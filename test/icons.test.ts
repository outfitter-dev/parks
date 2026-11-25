import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

// Solar is the one icon library. Every icon is imported on its own from a
// style subpath, such as @solar-icons/react/outline/bell, so bundles stay small.
const repo = join(import.meta.dirname, "..");
const gallery = join(repo, "apps/showcase/demos/icons.tsx");
const scanned = ["app", "apps", "cli", "lib", "packages", "plugins"];
const skip = new Set([
  "node_modules",
  ".next",
  ".turbo",
  ".cloudflare",
  "dist",
  "out",
]);

function files(dir: string): string[] {
  let names: string[];
  try {
    names = readdirSync(dir);
  } catch {
    return [];
  }
  return names.flatMap((name) => {
    if (skip.has(name)) {
      return [];
    }
    const path = join(dir, name);
    return statSync(path).isDirectory()
      ? files(path)
      : /\.(tsx?|jsx?|mjs)$/.test(name)
        ? [path]
        : [];
  });
}

const sources = scanned.flatMap((dir) => files(join(repo, dir)));
const specifier = /(?:from|import)\s*\(?\s*["']([^"']+)["']/g;
const otherLibraries =
  /^(lucide-react|lucide|@tabler\/icons-react|@hugeicons\/|@phosphor-icons\/|@remixicon\/|@radix-ui\/react-icons|@heroicons\/|react-icons)/;
const solarStyles = new Set([
  "linear",
  "bold",
  "bold-duotone",
  "broken",
  "line-duotone",
  "outline",
]);

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

  for (const path of sources) {
    const text = readFileSync(path, "utf8");
    const imports = [...text.matchAll(specifier)].map(
      (match) => match[1] ?? ""
    );
    const name = relative(repo, path);

    it(`${name} uses only Solar icons`, () => {
      expect(imports.filter((target) => otherLibraries.test(target))).toEqual(
        []
      );
    });

    it(`${name} imports Solar icons one at a time`, () => {
      const solar = imports.filter((target) =>
        target.startsWith("@solar-icons/react")
      );
      const unscoped = solar.filter((target) => {
        const style = target.split("/")[2];
        return style === undefined || !solarStyles.has(style);
      });
      expect(unscoped).toEqual([]);
    });
  }
});
