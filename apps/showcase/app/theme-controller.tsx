"use client";

import { DialRoot, useDialKitController, type DialConfig } from "dialkit";
import "dialkit/styles.css";
import { useEffect, useMemo, useRef } from "react";
import { compileTheme, presets, type Mode, type PresetId, type PresetValues } from "#lib/theme";

const start = presets.luma.values;

const config = {
  loadLuma: { type: "action", label: `Load ${presets.luma.label}` },
  loadLinear: { type: "action", label: `Load ${presets.linear.label}` },
  mode: { type: "select", options: ["system", "light", "dark"], default: "system" },
  shape: {
    radius: [start.shape.radius, 0, 24, 1],
    pad: [start.shape.pad, 4, 32, 1],
    control: [start.shape.control, 24, 44, 1],
  },
  type: {
    font: {
      type: "select",
      options: [
        { value: "allo", label: "Allo" },
        { value: "inter", label: "Inter" },
      ],
      default: start.type.font,
    },
    size: [start.type.size, 12, 16, 0.5],
    rond: [start.type.rond, 0, 100, 1],
    mono: {
      type: "select",
      options: [
        { value: "plex", label: "IBM Plex Mono" },
        { value: "jetbrains", label: "JetBrains Mono" },
      ],
      default: start.type.mono,
    },
  },
  color: {
    brand: { type: "color", default: start.color.brand },
    primary: {
      type: "select",
      options: [
        { value: "ink", label: "Ink" },
        { value: "brand", label: "Brand" },
      ],
      default: start.color.primary,
    },
    hue: [start.color.hue, 0, 360, 1],
    tint: [start.color.tint, 0, 0.03, 0.001],
    border: [start.color.border, 0, 1, 0.05],
    shadow: [start.color.shadow, 0, 4, 0.5],
  },
  copy: { type: "action", label: "Copy tokens" },
} satisfies DialConfig;

const presetActions: Record<string, PresetId> = {
  loadLuma: "luma",
  loadLinear: "linear",
};

function isMode(value: string): value is Mode {
  return value === "system" || value === "light" || value === "dark";
}

export function ThemeController() {
  const cssRef = useRef("");
  const setValuesRef = useRef<((next: PresetValues) => void) | null>(null);
  // Presets load only from an explicit click. Watching a select value would
  // also fire when DialKit restores saved values on reload and wipe edits.
  const dial = useDialKitController("Theme", config, {
    persist: { key: "outpost-workbench-theme" },
    onAction: (action) => {
      if (action === "copy") {
        void navigator.clipboard.writeText(cssRef.current);
        return;
      }
      const preset = presetActions[action];
      if (preset) setValuesRef.current?.(presets[preset].values);
    },
  });
  const { values, setValues } = dial;
  setValuesRef.current = setValues;

  const tokens: PresetValues = {
    shape: values.shape,
    type: {
      font: values.type.font === "inter" ? "inter" : "allo",
      size: values.type.size,
      rond: values.type.rond,
      mono: values.type.mono === "jetbrains" ? "jetbrains" : "plex",
    },
    color: {
      ...values.color,
      primary: values.color.primary === "brand" ? "brand" : "ink",
    },
  };
  const css = useMemo(() => compileTheme(tokens), [JSON.stringify(tokens)]);
  cssRef.current = css;

  const mode = isMode(values.mode) ? values.mode : "system";
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    if (mode !== "system") root.classList.add(mode);
  }, [mode]);

  return (
    <>
      <style id="workbench-theme" dangerouslySetInnerHTML={{ __html: css }} />
      <DialRoot productionEnabled defaultOpen={false} position="bottom-right" theme="system" />
    </>
  );
}
