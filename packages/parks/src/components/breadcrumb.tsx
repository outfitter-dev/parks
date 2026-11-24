"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { AltArrowRightIcon } from "@solar-icons/react/outline/alt-arrow-right";
import { useLayoutEffect, useRef, useState } from "react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "#components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#components/dropdown-menu";
import { fitBreadcrumb, hiddenByLimit } from "#lib/breadcrumb-fit";
import { cnState } from "#lib/utils";

/*
 * The parts follow shadcn's breadcrumb, so a shadcn breadcrumb drops in as
 * is. BreadcrumbPath builds a path from data on top of them and adds what
 * shadcn leaves to the caller: folding ancestors into a menu by count and
 * by width, an icon-only root when even that isn't enough, truncated
 * labels with the full text on hover, and a chevron that turns for RTL.
 */

function Breadcrumb({ className, ...props }: ComponentProps<"nav">) {
  return (
    <nav
      aria-label="Breadcrumb"
      data-slot="breadcrumb"
      className={cnState("min-w-0", className)}
      {...props}
    />
  );
}

function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cnState(
        "flex min-w-0 items-center gap-1.5 text-sm whitespace-nowrap text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cnState("inline-flex min-w-0 items-center gap-1.5", className)}
      {...props}
    />
  );
}

const crumb = "inline-flex min-w-0 items-center gap-1.5 rounded-sm";

function BreadcrumbLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cnState(
          crumb,
          "transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          className
        ),
      },
      props
    ),
    render,
    state: { slot: "breadcrumb-link" },
  });
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cnState(crumb, "font-medium text-foreground", className)}
      {...props}
    />
  );
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cnState(
        "grid shrink-0 place-items-center [&>svg]:size-3.5",
        className
      )}
      {...props}
    >
      {children ?? <AltArrowRightIcon className="rtl:rotate-180" />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cnState(
        "grid size-6 place-items-center leading-none",
        className
      )}
      {...props}
    >
      …<span className="sr-only">More</span>
    </span>
  );
}

/** One place in a BreadcrumbPath. */
type BreadcrumbEntry = {
  label: string;
  icon?: ReactNode;
  href?: string;
  onSelect?: () => void;
};

type BreadcrumbPathProps = Omit<ComponentProps<"nav">, "children"> & {
  /** The last entry is the current location. */
  items: readonly BreadcrumbEntry[];
  separator?: "chevron" | "slash" | ReactNode;
  /** Maximum visible positions, counting the overflow menu as one. */
  maxItems?: number;
};

function EntryLabel({
  entry,
  unclamped = false,
  iconOnly = false,
}: {
  entry: BreadcrumbEntry;
  unclamped?: boolean;
  iconOnly?: boolean;
}) {
  return (
    <>
      {entry.icon == null ? null : (
        <span
          aria-hidden
          className="grid size-3.5 shrink-0 place-items-center [&>svg]:size-full"
        >
          {entry.icon}
        </span>
      )}
      <span
        dir="auto"
        title={entry.label}
        className={
          iconOnly
            ? "sr-only"
            : cnState("truncate", unclamped ? undefined : "max-w-48")
        }
      >
        {entry.label}
      </span>
    </>
  );
}

function Entry({
  entry,
  current,
  iconOnly,
}: {
  entry: BreadcrumbEntry;
  current: boolean;
  iconOnly?: boolean;
}) {
  const label = <EntryLabel entry={entry} iconOnly={iconOnly} />;
  if (current) {
    return <BreadcrumbPage>{label}</BreadcrumbPage>;
  }
  if (entry.href) {
    return (
      <BreadcrumbLink href={entry.href} onClick={entry.onSelect}>
        {label}
      </BreadcrumbLink>
    );
  }
  if (entry.onSelect) {
    return (
      <BreadcrumbLink
        render={<button type="button" />}
        onClick={entry.onSelect}
      >
        {label}
      </BreadcrumbLink>
    );
  }
  return <span className={crumb}>{label}</span>;
}

/** Changes only when what the path shows changes, so callers can pass a fresh array each render. */
function signature(items: readonly BreadcrumbEntry[]) {
  return items
    .map((item) => `${item.icon == null ? "" : "◆"}${item.label}`)
    .join("\u0000");
}

/**
 * A breadcrumb from a list of entries. The root and the current entry always
 * show; ancestors fold into a menu after the root when the path passes
 * `maxItems` or its container's width. If it still doesn't fit, a root with
 * an icon shows the icon alone.
 */
