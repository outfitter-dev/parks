/**
 * Packs @outfitter/parks, installs the tarball into a throwaway app outside
 * the workspace, and checks that the components render and the stylesheet
 * compiles with the default theme, a seed override and both colour modes.
 *
 *   bun scripts/check-consumer.ts
 */
import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const repo = path.join(import.meta.dirname, "..");
const pkg = path.join(repo, "packages/parks");
const fixture = path.join(repo, "test/consumer");

function run(command: string, args: string[], cwd: string) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed in ${cwd}`);
  }
}

const work = mkdtempSync(path.join(tmpdir(), "parks-consumer-"));
run("bun", ["pm", "pack", "--destination", work], pkg);
const tarball = readdirSync(work).find((name) => name.endsWith(".tgz"));
if (!tarball) {
  throw new Error("bun pm pack wrote no tarball");
}

const app = path.join(work, "app");
cpSync(fixture, app, { recursive: true });
const root = JSON.parse(readFileSync(path.join(repo, "package.json"), "utf8"));
const versions = { ...root.devDependencies };
writeFileSync(
  path.join(app, "package.json"),
  JSON.stringify(
    {
      name: "parks-consumer",
      private: true,
      type: "module",
      dependencies: {
        "@outfitter/parks": `file:${path.join(work, tarball)}`,
        react: versions.react,
        "react-dom": versions["react-dom"],
        tailwindcss: versions.tailwindcss,
        "@tailwindcss/cli": versions["@tailwindcss/cli"],
      },
    },
    null,
    2
  )
);
run("bun", ["install"], app);
run("node", ["render.mjs"], app);
// The registry's blocks build on the packed package as an app would copy
// them: each file lands at its target, and each block's other dependencies
// are installed at the versions the showcase uses.
const registry: {
  items: {
    dependencies?: string[];
    files: { path: string; target: string }[];
  }[];
} = JSON.parse(readFileSync(path.join(repo, "registry.json"), "utf8"));
const showcase = JSON.parse(
  readFileSync(path.join(repo, "apps/showcase/package.json"), "utf8")
);
const parksDeps = JSON.parse(
  readFileSync(path.join(pkg, "package.json"), "utf8")
).dependencies;
const blockDeps = new Set<string>();
for (const item of registry.items) {
  for (const file of item.files) {
    mkdirSync(path.dirname(path.join(app, file.target)), { recursive: true });
    cpSync(path.join(repo, file.path), path.join(app, file.target));
  }
  for (const dependency of item.dependencies ?? []) {
    if (dependency !== "@outfitter/parks") {
      blockDeps.add(dependency);
    }
  }
}
const pinned = [...blockDeps].map(
  (name) => `${name}@${showcase.dependencies[name] ?? parksDeps[name]}`
);
if (pinned.length > 0) {
  run("bun", ["add", ...pinned], app);
}
run("bun", ["render-blocks.tsx"], app);
run("bunx", ["@tailwindcss/cli", "-i", "app.css", "-o", "out.css"], app);

// The shipped rules pass the fixture's own source, and fail once a
// component restates a colour under dark:.
run("bunx", ["parks", "check", "src"], app);
writeFileSync(
  path.join(app, "src/bad.tsx"),
  'export const Bad = () => <p className="bg-card dark:bg-black">x</p>;\n'
);
const bad = spawnSync("bunx", ["parks", "check", "src"], {
  cwd: app,
  encoding: "utf8",
});
if (bad.status !== 1 || !bad.stdout.includes("dark-variant")) {
  throw new Error(
    `parks check did not flag a dark: override:\n${bad.stdout}${bad.stderr}`
  );
}

const css = readFileSync(path.join(app, "out.css"), "utf8");
const checks: [string, boolean][] = [
  ["default theme radius", css.includes("--radius: 13px")],
  ["seed override", css.includes("--neutral-hue: 250")],
  ["both colour modes", css.includes("light-dark(")],
  ["component classes from the package", css.includes("--button-r")],
];
const failed = checks.filter(([, ok]) => !ok).map(([name]) => name);
if (failed.length > 0) {
  throw new Error(`stylesheet check failed: ${failed.join(", ")}`);
}
console.log(`consumer ok (${work})`);
