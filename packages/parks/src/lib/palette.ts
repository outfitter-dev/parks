/**
 * Every Tailwind palette name, rebuilt as one family so we can tune the
 * colours to our own spec while `bg-red-500` and `var(--color-red-500)` keep
 * working. scripts/ui-palette.ts writes renderPalette() to styles/palette.css;
 * test/ui-palette.test.ts fails when the two disagree.
 *
 * Tailwind tunes each palette by eye, so its 500s run from lightness 0.59
 * (indigo) to 0.80 (yellow) and some palettes sit near the edge of what a
 * screen shows while others sit well inside it. Ours share one lightness
 * curve and one chroma target per step, so the same step reads as the same
 * weight across hues. Each palette authors only its hue and how far that hue
 * drifts into the darks (warm hues lean redder as they darken, as paint does).
 */
export const steps = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
] as const;

/** Lightness at each step for a hue whose brightest colour sits at `pivot`. */
const lightness = [
  0.975, 0.947, 0.897, 0.833, 0.742, 0.66, 0.58, 0.505, 0.44, 0.385, 0.278,
];
const pivot = 0.62;
/** How far a hue's own brightest lightness pulls each step, so yellow stays light and blue stays deep, but closer together than Tailwind's. */
const lift = [
  0.04, 0.08, 0.18, 0.32, 0.5, 0.62, 0.55, 0.4, 0.28, 0.18, 0.1,
].map((weight) => weight * 0.42);
/** The chroma every hue aims for at each step. */
const target = [
  0.016, 0.036, 0.072, 0.118, 0.165, 0.195, 0.195, 0.182, 0.158, 0.13, 0.09,
];
/** The most of the screen's range (Display P3) a step may use, so no hue clips. */
const reach = [0.92, 0.92, 0.9, 0.88, 0.88, 0.88, 0.86, 0.82, 0.78, 0.74, 0.7];
/** Yellows and yellow-greens read dull at equal chroma in the lights, so they may go further there. */
const warmLights = [0.6, 0.6, 0.55, 0.45, 0.3, 0.15, 0, 0, 0, 0, 0];
/** The share of a palette's drift each step takes: lights lean one way, darks the other. */
const driftShare = [
  -0.45, -0.4, -0.32, -0.22, -0.1, 0, 0.15, 0.35, 0.55, 0.75, 1,
];

/** Greys sit on fixed lightness steps and keep most of their seed's chroma into the darks. */
const grey = {
  lightness: [
    0.985, 0.968, 0.929, 0.869, 0.704, 0.554, 0.446, 0.372, 0.279, 0.208, 0.129,
  ],
  chroma: [0.07, 0.15, 0.28, 0.48, 0.87, 1, 1, 0.95, 0.9, 0.9, 1],
};

/**
 * Chromatic palettes author a hue and a drift in degrees; greys keep a seed
 * (Tailwind's 500) that a theme can override. `neutral` is seeded separately
 * by --neutral-hue and --neutral-tint.
 */
export const palettes = {
  red: { kind: "chromatic", hue: 25, drift: 2 },
  orange: { kind: "chromatic", hue: 47, drift: -10 },
  amber: { kind: "chromatic", hue: 72, drift: -24 },
  yellow: { kind: "chromatic", hue: 92, drift: -32 },
  lime: { kind: "chromatic", hue: 128, drift: 0 },
  green: { kind: "chromatic", hue: 148, drift: 4 },
  emerald: { kind: "chromatic", hue: 163, drift: 6 },
  teal: { kind: "chromatic", hue: 183, drift: 8 },
  cyan: { kind: "chromatic", hue: 212, drift: 10 },
  sky: { kind: "chromatic", hue: 236, drift: 6 },
  blue: { kind: "chromatic", hue: 259, drift: 8 },
  indigo: { kind: "chromatic", hue: 276, drift: 4 },
  violet: { kind: "chromatic", hue: 293, drift: 0 },
  purple: { kind: "chromatic", hue: 305, drift: -2 },
  fuchsia: { kind: "chromatic", hue: 322, drift: 4 },
  pink: { kind: "chromatic", hue: 352, drift: 10 },
  rose: { kind: "chromatic", hue: 14, drift: -2 },
  slate: { kind: "grey", seed: "oklch(0.554 0.046 257.417)" },
  gray: { kind: "grey", seed: "oklch(0.551 0.027 264.364)" },
  zinc: { kind: "grey", seed: "oklch(0.552 0.016 285.938)" },
  stone: { kind: "grey", seed: "oklch(0.553 0.013 58.071)" },
} as const;

