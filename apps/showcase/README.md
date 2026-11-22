# Workbench

A preview app for `packages/ui`. It shows full screen compositions, single components and the primitives they are built from. The DialKit panel in the corner tunes the design tokens live and switches between the Luma tuned and Linear-like presets.

The workbench depends only on `@workspace/ui`. It needs no Outpost secrets, and it can move with the UI package when that package leaves this repo.

## Run it

```sh
bun install
bun run --cwd apps/workbench dev   # http://localhost:3100
```

Every branch also gets a Vercel preview from the `outpost-workbench` project.

## Add an entry

1. Add a row to `lib/nav.ts` with its section, slug, title and summary.
2. Write the demo in `demos/` as a client component. Use `Specimen` for component examples and `Viewport` for full screens.
3. Register it in `demos/index.tsx` under `section/slug`.

Fixtures in `lib/fixtures.ts` are made up. Never load live Board or Outpost data here.

## Tokens

`lib/theme.ts` holds the presets and compiles them to the CSS variables that `packages/ui` reads. "Copy tokens" in the panel copies that CSS. The corner model: `--radius` is the inner radius, `--pad` is a frame's padding, and a frame's radius is their sum (`rounded-frame`).

## Icons and components

Icons are Solar, imported one by one from `@solar-icons/react/linear/<name>` (MIT; icons by 480 Design, CC BY 4.0). The shadcn CLI still writes Lucide imports, so swap them for Solar when you add a component.

New components may follow ReUI patterns. ReUI's free components are MIT but built on Radix, so port each one to Base UI rather than installing it as-is.
