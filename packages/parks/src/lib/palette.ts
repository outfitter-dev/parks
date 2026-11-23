/**
 * Every Tailwind palette name, rebuilt from one seed per palette so we can
 * tune the colours to our own spec while `bg-red-500` and
 * `var(--color-red-500)` keep working. scripts/ui-palette.ts writes
 * renderPalette() to styles/palette.css; test/ui-palette.test.ts fails when
 * the two disagree.
 *
 * Each seed is the palette's 500 step (Tailwind's own value to start). Every
 * other step is the seed moved along one shared curve with `oklch(from …)`,
 * so a theme can retune a whole palette by overriding its seed.
 */
export const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

/** The seed lightness the chromatic curve is drawn for: a seed lighter or darker lifts its steps. */
const pivot = 0.645;

/** Lightness at each step for a seed at lightness 0.645, how much of the seed's own lift it keeps, and its share of the seed's chroma. */
const chromatic = {
  lightness: [0.975, 0.945, 0.89, 0.82, 0.72, 0.645, 0.575, 0.505, 0.44, 0.385, 0.275],
  lift: [0.15, 0.3, 0.5, 0.7, 0.9, 1, 1, 0.9, 0.8, 0.7, 0.5],
  chroma: [0.06, 0.13, 0.26, 0.45, 0.78, 1, 1.03, 0.9, 0.75, 0.6, 0.42],
};

/** Greys sit on fixed lightness steps and keep most of their chroma into the darks. */
const grey = {
  lightness: [0.985, 0.968, 0.929, 0.869, 0.704, 0.554, 0.446, 0.372, 0.279, 0.208, 0.129],
  chroma: [0.07, 0.15, 0.28, 0.48, 0.87, 1, 1, 0.95, 0.9, 0.9, 1],
};

/** Seeds: Tailwind 4's 500 step for each palette. `neutral` is seeded separately by --neutral-hue and --neutral-tint. */
export const palettes = {
  red: { kind: "chromatic", seed: "oklch(0.637 0.237 25.331)" },
  orange: { kind: "chromatic", seed: "oklch(0.705 0.213 47.604)" },
  amber: { kind: "chromatic", seed: "oklch(0.769 0.188 70.08)" },
  yellow: { kind: "chromatic", seed: "oklch(0.795 0.184 86.047)" },
  lime: { kind: "chromatic", seed: "oklch(0.768 0.233 130.85)" },
  green: { kind: "chromatic", seed: "oklch(0.723 0.219 149.579)" },
  emerald: { kind: "chromatic", seed: "oklch(0.696 0.17 162.48)" },
  teal: { kind: "chromatic", seed: "oklch(0.704 0.14 182.503)" },
  cyan: { kind: "chromatic", seed: "oklch(0.715 0.143 215.221)" },
  sky: { kind: "chromatic", seed: "oklch(0.685 0.169 237.323)" },
  blue: { kind: "chromatic", seed: "oklch(0.623 0.214 259.815)" },
  indigo: { kind: "chromatic", seed: "oklch(0.585 0.233 277.117)" },
  violet: { kind: "chromatic", seed: "oklch(0.606 0.25 292.717)" },
  purple: { kind: "chromatic", seed: "oklch(0.627 0.265 303.9)" },
  fuchsia: { kind: "chromatic", seed: "oklch(0.667 0.295 322.15)" },
  pink: { kind: "chromatic", seed: "oklch(0.656 0.241 354.308)" },
  rose: { kind: "chromatic", seed: "oklch(0.645 0.246 16.439)" },
  slate: { kind: "grey", seed: "oklch(0.554 0.046 257.417)" },
  gray: { kind: "grey", seed: "oklch(0.551 0.027 264.364)" },
  zinc: { kind: "grey", seed: "oklch(0.552 0.016 285.938)" },
  stone: { kind: "grey", seed: "oklch(0.553 0.013 58.071)" },
} as const;

export type PaletteName = keyof typeof palettes | "neutral";
export const paletteNames: readonly PaletteName[] = [...(Object.keys(palettes) as (keyof typeof palettes)[]), "neutral"];

export function isPaletteName(value: string): value is PaletteName {
  return (paletteNames as readonly string[]).includes(value);
}

const neutral = {
  lightness: [0.985, 0.97, 0.922, 0.87, 0.708, 0.556, 0.439, 0.371, 0.269, 0.205, 0.145],
  tint: [0.5, 1, 1.5, 2, 2.5, 3, 3, 3, 2.5, 2, 1.5],
};

function number(value: number) {
  return String(Number(value.toFixed(4)));
}

function chromaticStep(name: string, index: number, seed = `var(--palette-${name})`) {
  const base = chromatic.lightness[index]!;
  const lift = chromatic.lift[index]!;
  const l =
    base === pivot && lift === 1
      ? "l"
      : lift === 1
        ? `calc(l - ${number(pivot - base)})`
        : `calc(${number(base)} + (l - ${pivot}) * ${number(lift)})`;
  const c = chromatic.chroma[index] === 1 ? "c" : `calc(c * ${number(chromatic.chroma[index]!)})`;
  return `oklch(from ${seed} ${l} ${c} h)`;
}

function greyStep(name: string, index: number) {
  const c = grey.chroma[index] === 1 ? "c" : `calc(c * ${number(grey.chroma[index]!)})`;
  return `oklch(from var(--palette-${name}) ${number(grey.lightness[index]!)} ${c} h)`;
}

function neutralStep(index: number) {
  return `oklch(${number(neutral.lightness[index]!)} calc(var(--neutral-tint) * ${number(neutral.tint[index]!)}) var(--neutral-hue))`;
}

export function renderPalette() {
  const seeds = Object.entries(palettes).map(([name, { seed }]) => `  --palette-${name}: ${seed};`);
  const scales = Object.entries(palettes).flatMap(([name, { kind }]) =>
    steps.map((step, index) => `  --color-${name}-${step}: ${kind === "grey" ? greyStep(name, index) : chromaticStep(name, index)};`),
  );
  const neutrals = steps.map((step, index) => `  --color-neutral-${step}: ${neutralStep(index)};`);
  // The brand is a palette step (globals.css sets --brand), so its scale is that palette's curve from the brand.
  const brand = steps.map((step, index) => `  --color-brand-${step}: ${chromaticStep("brand", index, "var(--brand)")};`);
  return [
    "/* Generated by scripts/ui-palette.ts from src/lib/palette.ts. Edit that, then run `bun scripts/ui-palette.ts`. */",
    "",
    "/*",
    " * Every Tailwind palette name, rebuilt on our own curve. A palette's seed is",
    " * its 500 step; a theme retunes the whole palette by overriding the seed.",
    " * Components use roles (globals.css), not these steps; apps and tones may.",
    " */",
    ":root {",
    ...seeds,
    "}",
    "",
    "@theme static {",
    "  --color-*: initial;",
    "  --color-white: oklch(1 0 0);",
    "  --color-black: oklch(0 0 0);",
    ...scales,
    ...neutrals,
    ...brand,
    "}",
    "",
  ].join("\n");
}
