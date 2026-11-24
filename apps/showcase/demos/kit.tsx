"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Item, ItemContent, ItemGroup, ItemMedia, ItemMeta, ItemTitle } from "@workspace/ui/components/item";
import { SectionHeader, SectionHeaderDescription, SectionHeaderTitle } from "@workspace/ui/components/section-header";
import { StatusDot } from "@workspace/ui/components/status-dot";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import type { Tone as UiTone } from "@workspace/ui/lib/tone";
import { cn } from "@workspace/ui/lib/utils";
import { versions, type Tone } from "#lib/fixtures";

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
      <SectionHeader>
        <SectionHeaderTitle>{title}</SectionHeaderTitle>
        {note ? <SectionHeaderDescription>{note}</SectionHeaderDescription> : null}
      </SectionHeader>
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
          size="sm"
          aria-label="Viewport width"
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
      <div className="overflow-x-auto rounded-frame border bg-fill-subtle p-2">
        <div
          className="@container mx-auto overflow-hidden rounded-xl bg-background ring-1 ring-border-muted transition-[max-width] duration-300"
          style={{ maxWidth: widths[width] }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/** A small dot that signals state, used in place of colored badges. */
export function Signal({ tone }: { tone: Tone | "new" }) {
  return <StatusDot tone={tone === "new" ? "info" : agentModeTones[tone]} />;
}

/** Agent modes as UI tones: the one mapping the badge and the halo share. */
const agentModeTones = {
  live: "success",
  wait: "warning",
  alert: "destructive",
  off: "neutral",
} as const satisfies Record<Tone, UiTone>;

export function AgentModeBadge({ tone, mode, className }: { tone: Tone; mode: string; className?: string }) {
  return <Badge tone={agentModeTones[tone]} dot className={className}>{mode}</Badge>;
}

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
  tone?: Tone;
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
      data-tone={tone ? agentModeTones[tone] : undefined}
      className={cn("shrink-0", tone ? "text-tone-mark" : "text-muted-foreground", className)}
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

/**
 * The routing history: one control-height row per saved version, newest
 * first, the live one marked. `list` is the open form, `bounded` sits in a
 * panel; the rows are the same either way.
 */
export function VersionRows({ variant = "list", className }: { variant?: "list" | "bounded"; className?: string }) {
  return (
    <ItemGroup variant={variant} className={cn(variant === "bounded" && "concentric", className)}>
      {versions.map((item, index) => (
        <Item key={item.version} size="xs">
          <ItemMedia className="w-8 justify-start font-mono text-muted-foreground tabular-nums">v{item.version}</ItemMedia>
          <ItemContent>
            <ItemTitle className="font-normal">{item.change}</ItemTitle>
          </ItemContent>
          {index === 0 ? (
            <ItemMeta className="flex items-center gap-2 font-medium text-success-strong">
              <StatusDot tone="success" />
              Live
            </ItemMeta>
          ) : (
            <ItemMeta>{item.when}</ItemMeta>
          )}
        </Item>
      ))}
    </ItemGroup>
  );
}
