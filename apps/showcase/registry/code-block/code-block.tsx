"use client";

/*
 * CodeFrame and CodeBlock, from the Parks registry. CodeFrame is a bordered
 * frame for code or a diff, with an optional label and copy button in a
 * header row. CodeBlock highlights a snippet with Pierre's renderer
 * (`@pierre/diffs`) inside a frame. `codeTheme` maps Pierre's colours to the
 * Parks roles, so code follows the theme in light and dark; pass it to a
 * Pierre diff too.
 */

import { Button } from "@outfitter/parks/components/button";
import { cn } from "@outfitter/parks/lib/utils";
import type { FileContents } from "@pierre/diffs";
import { File } from "@pierre/diffs/react";
import { CheckIcon } from "@solar-icons/react/outline/check";
import { CopyIcon } from "@solar-icons/react/outline/copy";
import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

/** Pierre's custom properties, pointed at Parks roles. */
export const codeTheme: CSSProperties & Record<`--${string}`, string> = {
  "--diffs-font-family": "var(--font-code)",
  "--diffs-font-size": "var(--text-xs)",
  "--diffs-line-height": "calc(var(--spacing) * 5)",
  "--diffs-light-bg": "var(--background)",
  "--diffs-dark-bg": "var(--background)",
  "--diffs-bg-context-override": "var(--background)",
  "--diffs-bg-context-gutter-override": "var(--background)",
  "--diffs-gap-inline": "calc(var(--spacing) * 3)",
  "--diffs-fg-number-override": "var(--muted-foreground)",
  "--diffs-addition-color-override": "var(--success-strong)",
  "--diffs-deletion-color-override": "var(--destructive-strong)",
  "--diffs-bg-addition-override": "var(--success-fill)",
  "--diffs-bg-deletion-override": "var(--destructive-fill)",
  colorScheme: "inherit",
};

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
        "bg-background min-w-0 overflow-hidden rounded-lg border",
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
      {/* On the element itself: Pierre's shadow host declares its own colour scheme. */}
      <File
        file={file}
        options={numbers ? numberedFileOptions : fileOptions}
        style={codeTheme}
      />
    </CodeFrame>
  );
}
