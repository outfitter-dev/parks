import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { chromaticScale, defaultBrand, maxChroma, paletteNames, palettes, renderPalette, steps } from "../packages/ui/src/lib/palette";

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

  it("points every brand step at the same step of one palette", () => {
    for (const step of steps) {
      expect(css).toMatch(new RegExp(`--color-brand-${step}: var\\(--color-${defaultBrand}-${step}\\);`));
    }
  });

  it("keeps every chromatic step inside Display P3 and every palette's steps in lightness order", () => {
    for (const palette of Object.values(palettes)) {
      if (palette.kind !== "chromatic") continue;
      const scale = chromaticScale(palette.hue, palette.drift);
      scale.forEach(([l, c, h], index) => {
        expect(c).toBeLessThanOrEqual(maxChroma(l, h) + 1e-3);
        if (index > 0) expect(l).toBeLessThan(scale[index - 1]![0]);
      });
    }
  });

  it("gives the same step the same lightness across hues, within a band", () => {
    const chromatic = Object.values(palettes).filter((palette) => palette.kind === "chromatic");
    steps.forEach((_, index) => {
      const lightness = chromatic.map((palette) => chromaticScale(palette.hue, palette.drift)[index]![0]);
      expect(Math.max(...lightness) - Math.min(...lightness)).toBeLessThan(0.11);
    });
  });
});
