import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

import { colourOpacity } from "./ui-rules";

// The workbench demos are how we try the design system, so they follow the
// same colour rules as packages/parks: roles for translucency and one token for
// light and dark. reui is vendored and keeps its own styles.
const root = join(import.meta.dirname, "../apps/showcase");

const vendored = new Set(["reui", "node_modules", ".next"]);

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    if (vendored.has(name)) {
      return [];
    }
    const path = join(dir, name);
    return statSync(path).isDirectory() ? files(path) : [path];
  });
}

const sources = ["app", "demos"]
  .flatMap((dir) => files(join(root, dir)))
  .filter((path) => path.endsWith(".tsx"));

describe("workbench colour roles", () => {
  it("has sources to check", () => {
    expect(sources.length).toBeGreaterThan(0);
  });

  for (const path of sources) {
    const name = relative(root, path);
    const text = readFileSync(path, "utf8");
    it(`${name} uses roles, not /NN opacity or dark: overrides`, () => {
      expect(text.match(colourOpacity) ?? [], name).toEqual([]);
      expect(text.match(/\bdark:[^\s"'`]+/g) ?? [], name).toEqual([]);
    });
  }
});
