"use client"

import type * as React from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircleIcon } from "@solar-icons/react/bold/check-circle"
import { InfoCircleIcon } from "@solar-icons/react/bold/info-circle"
import { DangerTriangleIcon } from "@solar-icons/react/bold/danger-triangle"
import { CloseCircleIcon } from "@solar-icons/react/bold/close-circle"
import { Spinner } from "#components/spinner"

/*
 * shadcn's Sonner, without next-themes: the theme follows the system unless
 * the app passes `theme`, the same rule globals.css uses for `.light`/`.dark`.
 * Like Alert, a toast colours only its glyph by tone; text stays neutral and
 * the description is muted.
 */
const Toaster = ({ theme = "system", ...props }: ToasterProps) => {
  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: <CheckCircleIcon className="size-4 text-success" />,
        info: <InfoCircleIcon className="size-4 text-info" />,
        warning: <DangerTriangleIcon className="size-4 text-warning" />,
        error: <CloseCircleIcon className="size-4 text-destructive" />,
        loading: <Spinner className="text-muted-foreground" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border-muted)",
          "--border-radius": "var(--radius-lg)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast font-sans shadow-md",
          description: "text-muted-foreground!",
          actionButton: "bg-primary! text-primary-foreground!",
          cancelButton: "bg-secondary! text-secondary-foreground!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
export { toast } from "sonner"
