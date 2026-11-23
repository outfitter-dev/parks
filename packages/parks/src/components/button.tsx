import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cnState } from "#lib/utils"

const buttonVariants = cva(
  "group/button text-trim inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-invalid-border aria-invalid:ring-3 aria-invalid:ring-invalid-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-(--glyph) h-(--button-h) [--glyph:var(--icon-size,--spacing(4))]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-control-outline-border bg-control-outline text-button-foreground hover:bg-control-outline-hover aria-expanded:bg-muted",
        secondary:
          "bg-secondary text-button-foreground hover:bg-secondary-hover aria-expanded:bg-secondary",
        ghost:
          "text-button-foreground hover:bg-ghost-hover aria-expanded:bg-muted",
        destructive:
          "bg-destructive-fill text-destructive hover:bg-destructive-fill-hover focus-visible:border-destructive/40 focus-visible:ring-invalid-ring",
        link: "text-primary underline-offset-4 hover:underline",
      },
      shape: {
        pill: "rounded-full",
        // Match the small toggle at 28px, then add half the height difference.
        rect: "rounded-[max(var(--radius-floor),calc(var(--radius-md)_+_(var(--button-h)_-_--spacing(7))/2))]",
      },
      size: {
        default: "[--button-h:var(--control-h)] gap-1.5 px-2.5 has-data-[icon=inline-start]:ps-2 has-data-[icon=inline-end]:pe-2",
        xs: "[--button-h:--spacing(6)] gap-1 px-2 text-xs [--icon-size:--spacing(3)] has-data-[icon=inline-start]:ps-1.5 has-data-[icon=inline-end]:pe-1.5",
        sm: "[--button-h:--spacing(7)] gap-1 px-2.5 text-(length:--text-control-small) [--icon-size:--spacing(3.5)] has-data-[icon=inline-start]:ps-1.5 has-data-[icon=inline-end]:pe-1.5",
        lg: "[--button-h:--spacing(9)] gap-1.5 px-2.5 has-data-[icon=inline-start]:ps-2 has-data-[icon=inline-end]:pe-2",
        icon: "[--button-h:var(--control-h)] w-(--button-h)",
        "icon-xs": "[--button-h:--spacing(6)] w-(--button-h) [--icon-size:--spacing(3)]",
        "icon-sm": "[--button-h:--spacing(7)] w-(--button-h) [--icon-size:--spacing(3.5)]",
        "icon-lg": "[--button-h:--spacing(9)] w-(--button-h)",
      },
    },
    compoundVariants: [
      { shape: "rect", size: ["xs", "sm", "icon-xs", "icon-sm"], class: "in-data-[slot=button-group]:rounded-lg" },
    ],
    defaultVariants: {
      variant: "default",
      shape: "rect",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  shape = "rect",
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
