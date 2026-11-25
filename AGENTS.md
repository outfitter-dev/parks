# Parks

Parks is Outfitter's design system: **P**atterns · **A**ssets · **R**ules · **K**its · **S**tyles. It ships as one package, `@outfitter/parks` (tokens, theme CSS, React components on Base UI, helpers and the UI rules), plus a shadcn registry and a showcase at `parks.outfitter.dev`.

Read `README.md` and `docs/ui.md` before changing components or tokens. `docs/ui.md` governs how tones, sizes, rows, cards, headers and the theme fit together; when the work shows it is wrong, update it in the same pull request.

## Layout

- `packages/parks`: the published package. Theme in `src/styles`, components in `src/components`, helpers in `src/lib`.
- `apps/showcase`: every component and composition with fixtures, and the live token panel.
- `test/`: the UI rules and package checks. `scripts/`: `ui:add`, `ui:palette`.

## Rules

- This repository is public. Fixtures only: no real people, customer or product data, credentials or internal links. Fixture names come from National Parks and famous explorers and naturalists.
- `packages/parks` imports only its own files and the packages it declares, and never names a product that uses it. Components use colour roles and the Tailwind scale: no literal colours or palette steps, no `/NN` opacity, no `dark:` overrides, no lengths beyond 1px and 2px hairlines. `bun run lint:ui-source` enforces theme usage, and `test/ui-boundary.test.ts` checks package boundaries.
- UI icons use individual Solar glyph imports, including vendored UI. `bun run lint:icons` enforces this in the standard lint chain; the gallery inventory remains a test.
- Add shadcn components with `bun run ui:add`, never by hand-copying, and keep the tone handling when re-adding one (see `docs/ui.md`).
- Every third-party asset, font, icon set or vendored code needs a licence that allows it and an entry in `THIRD_PARTY_NOTICES.md`. Anything of unclear origin stays out.
- Strict TypeScript: no `any`, no `as` casts where a narrowing works. Do not hard-wrap Markdown prose.

## Work here

Run `./scripts/bootstrap.sh` in a fresh checkout, then `bun run check` (lint, format, typecheck, tests). `bun run dev` serves the showcase on http://localhost:3100. The showcase is a static export served as an assets-only Cloudflare Worker, configured in `cloudflare.config.ts` and deployed with the `cf` CLI: `bun run deploy:check` builds it and dry-runs the deploy, and `bun run deploy` publishes it (Cloudflare credentials required). Add a changeset (`bun run changeset`) when a change to `@outfitter/parks` would be visible to its users.

Work on a branch named for its Linear issue and keep the pull request in draft until CI passes. Do not publish the package, change repository settings or access, or deploy as an incidental change.
