import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { isTone, type Tone } from "#lib/tone"
import { cnState } from "#lib/utils"

/*
 * Shape and spacing come from two values, so every size and the theme's
 * control height stay in proportion:
 *
 * - --button-r is the end radius: half the height for a pill, and for a
 *   rect the theme radius grown with the button (a 28px button gets
 *   --radius-md, taller ones add half the difference).
 * - Text sits 2px inside the end radius (never under --spacing(2)).
 * - A leading or trailing glyph sits as far in from the end as from the top
 *   and bottom: on a pill that is the centre of the end cap, on a rect it is
 *   an even inset. The 1px is the transparent border.
 *
 * Colour and emphasis are separate: `tone` picks the colour role (see
 * #lib/tone) and `variant` the emphasis. `solid` fills with the tone (the
 * neutral solid is the primary button), `tint` is a soft tonal fill, and
 * outline, secondary, ghost and link keep their neutral chrome but take the
 * tone's text colour. shadcn's `default` and `destructive` stay as aliases
 * for solid and for a destructive tint.
 *
 * Pill is the default. Rect fits a button embedded in a row or field; see
 * `rounded-inset-action` for one that sits concentric inside its row.
 */
const textPadding =
  "px-[max(--spacing(2),calc(var(--button-r)-2px))] has-data-[icon=inline-start]:ps-(--icon-inset) has-data-[icon=inline-end]:pe-(--icon-inset)"

const buttonVariants = cva(
  "group/button text-trim inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-invalid-border aria-invalid:ring-3 aria-invalid:ring-invalid-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-(--glyph) h-(--button-h) [--glyph:var(--icon-size,--spacing(4))] [--icon-inset:calc((var(--button-h)-var(--glyph))/2-1px)]",
  {
    variants: {
      variant: {
        solid: "bg-tone text-tone-contrast hover:bg-tone-solid-hover",
        tint: "bg-tone-fill text-tone-strong hover:bg-tone-fill-hover",
        outline:
          "border-control-outline-border bg-control-outline text-secondary-foreground hover:bg-control-outline-hover hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover hover:text-foreground aria-expanded:bg-secondary aria-expanded:text-foreground",
        ghost:
          "text-secondary-foreground hover:bg-ghost-hover hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      shape: {
        pill: "rounded-full [--button-r:calc(var(--button-h)/2)]",
        rect: "rounded-[calc(var(--button-r)*var(--corner-scale))] [--button-r:max(var(--radius-floor),calc(var(--radius-md)+(var(--button-h)-(--spacing(7)))/2))]",
      },
      size: {
        default: `[--button-h:var(--control-h)] gap-1.5 ${textPadding}`,
        xs: `[--button-h:--spacing(6)] [--icon-size:--spacing(3)] gap-1 text-xs ${textPadding}`,
        sm: `[--button-h:--spacing(7)] [--icon-size:--spacing(3.5)] gap-1 text-(length:--text-control-small) ${textPadding}`,
        lg: `[--button-h:--spacing(9)] gap-1.5 ${textPadding}`,
        icon: "[--button-h:var(--control-h)] w-(--button-h)",
        "icon-xs": "[--button-h:--spacing(6)] [--icon-size:--spacing(3)] w-(--button-h)",
        "icon-sm": "[--button-h:--spacing(7)] [--icon-size:--spacing(3.5)] w-(--button-h)",
        "icon-lg": "[--button-h:--spacing(9)] w-(--button-h)",
      },
    },
    compoundVariants: [
      // Small buttons in a group share the group's corners.
      { size: ["xs", "sm", "icon-xs", "icon-sm"], class: "in-data-[slot=button-group]:rounded-lg" },
      // Neutral chrome, tonal text: a red ghost or outline button.
      {
        variant: ["outline", "secondary", "ghost", "link"],
        class:
          "not-data-[tone=neutral]:text-tone-strong not-data-[tone=neutral]:hover:text-tone-strong not-data-[tone=neutral]:aria-expanded:text-tone-strong",
      },
    ],
    defaultVariants: {
      variant: "solid",
      shape: "pill",
      size: "default",
    },
  }
)

type Emphasis = NonNullable<VariantProps<typeof buttonVariants>["variant"]>

/** shadcn's variant names, kept as aliases for a tone plus emphasis. */
const variantAliases = {
  default: { tone: "neutral", variant: "solid" },
  destructive: { tone: "destructive", variant: "tint" },
} as const satisfies Record<string, { tone: Tone; variant: Emphasis }>

type ButtonVariant = Emphasis | keyof typeof variantAliases

function resolveButton(variant: ButtonVariant | null | undefined, tone: Tone | undefined) {
  const value = variant ?? "solid"
  if (value in variantAliases) {
    const alias = variantAliases[value as keyof typeof variantAliases]
    return { tone: tone ?? alias.tone, variant: alias.variant as Emphasis }
  }
  return { tone: tone ?? "neutral", variant: value as Emphasis }
}

type ButtonProps = ButtonPrimitive.Props &
  Omit<VariantProps<typeof buttonVariants>, "variant"> & {
    /** The colour role. Defaults to neutral, or to the tone an alias names. */
    tone?: Tone
    /** Emphasis: solid (default), tint, outline, secondary, ghost, link. */
    variant?: ButtonVariant | null
  }

function Button({
  className,
  variant: variantProp,
  tone: toneProp,
  size = "default",
  shape = "pill",
  ...props
}: ButtonProps) {
  const { tone, variant } = resolveButton(variantProp, isTone(toneProp) ? toneProp : undefined)
  return (
    <ButtonPrimitive
      data-slot="button"
      data-tone={tone}
      data-variant={variant}
      className={cnState(
        buttonVariants({ variant, size, shape }),
        "data-[tone=destructive]:focus-visible:border-destructive-border data-[tone=destructive]:focus-visible:ring-invalid-ring",
        className
      )}
      {...props}
    />
  )
}

export { Button, buttonVariants }
export type { ButtonProps, ButtonVariant }
