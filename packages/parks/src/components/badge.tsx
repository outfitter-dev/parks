import type { ReactNode } from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn, cnState } from "#lib/utils"

/*
 * A small status label: the one place a status gets its colour.
 *
 * - Tones are flat by default: a soft tint with matching text, no edge.
 *   `ring` adds a 1px tonal ring for badges that sit on busy surfaces.
 * - Surface labels share the fill of inset panels.
 * - Shape is a rounded rectangle, except inside a card's action slot, where
 *   it becomes a pill that shares the card corner's centre. `shape="pill"`
 *   forces the pill anywhere.
 * - A leading mark (`dot`, `live` or `icon`) sits as far in from the start
 *   edge as from the top and bottom, so on a pill it is concentric with the
 *   end cap and on a rectangle it is evenly inset.
 * - Counts default to a pill and show "99+" above `max`.
 */
const badgeVariants = cva(
  "group/badge text-trim relative inline-flex [--badge-h:--spacing(5)] h-(--badge-h) w-fit max-w-full shrink-0 items-center justify-center gap-1 overflow-hidden border border-transparent px-1.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring data-lead:ps-[calc((var(--badge-h)-var(--badge-mark))/2)] data-lead:pe-2 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-invalid-border aria-invalid:ring-invalid-ring [&>svg]:pointer-events-none [&>svg]:size-3! in-data-[slot=card-action]:rounded-full in-data-[slot=card-action]:[--corner-nudge:calc(var(--frame-space)-var(--frame-radius)+var(--badge-h)/2)] in-data-[slot=card-action]:-mt-(--corner-nudge) in-data-[slot=card-action]:-me-(--corner-nudge) data-count:min-w-(--badge-h) data-count:px-1",
  {
    variants: {
      variant: {
        neutral: "bg-fill text-muted-foreground [a]:hover:bg-fill-strong",
        surface: "bg-panel-fill text-muted-foreground [a]:hover:bg-muted",
        plain: "bg-transparent text-muted-foreground",
        primary: "bg-primary text-primary-foreground [a]:hover:bg-primary-hover",
        success: "bg-success-fill text-success-foreground [a]:hover:bg-success-fill-hover",
        warning: "bg-warning-fill text-warning-foreground [a]:hover:bg-warning-fill-hover",
        info: "bg-info-fill text-info-foreground [a]:hover:bg-info-fill-hover",
        destructive:
          "bg-destructive-fill text-destructive-foreground focus-visible:ring-invalid-ring [a]:hover:bg-destructive-fill-hover",
        outline: "bg-chip text-foreground shadow-xs ring-1 ring-chip-ring [a]:hover:bg-fill",
        ghost: "hover:bg-ghost-hover hover:text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      shape: {
        rect: "rounded-xs",
        pill: "rounded-full",
      },
      ring: {
        true: "ring-1",
        false: "",
      },
    },
    compoundVariants: [
      { variant: ["neutral", "surface"], ring: true, class: "ring-border-muted" },
      { variant: "success", ring: true, class: "ring-success-border" },
      { variant: "warning", ring: true, class: "ring-warning-border" },
      { variant: "info", ring: true, class: "ring-info-border" },
      { variant: "destructive", ring: true, class: "ring-destructive-border" },
    ],
    defaultVariants: {
      variant: "neutral",
      shape: "rect",
      ring: false,
    },
  }
)

type BadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    /** A small dot in the tone's colour before the text. */
    dot?: boolean
    /** The dot pulses softly: for running, live and recording states. */
    live?: boolean
    /** Any glyph before the text (an icon, a loader), drawn at 12px. */
    icon?: ReactNode
    /** Makes it a round count: the number in place of the text. */
    count?: number
    /** The highest count shown in full; above it the badge reads max+. */
    max?: number
  }

/** 7 · 1,234 · 99+: whole numbers, never below zero, in the reader's digits. */
function formatCount(count: number, max: number) {
  const format = (value: number) => new Intl.NumberFormat().format(value)
  const n = Math.max(0, Math.floor(count))
  const top = Math.max(0, Math.floor(Number.isFinite(max) ? max : 99))
  if (n <= top) return format(n)

  return (
    <span className="inline-flex items-center gap-px">
      <span className="text-trim">{format(top)}</span>
      <span className="sr-only">+</span>
      <span
        aria-hidden
        className="grid size-[0.65cap] shrink-0 place-items-center before:[grid-area:1/1] before:w-full before:border-t after:[grid-area:1/1] after:h-full after:border-s"
      />
    </span>
  )
}

// The neutral dot is lighter than its text, so it doesn't compete with the label.
const quietDot = new Set(["neutral", "surface", "plain", "outline", "ghost"])

function Badge({
  className,
  variant = "neutral",
  shape,
  ring = false,
  dot,
  live,
  icon,
  count,
  max = 99,
  children,
  render,
  ...props
}: BadgeProps) {
  const isCount = typeof count === "number" && Number.isFinite(count)
  const lead = isCount ? null : dot || live ? "dot" : icon != null && icon !== false ? "icon" : null
  const empty = !isCount && !lead && (children == null || children === false || children === "")

  const dotClass = cn(
    "relative size-(--badge-mark) shrink-0 rounded-full",
    quietDot.has(variant ?? "neutral") ? "bg-fg-subtle" : "bg-current",
    live &&
      "after:absolute after:inset-0 after:animate-live after:rounded-full after:bg-inherit motion-reduce:after:hidden"
  );

  let content: ReactNode = children
  if (isCount) {
    content = formatCount(count, max)
  } else if (lead) {
    const label =
      typeof children === "string" || typeof children === "number" ? (
        <span className="text-trim min-w-0">{children}</span>
      ) : (
        children
      )
    content = (
      <>
        {lead === "dot" ? (
          <span
            data-slot="badge-dot"
            aria-hidden
            className={dotClass}
          />
        ) : (
          <span
            data-slot="badge-icon"
            aria-hidden
            className="grid size-(--badge-mark) shrink-0 place-items-center [&>svg]:size-full"
          >
            {icon}
          </span>
        )}
        {label}
      </>
    )
  }

  const element = useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cnState(
          badgeVariants({ variant, shape: isCount && shape !== "rect" ? "pill" : shape, ring }),
          lead === "dot" && "[--badge-mark:--spacing(1.5)]",
          lead === "icon" && "[--badge-mark:--spacing(3)]",
          className
        ),
        children: content,
        ...(lead ? { "data-lead": lead } : {}),
        ...(isCount ? { "data-count": "" } : {}),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })

  // Nothing to say (no text, no count, no mark): no empty pill either.
  return empty ? null : element
}

export { Badge, badgeVariants }
export type { BadgeProps }