/** OKLCH to linear Display P3, for the gamut test. */
function linearP3(l: number, c: number, hue: number) {
  const a = c * Math.cos((hue * Math.PI) / 180);
  const b = c * Math.sin((hue * Math.PI) / 180);
  const lms = [
    (l + 0.3963377774 * a + 0.2158037573 * b) ** 3,
    (l - 0.1055613458 * a - 0.0638541728 * b) ** 3,
    (l - 0.0894841775 * a - 1.291485548 * b) ** 3,
  ] as const;
  const r =
    4.0767416621 * lms[0] - 3.3077115913 * lms[1] + 0.2309699292 * lms[2];
  const g =
    -1.2684380046 * lms[0] + 2.6097574011 * lms[1] - 0.3413193965 * lms[2];
  const blue =
    -0.0041960863 * lms[0] - 0.7034186147 * lms[1] + 1.707614701 * lms[2];
  return [
    0.8224621 * r + 0.177538 * g,
    0.0331941 * r + 0.9668058 * g,
    0.0170827 * r + 0.0723974 * g + 0.9105199 * blue,
  ];
}

/** The most chroma Display P3 can show at this lightness and hue. */
export function maxChroma(l: number, hue: number) {
  let low = 0;
  let high = 0.5;
  for (let i = 0; i < 30; i++) {
    const mid = (low + high) / 2;
    if (linearP3(l, mid, hue).every((v) => v >= -1e-4 && v <= 1 + 1e-4)) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return low;
}

/** The lightness at which a hue reaches its most chroma. */
function brightest(hue: number) {
  let best = 0;
  let at = 0;
  for (let l = 0.3; l <= 0.99; l += 0.005) {
    const c = maxChroma(l, hue);
    if (c > best) {
      [best, at] = [c, l];
    }
  }
  return at;
}

/** Closeness to yellow-green, 1 at 108° falling off over about 30°. */
function warmth(hue: number) {
  const distance = Math.min(Math.abs(hue - 108), 360 - Math.abs(hue - 108));
  return Math.exp(-(distance ** 2) / (2 * 28 ** 2));
}

/** One palette's steps as [lightness, chroma, hue]. */
export function chromaticScale(hue: number, drift: number) {
  const pull = brightest(hue) - pivot;
  return steps.map((_, index) => {
    const h = (hue + drift * driftShare[index]! + 360) % 360;
    const l = lightness[index]! + pull * lift[index]!;
    const c = Math.min(
      reach[index]! * maxChroma(l, h),
      target[index]! * (1 + warmLights[index]! * warmth(h))
    );
    return [round(l, 3), round(c, 3), round(h, 1)] as const;
  });
}

function round(value: number, places: number) {
  return Number(value.toFixed(places));
}

export type PaletteName = keyof typeof palettes | "neutral";
export const paletteNames: readonly PaletteName[] = [
  ...(Object.keys(palettes) as (keyof typeof palettes)[]),
  "neutral",
];

export function isPaletteName(value: string): value is PaletteName {
  return (paletteNames as readonly string[]).includes(value);
}

const neutral = {
  lightness: [
    0.985, 0.97, 0.922, 0.87, 0.708, 0.556, 0.439, 0.371, 0.269, 0.205, 0.145,
  ],
  tint: [0.5, 1, 1.5, 2, 2.5, 3, 3, 3, 2.5, 2, 1.5],
};

function number(value: number) {
  return String(Number(value.toFixed(4)));
}

function greyStep(name: string, index: number) {
  const c =
    grey.chroma[index] === 1 ? "c" : `calc(c * ${number(grey.chroma[index]!)})`;
  return `oklch(from var(--palette-${name}) ${number(grey.lightness[index]!)} ${c} h)`;
}

function neutralStep(index: number) {
  return `oklch(${number(neutral.lightness[index]!)} calc(var(--neutral-tint) * ${number(neutral.tint[index]!)}) var(--neutral-hue))`;
}

/** The palette the brand scale points at unless a theme says otherwise. */
export const defaultBrand: PaletteName = "orange";

export function renderPalette() {
  const seeds = Object.entries(palettes).flatMap(([name, palette]) =>
    palette.kind === "grey" ? [`  --palette-${name}: ${palette.seed};`] : []
  );
  const scales = Object.entries(palettes).flatMap(([name, palette]) => {
    if (palette.kind === "grey") {
      return steps.map(
        (step, index) => `  --color-${name}-${step}: ${greyStep(name, index)};`
      );
    }
    const scale = chromaticScale(palette.hue, palette.drift);
    return steps.map(
      (step, index) =>
        `  --color-${name}-${step}: oklch(${scale[index]!.join(" ")});`
    );
  });
  const neutrals = steps.map(
    (step, index) => `  --color-neutral-${step}: ${neutralStep(index)};`
  );
  // The brand is a whole palette: a theme points every brand step at another palette's same step.
  const brand = steps.map(
    (step) => `  --color-brand-${step}: var(--color-${defaultBrand}-${step});`
  );
  return [
    "/* Generated by scripts/ui-palette.ts from src/lib/palette.ts. Edit that, then run `bun scripts/ui-palette.ts`. */",
    "",
    "/*",
    " * Every Tailwind palette name, rebuilt as one family: the same step has the",
    " * same lightness and chroma target across hues. Greys keep a seed a theme",
    " * can override. Components use roles (globals.css), not these steps; apps",
    " * and tones may.",
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
