# Parks

Outfitter's design system: **P**atterns · **A**ssets · **R**ules · **K**its · **S**tyles.

Parks ships as one package, `@outfitter/parks`: tokens and theme CSS, React components on Base UI, helpers, and the UI rules as a `parks` command. A shadcn registry of copy-in blocks and a showcase of everything live at `parks.outfitter.dev`. Nothing is published yet.

## Use it in an app

```sh
bun add @outfitter/parks
```

```css
/* app.css */
@import "@outfitter/parks/styles.css";
```

```tsx
import { Button } from "@outfitter/parks/components/button";
```

See [`packages/parks/README.md`](packages/parks/README.md) for theming, `parks check` and `parks contrast`.

## Registry

The showcase serves a shadcn registry at `parks.outfitter.dev/r`. Add `"@outfitter": "https://parks.outfitter.dev/r/{name}.json"` to an app's `components.json` registries, then `bunx shadcn add @outfitter/ask`. Blocks depend on `@outfitter/parks` instead of copying its components or tokens. Their sources live in `apps/showcase/registry`, are listed in `registry.json`, and are built by `bun run registry:build`.

## Layout

- `packages/parks`: the package. Theme in `src/styles` and `src/themes`, components in `src/components`, helpers in `src/lib`, the rules in `src/rules`.
- `apps/showcase`: every component and composition with fixtures, the live token panel, and the registry sources.
- `test/`: the UI rules, package and registry checks. `scripts/`: `ui:add`, `ui:palette`, `ui:theme`, the consumer and contrast checks.
- `docs/ui.md`: how tones, sizes, rows, cards, headers and the theme fit together.

The code moved here from `outfitter-dev/outpost` with its history.

## Work on it

```sh
./scripts/bootstrap.sh
bun run dev              # showcase on http://localhost:3100
bun run check            # lint, format, typecheck and tests
bun run lint:ui-source   # package and registry theme rules, plus showcase opacity and dark-mode rules
bun run check:consumer   # install the packed package into a throwaway app
```

See `AGENTS.md` for the rules of the repo.

## License

MIT. Third-party code, icons and fonts are listed in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
