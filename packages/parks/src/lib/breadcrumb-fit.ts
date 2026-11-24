/** What fits of a breadcrumb path in the width available. */
export type BreadcrumbFit = {
  /** How many ancestors after the root fold into the overflow menu. */
  hidden: number
  /** Whether the root shows its icon alone, after every ancestor that can fold has folded. */
  compactRoot: boolean
}

/**
 * Folds ancestors into the overflow menu, nearest the root first, until the
 * path fits. The root and the current item never fold. When the path still
 * doesn't fit and the root has an icon, the root drops its label.
 *
 * @param widths each item's natural width, separator included, root first
 * @param overflowWidth the overflow trigger's width, separator included
 * @param available the width the path may use
 * @param rootHasIcon whether the root can show an icon alone
 */
export function fitBreadcrumb(
  widths: readonly number[],
  overflowWidth: number,
  available: number,
  rootHasIcon: boolean
): BreadcrumbFit {
  const foldable = Math.max(0, widths.length - 2)
  let required = widths.reduce((sum, width) => sum + width, 0)
  let hidden = 0
  while (required > available && hidden < foldable) {
    if (hidden === 0) required += overflowWidth
    hidden += 1
    required -= widths[hidden] ?? 0
  }
  return { hidden, compactRoot: rootHasIcon && foldable > 0 && required > available }
}

/**
 * How many ancestors fold to keep the path within `maxItems` positions,
 * counting the overflow trigger as one. Never fewer than three positions:
 * root, overflow, current.
 */
export function hiddenByLimit(count: number, maxItems: number): number {
  const limit = Math.max(3, Math.floor(maxItems) || 3)
  return count > limit ? count - limit + 1 : 0
}
