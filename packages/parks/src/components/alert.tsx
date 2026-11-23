import * as React from "react"
import { cva } from "class-variance-authority"
import { isTone, type Tone } from "#lib/tone"
import { cnState } from "#lib/utils"

/*
 * `tone` colours only the glyph and title. The description stays muted, so a
 * red or amber alert reads at a glance without shouting. `variant` keeps
 * shadcn's names (`default`, `destructive`) and the older tone names as
 * aliases for `tone`.
 */
const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border bg-card px-2.5 py-2 text-left text-sm text-card-foreground has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      toned: {
        true: "*:data-[slot=alert-title]:text-tone-strong *:[svg]:text-tone-strong",
        false: "",
      },
    },
    defaultVariants: {
      toned: false,
    },
  }
)

type AlertVariant = "default" | Exclude<Tone, "neutral" | "brand" | "merged">

type AlertProps = React.ComponentProps<"div"> & {
  /** The colour of the glyph and title. Defaults to neutral. */
  tone?: Tone
  /** shadcn's `default`/`destructive`, or an older tone name: an alias for `tone`. */
  variant?: AlertVariant | null
}

function Alert({ className, variant, tone: toneProp, ...props }: AlertProps) {
  const tone: Tone = isTone(toneProp)
    ? toneProp
    : variant && variant !== "default"
      ? variant
      : "neutral"
  return (
    <div
      data-slot="alert"
      data-tone={tone}
      role="alert"
      className={cnState(alertVariants({ toned: tone !== "neutral" }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cnState(
        "font-medium group-has-[>svg]/alert:col-start-2 group-has-data-[slot=alert-meta]/alert:pe-16 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cnState(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * A timestamp or other short meta in the alert's top-right corner, on the
 * title's line. The title leaves room for it.
 *
 * @example
 * <AlertMeta><time dateTime="2026-11-22T21:10Z">2 min ago</time></AlertMeta>
 */
function AlertMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-meta"
      className={cnState(
        "absolute top-2 right-2.5 text-xs leading-5 whitespace-nowrap text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cnState("absolute top-2 right-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction, AlertMeta, alertVariants }
export type { AlertProps, AlertVariant }
