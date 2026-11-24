import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { checkSource } from "../packages/parks/src/rules/source";

// Registry items are copy-in blocks built on @outfitter/parks. They depend on
// the package for components and tokens instead of carrying copies, so a
// block copied into an app still follows the theme.
const repo = path.join(import.meta.dirname, "..");
const registry: {
  items: {
    name: string;
    dependencies?: string[];
    cssVars?: unknown;
    css?: unknown;
    files: { path: string; type: string }[];
  }[];
} = JSON.parse(readFileSync(path.join(repo, "registry.json"), "utf8"));

describe("registry", () => {
  it("has items", () => {
    expect(registry.items.length).toBeGreaterThan(0);
  });

  for (const item of registry.items) {
    describe(item.name, () => {
      it("depends on @outfitter/parks and carries no tokens of its own", () => {
        expect(item.dependencies).toContain("@outfitter/parks");
        expect(item.cssVars).toBeUndefined();
        expect(item.css).toBeUndefined();
      });

      for (const file of item.files) {
        const text = readFileSync(path.join(repo, file.path), "utf8");

        it(`${file.path} lives under apps/showcase/registry`, () => {
          expect(file.path.startsWith("apps/showcase/registry/")).toBe(true);
        });

        it(`${file.path} imports Parks from the package, not copies`, () => {
          const specifiers = Array.from(
            text.matchAll(/from\s+["']([^"']+)["']/gu),
            (match) => match[1] ?? ""
          );
          // A relative import may only reach another file of the same item,
          // which the CLI installs beside it.
          const siblings = new Set(item.files.map((other) => other.path));
          for (const specifier of specifiers) {
            expect(specifier.startsWith("#"), specifier).toBe(false);
            if (specifier.startsWith(".")) {
              const target = `${path.join(path.dirname(file.path), specifier)}.tsx`;
              expect(siblings.has(target), specifier).toBe(true);
            }
          }
        });

        it(`${file.path} passes the Parks source rules`, () => {
          expect(checkSource(text)).toEqual([]);
        });
      }
    });
  }
});
