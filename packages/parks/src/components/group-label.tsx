import * as React from "react"
import { groupLabel } from "#lib/header"
import { cnState } from "#lib/utils"

/**
 * The label over a group of rows, such as a section of nav items. Menus and
 * selects use the same style through their own label parts.
 *
 * @example
 * <GroupLabel className="px-2 pb-1">Surfaces</GroupLabel>
 */
function GroupLabel({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="group-label" className={cnState(groupLabel, className)} {...props} />
}

export { GroupLabel }
