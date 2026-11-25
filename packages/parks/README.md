# @outfitter/parks

Outfitter's design system for React and Tailwind CSS v4: tokens, the theme stylesheet, components on Base UI, and the helpers they share. See the [showcase](https://parks.outfitter.dev) and the [repository](https://github.com/outfitter-dev/parks).

## Install

```sh
bun add @outfitter/parks
```

React 19 and Tailwind CSS 4 are peer dependencies.

## Use

Import the stylesheet once from your app's root CSS. It brings in Tailwind, the Parks tokens and Outfitter's default theme, and tells Tailwind to scan the package's components.

```css
@import "@outfitter/parks/styles.css";
```

Import components by path:

```tsx
import { Button } from "@outfitter/parks/components/button";

export function Save() {
  return <Button>Save</Button>;
}
```

The default theme uses the Allo and JetBrains Mono typefaces when they are loaded (for example from the `allo-font` and `@fontsource-variable/jetbrains-mono` packages) and falls back to the system fonts.

## Tune the theme

A theme sets seeds and the stylesheet derives every colour, radius and shadow from them in light and dark. Override seeds in a `:root` rule after the import; `themes/outfitter.css` lists them all.

```css
@import "@outfitter/parks/styles.css";

:root {
  --neutral-hue: 250;
  --radius: 8px;
}
```

Import `@outfitter/parks/globals.css` instead of `styles.css` to start from the plain defaults with no theme.

Dark mode follows the system unless the root element carries `.light` or `.dark`; either class also switches a subtree.

## Check your UI against the Parks rules

The package ships a `parks` command. Add it to your checks:

```sh
bunx parks check            # scans ./src, ./app and ./components
bunx parks check apps/web   # or the paths you name
```

It flags class names that drift off the theme:

- `colour-opacity`: an ad hoc `/NN` opacity such as `bg-foreground/10`. Use a translucent role such as `fill-subtle` or `border-muted`.
- `dark-variant`: a colour restated under `dark:`. Roles already carry light and dark values through `light-dark()`.
- `literal-colour` and `palette-colour`: a literal colour or a palette step such as `red-500`. Use a colour role.
- `literal-length`: a bracketed length other than 1px or 2px. Use the Tailwind scale or a token.
- `lone-outline-button`: an outline `Button` with no solid partner. Use `variant="secondary"` on its own.

To keep a deliberate exception, put `// parks-ignore <rule>: <reason>` on the line above or on the same line.

`parks contrast <compiled.css>` scores every text role on its surface, in light and dark, against WCAG: 4.5:1 for text, and 3:1 for a label on a solid control fill (primary, brand, a tone's solid). That includes each tone's text on its tint and on its solid fill. It renders the roles in Chromium, so it needs `playwright-core` and its browser:

```sh
bun add -d playwright-core
bunx playwright-core install chromium-headless-shell
bunx parks contrast dist/app.css
```

## Lint React components with Oxlint

Load the Parks plugin in an app that uses the component package. This example uses Oxlint 1.95 and enables warnings on JSX and TSX files. Adjust the file patterns to cover your app's screens and compositions.

```json
{
  "jsPlugins": ["@outfitter/parks/oxlint"],
  "overrides": [
    {
      "files": ["**/*.jsx", "**/*.tsx"],
      "rules": {
        "parks/layout-only-classname": "warn",
        "parks/no-rebuilt-primitives": "warn",
        "parks/icon-button-label": "warn"
      }
    }
  ]
}
```

- `layout-only-classname` checks styling on imported Parks components. Use classes for placement, such as `mt-2` or `w-full`, and component props such as `tone`, `variant` and `size` for appearance.
- `no-rebuilt-primitives` points native controls to their Parks equivalents. Hidden, file and range inputs can use native elements. For an intentional native control such as a sidebar backdrop, keep the exception local with an Oxlint suppression and a reason.
- `icon-button-label` checks icon-only Parks buttons for an accessible name. Name the action, for example `<Button size="icon" aria-label="Search"><SearchIcon /></Button>`.

These checks read JSX and statically recognizable class names. Use the rendered accessibility tree to verify buttons whose labels come from other components or runtime data.

The rules were inspired by [Outtrue](https://github.com/jakubkrehel/outtrue). Run `oxlint` for these JSX checks and `parks check` for Parks' theme rules.
