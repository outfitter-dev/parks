import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

import { isTone, tones } from "../packages/parks/src/lib/tone";

const css = readFileSync(
  join(import.meta.dirname, "../packages/parks/src/styles/globals.css"),
  "utf8"
);
const roles = [
  "",
  "-strong",
  "-foreground",
  "-contrast",
  "-solid-hover",
  "-fill",
  "-fill-hover",
  "-border",
  "-mark",
];

/** Every custom property set by rules whose selector names this tone. */
function toneDeclarations(tone: string) {
  const declared = new Set<string>();
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const [, selector = "", body = ""] = match;
    if (!selector.includes(`[data-tone="${tone}"]`)) {
      continue;
    }
    for (const property of body.matchAll(/(--tone[\w-]*)\s*:/g)) {
      declared.add(property[1] ?? "");
    }
  }
  return declared;
}

describe("tones", () => {
  test.each(tones)("%s sets every tone role", (tone) => {
    const declared = toneDeclarations(tone);
    for (const role of roles) {
      expect(declared, `--tone${role}`).toContain(`--tone${role}`);
    }
  });

  test("every tone role is a Tailwind colour", () => {
    for (const role of roles) {
      expect(css).toContain(`--color-tone${role}: var(--tone${role});`);
    }
  });

  test("isTone accepts tones only", () => {
    expect(tones.every(isTone)).toBe(true);
    expect(isTone("primary")).toBe(false);
    expect(isTone(undefined)).toBe(false);
  });
});
