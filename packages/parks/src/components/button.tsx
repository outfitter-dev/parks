import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cnState } from "#lib/utils"

const buttonVariants = cva(
  "group/button text-trim inline-flex shrink-0 items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-invalid-border aria-invalid:ring-3 aria-invalid:ring-invalid-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-(--glyph) h-(--button-h) [--glyph:var(--icon-size,calc(var(--spacing)*4))] has-data-[icon=inline-start]:ps-(--icon-inset) has-data-[icon=inline-end]:pe-(--icon-inset) [--icon-inset:calc((var(--button-h)-var(--glyph))/2-1px)]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-control-outline-border bg-control-outline hover:bg-control-outline-hover hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-ghost-hover hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground",
        destructive:
          "bg-destructive-fill text-destructive hover:bg-destructive-fill-hover focus-visible:border-destructive/40 focus-visible:ring-invalid-ring",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // A leading or trailing glyph sits on the centre of the pill's end
        // radius: --icon-inset is half the height left over around the glyph,
        // less the 1px transparent border.
        default: "[--button-h:var(--control-h)] gap-1.5 px-3.5",
        xs: "[--button-h:calc(var(--spacing)*6)] [--icon-size:calc(var(--spacing)*3)] gap-1 px-2.5 text-xs in-data-[slot=button-group]:rounded-lg",
        sm: "[--button-h:calc(var(--spacing)*7)] [--icon-size:calc(var(--spacing)*3.5)] gap-1 px-3 text-(length:--text-control-small) in-data-[slot=button-group]:rounded-lg",
        lg: "[--button-h:calc(var(--spacing)*9)] gap-1.5 px-4",
        icon: "[--button-h:var(--control-h)] w-(--button-h)",
        "icon-xs":
          "[--button-h:calc(var(--spacing)*6)] [--icon-size:calc(var(--spacing)*3)] w-(--button-h) in-data-[slot=button-group]:rounded-lg",
        "icon-sm":
          "[--button-h:calc(var(--spacing)*7)] w-(--button-h) in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "[--button-h:calc(var(--spacing)*9)] w-(--button-h)",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cnState(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
