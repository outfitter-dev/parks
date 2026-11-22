/**
 * Theme presets and the CSS they compile to. The workbench writes this CSS
 * into a <style> tag so every component reads the same variables that
 * packages/ui defines. "Copy tokens" copies the same string.
 */

export type PresetId = "luma" | "linear";
export type Mode = "system" | "light" | "dark";
export type UiFont = "allo" | "inter";
export type MonoFont = "jetbrains";
export type PrimaryStyle = "ink" | "brand";

export type ThemeTokens = {
  mode: Mode;
  shape: { radius: number; pad: number; panelPad: number; textInset: number; control: number };
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
      shape: { radius: 8, pad: 12, panelPad: 8, textInset: 0.4, control: 34 },
      type: { font: "allo", size: 14, rond: 50, mono: "jetbrains" },
      color: {
        brand: "oklch(0.76 0.15 70)",
        primary: "ink",
        hue: 70,
        tint: 0.006,
        border: 0.5,
        shadow: 2,
      },
    },
  },
  linear: {
    label: "Linear-like",
    values: {
      shape: { radius: 6, pad: 8, panelPad: 6, textInset: 0.4, control: 28 },
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
  jetbrains: { stack: `"JetBrains Mono Variable", ui-monospace, monospace`, scale: 0.88 },
};

const round = (value: number, places = 4) => Number(value.toFixed(places));

function tone(lightness: number, chroma: number, hue: number, alpha?: number) {
  const base = `${round(lightness)} ${round(chroma)} ${round(hue, 1)}`;
  return alpha === undefined ? `oklch(${base})` : `oklch(${base} / ${round(alpha, 3)})`;
}

function lightPalette({ color }: PresetValues) {
  const { hue: h, tint: c, border: b, primary } = color;
  return {
    "--background": tone(0.992, c * 0.6, h),
    "--foreground": tone(0.18, c * 2, h),
    "--card": tone(1, c * 0.2, h),
    "--card-foreground": tone(0.18, c * 2, h),
    "--popover": tone(1, c * 0.2, h),
    "--popover-foreground": tone(0.18, c * 2, h),
    "--primary": primary === "ink" ? tone(0.21, c * 2, h) : "var(--brand)",
    "--primary-foreground": primary === "ink" ? tone(0.985, c * 0.3, h) : "var(--brand-foreground)",
    "--secondary": tone(0.962, c * 1.2, h),
    "--secondary-foreground": tone(0.21, c * 2, h),
    "--muted": tone(0.962, c * 1.2, h),
    "--muted-foreground": tone(0.5, c * 2.5, h),
    "--accent": tone(0.952, c * 1.4, h),
    "--accent-foreground": tone(0.21, c * 2, h),
    "--destructive": "oklch(0.577 0.245 27.325)",
    "--border": tone(0.94 - b * 0.08, c * 1.5, h),
    "--input": tone(0.93 - b * 0.08, c * 1.5, h),
    "--ring": "color-mix(in oklch, var(--brand) 70%, transparent)",
  };
}

function darkPalette({ color }: PresetValues) {
  const { hue: h, tint: c, border: b, primary } = color;
  return {
    "--background": tone(0.165, c * 1.5, h),
    "--foreground": tone(0.965, c * 0.6, h),
    "--card": tone(0.2, c * 1.6, h),
    "--card-foreground": tone(0.965, c * 0.6, h),
    "--popover": tone(0.22, c * 1.6, h),
    "--popover-foreground": tone(0.965, c * 0.6, h),
    "--primary": primary === "ink" ? tone(0.94, c, h) : "var(--brand)",
    "--primary-foreground": primary === "ink" ? tone(0.2, c * 2, h) : "var(--brand-foreground)",
    "--secondary": tone(0.255, c * 1.8, h),
    "--secondary-foreground": tone(0.965, c * 0.6, h),
    "--muted": tone(0.255, c * 1.8, h),
    "--muted-foreground": tone(0.7, c * 2, h),
    "--accent": tone(0.27, c * 2, h),
    "--accent-foreground": tone(0.965, c * 0.6, h),
    "--destructive": "oklch(0.704 0.191 22.216)",
    "--border": tone(1, 0, 0, 0.06 + b * 0.08),
    "--input": tone(1, 0, 0, 0.1 + b * 0.08),
    "--ring": "color-mix(in oklch, var(--brand) 70%, transparent)",
  };
}

function shadow(level: number, dark: boolean) {
  if (level <= 0) {
    return dark ? "inset 0 1px 0 oklch(1 0 0 / 0.04)" : "0 0 #0000";
  }
  const a = dark ? 0.22 : 0.035;
  const lift = `0 1px 2px oklch(0 0 0 / ${round(a * level, 3)}), 0 ${level * 2}px ${level * 6}px oklch(0 0 0 / ${round(a * level * 0.8, 3)})`;
  return dark ? `${lift}, inset 0 1px 0 oklch(1 0 0 / 0.05)` : lift;
}

function block(selector: string, vars: Record<string, string>) {
  const body = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
  return `${selector} {\n${body}\n}`;
}

export function compileTheme(tokens: PresetValues): string {
  const mono = monoFonts[tokens.type.mono];
  const common = {
    "--radius": `${tokens.shape.radius}px`,
    "--pad": `${tokens.shape.pad}px`,
    "--panel-pad-base": `${tokens.shape.panelPad}px`,
    "--inset-ratio": `${tokens.shape.textInset}`,
    "--control-h": `${tokens.shape.control}px`,
    "--font-ui": uiFonts[tokens.type.font],
    "--font-code": mono.stack,
    "--text-ui": `${tokens.type.size}px`,
    "--rond": `${tokens.type.rond}`,
    "--mono-scale": `${mono.scale}`,
    "--brand": tokens.color.brand,
    "--brand-foreground": "oklch(from var(--brand) clamp(0.16, (0.7 - l) * 1000, 0.99) 0.01 h)",
  };
  const light = { ...lightPalette(tokens), "--shadow-frame": shadow(tokens.color.shadow, false) };
  const dark = { ...darkPalette(tokens), "--shadow-frame": shadow(tokens.color.shadow, true) };
  return [
    block(":root", common),
    block(":root, .light", light),
    `@media (prefers-color-scheme: dark) {\n${block(":root:not(.light)", dark)}\n}`,
    block(":root.dark, .dark", dark),
  ].join("\n\n");
}
