"use client";

import { Button } from "@outfitter/parks/components/button";
import { Card } from "@outfitter/parks/components/card";
import {
  SectionHeader,
  SectionHeaderAction,
  SectionHeaderTitle,
} from "@outfitter/parks/components/section-header";
import { cn } from "@outfitter/parks/lib/utils";
import type { FileContents } from "@pierre/diffs";
import { File } from "@pierre/diffs/react";
import { CheckIcon } from "@solar-icons/react/outline/check";
import { CopyIcon } from "@solar-icons/react/outline/copy";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

/** Shared pieces for the surface compositions. */

/**
 * A copy button for a code frame. It shows a check for a moment after a
 * successful copy and announces the result.
 */
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <Button
      variant="ghost"
      size="icon-xs"
      aria-label={copied ? "Copied" : "Copy"}
      onClick={copy}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}

/**
 * A bordered frame for code or a diff, with an optional label and copy
 * button in a header row.
 */
export function CodeFrame({
  label,
  copyText,
  className,
  children,
}: {
  label?: string;
  copyText?: string;
  className?: string;
  children: ReactNode;
}) {
  const header = label !== undefined || copyText !== undefined;
  return (
    <figure
      className={cn(
        "workbench-code-frame min-w-0 overflow-hidden border",
        className
      )}
    >
      {header ? (
        <figcaption className="text-muted-foreground flex min-h-8 items-center gap-2 border-b ps-3 pe-1 text-xs">
          <span className="min-w-0 flex-1 truncate font-mono">{label}</span>
          {copyText === undefined ? null : <CopyButton text={copyText} />}
        </figcaption>
      ) : null}
      {children}
    </figure>
  );
}

const fileOptions = {
  disableFileHeader: true,
  disableLineNumbers: true,
} as const;
const numberedFileOptions = {
  ...fileOptions,
  disableLineNumbers: false,
} as const;

/** A highlighted snippet in a code frame. */
export function CodeBlock({
  code,
  label,
  language = "text",
  numbers = false,
  className,
}: {
  code: string;
  label?: string;
  language?: FileContents["lang"];
  numbers?: boolean;
  className?: string;
}) {
  const file = useMemo(
    () => ({ name: label ?? "snippet", contents: code, lang: language }),
    [code, label, language]
  );
  return (
    <CodeFrame label={label} copyText={code} className={className}>
      <File
        file={file}
        options={numbers ? numberedFileOptions : fileOptions}
        className="workbench-code"
      />
    </CodeFrame>
  );
}

/** A stat tile: a label over a value, with an optional note. Place inside a `<dl>`. */
export function Stat({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note?: ReactNode;
}) {
  return (
    <Card variant="filled" size="sm" className="*:px-inset gap-0.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
      {note ? <dd className="text-muted-foreground text-xs">{note}</dd> : null}
    </Card>
  );
}

/** A section heading inside a page. */
export function Heading({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <SectionHeader className="mb-2">
      <SectionHeaderTitle>{children}</SectionHeaderTitle>
      {action ? <SectionHeaderAction>{action}</SectionHeaderAction> : null}
    </SectionHeader>
  );
}
