/**
 * Theme presets and the CSS they compile to. A theme sets only seeds; the
 * stylesheet derives every colour, radius and shadow from them in light and
 * dark. `outfitter` is the default theme: `themes/outfitter.css` is compiled
 * from it (`bun run ui:theme`) and `styles.css` applies it.
 */

import { steps, type PaletteName } from "#lib/palette";

export type PresetId = "outfitter" | "linear";
export type Mode = "system" | "light" | "dark";
export type UiFont = "allo" | "inter";
export type MonoFont = "plex" | "jetbrains";
export type PrimaryStyle = "ink" | "brand";

export type ThemeTokens = {
  mode: Mode;
  shape: { radius: number; pad: number; panelPad: number; textInset: number; control: number; field: number; smooth: number };
  type: { font: UiFont; size: number; rond: number; mono: MonoFont };
  color: {
    /** A Tailwind palette name; the brand scale is that palette, and the brand its 500 step. */
    brand: PaletteName;
    primary: PrimaryStyle;
    hue: number;
    tint: number;
    border: number;
    shadow: number;
  };
};

export type PresetValues = Omit<ThemeTokens, "mode">;

export const presets: Record<PresetId, { label: string; values: PresetValues }> = {
  outfitter: {
    label: "Outfitter (default)",
    values: {
      shape: { radius: 13, pad: 12, panelPad: 8, textInset: 0.4, control: 34, field: 8, smooth: 2 },
      type: { font: "allo", size: 14, rond: 50, mono: "jetbrains" },
      color: {
        brand: "orange",
        primary: "ink",
        hue: 70,
        tint: 0.0015,
        border: 0.5,
        shadow: 2,
      },
    },
  },
  linear: {
    label: "Linear-like",
    values: {
      shape: { radius: 6, pad: 8, panelPad: 6, textInset: 0.4, control: 28, field: 6, smooth: 2 },
      type: { font: "inter", size: 13, rond: 0, mono: "jetbrains" },
      color: {
        brand: "indigo",
        primary: "brand",
        hue: 270,
        tint: 0.008,
        border: 0.3,
        shadow: 0,
      },
    },
  },
};

const uiFonts: Record<UiFont, string> = {
  allo: `"Allo", ui-sans-serif, system-ui, sans-serif`,
  inter: `"Inter Variable", ui-sans-serif, system-ui, sans-serif`,
};

/**
 * Each mono font's size relative to the UI font beside it, so code and text
 * share an x-height. At equal sizes JetBrains Mono and Allo already match.
 */
const monoFonts: Record<MonoFont, { stack: string; scale: Record<UiFont, number> }> = {
  plex: { stack: `"IBM Plex Mono", ui-monospace, monospace`, scale: { allo: 0.92, inter: 0.92 } },
  jetbrains: { stack: `"JetBrains Mono Variable", ui-monospace, monospace`, scale: { allo: 1, inter: 0.88 } },
};

/**
 * Compiles a preset to the seed variables, as one `:root` rule. Apps that
 * tune a theme override these same variables after `styles.css`.
 */
export function compileTheme(tokens: PresetValues): string {
  const { shape, type, color } = tokens;
  const mono = monoFonts[type.mono];
  const seeds: Record<string, string> = {
    "--radius": `${shape.radius}px`,
    "--pad": `${shape.pad}px`,
    "--panel-pad-base": `${shape.panelPad}px`,
    "--inset-ratio": `${shape.textInset}`,
    "--control-h": `${shape.control}px`,
    "--field-radius": `${shape.field}px`,
    "--corner-smoothing": `${shape.smooth}`,
    "--font-ui": uiFonts[type.font],
    "--font-code": mono.stack,
    "--text-ui": `${type.size}px`,
    "--rond": `${type.rond}`,
    "--mono-scale": `${mono.scale[type.font]}`,
    ...Object.fromEntries(steps.map((step) => [`--color-brand-${step}`, `var(--color-${color.brand}-${step})`])),
    "--neutral-hue": `${color.hue}`,
    "--neutral-tint": `${color.tint}`,
    "--border-strength": `${color.border}`,
    "--shadow-level": `${color.shadow}`,
  };
  if (color.primary === "brand") {
    seeds["--primary-seed"] = "var(--brand)";
    seeds["--primary-foreground-seed"] = "var(--brand-foreground)";
  }
  const body = Object.entries(seeds)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
  return `:root {\n${body}\n}`;
}

/** The theme `styles.css` applies unless an app overrides its seeds. */
export const defaultTheme = presets.outfitter.values;