function BreadcrumbPath({
  items,
  separator = "chevron",
  maxItems = 4,
  className,
  ...props
}: BreadcrumbPathProps) {
  const measure = useRef<HTMLOListElement>(null);
  const list = useRef<HTMLOListElement>(null);
  const [fit, setFit] = useState({ hidden: 0, compactRoot: false });
  const hidden = Math.min(
    Math.max(0, items.length - 2),
    Math.max(hiddenByLimit(items.length, maxItems), fit.hidden)
  );
  const key = signature(items);
  const rootHasIcon = items[0]?.icon != null;

  useLayoutEffect(() => {
    const row = list.current;
    const sample = measure.current;
    if (!row || !sample || items.length < 3) {
      return;
    }

    const update = () => {
      const available = row.getBoundingClientRect().width;
      if (available === 0) {
        return;
      }
      const start = sample.getBoundingClientRect().left;
      const ends = Array.from(
        sample.querySelectorAll<HTMLElement>("[data-measure]"),
        (el) => el.getBoundingClientRect().right
      );
      const overflowEnd = ends.pop() ?? 0;
      const widths = ends.map(
        (end, index) => end - (index === 0 ? start : (ends[index - 1] ?? start))
      );
      const next = fitBreadcrumb(
        widths,
        overflowEnd - (ends.at(-1) ?? start),
        available,
        rootHasIcon
      );
      setFit((last) =>
        last.hidden === next.hidden && last.compactRoot === next.compactRoot
          ? last
          : next
      );
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(row);
    observer.observe(sample);
    return () => observer.disconnect();
    // `key` stands in for `items`: it changes only when the path does.
  }, [key, separator, rootHasIcon]);

  if (!items.length) {
    return null;
  }

  // Undefined keeps BreadcrumbSeparator's chevron.
  const mark =
    separator === "chevron"
      ? undefined
      : separator === "slash"
        ? "/"
        : separator;
  const folded = items.slice(1, hidden + 1);
  const last = items.length - 1;

  return (
    <Breadcrumb className={cnState("relative", className)} {...props}>
      <BreadcrumbList ref={list}>
        {items.map((entry, index) => {
          if (index > 0 && index <= hidden) {
            if (index > 1) {
              return null;
            }
            return [
              <BreadcrumbSeparator key="overflow-separator">
                {mark}
              </BreadcrumbSeparator>,
              <BreadcrumbItem key="overflow" className="shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon-xs" />}
                    aria-label={`Show ${hidden} hidden breadcrumb${hidden === 1 ? "" : "s"}`}
                  >
                    <BreadcrumbEllipsis className="size-auto" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-max max-w-64"
                    aria-label="Hidden breadcrumbs"
                  >
                    {folded.map((ancestor, offset) => (
                      <DropdownMenuItem
                        key={offset}
                        disabled={!ancestor.href && !ancestor.onSelect}
                        render={
                          ancestor.href ? <a href={ancestor.href} /> : undefined
                        }
                        onClick={ancestor.onSelect}
                      >
                        <EntryLabel entry={ancestor} unclamped />
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>,
            ];
          }
          const iconOnly = index === 0 && items.length > 2 && fit.compactRoot;
          return [
            index > 0 ? (
              <BreadcrumbSeparator key={`separator-${index}`}>
                {mark}
              </BreadcrumbSeparator>
            ) : null,
            <BreadcrumbItem
              key={index}
              className={
                iconOnly ? "shrink-0" : index === last ? "shrink" : "shrink-[3]"
              }
            >
              <Entry
                entry={entry}
                current={index === last}
                iconOnly={iconOnly}
              />
            </BreadcrumbItem>,
          ];
        })}
      </BreadcrumbList>
      {items.length > 2 && (
        // The whole path at its natural width, hidden, so the fit can be measured while the visible path is folded.
        <div
          aria-hidden
          inert
          className="pointer-events-none invisible absolute inset-0 overflow-hidden"
        >
          <BreadcrumbList ref={measure} className="w-max">
            {items.map((entry, index) => [
              index > 0 ? (
                <BreadcrumbSeparator key={`separator-${index}`}>
                  {mark}
                </BreadcrumbSeparator>
              ) : null,
              <BreadcrumbItem key={index} data-measure="">
                <Entry entry={entry} current={index === last} />
              </BreadcrumbItem>,
            ])}
            <BreadcrumbSeparator>{mark}</BreadcrumbSeparator>
            <BreadcrumbItem data-measure="">
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
          </BreadcrumbList>
        </div>
      )}
    </Breadcrumb>
  );
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbPath,
  BreadcrumbSeparator,
};
export type { BreadcrumbEntry, BreadcrumbPathProps };
