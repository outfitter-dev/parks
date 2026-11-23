import * as React from "react"
import { cva } from "class-variance-authority"
import { header, headerAction, headerDescription, headerMeta, headerTitle } from "#lib/header"
import { isTone, type Tone } from "#lib/tone"
import { cnState } from "#lib/utils"

/*
 * `tone` colours only the glyph and title. The description stays muted, so a
 * red or amber alert reads at a glance without shouting. `variant` keeps
 * shadcn's names (`default`, `destructive`) and the older tone names as
 * aliases for `tone`.
 *
 * The alert lays out on the shared header grid (#lib/header): the glyph in
 * the lead slot, then title and description, then AlertMeta and AlertAction
 * at the end. Meta and action take their own columns, so an alert can have
 * both without them overlapping.
 */
const alertGlyph =
  "*:[svg]:col-start-1 *:[svg]:row-span-2 *:[svg]:row-start-1 *:[svg]:me-2 *:[svg]:self-start *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4"

const alertVariants = cva(
  `group/alert relative w-full rounded-lg border bg-card px-2.5 py-2 text-left text-sm text-card-foreground ${header}`,
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
      className={cnState(alertVariants({ toned: tone !== "neutral" }), alertGlyph, className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cnState(
        headerTitle,
        "font-medium [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
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
        headerDescription,
        "mt-0.5 text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

/**
 * A timestamp or other short meta at the end of the title's line, before
 * any AlertAction.
 *
 * @example
 * <AlertMeta><time dateTime="2026-11-22T21:10Z">2 min ago</time></AlertMeta>
 */
function AlertMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-meta"
      className={cnState(
        headerMeta,
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
      className={cnState(headerAction, "-my-0.5", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertAction, AlertMeta, alertVariants }
export type { AlertProps, AlertVariant }
