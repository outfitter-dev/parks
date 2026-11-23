/*
 * The one row recipe shared by menu, select and nav items. Each starts from
 * shadcn's own class list (DropdownMenuItem, SelectItem, SidebarMenuButton);
 * this file keeps the parts they share in one place so weight, padding, icon
 * size and the highlighted state cannot drift apart.
 */

/** A row in a popup list: menu items, sub-menu triggers and select items. */
export const menuRow =
  "relative flex w-full cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-normal outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-indent:ps-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

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
