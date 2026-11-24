/*
 * The one segmented control: a muted track holding segments, the selected
 * one raised. Tabs (`TabsList` default variant) and `ToggleGroup` (default
 * variant) both draw with it, so a filter and a tab strip look the same.
 * It starts from shadcn's TabsList and TabsTrigger class lists.
 *
 * The track takes `data-size` (xs, sm, default, lg) and is that control
 * height (the steps in #lib/size). A segment is selected when it carries
 * `data-active` (Tabs) or `data-pressed` (Toggle).
 */

/** The track. */
export const segmentTrack =
  "group/segment inline-flex h-(--size-h) w-fit items-center rounded-lg bg-muted p-0.75 text-muted-foreground [--size-h:var(--control-h)] data-[size=xs]:[--size-h:--spacing(6)] data-[size=xs]:rounded-md data-[size=sm]:[--size-h:--spacing(7)] data-[size=sm]:rounded-md data-[size=lg]:[--size-h:--spacing(9)]";

/** A segment inside the track. */
export const segmentItem =
  "relative inline-flex h-full flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 text-sm font-medium whitespace-nowrap text-tab-text transition-all outline-none hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 has-data-[icon=inline-end]:pe-1 has-data-[icon=inline-start]:ps-1 group-data-[size=xs]/segment:rounded-sm group-data-[size=xs]/segment:text-xs group-data-[size=sm]/segment:rounded-sm group-data-[size=sm]/segment:text-(length:--text-control-small) [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-active:border-tab-active-border data-active:bg-tab-active data-active:text-foreground data-active:shadow-sm data-pressed:border-tab-active-border data-pressed:bg-tab-active data-pressed:text-foreground data-pressed:shadow-sm";
