/**
 * Adds shadcn components to packages/parks with Solar icons.
 *
 *   bun run ui:add accordion dialog
 *   bun run ui:add --fix-only [dir]   # rewrite files already on disk
 *
 * The shadcn CLI has no Solar support. With `iconLibrary: "solar"` in
 * components.json it leaves each icon as an <IconPlaceholder lucide="…" …/>.
 * This script swaps every placeholder for the Solar icon named in
 * packages/parks/icons.json, and fixes the CLI's `from "cn"` import.
 */
import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const repo = join(import.meta.dirname, "..");
const ui = join(repo, "packages/parks");
const shadcn = "shadcn@4.23.0";
const iconLibraries = ["lucide", "tabler", "hugeicons", "phosphor", "remixicon", "radix"];
const strayPackages = ["cn", "lucide-react"];

const iconMap: Record<string, string> = JSON.parse(readFileSync(join(ui, "icons.json"), "utf8"));

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (name === "node_modules") return [];
    return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(name) ? [path] : [];
  });
}

function exportName(solarPath: string) {
  const name = solarPath.split("/")[1] ?? "";
  return `${name.replace(/(^|-)([a-z0-9])/g, (_, __, char: string) => char.toUpperCase())}Icon`;
}

/** Returns the rewritten source and any Lucide names that have no Solar mapping. */
export function rewrite(source: string): { code: string; missing: string[] } {
  const missing: string[] = [];
  const needed = new Map<string, string>();
  let code = source.replace(/<IconPlaceholder\b([\s\S]*?)\/>/g, (whole, attributes: string) => {
    const lucide = attributes.match(/\blucide="([^"]+)"/)?.[1];
    const solar = lucide ? iconMap[lucide] : undefined;
    if (!lucide || !solar) {
      missing.push(lucide ?? "(no lucide name)");
      return whole;
    }
    const component = exportName(solar);
    needed.set(component, solar);
    const kept = attributes.replace(new RegExp(`\\s*\\b(${iconLibraries.join("|")})="[^"]*"`, "g"), "");
    return `<${component}${kept}/>`;
  });
  code = code.replace(/^import \{ cn \} from "cn"$/m, 'import { cn } from "#lib/utils"');
  if (needed.size > 0 && !/<IconPlaceholder\b/.test(code)) {
    code = code.replace(/^import \{ IconPlaceholder \} from "[^"]+"\n/m, "").replace(/\n{3,}/g, "\n\n");
  }
  const imports = [...needed]
    .filter(([component]) => !code.includes(`import { ${component} }`))
    .map(([component, solar]) => `import { ${component} } from "@solar-icons/react/${solar}"`);
  if (imports.length > 0) {
    const lines = code.split("\n");
    // Insert after the line that ends the last import statement, so a
    // multi-line `import {\n  A,\n} from "x"` is never split.
    let last = -1;
    let open = false;
    lines.forEach((line, index) => {
      if (/^import\s/.test(line)) open = true;
      if (open && /(from\s+)?["'][^"']+["'];?\s*$/.test(line)) {
        last = index;
        open = false;
      }
    });
    lines.splice(last + 1, 0, ...imports);
    code = lines.join("\n");
  }
  return { code, missing };
}

function fixDirectory(dir: string) {
  const missing = new Map<string, string[]>();
  let changed = 0;
  for (const path of files(dir)) {
    const source = readFileSync(path, "utf8");
    const { code, missing: unmapped } = rewrite(source);
    if (code !== source) {
      writeFileSync(path, code);
      changed += 1;
    }
    if (unmapped.length > 0) missing.set(relative(repo, path), unmapped);
  }
  return { changed, missing };
}

function dropStrayPackages() {
  const path = join(ui, "package.json");
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  const removed = strayPackages.filter((name) => manifest.dependencies?.[name]);
  for (const name of removed) delete manifest.dependencies[name];
  if (removed.length > 0) writeFileSync(path, `${JSON.stringify(manifest, null, 2)}\n`);
  return removed;
}

async function main() {
  const args = process.argv.slice(2);
  const fixOnly = args[0] === "--fix-only";
  if (!fixOnly) {
    if (args.length === 0) {
      console.error("Usage: bun run ui:add <component...>");
      process.exit(2);
    }
    const run = spawnSync("bunx", ["--bun", shadcn, "add", ...args, "-c", "packages/parks"], {
      cwd: repo,
      stdio: "inherit",
    });
    if (run.status !== 0) process.exit(run.status ?? 1);
  }
  const dir = fixOnly && args[1] ? resolve(args[1]) : join(ui, "src");
  const { changed, missing } = fixDirectory(dir);
  const removed = fixOnly ? [] : dropStrayPackages();
  console.log(`Rewrote ${changed} file(s) to Solar icons.`);
  if (removed.length > 0) console.log(`Removed stray dependencies: ${removed.join(", ")}. Run bun install.`);
  if (missing.size > 0) {
    console.error("These Lucide icons have no Solar mapping. Add them to packages/parks/icons.json and rerun with --fix-only:");
    for (const [path, names] of missing) console.error(`  ${path}: ${[...new Set(names)].join(", ")}`);
    process.exit(1);
  }
}

if (import.meta.main) await main();
