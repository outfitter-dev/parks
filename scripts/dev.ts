/**
 * Builds @outfitter/parks once, then runs its TypeScript watcher and the
 * showcase dev server side by side. Ctrl-C stops both.
 *
 *   bun run dev
 */
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const repo = path.join(import.meta.dirname, "..");
const pkg = path.join(repo, "packages/parks");
const showcase = path.join(repo, "apps/showcase");

if (
  spawnSync("bun", ["run", "build"], { cwd: pkg, stdio: "inherit" }).status !==
  0
) {
  process.exit(1);
}

const children = [
  spawn("bun", ["run", "dev"], { cwd: pkg, stdio: "inherit" }),
  spawn("bun", ["run", "dev:app"], { cwd: showcase, stdio: "inherit" }),
];
const stop = () => {
  for (const child of children) {
    child.kill("SIGTERM");
  }
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
for (const child of children) {
  child.on("exit", (code) => {
    stop();
    process.exitCode = code ?? 0;
  });
}
