"use client";

import { Badge } from "@outfitter/parks/components/badge";
import { HaloSignal as ParksHaloSignal } from "@outfitter/parks/components/halo-signal";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemMeta,
  ItemTitle,
} from "@outfitter/parks/components/item";
import {
  SectionHeader,
  SectionHeaderDescription,
  SectionHeaderTitle,
} from "@outfitter/parks/components/section-header";
import { StatusDot } from "@outfitter/parks/components/status-dot";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@outfitter/parks/components/toggle-group";
import type { Tone as UiTone } from "@outfitter/parks/lib/tone";
import { cn } from "@outfitter/parks/lib/utils";
import { useState } from "react";
import type { ComponentProps, ReactNode } from "react";

import { versions } from "#lib/fixtures";
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
      <SectionHeader>
        <SectionHeaderTitle>{title}</SectionHeaderTitle>
        {note ? (
          <SectionHeaderDescription>{note}</SectionHeaderDescription>
        ) : null}
      </SectionHeader>
      <div
        className={cn(
          "frame p-frame bg-background mt-3 flex flex-wrap items-center gap-3 border border-dashed",
          className
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
            if (isWidth(next)) {
              setWidth(next);
            }
          }}
        >
          {Object.keys(widths).map((key) => (
            <ToggleGroupItem key={key} value={key} className="capitalize">
              {key}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className="rounded-frame bg-fill-subtle overflow-x-auto border p-2">
        <div
          className="bg-background ring-border-muted @container mx-auto overflow-hidden rounded-xl ring-1 transition-[max-width] duration-300"
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

export function AgentModeBadge({
  tone,
  mode,
  className,
}: {
  tone: Tone;
  mode: string;
  className?: string;
}) {
  return (
    <Badge tone={agentModeTones[tone]} dot className={className}>
      {mode}
    </Badge>
  );
}

/** The package's HaloSignal, coloured by an agent mode. */
export function HaloSignal({
  tone,
  ...props
}: Omit<ComponentProps<typeof ParksHaloSignal>, "tone"> & { tone?: Tone }) {
  return (
    <ParksHaloSignal
      {...props}
      tone={tone ? agentModeTones[tone] : undefined}
    />
  );
}

/**
 * The routing history: one control-height row per saved version, newest
 * first, the live one marked. `list` is the open form, `bounded` sits in a
 * panel; the rows are the same either way.
 */
export function VersionRows({
  variant = "list",
  className,
}: {
  variant?: "list" | "bounded";
  className?: string;
}) {
  return (
    <ItemGroup
      variant={variant}
      className={cn(variant === "bounded" && "concentric", className)}
    >
      {versions.map((item, index) => (
        <Item key={item.version} size="xs">
          <ItemMedia className="text-muted-foreground w-8 justify-start font-mono tabular-nums">
            v{item.version}
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="font-normal">{item.change}</ItemTitle>
          </ItemContent>
          {index === 0 ? (
            <ItemMeta className="text-success-strong flex items-center gap-2 font-medium">
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
