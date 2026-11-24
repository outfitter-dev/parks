/**
 * Contrast checks for the Parks colour roles, in light and dark. A pair is a
 * text role on a surface role, optionally inside a tone. A browser resolves
 * the roles (they use light-dark(), color-mix() and relative colours), so
 * `probeContrast` runs in a page that has the app's compiled CSS and
 * returns the rendered colours; `checkContrast` scores them.
 */

type Rgb = readonly [number, number, number];
type Mode = "light" | "dark";

type ContrastPair = {
  text: string;
  surface: string;
  tone?: string;
  /** WCAG ratio the pair must reach: 4.5 for body text. */
  minimum: number;
};

type Sample = ContrastPair & { mode: Mode; textRgb: Rgb; surfaceRgb: Rgb };

type ContrastResult = Sample & { ratio: number; ok: boolean };

const body = 4.5;
const tones = [
  "neutral",
  "info",
  "success",
  "warning",
  "destructive",
  "merged",
  "brand",
];

/** The text-on-surface pairs every theme must keep readable. */
const contrastPairs: readonly ContrastPair[] = [
  { text: "foreground", surface: "background", minimum: body },
  { text: "foreground", surface: "card", minimum: body },
  { text: "foreground", surface: "muted", minimum: body },
  { text: "popover-foreground", surface: "popover", minimum: body },
  { text: "muted-foreground", surface: "background", minimum: body },
  { text: "muted-foreground", surface: "card", minimum: body },
  { text: "muted-foreground", surface: "muted", minimum: body },
  { text: "primary-foreground", surface: "primary", minimum: body },
  { text: "secondary-foreground", surface: "secondary", minimum: body },
  { text: "accent-foreground", surface: "accent", minimum: body },
  { text: "brand-foreground", surface: "brand", minimum: body },
  ...tones.flatMap((tone) => [
    { text: "tone-foreground", surface: "tone-fill", tone, minimum: body },
    { text: "tone-contrast", surface: "tone", tone, minimum: body },
  ]),
];

function channel(value: number) {
  const unit = value / 255;
  return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4;
}

function luminance([red, green, blue]: Rgb) {
  return (
    0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue)
  );
}

/** The WCAG 2 contrast ratio between two opaque sRGB colours. */
function contrastRatio(first: Rgb, second: Rgb) {
  const one = luminance(first);
  const two = luminance(second);
  return (Math.max(one, two) + 0.05) / (Math.min(one, two) + 0.05);
}

function checkContrast(samples: readonly Sample[]): ContrastResult[] {
  return samples.map((sample) => {
    const ratio = contrastRatio(sample.textRgb, sample.surfaceRgb);
    return { ...sample, ratio, ok: ratio >= sample.minimum };
  });
}

/**
 * Runs in the browser. For each mode and pair it paints the page background,
 * the surface and the text colour on a canvas, so translucent roles are
 * composited the way they render, and reads back the opaque result.
 */
function probeContrast(pairs: readonly ContrastPair[]): Sample[] {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    throw new Error("No 2D canvas context");
  }
  const paint = (colours: readonly string[]): Rgb => {
    context.clearRect(0, 0, 1, 1);
    for (const colour of colours) {
      context.fillStyle = colour;
      context.fillRect(0, 0, 1, 1);
    }
    const [red = 0, green = 0, blue = 0] = context.getImageData(
      0,
      0,
      1,
      1
    ).data;
    return [red, green, blue];
  };
  const samples: Sample[] = [];
  for (const mode of ["light", "dark"] as const) {
    const root = document.createElement("div");
    root.className = mode;
    document.body.append(root);
    const read = (role: string, tone?: string) => {
      const probe = document.createElement("span");
      if (tone) {
        probe.dataset.tone = tone;
      }
      probe.style.color = `var(--${role})`;
      root.append(probe);
      const colour = getComputedStyle(probe).color;
      probe.remove();
      return colour;
    };
    const page = read("background");
    for (const pair of pairs) {
      const surface = read(pair.surface, pair.tone);
      const text = read(pair.text, pair.tone);
      const base = pair.tone ? [page, read("card")] : [page];
      samples.push({
        ...pair,
        mode,
        surfaceRgb: paint([...base, surface]),
        textRgb: paint([...base, surface, text]),
      });
    }
    root.remove();
  }
  return samples;
}

export { checkContrast, contrastPairs, contrastRatio, probeContrast };
export type { ContrastPair, ContrastResult, Mode, Rgb, Sample };
