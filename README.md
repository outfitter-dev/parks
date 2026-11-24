# Parks

Outfitter's design system: **P**atterns · **A**ssets · **R**ules · **K**its · **S**tyles.

Parks ships as one package, `@outfitter/parks`, with tokens, theme CSS, components and the UI rules, plus a shadcn registry and a showcase at `parks.outfitter.dev`. Nothing is published yet.

## Layout

- `packages/parks`: the package. Theme in `src/styles`, components in `src/components`, helpers in `src/lib`.
- `apps/showcase`: every component and composition, with a live token panel. Fixtures only.
- `test/`: the UI rules and package checks.
- `docs/ui.md`: how the tokens, tones, sizes and components fit together.

The code moved here from `outfitter-dev/outpost` with its history.

## Work on it

```sh
bun install
bun run dev      # showcase on http://localhost:3100
bun run check    # typecheck and tests
```

Add shadcn components with `bun run ui:add <component>` and regenerate the palette with `bun run ui:palette`; see `docs/ui.md`.

## License

MIT
