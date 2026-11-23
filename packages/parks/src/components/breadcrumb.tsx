"use client"

import { useLayoutEffect, useRef, useState, type ComponentProps, type ReactNode } from "react"
import { AltArrowRightIcon } from "@solar-icons/react/outline/alt-arrow-right"
import { Button } from "#components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#components/dropdown-menu"
import { cnState } from "#lib/utils"

type BreadcrumbItem = {
  label: string
  icon?: ReactNode
  href?: string
  onSelect?: () => void
}

type BreadcrumbProps = Omit<ComponentProps<"nav">, "children"> & {
  /** The last item is the current location. */
  items: readonly BreadcrumbItem[]
  separator?: "chevron" | "slash" | ReactNode
  /** Maximum visible positions, including the overflow trigger. */
  maxItems?: number
}

const segment = "flex min-w-0 items-center gap-[var(--breadcrumb-gap,--spacing(1.5))] not-first:ps-[var(--breadcrumb-gap,--spacing(1.5))]"
const crumb = "inline-flex min-w-0 items-center gap-[var(--breadcrumb-icon-gap,--spacing(1.5))] rounded-sm"
const interactive = "hover:text-[color:var(--breadcrumb-current,var(--foreground))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
const current = "font-medium text-[color:var(--breadcrumb-current,var(--foreground))]"
const overflowSize = "size-6"

function CrumbLabel({ item, unclamped = false, iconOnly = false }: { item: BreadcrumbItem; unclamped?: boolean; iconOnly?: boolean }) {
  return (
    <>
      {item.icon == null ? null : (
        <span aria-hidden className="grid size-[var(--breadcrumb-icon-size,--spacing(3.5))] shrink-0 place-items-center [&>svg]:size-full">
          {item.icon}
        </span>
      )}
      <span
        dir="auto"
        title={item.label}
        className={iconOnly ? "sr-only" : cnState("truncate", unclamped ? undefined : "max-w-[var(--breadcrumb-label-width,--spacing(48))]")}
      >
        {item.label}
      </span>
    </>
  )
}

/**
 * Local styling hooks fall back to the design system:
 * --breadcrumb-gap, --breadcrumb-icon-gap, --breadcrumb-label-width, --breadcrumb-icon-size,
 * --breadcrumb-muted, --breadcrumb-current, --breadcrumb-separator.
 */
function Breadcrumb({ items, separator = "chevron", maxItems = 4, className, "aria-label": label = "Breadcrumb", ...props }: BreadcrumbProps) {
  const list = useRef<HTMLOListElement>(null)
  const measurement = useRef<HTMLDivElement>(null)
  const limit = Math.max(3, Math.floor(maxItems) || 3)
  const hiddenByLimit = items.length > limit ? items.length - limit + 1 : 0
  const [hiddenByWidth, setHiddenByWidth] = useState(0)
  const [compactRoot, setCompactRoot] = useState(false)
  const hidden = Math.min(Math.max(0, items.length - 2), Math.max(hiddenByLimit, hiddenByWidth))

  useLayoutEffect(() => {
    const row = list.current
    const sample = measurement.current
    if (!row || !sample || items.length < 3) return

    const fit = () => {
      const available = row.getBoundingClientRect().width
      if (available === 0) return
      const widths = Array.from(sample.children, (el) => el.getBoundingClientRect().width)
      const overflowWidth = widths.pop() ?? 0
      let required = widths.reduce((sum, width) => sum + width, 0)
      let collapsed = 0
      while (required > available && collapsed < items.length - 2) {
        if (collapsed === 0) required += overflowWidth
        collapsed += 1
        required -= widths[collapsed] ?? 0
      }
      setHiddenByWidth(collapsed)
      setCompactRoot(items[0]?.icon != null && required > available)
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(row)
    observer.observe(sample)
    return () => observer.disconnect()
  }, [items, separator])

  if (!items.length) return null

  const divider = (
    <span aria-hidden className="grid shrink-0 place-items-center text-[color:var(--breadcrumb-separator,var(--muted-foreground))] [&>svg]:size-[var(--breadcrumb-icon-size,--spacing(3.5))]">
      {separator === "chevron" ? <AltArrowRightIcon className="rtl:rotate-180" /> : separator === "slash" ? "/" : separator}
    </span>
  )
  const overflowItems = items.slice(1, hidden + 1)

  return (
    <nav
      {...props}
      data-slot="breadcrumb"
      aria-label={label}
      className={cnState("relative min-w-0 text-sm text-[color:var(--breadcrumb-muted,var(--muted-foreground))]", className)}
    >
      <ol ref={list} role="list" className="flex min-w-0 items-center whitespace-nowrap">
        {items.map((item, index) => {
          if (index > 0 && index <= hidden) {
            return index === 1 ? (
              <li key="overflow" className={cnState(segment, "shrink-0")}>
                {divider}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon-xs" />}
                    aria-label={`Show ${hidden} hidden breadcrumb${hidden === 1 ? "" : "s"}`}
                  >
                    <span aria-hidden="true" className="leading-none">…</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-max max-w-64" aria-label="Hidden breadcrumbs">
                    {overflowItems.map((ancestor, offset) => (
                      <DropdownMenuItem
                        key={offset}
                        disabled={!ancestor.href && !ancestor.onSelect}
                        render={ancestor.href ? <a href={ancestor.href} /> : undefined}
                        onClick={ancestor.onSelect}
                      >
                        <CrumbLabel item={ancestor} unclamped />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            ) : null
          }

          const isCurrent = index === items.length - 1
          const iconOnly = index === 0 && items.length > 2 && compactRoot
          const content = <CrumbLabel item={item} iconOnly={iconOnly} />
          return (
            <li key={index} className={cnState(segment, iconOnly ? "shrink-0" : isCurrent ? "shrink" : "shrink-[3]")}>
              {index > 0 && divider}
              {isCurrent ? (
                <span aria-current="page" className={cnState(crumb, current)}>{content}</span>
              ) : item.href ? (
                <a href={item.href} onClick={item.onSelect} className={cnState(crumb, interactive)}>{content}</a>
              ) : item.onSelect ? (
                <button type="button" onClick={item.onSelect} className={cnState(crumb, interactive)}>{content}</button>
              ) : (
                <span className={crumb}>{content}</span>
              )}
            </li>
          )
        })}
      </ol>
      {items.length > 2 && (
        <div aria-hidden inert className="pointer-events-none invisible absolute inset-0 overflow-hidden">
          <div ref={measurement} className="flex w-max items-center whitespace-nowrap">
            {items.map((item, index) => (
              <div key={index} className={segment}>
                {index > 0 && divider}
                <span className={cnState(crumb, index === items.length - 1 ? current : undefined)}><CrumbLabel item={item} /></span>
              </div>
            ))}
            <div className={segment}>{divider}<span className={overflowSize} /></div>
          </div>
        </div>
      )}
    </nav>
  )
}

export { Breadcrumb }
export type { BreadcrumbItem, BreadcrumbProps }
