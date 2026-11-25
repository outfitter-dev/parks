/** Apply the shipped UI source rules to package, registry and showcase sources. */
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { checkSource } from "../packages/parks/src/rules/source";

const repo = join(import.meta.dirname, "..");

function tsxSources(dir: string, skip?: ReadonlySet<string>): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (skip?.has(entry.name)) {
      return [];
    }
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return tsxSources(path, skip);
    }
    return path.endsWith(".tsx") ? [path] : [];
  });
}

function report(paths: Iterable<string>, only?: readonly string[]) {
  let count = 0;
  for (const path of paths) {
    const name = relative(repo, path);
    for (const violation of checkSource(readFileSync(path, "utf8"), only)) {
      count += 1;
      console.error(
        `${name}:${violation.line}  ${violation.rule}  ${violation.match}\n  ${violation.message}`
      );
    }
  }
  return count;
}

function check() {
  const sources = tsxSources(join(repo, "packages/parks/src"));
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
  const excluded = new Set(["reui", "node_modules", ".next"]);
  const showcase = ["app", "demos"].flatMap((dir) =>
    tsxSources(join(repo, "apps/showcase", dir), excluded)
  );
  if (showcase.length === 0) {
    throw new Error("Showcase app and demos have no TSX sources to check");
  }

  const count =
    report(paths) + report(showcase, ["colour-opacity", "dark-variant"]);
  console.log(
    `UI source rules: ${paths.size} package/registry files, ${showcase.length} showcase files, ${count} problems`
  );
  return count === 0 ? 0 : 1;
}

try {
  process.exitCode = check();
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
