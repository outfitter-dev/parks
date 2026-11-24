# Showcase

A preview app for `packages/parks`. It shows full screen compositions, single components and the primitives they are built from. The DialKit panel in the corner tunes the design tokens live and switches between the Outfitter default and Linear-like presets.

The showcase depends only on `@outfitter/parks` and needs no secrets. Everything in this repo is public, so fixtures only.

## Run it

```sh
bun install
bun run --cwd apps/showcase dev   # http://localhost:3100
```

## Add an entry

1. Add a row to `lib/nav.ts` with its section, slug, title and summary.
2. Write the demo in `demos/` as a client component. Use `Specimen` for component examples and `Viewport` for full screens.
3. Register it in `demos/index.tsx` under `section/slug`.

Fixtures in `lib/fixtures.ts` are made up. Never load live product data here.

## Tokens

`@outfitter/parks/lib/theme` holds the presets and compiles them to the CSS variables that `packages/parks` reads. "Copy tokens" in the panel copies that CSS. The corner model: `--radius` is the inner radius, `--pad` is a frame's padding, and a frame's radius is their sum (`rounded-frame`). Frame padding is even on every side so pills, buttons and glyphs sit concentric in the corners; text blocks add `--inset` on the left and right (`px-inset`, `ps-inset`, `pe-inset`) so they don't read top-heavy. The `frame` and `panel` utilities in `packages/parks` publish their own padding, radius and inset to their children, and `--inset` is `--inset-ratio` times the nearest container's padding, so smaller or nested containers get a smaller inset on their own. Resize one with `--frame-pad` or `--panel-pad` on that element. Buttons and badges use `text-trim` (CSS `text-box`) so a single line centres on its cap height.

## Icons and components

Icons are Solar, imported one by one from `@solar-icons/react/outline/<name>` (MIT; icons by 480 Design, CC BY 4.0). The repo’s `ui:add` script maps shadcn’s icon placeholders to Solar.

New components may follow ReUI patterns. ReUI's free components are MIT but built on Radix, so port each one to Base UI rather than installing it as-is.

## Annotations

In development (`bun run dev`), the [Agentation](https://www.agentation.com) toolbar (bottom right, desktop only) pins notes to elements. Production builds leave it out. Each note records the element, its React component path and its computed styles.

- **Copy:** press `C` or use the toolbar's Copy button to put every note on the page on your clipboard as markdown. This works with nothing else running.
- **Agents (MCP):** the repo's `.mcp.json` registers `agentation-mcp`, so Claude Code in this repo offers to start it. The server listens on `localhost:4747` and keeps notes in `~/.agentation/store.db` until an agent resolves them. Agents read them with `agentation_get_all_pending` and answer with `agentation_reply`, `agentation_resolve` or `agentation_dismiss`. Other agents can register the same command: `bunx agentation-mcp@1.3.2 server`.
- **Scripts and the CLI:** the same server has an HTTP API, so `curl localhost:4747/pending` lists open notes and `curl -N localhost:4747/events` streams them as they arrive.

On `localhost` the toolbar syncs to the server automatically. The server only accepts browser origins listed in `AGENTATION_CORS_ORIGINS` in `.mcp.json`. `NEXT_PUBLIC_AGENTATION_ENDPOINT` overrides the endpoint entirely.
