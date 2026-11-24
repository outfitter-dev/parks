import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";

export default defineConfig({
  env: { browser: true, node: true },
  extends: [core],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    "dist/**",
    "coverage/**",
    ".next/**",
    "**/next-env.d.ts",
    // Vendored ReUI pieces keep their upstream shape.
    "apps/showcase/demos/reui/**",
  ],
  rules: {
    // shadcn components are function declarations that use helpers defined
    // below them, and their cva variant maps are ordered by meaning, not by
    // name. Keeping them close to upstream matters more than these styles.
    "func-style": "off",
    "no-use-before-define": "off",
    "sort-keys": "off",
    // Spreading data-* attributes into mergeProps avoids an excess-property
    // error; the "useless" spread is load-bearing there.
    "unicorn/no-useless-spread": "off",
    "typescript/consistent-type-definitions": "off",
    // Imported code that predates these rules. They warn so CI can move;
    // fix a file's findings when touching it, then delete the rule here.
    complexity: "warn",
    curly: "warn",
    "default-case": "warn",
    eqeqeq: "warn",
    "no-empty-function": "warn",
    "no-eq-null": "warn",
    "no-inline-comments": "warn",
    "no-nested-ternary": "warn",
    "no-plusplus": "warn",
    "no-promise-executor-return": "warn",
    "no-unused-vars": "warn",
    "prefer-destructuring": "warn",
    "prefer-named-capture-group": "warn",
    "require-await": "warn",
    "require-unicode-regexp": "warn",
    "promise/avoid-new": "warn",
    "typescript/ban-types": "warn",
    "typescript/consistent-type-imports": "warn",
    "typescript/no-dynamic-delete": "warn",
    "typescript/no-non-null-assertion": "warn",
    "unicorn/consistent-function-scoping": "warn",
    "unicorn/import-style": "warn",
    "unicorn/no-array-for-each": "warn",
    "unicorn/no-array-sort": "warn",
    "unicorn/prefer-array-index-of": "warn",
    "unicorn/prefer-code-point": "warn",
    "unicorn/prefer-default-parameters": "warn",
    "unicorn/prefer-number-coercion": "warn",
    "unicorn/prefer-number-properties": "warn",
    "unicorn/prefer-query-selector": "warn",
    "unicorn/prefer-spread": "warn",
    "unicorn/text-encoding-identifier-case": "warn",
  },
});
