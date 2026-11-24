# Third-party notices

Parks is MIT licensed (see `LICENSE`). It includes or depends on the following third-party work. Everything vendored into this repository is listed with its source and licence; dependencies installed from npm keep their own licence files.

## Vendored into this repository

| What | Where | Source | Licence |
| --- | --- | --- | --- |
| shadcn/ui components, adapted | `packages/parks/src/components` (started from the shadcn CLI, base flavour) | [shadcn-ui/ui](https://github.com/shadcn-ui/ui), © 2023 shadcn | MIT |
| shadcn utility classes | `packages/parks/src/styles/shadcn-utilities.css` | shadcn 4.23.0 `dist/tailwind.css`, © 2023 shadcn | MIT |
| ReUI components: file type, icon stack, icon tile, scrollspy, stepper, timeline | `apps/showcase/demos/reui` (showcase only, not published) | [keenthemes/reui](https://github.com/keenthemes/reui) free components, © KeenThemes Inc. | MIT |

The ReUI pieces above are from the public, MIT-licensed ReUI repository.

## Icons and fonts

| What | Used by | Source | Licence |
| --- | --- | --- | --- |
| Solar icons via `@solar-icons/react` | `@outfitter/parks` components and the showcase | Icons by [480 Design](https://www.figma.com/community/file/1166831539721848736); React package MIT | Icons CC BY 4.0, package MIT |
| Allo via `allo-font` | showcase; named in the default theme, not shipped | allo-font | SIL OFL 1.1 |
| Inter via `@fontsource-variable/inter` | showcase | Rasmus Andersson | SIL OFL 1.1 |
| JetBrains Mono via `@fontsource-variable/jetbrains-mono` | showcase; named in the default theme, not shipped | JetBrains | SIL OFL 1.1 |

`@outfitter/parks` names Allo and JetBrains Mono in its default font stacks but does not ship font files; apps that want them load them, under their licences.

## Runtime dependencies of `@outfitter/parks`

All MIT unless noted: `@base-ui/react`, `@shadcn/react`, `@tanstack/react-table`, `@solar-icons/react` (icons CC BY 4.0, above), `class-variance-authority` (Apache-2.0), `clsx`, `cmdk`, `input-otp`, `react-resizable-panels`, `tailwind-merge`, `tw-animate-css`.

## Showcase-only dependencies

Not published. `next`, `motion` and `dialkit` (MIT); `@pierre/diffs` and `@pierre/trees` (Apache-2.0); `agentation` (PolyForm Shield 1.0.0, a source-available licence) is a development tool for annotating the showcase locally; it loads only under `next dev` and is left out of production builds.
