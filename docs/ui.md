# Web UI

Outpost's pages use Tailwind CSS v4 and shadcn components built on Base UI. Shared tokens, styles and components live in the `@workspace/ui` package under `packages/ui`, so they can move to a shared Outfitter repo later.

## Where code goes

- `packages/ui` holds anything another Outfitter app could use: the theme in `src/styles/globals.css`, primitives in `src/components`, and helpers such as `cn` in `src/lib`. It imports only its own files and the packages its `package.json` declares, and it never names Outpost. `test/ui-boundary.test.ts` enforces both.
- The app holds Outpost-specific pieces: pages under `app/` and composites under `components/` (imported as `#components/...`).

Import shared pieces by their package path, for example `import { Button } from "@workspace/ui/components/button"`.

## Adding a shadcn component

Run the CLI against the package so the component lands there:

```sh
bunx --bun shadcn@4.23.0 add <component> -c packages/ui
```

Check the result before committing. In CLI 4.23.0 the `#lib/utils` alias was written as `from "cn"` and the unrelated npm package `cn` was added to `packages/ui/package.json`; fix the import and remove that dependency if it happens again.

## Theme

Components read only the CSS variables in `globals.css`. Dark mode follows the system unless the root element carries `.light` or `.dark`; either class also switches a subtree.

Values are stacked, not hard-coded:

- **Seeds** are the few values a theme tunes: radius and padding, the neutral hue and tint, border strength, shadow level, the brand colour. The workbench theme panel sets only seeds.
- **Derived tokens** are built from seeds. Every neutral is a lightness step on the neutral hue and tint, written once with `light-dark()` for both modes. Foregrounds point at the surface text they share (`--card-foreground: var(--foreground)`), and radii step from `--radius` by `--radius-step`.
- **Components** use tokens or the Tailwind scale (`p-0.75`, `--spacing(60)`), never a literal colour or length. The only literals allowed are 1px and 2px hairline offsets. `test/ui-boundary.test.ts` enforces this.

A theme that sets `--primary-seed` (for example `var(--brand)`) replaces the default ink primary.
