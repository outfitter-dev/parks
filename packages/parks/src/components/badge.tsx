import type { ReactNode } from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { StatusDot } from "#components/status-dot"
import { isTone, type Tone } from "#lib/tone"
import { cnState } from "#lib/utils"

/*
 * A small status label: the one place a status gets its colour.
 *
 * - `tone` is the colour (see #lib/tone); `variant` is the emphasis. Tint
 *   is the default: a soft fill with matching text, no edge. `solid` fills
 *   with the tone, `outline` sits on a chip with a tonal ring, `plain` is
 *   text only. `ring` adds a 1px tonal ring to any of them for badges that
 *   sit on busy surfaces.
 * - The older tone-as-variant values (`success`, `warning`, `info`,
 *   `destructive`, `neutral`) and shadcn's `default`/`secondary` still work
 *   and resolve to a tone plus `tint` or `solid`.
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
        tint: "bg-tone-fill text-tone-foreground [a]:hover:bg-tone-fill-hover",
        solid: "bg-tone text-tone-contrast [a]:hover:bg-tone-solid-hover",
        outline:
          "bg-chip text-tone-strong shadow-xs ring-1 ring-tone-border data-[tone=neutral]:ring-chip-ring [a]:hover:bg-fill",
        plain: "bg-transparent text-tone-foreground",
        surface: "bg-panel-fill text-tone-foreground [a]:hover:bg-muted",
        ghost: "hover:bg-ghost-hover hover:text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      shape: {
        rect: "rounded-xs",
        pill: "rounded-full",
      },
      ring: {
        true: "ring-1 ring-tone-border",
        false: "",
      },
    },
    defaultVariants: {
      variant: "tint",
      shape: "rect",
      ring: false,
    },
  }
)

type Emphasis = NonNullable<VariantProps<typeof badgeVariants>["variant"]>

/** Older and shadcn variant names, kept as aliases for a tone plus emphasis. */
const variantAliases = {
  neutral: { tone: "neutral", variant: "tint" },
  default: { tone: "neutral", variant: "solid" },
  primary: { tone: "neutral", variant: "solid" },
  secondary: { tone: "neutral", variant: "tint" },
  success: { tone: "success", variant: "tint" },
  warning: { tone: "warning", variant: "tint" },
  info: { tone: "info", variant: "tint" },
  destructive: { tone: "destructive", variant: "tint" },
} as const satisfies Record<string, { tone: Tone; variant: Emphasis }>

type BadgeVariant = Emphasis | keyof typeof variantAliases

/** Splits a badge's `variant` into emphasis and, for an alias, its tone. */
function resolveBadge(variant: BadgeVariant | null | undefined, tone: Tone | undefined) {
  const value = variant ?? "tint"
  if (value in variantAliases) {
    const alias = variantAliases[value as keyof typeof variantAliases]
    return { tone: tone ?? alias.tone, variant: alias.variant as Emphasis }
  }
  return { tone: tone ?? "neutral", variant: value as Emphasis }
}

type BadgeProps = useRender.ComponentProps<"span"> &
  Omit<VariantProps<typeof badgeVariants>, "variant"> & {
    /** The colour role. Defaults to neutral, or to the tone a legacy variant names. */
    tone?: Tone
    /** Emphasis: tint (default), solid, outline, plain, surface, ghost, link. */
    variant?: BadgeVariant | null
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

function Badge({
  className,
  variant: variantProp,
  tone: toneProp,
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
  const { tone, variant } = resolveBadge(variantProp, isTone(toneProp) ? toneProp : undefined)
  const isCount = typeof count === "number" && Number.isFinite(count)
  const lead = isCount ? null : dot || live ? "dot" : icon != null && icon !== false ? "icon" : null
  const empty = !isCount && !lead && (children == null || children === false || children === "")


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
          <StatusDot
            data-slot="badge-dot"
            tone={tone}
            live={Boolean(live)}
            // On a solid fill the dot takes the text colour, or it would vanish.
            className={variant === "solid" ? "size-(--badge-mark) bg-current" : "size-(--badge-mark)"}
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
          "data-[tone=destructive]:focus-visible:ring-invalid-ring",
          lead === "dot" && "[--badge-mark:--spacing(1.5)]",
          lead === "icon" && "[--badge-mark:--spacing(3)]",
          className
        ),
        children: content,
        ...{ "data-tone": tone, "data-variant": variant },
        ...(lead ? { "data-lead": lead } : {}),
        ...(isCount ? { "data-count": "" } : {}),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
      tone,
    },
  })

  // Nothing to say (no text, no count, no mark): no empty pill either.
  return empty ? null : element
}

export { Badge, badgeVariants }
export type { BadgeProps, BadgeVariant }
