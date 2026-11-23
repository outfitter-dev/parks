"use client";

import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import type { FileContents } from "@pierre/diffs";
import { File } from "@pierre/diffs/react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { AltArrowRightIcon } from "@solar-icons/react/outline/alt-arrow-right";
import { CheckIcon } from "@solar-icons/react/outline/check";
import { CopyIcon } from "@solar-icons/react/outline/copy";



/**
 * Shared pieces for the surface compositions. These are recreations of
 * ReUI's licensed message and trace patterns, built on our tokens.
 */

type Icon = ComponentType<{ className?: string }>;

/** The shared header and frame for code snippets and diffs. */
export function CodeFrame({ label, copyText, className, children }: {
  label?: string;
  copyText?: string;
  className?: string;
  children: ReactNode;
}) {
  const [copyStatus, setCopyStatus] = useState("");
  const copy = async () => {
    if (copyText === undefined) return;
    try {
      await navigator.clipboard.writeText(copyText);
      setCopyStatus("Code copied");
    } catch {
      setCopyStatus("Could not copy code");
    }
  };

  return (
    <figure className={cn("workbench-code-frame min-w-0 overflow-hidden border", className)}>
      {label || copyText !== undefined ? (
        <figcaption className="flex min-h-8 items-center gap-2 border-b bg-fill-subtle py-1 ps-3 pe-1 font-mono text-xs text-muted-foreground">
          {label}
          {copyText !== undefined ? (
            <>
              <Button variant="ghost" shape="rect" size="icon-sm" aria-label="Copy code" className="ms-auto" onClick={copy}>
                {copyStatus === "Code copied" ? <CheckIcon /> : <CopyIcon />}
              </Button>
              <span role="status" className="sr-only">{copyStatus}</span>
            </>
          ) : null}
        </figcaption>
      ) : null}
      {children}
    </figure>
  );
}

const fileOptions = { disableFileHeader: true, disableLineNumbers: true } as const;
const numberedFileOptions = { ...fileOptions, disableLineNumbers: false } as const;

export function CodeBlock({ code, label, language = "text", numbers = false, className }: {
  code: string;
  label?: string;
  language?: FileContents["lang"];
  numbers?: boolean;
  className?: string;
}) {
  const file = useMemo(() => ({ name: label ?? "snippet", contents: code, lang: language }), [code, label, language]);
  return (
    <CodeFrame label={label} copyText={code} className={className}>
      <File file={file} options={numbers ? numberedFileOptions : fileOptions} className="workbench-code" />
    </CodeFrame>
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
      <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="w-full rounded-md text-left hover:bg-ghost-hover">
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
        <div className="max-w-[80%] rounded-2xl rounded-br-md bg-fill-subtle px-3.5 py-2 ring-1 ring-border-muted">
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

/** A stat tile: a label over a value, with an optional note. Place inside a `<dl>`. */
export function Stat({ label, value, note }: { label: string; value: string; note?: ReactNode }) {
  return (
    <Card variant="filled" size="sm" className="gap-0.5 *:px-inset">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
      {note ? <dd className="text-xs text-muted-foreground">{note}</dd> : null}
    </Card>
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
