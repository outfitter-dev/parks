/*
 * One size scale for controls: xs, sm, default and lg. Button, Toggle,
 * Input, Select and the segmented control share these heights, so any two
 * controls of the same size line up in a row. Components that are not
 * controls (Badge, Avatar, Item) use the same names for their own steps.
 * Icon-only is a size on the components that take one: `icon`, `icon-xs`,
 * `icon-sm` and `icon-lg` keep the height and make the control square.
 *
 * Each step sets --size-h; a component draws at `h-(--size-h)`.
 */
export const controlSize = {
  xs: "[--size-h:--spacing(6)]",
  sm: "[--size-h:--spacing(7)]",
  default: "[--size-h:var(--control-h)]",
  lg: "[--size-h:--spacing(9)]",
} as const;

export type ControlSize = keyof typeof controlSize;
