import * as React from "react";

import { cnState } from "#lib/utils";

/*
 * Prose: styles plain rendered HTML, such as Markdown output, after the
 * element styles in shadcn's Typography page. shadcn ships those as classes
 * per element; this wraps them in one container so rendered Markdown needs
 * no per-element classes. Use it for long-form text only, never for app UI.
 */

const proseClasses = [
  "text-sm leading-relaxed text-foreground",
  "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
  // Headings
  "[&_h1]:mt-8 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-balance",
  "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:border-b [&_h2]:border-border-muted [&_h2]:pb-1.5 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight",
  "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold",
  "[&_h4]:mt-5 [&_h4]:mb-2 [&_h4]:text-sm [&_h4]:font-semibold",
  // Body
  "[&_p]:my-3 [&_p]:text-pretty",
  "[&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-brand-strong",
  "[&_strong]:font-semibold",
  "[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground [&_blockquote]:italic",
  // Lists
  "[&_ul]:my-3 [&_ul]:ml-5 [&_ul]:list-disc [&_ol]:my-3 [&_ol]:ml-5 [&_ol]:list-decimal",
  "[&_li]:mt-1 [&_li]:pl-1 [&_li>ul]:my-1 [&_li>ol]:my-1 marker:[&_li]:text-fg-subtle",
  // Code
  "[&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:bg-fill [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:font-mono",
  "[&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border-muted [&_pre]:bg-fill-subtle [&_pre]:p-3 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:leading-normal",
  // Rules, tables and media
  "[&_hr]:my-6 [&_hr]:border-border-muted",
  "[&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
  "[&_th]:border-b [&_th]:border-border [&_th]:px-2 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-medium",
  "[&_td]:border-b [&_td]:border-border-muted [&_td]:px-2 [&_td]:py-1.5",
  "[&_img]:my-4 [&_img]:rounded-lg",
  "[&_kbd]:rounded-sm [&_kbd]:border [&_kbd]:border-border [&_kbd]:bg-fill-subtle [&_kbd]:px-1 [&_kbd]:font-mono [&_kbd]:text-xs",
].join(" ");

type ProseProps = React.ComponentProps<"div"> & {
  /** Tighter rhythm for prose inside cards, bubbles and panels. */
  size?: "default" | "sm";
};

function Prose({ className, size = "default", ...props }: ProseProps) {
  return (
    <div
      data-slot="prose"
      data-size={size}
      className={cnState(
        proseClasses,
        "data-[size=sm]:[&_h1]:mt-5 data-[size=sm]:[&_h1]:text-lg data-[size=sm]:[&_h2]:mt-5 data-[size=sm]:[&_h2]:text-base data-[size=sm]:[&_h3]:mt-4 data-[size=sm]:[&_h3]:text-sm data-[size=sm]:[&_p]:my-2 data-[size=sm]:[&_ul]:my-2 data-[size=sm]:[&_ol]:my-2",
        className
      )}
      {...props}
    />
  );
}

export { Prose };
export type { ProseProps };
