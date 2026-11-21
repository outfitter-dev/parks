import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

// packages/ui is meant to move to a shared repo (POST-120), so it may only use
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
  }
});
