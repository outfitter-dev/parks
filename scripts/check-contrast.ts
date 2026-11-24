/**
 * Scores the Parks colour roles in light and dark for every theme preset,
 * through the shipped `parks contrast` command. Needs Chromium for
 * playwright-core (`bunx playwright-core install chromium-headless-shell`).
 *
 *   bun scripts/check-contrast.ts
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import process from "node:process";

import { compileTheme, presets } from "../packages/parks/src/lib/theme";

const repo = path.join(import.meta.dirname, "..");
const pkg = path.join(repo, "packages/parks");
const work = mkdtempSync(path.join(tmpdir(), "parks-contrast-"));

function run(command: string, args: string[]) {
  return spawnSync(command, args, { cwd: repo, stdio: "inherit" }).status ?? 1;
}

if (run("bun", ["run", "--cwd", pkg, "build"]) !== 0) {
  process.exit(1);
}

let failed = 0;
for (const [id, preset] of Object.entries(presets)) {
  const input = path.join(work, `${id}.css`);
  const output = path.join(work, `${id}.out.css`);
  writeFileSync(
    input,
    `@import "${path.join(pkg, "src/styles/globals.css")}";\n${compileTheme(preset.values)}\n`
  );
  console.log(`\n${preset.label}`);
  if (run("bunx", ["@tailwindcss/cli", "-i", input, "-o", output]) !== 0) {
    process.exit(1);
  }
  if (
    run("node", [path.join(pkg, "dist/rules/cli.js"), "contrast", output]) !== 0
  ) {
    failed += 1;
  }
}
process.exitCode = failed === 0 ? 0 : 1;
