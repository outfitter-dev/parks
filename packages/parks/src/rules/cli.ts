#!/usr/bin/env node
/**
 * The `parks` command.
 *
 *   parks check [paths…]      apply the source rules to .ts/.tsx/.js/.jsx files
 *   parks contrast <css-file> score the colour roles in light and dark
 *
 * `check` defaults to ./src, ./app and ./components. `contrast` takes the
 * app's compiled CSS and needs `playwright-core` with Chromium installed
 * (`npx playwright-core install chromium`).
 */

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

import { checkContrast, contrastPairs, probeContrast } from "#rules/contrast";
import { checkSource } from "#rules/source";

const skip = new Set(["node_modules", "dist", ".next", "coverage", ".git"]);
const sourceFile = /\.(?:tsx?|jsx?)$/u;

function files(target: string): string[] {
  if (!statSync(target).isDirectory()) {
    return sourceFile.test(target) ? [target] : [];
  }
  return readdirSync(target).flatMap((name) =>
    skip.has(name) ? [] : files(path.join(target, name))
  );
}

function check(targets: readonly string[]) {
  const roots =
    targets.length > 0
      ? targets
      : ["src", "app", "components"].filter((dir) => existsSync(dir));
  let count = 0;
  for (const file of roots.flatMap(files)) {
    for (const violation of checkSource(readFileSync(file, "utf8"))) {
      count += 1;
      console.log(
        `${file}:${violation.line}  ${violation.rule}  ${violation.match}\n  ${violation.message}`
      );
    }
  }
  console.log(
    count === 0
      ? "parks check: no problems"
      : `parks check: ${count} problem${count === 1 ? "" : "s"}`
  );
  return count === 0 ? 0 : 1;
}

async function contrast(cssFile: string | undefined) {
  if (!cssFile) {
    console.error("usage: parks contrast <compiled-css-file>");
    return 2;
  }
  const css = readFileSync(cssFile, "utf8");
  const { chromium } = await import("playwright-core");
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(
      `<!doctype html><html><head><style>${css}</style></head><body></body></html>`
    );
    const results = checkContrast(
      await page.evaluate(probeContrast, contrastPairs)
    );
    const failed = results.filter((result) => !result.ok);
    for (const result of failed) {
      const where = result.tone ? `${result.tone} ` : "";
      console.log(
        `${result.mode}  ${where}${result.text} on ${result.surface}: ${result.ratio.toFixed(2)} (needs ${result.minimum})`
      );
    }
    console.log(
      failed.length === 0
        ? `parks contrast: ${results.length} pairs pass in light and dark`
        : `parks contrast: ${failed.length} of ${results.length} pairs below the minimum`
    );
    return failed.length === 0 ? 0 : 1;
  } finally {
    await browser.close();
  }
}

const [command, ...rest] = process.argv.slice(2);
if (command === "check") {
  process.exitCode = check(rest);
} else if (command === "contrast") {
  process.exitCode = await contrast(rest[0]);
} else {
  console.error(
    "usage: parks check [paths…] | parks contrast <compiled-css-file>"
  );
  process.exitCode = 2;
}
