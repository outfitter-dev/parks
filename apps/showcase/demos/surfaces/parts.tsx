"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import { Kbd } from "@workspace/ui/components/kbd";
import { cn } from "@workspace/ui/lib/utils";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { CopyIcon } from "@solar-icons/react/linear/copy";
import { MagnifierIcon } from "@solar-icons/react/linear/magnifier";

/**
 * Shared pieces for the surface compositions. These are recreations of
 * ReUI's licensed message, trace and code-block patterns, built on our tokens.
 */

type Icon = ComponentType<{ className?: string }>;

/** App chrome shared by the product surfaces: a quiet sidebar and a top bar. */
export function Shell({
  mark,
  name,
  nav,
  active,
  title,
  actions,
  footer,
  children,
}: {
  mark: string;
  name: string;
  nav: { label: string; icon: Icon; count?: number | string }[];
  active: string;
  title: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-160 bg-background text-foreground">
      <aside className="hidden w-56 shrink-0 flex-col border-r bg-muted/40 p-2 @3xl:flex">
        <div className="flex items-center gap-2 px-2 py-2 font-semibold">
          <span className="grid size-6 place-items-center rounded-md bg-foreground text-xs text-background">{mark}</span>
          {name}
        </div>
        <button
          type="button"
          className="mt-1 mb-2 flex h-(--control-h) items-center gap-2 rounded-lg border bg-background px-2 text-muted-foreground"
        >
          <MagnifierIcon className="size-4" />
          Search
          <Kbd className="ml-auto">⌘K</Kbd>
        </button>
        <nav aria-label={name}>
          {nav.map(({ label, icon: NavIcon, count }) => (
            <a
              key={label}
              href="#"
              aria-current={label === active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground",
                label === active && "bg-accent text-foreground",
              )}
            >
              <NavIcon className="size-4" />
              {label}
              {count !== undefined ? <span className="ml-auto text-xs tabular-nums">{count}</span> : null}
            </a>
          ))}
        </nav>
        {footer ? <div className="mt-auto">{footer}</div> : null}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 items-center gap-3 px-4">
          <div className="flex min-w-0 items-center gap-2 font-medium">{title}</div>
          <div className="ml-auto flex items-center gap-2">{actions}</div>
        </header>
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

/** Breadcrumb segments for a top bar. The last one is the page. */
export function Crumbs({ items }: { items: string[] }) {
  return (
    <span className="flex min-w-0 items-center gap-1.5">
      {items.map((item, index) => (
        <span key={item} className="flex min-w-0 items-center gap-1.5">
          {index > 0 ? <AltArrowRightIcon className="size-3.5 shrink-0 text-muted-foreground" /> : null}
          <span className={cn("truncate", index < items.length - 1 && "text-muted-foreground")}>{item}</span>
        </span>
      ))}
    </span>
  );
}

type LineMark = "add" | "remove" | undefined;

/** A code block with an optional file label, line numbers and diff marks. */
export function CodeBlock({
  code,
  label,
  added = [],
  removed = [],
  numbers = false,
  className,
}: {
  code: string;
  label?: string;
  added?: number[];
  removed?: number[];
  numbers?: boolean;
  className?: string;
}) {
  const lines = code.split("\n");
  const mark = (line: number): LineMark =>
    added.includes(line) ? "add" : removed.includes(line) ? "remove" : undefined;
  return (
    <figure className={cn("overflow-hidden rounded-lg border bg-muted/40", className)}>
      {label ? (
        <figcaption className="flex h-8 items-center gap-2 px-3 font-mono text-xs text-muted-foreground">
          {label}
          <button type="button" aria-label="Copy" className="ml-auto rounded p-1 hover:bg-accent hover:text-foreground">
            <CopyIcon className="size-3.5" />
          </button>
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto py-2 font-mono text-xs leading-5">
        {lines.map((text, index) => {
          const line = index + 1;
          const kind = mark(line);
          return (
            <div
              key={line}
              className={cn(
                "flex px-3",
                kind === "add" && "bg-success-fill",
                kind === "remove" && "bg-destructive-fill",
              )}
            >
              {numbers ? <span className="w-7 shrink-0 select-none text-muted-foreground/60 tabular-nums">{line}</span> : null}
              {added.length || removed.length ? (
                <span
                  aria-hidden
                  className={cn(
                    "w-4 shrink-0 select-none text-muted-foreground/60",
                    kind === "add" && "text-success-strong",
                    kind === "remove" && "text-destructive-strong",
                  )}
                >
                  {kind === "add" ? "+" : kind === "remove" ? "−" : " "}
                </span>
              ) : null}
              <code className="whitespace-pre">{text || " "}</code>
            </div>
          );
        })}
      </pre>
    </figure>
  );
}

/** One step an agent took: an icon, what happened, and a short result. */
export function TraceLine({
  icon: LineIcon,
  title,
  detail,
  children,
  defaultOpen = false,
  tone,
}: {
  icon: Icon;
  title: string;
  detail?: string;
  children?: ReactNode;
  defaultOpen?: boolean;
  tone?: "ok" | "fail";
}) {
  const [open, setOpen] = useState(defaultOpen);
  const row = (
    <span className="flex min-w-0 items-center gap-2 py-1">
      <LineIcon className="size-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{title}</span>
      {detail ? (
        <span
          className={cn(
            "shrink-0 text-muted-foreground",
            tone === "ok" && "text-success-foreground",
            tone === "fail" && "text-destructive-foreground",
          )}
        >
          {detail}
        </span>
      ) : null}
      {children ? (
        <AltArrowRightIcon className={cn("ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform", open && "rotate-90")} />
      ) : null}
    </span>
  );
  if (!children) return <li>{row}</li>;
  return (
    <li>
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="w-full rounded-md text-left hover:bg-accent/60">
        {row}
      </button>
      {open ? <div className="mt-1 mb-2 ml-6">{children}</div> : null}
    </li>
  );
}

/** A list of trace lines joined by a thin rail. */
export function Trace({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={cn("flex flex-col text-sm", className)}>{children}</ul>;
}

/** A chat turn. Your turns sit on the right in a filled bubble; agent turns read as plain text. */
export function Turn({ from, name, children }: { from: "you" | "agent"; name?: string; children: ReactNode }) {
  if (from === "you") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-foreground/6 px-3.5 py-2 ring-1 ring-foreground/6">
          <span className="sr-only">You said: </span>
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {name ? <span className="sr-only">{name} said: </span> : null}
      {children}
    </div>
  );
}

/** A stat with a label, used in summary rows. */
export function Stat({ label, value, note }: { label: string; value: string; note?: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg border bg-background px-3 py-2.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold tabular-nums">{value}</span>
      {note ? <span className="text-xs text-muted-foreground">{note}</span> : null}
    </div>
  );
}

/** A section heading inside a page. */
export function Heading({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <h2 className="font-medium">{children}</h2>
      {action ? <div className="ml-auto">{action}</div> : null}
    </div>
  );
}
