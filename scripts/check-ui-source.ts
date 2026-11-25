/** Apply the shipped UI source rules to the package and registry sources. */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { checkSource } from "../packages/parks/src/rules/source";

const repo = join(import.meta.dirname, "..");

function packageSources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return packageSources(path);
    }
    return path.endsWith(".tsx") ? [path] : [];
  });
}

function check() {
  const sources = packageSources(join(repo, "packages/parks/src"));
  if (sources.length === 0) {
    throw new Error("packages/parks/src has no TSX sources to check");
  }
  const registry: { items: { name: string; files: { path: string }[] }[] } =
    JSON.parse(readFileSync(join(repo, "registry.json"), "utf8"));
  if (registry.items.length === 0) {
    throw new Error("registry.json has no items to check");
  }
  for (const item of registry.items) {
    if (item.files.length === 0) {
      throw new Error(`Registry item ${item.name} has no sources to check`);
    }
    sources.push(...item.files.map((file) => join(repo, file.path)));
  }

  const paths = new Set(sources);
  let count = 0;
  for (const path of paths) {
    const name = relative(repo, path);
    for (const violation of checkSource(readFileSync(path, "utf8"))) {
      count += 1;
      console.error(
        `${name}:${violation.line}  ${violation.rule}  ${violation.match}\n  ${violation.message}`
      );
    }
  }
  console.log(`UI source rules: ${paths.size} files, ${count} problems`);
  return count === 0 ? 0 : 1;
}

try {
  process.exitCode = check();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
