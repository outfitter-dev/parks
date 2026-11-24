import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { colourOpacity } from "./ui-rules";

// packages/ui is meant to move to a shared repo, so it may only use
// its own files and the packages it declares. It must not reach into the app.
const root = join(import.meta.dirname, "../packages/ui");
const manifest: {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  imports?: Record<string, string>;
} =
  JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const declared = new Set([...Object.keys(manifest.dependencies ?? {}), ...Object.keys(manifest.peerDependencies ?? {})]);

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

function packageName(specifier: string) {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

const sources = files(join(root, "src")).filter((path) => /\.(tsx?|css)$/.test(path));
const specifier = /(?:from|import)\s*\(?\s*["']([^"']+)["']|@import\s+["']([^"']+)["']/g;

const aliases = Object.entries(manifest.imports ?? {});

function aliasFor(target: string) {
  return aliases.find(([key]) => (key.endsWith("*") ? target.startsWith(key.slice(0, -1)) : target === key));
}

describe("packages/ui boundary", () => {
  it("has sources to check", () => {
    expect(sources.length).toBeGreaterThan(0);
  });

  for (const [alias, mapped] of aliases) {
    it(`alias ${alias} maps inside the package`, () => {
      expect(mapped.startsWith("./"), `${alias} -> ${mapped}`).toBe(true);
      expect(relative(root, join(root, mapped)).startsWith(".."), `${alias} -> ${mapped}`).toBe(false);
    });
  }

  for (const path of sources) {
    const name = relative(root, path);
    const text = readFileSync(path, "utf8");

    it(`${name} imports only its own files and declared packages`, () => {
      for (const match of text.matchAll(specifier)) {
        const target = match[1] ?? match[2] ?? "";
        if (target.startsWith("#")) {
          expect(aliasFor(target), `${name} -> ${target} has no alias in package.json imports`).toBeDefined();
          continue;
        }
        if (target.startsWith(".")) {
          expect(relative(root, join(path, "..", target)).startsWith(".."), `${name} -> ${target}`).toBe(false);
          continue;
        }
        expect(declared.has(packageName(target)), `${name} -> ${target}`).toBe(true);
      }
    });

    it(`${name} carries no Outpost-specific terms`, () => {
      expect(text).not.toMatch(/outpost/i);
    });

    if (name.endsWith(".tsx")) {
      // Components derive every colour and size from globals.css tokens or
      // the Tailwind scale. Only 1px and 2px hairline offsets may be literal.
      it(`${name} hard-codes no colours or sizes`, () => {
        expect(text, "literal colour").not.toMatch(/oklch\(|rgba?\(|hsla?\(|#[0-9a-f]{3,8}\b/i);
        expect(text, "Tailwind palette colour").not.toMatch(
          /\b(?:bg|text|border|ring|fill|stroke|outline|shadow|from|to)-(?:white|black|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d+)\b/,
        );
        for (const [value] of text.matchAll(/\[[^\]]*\d(?:\.\d+)?(?:px|rem|em)[^\]]*\]/g)) {
          const lengths = value.match(/\d+(?:\.\d+)?(?:px|rem|em)/g) ?? [];
          expect(lengths.every((length) => length === "1px" || length === "2px"), `${name}: ${value}`).toBe(true);
        }
      });

      // Translucent colours are named roles in globals.css (fill-subtle,
      // border-muted, focus-ring and so on), never an ad hoc /NN opacity.
      it(`${name} uses colour roles, not /NN opacity`, () => {
        expect(text.match(colourOpacity) ?? [], name).toEqual([]);
      });

      // Light and dark values live in one token via light-dark(), so a
      // component never restates a colour under dark:. Blend modes can't go
      // through light-dark(), which is why avatar's edge keeps one override.
      it(`${name} has no dark: overrides`, () => {
        const overrides = text.match(/\bdark:[^\s"'`]+/g) ?? [];
        const allowed = name.endsWith("avatar.tsx") ? ["dark:after:mix-blend-lighten"] : [];
        expect(overrides.filter((cls) => !allowed.includes(cls)), name).toEqual([]);
      });

      // Base UI passes className as a function of state; cn() would drop it.
      it(`${name} merges className with cnState`, () => {
        expect(text, name).not.toMatch(/\bcn\([^;]*\bclassName\s*\)/);
      });
    }
  }
});
