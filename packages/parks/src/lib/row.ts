/*
 * The one row recipe shared by menu, select and nav items. Each starts from
 * shadcn's own class list (DropdownMenuItem, SelectItem, SidebarMenuButton);
 * this file keeps the parts they share in one place so weight, padding, icon
 * size and the highlighted state cannot drift apart.
 */

/**
 * The shape of a row in a popup list, without its highlighted or disabled
 * state. Lists mark those states differently, so each list adds its own:
 * `menuRow` for menus and selects (focus), `comboboxRowState` for Base UI
 * Combobox (data-highlighted), `commandRowState` for cmdk (data-selected).
 */
export const popupRow =
  "relative flex w-full cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-normal outline-hidden select-none data-indent:ps-7 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

/** A row in a popup list: menu items, sub-menu triggers and select items. */
export const menuRow = [
  popupRow,
  "focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
].join(" ")

/** Combobox items keep focus in the input and mark the active row with data-highlighted. */
export const comboboxRowState =
  "data-highlighted:bg-accent data-highlighted:text-accent-foreground data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50"

/** cmdk always sets data-selected and data-disabled, to "true" or "false". */
export const commandRowState =
  "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[selected=true]:**:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"

/**
 * Muted children (icons, shortcuts) follow the row's text on highlight.
 * Toned rows leave this off so their children keep the tone colour.
 */
export const menuRowFocusChildren = "focus:**:text-accent-foreground"

/** Room at the end for a check or radio indicator. */
export const menuRowIndicator = "pe-8"

/** The indicator itself, pinned to the row's end. */
export const menuRowIndicatorSlot = "pointer-events-none absolute end-2 flex size-4 items-center justify-center"

/** A row in a nav list. The current page reads as `aria-current` or `data-current`. */
export const navRow =
  "flex w-full min-w-0 items-center gap-2 rounded-md px-2 text-start text-muted-foreground outline-hidden hover:bg-fill-subtle hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus-ring aria-[current=page]:bg-fill aria-[current=page]:font-medium aria-[current=page]:text-foreground data-current:bg-fill data-current:font-medium data-current:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
