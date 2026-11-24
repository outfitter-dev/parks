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
