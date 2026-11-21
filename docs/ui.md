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

Components read only the CSS variables in `globals.css`. Dark mode follows the system unless the root element carries `.light` or `.dark`. The current values are a provisional neutral theme until the design direction lands.
