import { existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const roots = ["app", "apps", "cli", "lib", "packages", "plugins"];
const skip = new Set([
  "node_modules",
  ".next",
  ".turbo",
  ".cloudflare",
  "dist",
  "out",
]);

/** The same UI sources feed import lint and the icon gallery inventory. */
export function iconSources(repo: string): string[] {
  function files(dir: string): string[] {
    return readdirSync(dir).flatMap((name) => {
      if (skip.has(name)) {
        return [];
      }
      const path = join(dir, name);
      return statSync(path).isDirectory()
        ? files(path)
        : /\.(tsx?|jsx?|mjs)$/u.test(name)
          ? [path]
          : [];
    });
  }

  const sources = roots.flatMap((root) => {
    const path = join(repo, root);
    return existsSync(path) ? files(path) : [];
  });
  if (sources.length === 0) {
    throw new Error("Icon lint found no UI source files.");
  }
  return sources;
}
