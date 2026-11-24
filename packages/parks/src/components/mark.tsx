"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";

import { isTone } from "#lib/tone";
import type { Tone } from "#lib/tone";
import { cnState } from "#lib/utils";

/*
 * A bounded glyph tile: an icon, letter or number on a tonal ground. Brand
 * marks, option tiles, step numbers and the icon above an empty state or an
 * auth card all use it.
 *
 * - `tone` is the colour (see #lib/tone); `variant` is `tint` (a soft fill
 *   with the tone's text) or `solid` (the tone itself with its contrast
 *   text).
 * - `selected` turns a tint solid, for a tile that lights up with its
 *   option. Swap a line icon for its bold form yourself when it does.
 * - Baseline: shadcn's `ItemMedia variant="icon"` and `EmptyMedia
 *   variant="icon"`; a Mark can be their child.
 */
const markVariants = cva(
  "inline-grid shrink-0 place-items-center font-semibold tabular-nums transition-colors select-none [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        tint: "bg-tone-fill text-tone-foreground",
        solid: "bg-tone text-tone-contrast",
      },
      size: {
        sm: "size-5 text-xs leading-none [&_svg:not([class*='size-'])]:size-3",
        md: "size-6 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "size-8 text-sm [&_svg:not([class*='size-'])]:size-4",
        xl: "size-12 text-base [&_svg:not([class*='size-'])]:size-6",
      },
      shape: {
        rect: "rounded-md data-[size=lg]:rounded-lg data-[size=xl]:rounded-xl",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "tint",
      size: "md",
      shape: "rect",
    },
  }
);

type MarkProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof markVariants> & {
    /** The colour role. Defaults to neutral. */
    tone?: Tone;
    /** Lights the mark up: a tint becomes solid. */
    selected?: boolean;
  };

/**
 * @example
 * <Mark tone="brand" variant="solid">O</Mark>
 * <Mark tone="success" selected={picked}>A</Mark>
 * <Mark tone="brand" size="xl" shape="circle"><ShieldIcon /></Mark>
 */
function Mark({
  className,
  tone,
  variant,
  size,
  shape,
  selected,
  render,
  ...props
}: MarkProps) {
  const resolvedTone = isTone(tone) ? tone : "neutral";
  const resolvedVariant = selected ? "solid" : (variant ?? "tint");
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cnState(
          markVariants({ variant: resolvedVariant, size, shape }),
          className
        ),
        ...{
          "data-tone": resolvedTone,
          "data-variant": resolvedVariant,
          "data-size": size ?? "md",
          ...(selected ? { "data-selected": "" } : {}),
        },
      },
      props
    ),
    render,
    state: {
      slot: "mark",
      tone: resolvedTone,
      variant: resolvedVariant,
      selected: Boolean(selected),
    },
  });
}

export { Mark, markVariants };
export type { MarkProps };
