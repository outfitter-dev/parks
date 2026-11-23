import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { navRow } from "#lib/row"
import { cnState } from "#lib/utils"

/*
 * A nav row: an icon, a label and an optional count or mark at the end.
 * Based on shadcn's SidebarMenuButton without the sidebar context. `current`
 * marks the page the user is on (aria-current="page"), and renders the same
 * fill as a selected Item.
 */
const navItemVariants = cva(navRow, {
  variants: {
    size: {
      default: "h-(--control-h)",
      sm: "h-7 text-xs",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

type NavItemProps = useRender.ComponentProps<"a"> &
  VariantProps<typeof navItemVariants> & {
    /** The page the user is on. Sets aria-current="page". */
    current?: boolean
  }

/**
 * @example
 * <NavItem href="/inbox" current>
 *   <InboxIcon />
 *   Inbox
 *   <Badge count={3} className="ms-auto" />
 * </NavItem>
 */
function NavItem({ className, size = "default", current = false, render, ...props }: NavItemProps) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cnState(navItemVariants({ size }), className),
        "aria-current": current ? "page" : undefined,
      },
      props
    ),
    render,
    state: {
      slot: "nav-item",
      size,
      current,
    },
  })
}

export { NavItem, navItemVariants, type NavItemProps }
