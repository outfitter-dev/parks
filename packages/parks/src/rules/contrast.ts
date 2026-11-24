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
  /** WCAG ratio the pair must reach: 4.5 for text, 3 for a label on a solid control fill. */
  minimum: number;
};

type Sample = ContrastPair & {
  mode: Mode;
  textRgb: Rgb;
  surfaceRgb: Rgb;
  /** Set when a role does not resolve to a colour, so its contrast is meaningless. */
  invalid?: string;
};

type ContrastResult = Sample & { ratio: number; ok: boolean };

const body = 4.5;
/** Labels on solid control fills (primary, brand, a tone's solid) need 3:1. */
const solidLabel = 3;
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
  { text: "primary-foreground", surface: "primary", minimum: solidLabel },
  { text: "secondary-foreground", surface: "secondary", minimum: body },
  { text: "accent-foreground", surface: "accent", minimum: body },
  { text: "brand-foreground", surface: "brand", minimum: solidLabel },
  ...tones.flatMap((tone) => [
    { text: "tone-foreground", surface: "tone-fill", tone, minimum: body },
    { text: "tone-contrast", surface: "tone", tone, minimum: solidLabel },
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
    return {
      ...sample,
      ratio,
      ok: sample.invalid === undefined && ratio >= sample.minimum,
    };
  });
}

/**
 * Runs in the browser, in one mode: the caller sets the mode class on the
 * root element and emulates the matching colour scheme, so root-scoped and
 * media-query overrides apply as they do in the app. For each pair it paints
 * the page background, the surface and the text colour on a canvas, so
 * translucent roles composite the way they render, and reads back the
 * opaque result. A surface is read as a background and a text role as a
 * colour; one that does not resolve to a colour is reported as invalid.
 */
function probeContrast({
  pairs,
  mode,
}: {
  pairs: readonly ContrastPair[];
  mode: Mode;
}): Sample[] {
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
  // A sentinel colour on the container shows when a text role fails to
  // resolve and inherits instead.
  const sentinel = "rgb(1, 2, 3)";
  const container = document.createElement("div");
  container.style.color = sentinel;
  document.body.append(container);
  const probe = (tone?: string) => {
    const element = document.createElement("span");
    if (tone) {
      element.dataset.tone = tone;
    }
    container.append(element);
    return element;
  };
  const surfaceOf = (role: string, tone?: string) => {
    const element = probe(tone);
    element.style.backgroundColor = `var(--${role})`;
    const colour = getComputedStyle(element).backgroundColor;
    element.remove();
    return colour;
  };
  const textOf = (role: string, tone?: string) => {
    const element = probe(tone);
    element.style.color = `var(--${role})`;
    const colour = getComputedStyle(element).color;
    element.remove();
    return colour;
  };
  const transparent = (colour: string) =>
    /^rgba\(0, 0, 0, 0\)$|^transparent$/u.test(colour);
  const page = surfaceOf("background");
  const card = surfaceOf("card");
  const samples: Sample[] = [];
  for (const pair of pairs) {
    const surface = surfaceOf(pair.surface, pair.tone);
    const text = textOf(pair.text, pair.tone);
    const base = pair.tone ? [page, card] : [page];
    let invalid: string | undefined;
    if (transparent(surface)) {
      invalid = `--${pair.surface} does not resolve to a colour`;
    } else if (text === sentinel) {
      invalid = `--${pair.text} does not resolve to a colour`;
    }
    samples.push({
      ...pair,
      mode,
      invalid,
      surfaceRgb: paint([...base, surface]),
      textRgb: paint([...base, surface, text]),
    });
  }
  container.remove();
  return samples;
}

export { checkContrast, contrastPairs, contrastRatio, probeContrast };
export type { ContrastPair, ContrastResult, Mode, Rgb, Sample };
