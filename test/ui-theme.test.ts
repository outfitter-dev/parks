import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import {
  compileTheme,
  defaultTheme,
  presets,
} from "../packages/parks/src/lib/theme";
import { renderDefaultTheme, themePath } from "../scripts/ui-theme";

describe("default theme", () => {
  it("themes/outfitter.css is what scripts/ui-theme.ts writes", () => {
    expect(readFileSync(themePath, "utf8")).toBe(renderDefaultTheme());
  });

  it("is the outfitter preset", () => {
    expect(defaultTheme).toBe(presets.outfitter.values);
  });

  it("sets only seed variables", () => {
    const names = Array.from(
      compileTheme(defaultTheme).matchAll(/(?<name>--[a-z0-9-]+):/gu),
      (match) => match.groups?.name ?? ""
    );
    const derived = new Set([
      "--primary",
      "--background",
      "--foreground",
      "--card",
      "--muted",
      "--border",
    ]);
    expect(names.filter((name) => derived.has(name))).toEqual([]);
  });
});
