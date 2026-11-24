import { defineConfig } from "oxfmt";
import ultracite from "ultracite/oxfmt";

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    "dist/**",
    "coverage/**",
    ".next/**",
    "**/next-env.d.ts",
    "bun.lock",
    // Generated: the scripts that write these own their format.
    "packages/parks/src/styles/palette.css",
    "packages/parks/src/themes/*.css",
  ],
  proseWrap: "never",
});
