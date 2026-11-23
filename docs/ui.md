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

Re-adding a component that already exists overwrites the file. Badge, Button, Alert and DropdownMenuItem carry Outpost's tone model (below), so diff a re-added copy against git and keep the `tone` handling.

## Tone and emphasis

Colour and emphasis are separate props. `tone` is the colour role: `neutral`, `info`, `success`, `warning`, `destructive`, `brand` or `merged` (`packages/ui/src/lib/tone.ts`). `variant` is emphasis only: Badge takes `tint` (default), `solid`, `outline`, `plain`; Button takes `solid` (default), `tint`, `secondary`, `outline`, `ghost`, `link`. Any tone works with any variant.

A component sets `data-tone` and its classes read the `--tone-*` roles from `globals.css` (`bg-tone-fill`, `text-tone-foreground`, `ring-tone-border`, `bg-tone-mark` and so on), so there is no compound class per tone and variant. Use the same utilities to give a custom element a tone: set `data-tone` on it.

shadcn's values and the older tone-as-variant values still work as aliases: Button `default` is `solid`, `destructive` is a destructive `tint`; Badge `success`, `warning`, `info`, `destructive` and `neutral` are that tone as a `tint`; Alert `destructive`, `warning`, `success` and `info` set the tone. Prefer `tone=` in new code. Map domain states to a `Tone` in one table (see `agentModeTones` in the workbench kit), not to class strings.

## Icons

Solar (`@solar-icons/react`) is the only icon library. Import each icon on its own from a style subpath, never from the package root:

```tsx
import { BellIcon } from "@solar-icons/react/outline/bell";
```

Use `outline` by default, `bold` for selected states, and `bold-duotone` for empty states. `outline` glyphs are filled paths, so their weight is fixed at 1.5/24 of the icon size; there is no stroke token. Mark icons alongside button text with `data-icon="inline-start"` or `"inline-end"` so the button sets the correct padding. Icons take their color from `currentColor` and their size from the component. `test/icons.test.ts` checks the icon library and import paths.

## Theme

Components read only the CSS variables in `globals.css`. Dark mode follows the system unless the root element carries `.light` or `.dark`; either class also switches a subtree.

Values are stacked, not hard-coded:

- **Seeds** are the few values a theme tunes: radius and padding, the neutral hue and tint, border strength, shadow level, the brand colour. The workbench theme panel sets only seeds.
- **Derived tokens** are built from seeds. Every neutral is a lightness step on the neutral hue and tint, written once with `light-dark()` for both modes. Foregrounds point at the surface text they share (`--card-foreground: var(--foreground)`), and radii step from `--radius` by `--radius-step`.
- **Palettes** are every Tailwind palette name (`red` to `rose`, the four greys and `neutral`), generated into `styles/palette.css` by `bun scripts/ui-palette.ts` from `src/lib/palette.ts`, so `bg-red-500` keeps working while the values are ours. The chromatic palettes are one family: each authors only a hue and how far that hue drifts into the darks, and every palette shares one lightness curve and one chroma target per step, capped inside Display P3. So `-500` reads as the same weight in every hue, where Tailwind's 500s run from lightness 0.59 to 0.80. Yellows and yellow-greens may go further in the lights, where equal chroma reads dull. The greys keep a seed (Tailwind's 500) and `neutral` follows the neutral hue and tint seeds. The brand is a palette name (Luma uses `orange`): `--color-brand-*` points at that palette's steps and `--brand` is its 500. `test/ui-palette.test.ts` checks the CSS matches the script, every step stays in gamut, and same-step lightness stays within a band.
- **Roles** are what components use. Tones map to palettes (destructive red, warning amber, success emerald, info blue, merged purple) and each gives `strong`, `foreground`, `contrast`, `fill` and `border` roles for both modes. Translucent neutrals are named too: `fg-subtle`, `fill-subtle`, `fill`, `fill-strong`, `border-muted`, `border-strong`, `inverse-muted`, `glass`, `focus-ring`.
- **Components** use roles or the Tailwind scale (`p-0.75`, `--spacing(60)`), never a literal colour, a palette step, an ad hoc `/NN` opacity, a `dark:` override or a literal length. The only literals allowed are 1px and 2px hairline offsets. `test/ui-boundary.test.ts` enforces this for `packages/ui`, and `test/ui-workbench-roles.test.ts` holds the workbench demos to the opacity and `dark:` rules.

A theme that sets `--primary-seed` (for example `var(--brand)`) replaces the default ink primary.
