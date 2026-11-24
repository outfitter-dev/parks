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

Colour and emphasis are separate props. `tone` is the colour role: `neutral`, `info`, `success`, `warning`, `destructive`, `brand` or `merged` (`packages/ui/src/lib/tone.ts`). `variant` is emphasis only: Badge takes `tint` (default), `solid`, `outline`, `plain`; Button takes `solid` (default), `tint`, `secondary`, `outline`, `ghost`, `link`. Any tone works with any variant. Never leave an `outline` button on its own: a lone secondary action is `secondary` (grey); outline pairs with a solid button.

A component sets `data-tone` and its classes read the `--tone-*` roles from `globals.css` (`bg-tone-fill`, `text-tone-foreground`, `ring-tone-border`, `bg-tone-mark` and so on), so there is no compound class per tone and variant. Use the same utilities to give a custom element a tone: set `data-tone` on it.

shadcn's values and the older tone-as-variant values still work as aliases: Button `default` is `solid`, `destructive` is a destructive `solid`; Badge `success`, `warning`, `info`, `destructive` and `neutral` are that tone as a `tint`; Alert `destructive`, `warning`, `success` and `info` set the tone. Prefer `tone=` in new code. Map domain states to a `Tone` in one table (see `agentModeTones` in the workbench kit), not to class strings.

## Rows

Build any row of label, meta and trailing action with `Item` (`packages/ui/src/components/item.tsx`, from shadcn's Item). Slots: `ItemMedia` (icon, dot or mark), `ItemContent` with `ItemTitle` and `ItemDescription`, `ItemMeta` (muted, tabular, never wraps), and `ItemActions` (badges and buttons). `ItemHeader` and `ItemFooter` span the full width when a row needs a second line.

`Item` takes `variant` (`default`, `outline`, `muted`), `size` (`default`, `sm`, `xs`; `xs` is one control high) and `selected`. Render it as a link or button with `render` to get hover and focus states. Wrap rows in `ItemGroup`: `open` spaces them apart, `list` divides them with rules, and `bounded` also puts them in one rounded panel. Neither component sets a list role; add `role="list"` and `role="listitem"` yourself when the rows are a real list rather than buttons or links.

Disclosure rows that open in place, such as `TraceLine` in the workbench, stay on Collapsible.

Menu, select and nav rows share one recipe in `packages/ui/src/lib/row.ts`, so weight, padding, icon size and the highlighted state match. Use `NavItem` for a nav link (`current` sets `aria-current="page"` and the same fill as a selected Item; `size="sm"` for dense lists). Menu items, labels and sub-menu triggers take `indent` to line up past an icon column; shadcn's `inset` still works as an alias, but it is not the `--inset` text padding.

## Cards and headers

Every card-like box is a `Card`. `variant` sets the look: `raised` (the default), `outline` (an edge, no shadow, for dense cards in a list), `filled` (a panel fill, for stat tiles) and `tray` (a muted well that holds other cards, which take its concentric radius). `size` is `sm`, `default` or `lg`, and the radius follows the padding. `selected` is the one selected look, a brand ring; rendering a card as a link or button (`render`) makes it `interactive`. A card with no header, content or footer pads evenly, so a bare card needs no padding classes.

Card, Dialog, Popover and Alert headers share one grid (`packages/ui/src/lib/header.ts`): lead, title, description, meta, then actions. Meta and actions take their own columns, so an Alert with both a time and an action does not overlap. `CardLead` takes an icon, Mark or Avatar; `CardMeta` a time or count; `CardAction` any number of buttons. Titles are `font-semibold` on frames (Card, Dialog) and `font-medium` on rows and popovers (Item, Popover, Alert). `GroupLabel` is the one overline style for a group of rows; menu and select labels use the same style.

A section or detail header on the page, outside a frame, is a `SectionHeader` (`packages/ui/src/components/section-header.tsx`) on the same grid: `SectionHeaderTitle` (an `h2` by default, `render` for another level), `SectionHeaderDescription`, `SectionHeaderMeta` and `SectionHeaderAction`. `size="default"` is a section heading in `font-medium`; `size="lg"` titles a detail view in `text-lg font-semibold`. Badges that qualify the title go inside `SectionHeaderTitle`, after the text.

## Sizes, toggles and segmented controls

Controls share one size scale, `xs`, `sm`, `default` and `lg` (`packages/ui/src/lib/size.ts`): 24, 28, `--control-h` and 36px. Button, Toggle, Input, Select and the segmented control draw at those heights, so same-size controls line up in a row. Badge, Avatar and Item use the same names for their own steps. Icon-only is a size where a component takes one: `icon`, `icon-xs`, `icon-sm`, `icon-lg`.

`Toggle` is a Button that stays pressed. It takes Button's sizes, `shape` and the `ghost` (default), `outline` and `secondary` emphasis, and adds one pressed look: the `fill` background and full-strength text.

There is one segmented control (`packages/ui/src/lib/segment.ts`): a muted track whose selected segment is raised. `ToggleGroup` draws it by default, and Tabs' default `TabsList` draws the same thing. Use Tabs when each choice shows its own panel; use `ToggleGroup` to switch a filter or a view with no panel. `ToggleGroup variant="ghost" | "outline" | "secondary"` is a row of separate, spaced Toggles for a toolbar.

## Empty states, progress and chips

`Empty` is shadcn's empty state: `EmptyHeader` (with `EmptyMedia`, `EmptyTitle`, `EmptyDescription`) and `EmptyContent` for actions. Put a `Mark` in `EmptyMedia`, with a `bold-duotone` icon. `EmptyHeader` is also the centred header of the sign-in and device cards; `EmptyTitle` takes `render={<h2 />}` when it titles a card.

`Progress` adds `segments` (counted steps drawn as separate segments: `true` for one per step, or a number), `showValue` (the percentage, or `done/max` for segments, at the end of the bar's line) and `tone` for the fill.

A chip is a `Badge`: `size` (`xs`, `sm`, `default`, `lg`) and `mono` for code, paths and identifiers, with `icon` for a file type or graph glyph. File chips in the composer and nodes in the Trails graph use `variant="outline" size="lg" mono`.

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
