import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
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
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        outline:
          "border-control-outline-border bg-control-outline text-secondary-foreground hover:bg-control-outline-hover hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover hover:text-foreground aria-expanded:bg-secondary aria-expanded:text-foreground",
        ghost:
          "text-secondary-foreground hover:bg-ghost-hover hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive-fill text-destructive hover:bg-destructive-fill-hover focus-visible:border-destructive-border focus-visible:ring-invalid-ring",
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
    ],
    defaultVariants: {
      variant: "default",
      shape: "pill",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "pill",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cnState(buttonVariants({ variant, size, shape }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
