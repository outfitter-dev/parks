/**
 * Theme presets and the CSS they compile to. The workbench writes this CSS
 * into a <style> tag so every component reads the same variables that
 * packages/ui defines. "Copy tokens" copies the same string.
 */

export type PresetId = "luma" | "linear";
export type Mode = "system" | "light" | "dark";
export type UiFont = "allo" | "inter";
export type MonoFont = "plex" | "jetbrains";
export type PrimaryStyle = "ink" | "brand";

export type ThemeTokens = {
  mode: Mode;
  shape: { radius: number; pad: number; panelPad: number; textInset: number; control: number; field: number };
  type: { font: UiFont; size: number; rond: number; mono: MonoFont };
  color: {
    brand: string;
    primary: PrimaryStyle;
    hue: number;
    tint: number;
    border: number;
    shadow: number;
  };
};

export type PresetValues = Omit<ThemeTokens, "mode">;

export const presets: Record<PresetId, { label: string; values: PresetValues }> = {
  luma: {
    label: "Luma tuned",
    values: {
      shape: { radius: 13, pad: 12, panelPad: 8, textInset: 0.4, control: 34, field: 8 },
      type: { font: "allo", size: 14, rond: 50, mono: "plex" },
      color: {
        brand: "oklch(0.76 0.15 70)",
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
      shape: { radius: 6, pad: 8, panelPad: 6, textInset: 0.4, control: 28, field: 6 },
      type: { font: "inter", size: 13, rond: 0, mono: "jetbrains" },
      color: {
        brand: "oklch(0.6 0.17 277)",
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

const monoFonts: Record<MonoFont, { stack: string; scale: number }> = {
  plex: { stack: `"IBM Plex Mono", ui-monospace, monospace`, scale: 0.92 },
  jetbrains: { stack: `"JetBrains Mono Variable", ui-monospace, monospace`, scale: 0.88 },
};

/**
 * The theme only sets seeds. packages/ui derives every colour, radius and
 * shadow from them, in light and dark, so the workbench never restates a
 * derived value.
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
    "--font-ui": uiFonts[type.font],
    "--font-code": mono.stack,
    "--text-ui": `${type.size}px`,
    "--rond": `${type.rond}`,
    "--mono-scale": `${mono.scale}`,
    "--brand": color.brand,
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
