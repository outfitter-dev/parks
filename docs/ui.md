# Web UI

Outpost's pages use Tailwind CSS v4 and shadcn components built on Base UI. Shared tokens, styles and components live in the `@workspace/ui` package under `packages/ui`, so they can move to a shared Outfitter repo later.

## Where code goes

- `packages/ui` holds anything another Outfitter app could use: the theme in `src/styles/globals.css`, primitives in `src/components`, and helpers such as `cn` in `src/lib`. It imports only its own files and the packages its `package.json` declares, and it never names Outpost. `test/ui-boundary.test.ts` enforces both.
- The app holds Outpost-specific pieces: pages under `app/` and composites under `components/` (imported as `#components/...`).

Import shared pieces by their package path, for example `import { Button } from "@workspace/ui/components/button"`.

## Control typography

Use the shared component’s typography for control labels. Tabs that switch between code examples use the same UI typeface and size as other tabs. Within a code example, use the code typography for the command or output. When migrating a bespoke control to a shared component, check which local styles still serve a purpose before carrying them over.

## Adding a shadcn component

Add components through the repo script, which runs the shadcn CLI against `packages/ui` and then swaps every icon for Solar:

```sh
bun run ui:add <component> [<component>...]
```

The CLI has no Solar support. Because `components.json` sets `iconLibrary` to `solar`, it leaves each icon as an `<IconPlaceholder lucide="…" …/>`. The script replaces each placeholder with the Solar icon that `packages/ui/icons.json` maps that Lucide name to, adds the per-icon import, and removes the placeholder import. If a name has no mapping it stops and lists it: add the name to `icons.json` and run `bun run ui:add --fix-only`.

The script also fixes a CLI 4.23.0 bug that writes the `#lib/utils` import as `from "cn"` and adds the unrelated npm package `cn`. Review the result before committing: Base UI `className` callbacks still need `cnState`, which `test/ui-boundary.test.ts` checks.

## Icons

Solar (`@solar-icons/react`) is the only icon library. Import each icon on its own from a style subpath, never from the package root:

```tsx
import { BellIcon } from "@solar-icons/react/outline/bell";
```

Use `outline` by default, `bold` for selected states, and `bold-duotone` for empty states. Use `linear` when the icon needs an adjustable stroke. Mark icons alongside button text with `data-icon="inline-start"` or `"inline-end"` so the button sets the correct padding. Icons take their color from `currentColor` and their size from the component. `test/icons.test.ts` checks the icon library and import paths.

## Theme

Components read only the CSS variables in `globals.css`. Dark mode follows the system unless the root element carries `.light` or `.dark`; either class also switches a subtree.

Values are stacked, not hard-coded:

- **Seeds** are the few values a theme tunes: radius and padding, the neutral hue and tint, border strength, shadow level, the brand colour. The workbench theme panel sets only seeds.
- **Derived tokens** are built from seeds. Every neutral is a lightness step on the neutral hue and tint, written once with `light-dark()` for both modes. Foregrounds point at the surface text they share (`--card-foreground: var(--foreground)`), and radii step from `--radius` by `--radius-step`.
- **Components** use tokens or the Tailwind scale (`p-0.75`, `--spacing(60)`), never a literal colour or length. The only literals allowed are 1px and 2px hairline offsets. `test/ui-boundary.test.ts` enforces this.

A theme that sets `--primary-seed` (for example `var(--brand)`) replaces the default ink primary.
