import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { paletteNames, renderPalette, steps } from "../packages/ui/src/lib/palette";

const repo = join(import.meta.dirname, "..");
const css = readFileSync(join(repo, "packages/ui/src/styles/palette.css"), "utf8");

// Tailwind 4's palette names. Ours retunes the values, never the names.
const tailwindNames = [
  "red", "orange", "amber", "yellow", "lime", "green", "emerald", "teal", "cyan", "sky", "blue",
  "indigo", "violet", "purple", "fuchsia", "pink", "rose", "slate", "gray", "zinc", "neutral", "stone",
];

describe("palette", () => {
  it("palette.css is what scripts/ui-palette.ts writes", () => {
    expect(css).toBe(renderPalette());
  });

  it("supports every Tailwind palette name at every step", () => {
    expect([...paletteNames].sort()).toEqual([...tailwindNames].sort());
    for (const name of tailwindNames) {
      for (const step of steps) {
        expect(css, `${name}-${step}`).toMatch(new RegExp(`--color-${name}-${step}: `));
      }
    }
  });

  it("derives the brand scale from --brand", () => {
    for (const step of steps) {
      expect(css).toMatch(new RegExp(`--color-brand-${step}: oklch\\(from var\\(--brand\\)`));
    }
  });
});
