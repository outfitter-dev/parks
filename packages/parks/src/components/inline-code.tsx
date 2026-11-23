import type { ComponentProps } from "react"
import { cnState } from "#lib/utils"

function InlineCode({ className, ...props }: ComponentProps<"code">) {
  return (
    <code
      data-slot="inline-code"
      className={cnState("box-decoration-clone rounded-xs bg-muted px-1 py-0.5 font-mono text-xs text-foreground", className)}
      {...props}
    />
  )
}

export { InlineCode }
