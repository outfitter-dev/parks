import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { iconSources } from "../scripts/icon-sources";

// Solar is the one icon library. Every icon is imported on its own from a
// style subpath, such as @solar-icons/react/outline/bell, so bundles stay small.
const repo = join(import.meta.dirname, "..");
const gallery = join(repo, "apps/showcase/demos/icons.tsx");
const sources = iconSources(repo);
const specifier = /(?:from|import)\s*\(?\s*["']([^"']+)["']/g;
describe("icons", () => {
  it("has sources to check", () => {
    expect(sources.length).toBeGreaterThan(0);
  });

  it("lists every Solar glyph used in the UI in alphabetical order", () => {
    const glyphImport = /^@solar-icons\/react\/[^/]+\/([^/]+)$/;
    const used = sources
      .filter((path) => path !== gallery)
      .flatMap((path) =>
        [...readFileSync(path, "utf8").matchAll(specifier)].flatMap(
          ([, target]) => {
            const glyph = glyphImport.exec(target)?.[1];
            return glyph ? [glyph] : [];
          }
        )
      );
    const listed = Array.from(
      readFileSync(gallery, "utf8").matchAll(
        /\{\s*name: "([^"]+)",\s*outline:/g
      ),
      ([, name]) => name
    );
    expect(listed).toEqual([...new Set(used)].sort());
  });
});
