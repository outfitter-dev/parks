"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import { cn } from "@workspace/ui/lib/utils";
import type { Tone } from "#lib/fixtures";

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
          className="@container mx-auto overflow-hidden rounded-xl bg-background ring-1 ring-foreground/10 transition-[max-width] duration-300"
          style={{ maxWidth: widths[width] }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** A small dot that signals state, used in place of colored badges. */
export function Signal({ tone }: { tone: "live" | "wait" | "off" | "alert" | "new" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-block size-2 shrink-0 rounded-full",
        tone === "live" && "bg-success",
        tone === "wait" && "bg-warning",
        tone === "off" && "bg-muted-foreground/40",
        tone === "alert" && "bg-destructive",
        tone === "new" && "bg-new",
      )}
    />
  );
}

const agentModeTones = {
  live: "success",
  wait: "warning",
  alert: "destructive",
  off: "neutral",
} as const;

export function AgentModeBadge({ tone, mode, className }: { tone: Tone; mode: string; className?: string }) {
  return <Badge variant={agentModeTones[tone]} dot className={className}>{mode}</Badge>;
}

const haloTones = {
  live: "text-success",
  wait: "text-warning",
  off: "text-muted-foreground",
  alert: "text-destructive",
} as const;

/**
 * A Signal dot inside a faint halo with an arc travelling around it: the
 * ring uses the same colour as the dot. At 16px the dot is
 * the same 8px as a plain Signal. Inside a 12px badge icon, the dot shrinks
 * to 5px to give it more room inside the halo.
 */
export function HaloSignal({
  tone,
  size = 16,
  label,
  className,
  ...props
}: Omit<ComponentProps<"svg">, "children"> & {
  tone?: keyof typeof haloTones;
  size?: number;
  label: string;
}) {
  return (
    <svg
      {...props}
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={cn("shrink-0", tone ? haloTones[tone] : "text-muted-foreground", className)}
    >
      <circle
        cx="8"
        cy="8"
        r="4"
        fill="currentColor"
        className="in-data-[slot=badge-icon]:[r:calc(10px/3)]"
      />
      <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.5" />
      <circle
        cx="8"
        cy="8"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="11 33"
        className="origin-center animate-spin [animation-duration:1.2s] [transform-box:fill-box] motion-reduce:animate-none"
      />
    </svg>
  );
}
