/*
 * One header anatomy for Card, Dialog and Popover: lead, title, description,
 * meta and actions, always in that order and always in the same grid.
 *
 *   [lead] [title        ] [meta] [actions]
 *   [lead] [description  ]        [actions]
 *
 * Empty columns collapse: the grid has no column gap, so each slot carries
 * its own margin toward the title. Titles are `font-semibold` on frames
 * (Card, Dialog) and `font-medium` on rows and popovers (Item, Popover,
 * Alert); see docs/ui.md.
 */

export const header = "grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-baseline"

export const headerLead = "col-start-1 row-span-2 row-start-1 me-3 flex items-center self-start"

export const headerTitle = "col-start-2 row-start-1 min-w-0 leading-snug"

export const headerDescription =
  "col-start-2 row-start-2 mt-1 min-w-0 text-muted-foreground"

export const headerMeta =
  "col-start-3 row-start-1 ms-3 text-xs leading-snug whitespace-nowrap text-muted-foreground tabular-nums"

export const headerAction =
  "col-start-4 row-span-2 row-start-1 ms-2 flex items-center gap-2 self-start"

/** The one overline style for a group of rows: nav sections, menu and select labels. */
export const groupLabel = "text-xs font-medium text-muted-foreground"
