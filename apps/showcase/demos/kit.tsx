"use client";

import { useState, type ReactNode } from "react";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import { cn } from "@workspace/ui/lib/utils";

/** A titled example on a plain canvas. */
export function Specimen({
  title,
  note,
  children,
  className,
}: {
  title: string;
  note?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className="mb-8">
      <h2 className="font-medium">{title}</h2>
      {note ? <p className="mt-0.5 max-w-prose text-muted-foreground">{note}</p> : null}
      <div
        className={cn(
          "mt-3 flex flex-wrap items-center gap-3 frame p-frame border border-dashed bg-background",
          className,
        )}
      >
        {children}
      </div>
    </section>
  );
}

const widths = {
  fill: "100%",
  laptop: "1280px",
  tablet: "820px",
  phone: "390px",
} as const;

type Width = keyof typeof widths;

function isWidth(value: unknown): value is Width {
  return typeof value === "string" && value in widths;
}

/**
 * A resizable stage for full screens. The stage is a size container, so
 * compositions use container breakpoints (`@3xl:`) and reflow with the
 * preset width rather than the browser width.
 */
export function Viewport({ children }: { children: ReactNode }) {
  const [width, setWidth] = useState<Width>("fill");
  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-muted-foreground">Viewport</p>
        <ToggleGroup
          variant="outline"
          size="sm"
          value={[width]}
          onValueChange={(value) => {
            const next = value[0];
            if (isWidth(next)) setWidth(next);
          }}
        >
          {Object.keys(widths).map((key) => (
            <ToggleGroupItem key={key} value={key} className="capitalize">
              {key}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="overflow-x-auto rounded-frame border bg-muted/30 p-2">
        <div
          className="@container mx-auto overflow-hidden rounded-[calc(var(--radius)+4px)] bg-background ring-1 ring-foreground/10 transition-[max-width] duration-300"
          style={{ maxWidth: widths[width] }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** A small dot that signals state, used in place of colored badges. */
export function Signal({ tone }: { tone: "live" | "wait" | "off" | "alert" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2 shrink-0 rounded-full",
        tone === "live" && "bg-success",
        tone === "wait" && "bg-brand",
        tone === "off" && "bg-muted-foreground/40",
        tone === "alert" && "bg-destructive",
      )}
    />
  );
}
