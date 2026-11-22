import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cnState } from "#lib/utils"

const badgeVariants = cva(
  "group/badge text-trim inline-flex [--lead-size:--spacing(5)] h-(--lead-size) has-[>.lead]:gap-0 has-[>.lead]:ps-0 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-invalid-border aria-invalid:ring-invalid-ring [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-foreground/6 text-secondary-foreground ring-1 ring-foreground/6 [a]:hover:bg-foreground/10",
        success:
          "bg-success-fill text-success-foreground ring-1 ring-success/30 [a]:hover:bg-success/20",
        destructive:
          "bg-destructive-fill text-destructive ring-1 ring-destructive/25 focus-visible:ring-invalid-ring [a]:hover:bg-destructive/20",
        outline:
          "bg-chip text-foreground shadow-xs ring-1 ring-chip-ring [a]:hover:bg-foreground/6",
        ghost:
          "hover:bg-ghost-hover hover:text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cnState(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
