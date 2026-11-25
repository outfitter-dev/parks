# @outfitter/parks

## 0.1.0

### Minor Changes

- 41a6464: First release of Parks as `@outfitter/parks`: tokens and theme CSS (`styles.css` with Outfitter's default theme, or `globals.css` without one), React components on Base UI, theme presets in `lib/theme`, and a compiled `dist` with declarations for apps outside this repo.
- 1a313ab: Add `HaloSignal`, the loading signal for work in progress, and `Stat`, a stat tile, generalized from the showcase.
- bf0829d: Add the `parks` command: `parks check` applies the Parks source rules to an app's files, and `parks contrast` scores every text role on its surface in light and dark (needs `playwright-core` with Chromium).

### Patch Changes

- bf0829d: Darken the brand fill slightly (15% toward its 600 step) and the light-mode success fill (15% toward emerald-700) so labels on solid brand and success controls reach 3:1.
