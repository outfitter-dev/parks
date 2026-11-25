import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";

import { isTone } from "#lib/tone";
import type { Tone } from "#lib/tone";
import { cnState } from "#lib/utils";

/*
 * A small round mark that signals state: the one status dot. It reads the
 * tone's mark role, so neutral is quieter than its text and every other tone
 * is the hue itself. Badge's dot, nav "new" dots and list rows all use it.
 *
 * shadcn has no status dot; this sits beside Badge and Mark in the tone model
 * (see #lib/tone).
 */
const statusDotVariants = cva(
  "bg-tone-mark relative inline-block shrink-0 rounded-full",
  {
    variants: {
      size: {
        xs: "size-1.5",
        sm: "size-2",
        md: "size-2.5",
      },
      variant: {
        default: "",
        overlay: "ring-canvas ring-2",
      },
      live: {
        true: "after:animate-live after:absolute after:inset-0 after:rounded-full after:bg-inherit motion-reduce:after:hidden",
        false: "",
      },
    },
    defaultVariants: {
      size: "sm",
      live: false,
    },
  }
);

type StatusDotProps = Omit<React.ComponentProps<"span">, "children"> &
  VariantProps<typeof statusDotVariants> & {
    /** The colour role. Defaults to neutral. */
    tone?: Tone;
    /** Names the state for assistive tech. Without it the dot is decorative. */
    label?: string;
  };

/**
 * @example
 * <StatusDot tone="success" live label="Live" />
 */
function StatusDot({
  className,
  tone,
  size,
  live,
  variant,
  label,
  ...props
}: StatusDotProps) {
  return (
    <span
      data-slot="status-dot"
      data-tone={isTone(tone) ? tone : "neutral"}
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true })}
      className={cnState(statusDotVariants({ size, live, variant }), className)}
      {...props}
    />
  );
}

export { StatusDot, statusDotVariants };
export type { StatusDotProps };
