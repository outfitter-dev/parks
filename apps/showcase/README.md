# Workbench

A preview app for `packages/ui`. It shows full screen compositions, single components and the primitives they are built from. The DialKit panel in the corner tunes the design tokens live and switches between the Luma tuned and Linear-like presets.

The workbench depends only on `@workspace/ui`. It needs no Outpost secrets, and it can move with the UI package when that package leaves this repo (POST-120).

## Run it

```sh
bun install
bun run --cwd apps/workbench dev   # http://localhost:3100
```

Every branch also gets a Vercel preview from the `ui-workbench` project, at `ui-workbench-git-<branch>-outfitter.vercel.app`. Previews need a Vercel login.

## Add an entry

1. Add a row to `lib/nav.ts` with its section, slug, title and summary.
2. Write the demo in `demos/` as a client component. Use `Specimen` for component examples and `Viewport` for full screens.
3. Register it in `demos/index.tsx` under `section/slug`.

Fixtures in `lib/fixtures.ts` are made up. Never load live Board or Outpost data here.

## Tokens

`lib/theme.ts` holds the presets and compiles them to the CSS variables that `packages/ui` reads. "Copy tokens" in the panel copies that CSS. The corner model: `--radius` is the inner radius, `--pad` is a frame's padding, and a frame's radius is their sum (`rounded-frame`). Frame padding is even on every side so pills, buttons and glyphs sit concentric in the corners; text blocks add `--inset` on the left and right with the `px-inset` utility so they don't read top-heavy.

## Icons and components

Icons are Solar, imported one by one from `@solar-icons/react/linear/<name>` (MIT; icons by 480 Design, CC BY 4.0). The shadcn CLI still writes Lucide imports, so swap them for Solar when you add a component.

New components may follow ReUI patterns. ReUI's free components are MIT but built on Radix, so port each one to Base UI rather than installing it as-is.

## Annotations

The [Agentation](https://www.agentation.com) toolbar (bottom right, desktop only) pins notes to elements. Each note records the element, its React component path and its computed styles.

- **Copy:** press `C` or use the toolbar's Copy button to put every note on the page on your clipboard as markdown. This works everywhere, including Vercel previews, with nothing else running.
- **Agents (MCP):** the repo's `.mcp.json` registers `agentation-mcp`, so Claude Code in this repo offers to start it. The server listens on `localhost:4747` and keeps notes in `~/.agentation/store.db` until an agent resolves them. Agents read them with `agentation_get_all_pending` and answer with `agentation_reply`, `agentation_resolve` or `agentation_dismiss`. Other agents can register the same command: `bunx agentation-mcp@1.3.2 server`.
- **Scripts and the CLI:** the same server has an HTTP API, so `curl localhost:4747/pending` lists open notes and `curl -N localhost:4747/events` streams them as they arrive.

On `localhost` the toolbar syncs to the server automatically. On a preview it stays copy-only until you open the page once with `?annotations=mcp`, because a public page reaching `localhost` makes the browser ask for local network access. `?annotations=off` turns it back off. The server only accepts browser origins listed in `AGENTATION_CORS_ORIGINS` in `.mcp.json`; add a branch preview's origin there if you annotate on it. `NEXT_PUBLIC_AGENTATION_ENDPOINT` overrides the endpoint entirely.
