import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

import { iconSources } from "./icon-sources";

const repo = path.join(import.meta.dirname, "..");
const result = spawnSync(
  path.join(repo, "node_modules/.bin/oxlint"),
  [
    "--config",
    path.join(import.meta.dirname, "oxlint-icons.json"),
    "--no-ignore",
    ...iconSources(repo),
  ],
  { cwd: repo, stdio: "inherit" }
);
if (result.error) {
  throw result.error;
}
process.exitCode = result.status ?? 1;
