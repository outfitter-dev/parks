"use client";

import { useState, type ComponentType, type RefObject } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Kbd } from "@workspace/ui/components/kbd";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { AltArrowDownIcon } from "@solar-icons/react/outline/alt-arrow-down";
import { MagnifierIcon } from "@solar-icons/react/outline/magnifier";
import { PanelLeftCloseIcon } from "@solar-icons/react/outline/panel-left-close";
import { PanelLeftOpenIcon } from "@solar-icons/react/outline/panel-left-open";
import { SettingsIcon } from "@solar-icons/react/outline/settings";
import type { ShellStyle } from "#lib/shell";

type NavIcon = ComponentType<{ className?: string }>;

export type AppNavigation = {
  name: string;
  mark: string;
  items: readonly {
    id: string;
    label: string;
    icon: NavIcon;
    solid: NavIcon;
    count?: number;
    dot?: boolean;
  }[];
  account?: string;
};

/** The dot form, for a place that has something new but no useful number. */
function NavDot() {
  return (
    <span className="ml-auto grid size-5 place-items-center" aria-label="New">
      <span className="size-1.5 rounded-full bg-foreground" />
    </span>
  );
}

function Brand({ mark }: { mark: string }) {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-brand text-xs text-brand-foreground">{mark}</span>
  );
}

/**
 * The full sidebar: brand, search, places and the account, with its own hide
 * button. Docked, the button sits at the end of the brand row and leaves with
 * the sidebar. Opened over the page (`hideAt: "start"`), it sits before the
 * brand, exactly on the header toggle it covers.
 */
export function SidebarPanel({
  navigation,
  place,
  shell,
  onHide,
  hideAt,
  onDock,
}: {
  navigation: AppNavigation;
  place: string;
  shell: ShellStyle;
  onHide: () => void;
  hideAt: "start" | "end";
  /** Shown from the rail: the end button docks the sidebar instead of hiding it. */
  onDock?: () => void;
}) {
  // On the bare canvas, solid accents vanish; translucent ink reads on any surface.
  const { name, mark, items, account } = navigation;
  const hover = shell === "inset" ? "hover:bg-fill-subtle" : "hover:bg-accent";
  const current = shell === "inset" ? "bg-fill" : "bg-accent";
  const hide = onDock ? (
    <Button variant="ghost" size="icon-sm" aria-label="Dock sidebar" onClick={onDock} className="-me-1 ml-auto">
      <PanelLeftOpenIcon />
    </Button>
  ) : (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Hide sidebar"
      onClick={onHide}
      // At the start it lands on the header toggle: same 28px button, same centre.
      className={hideAt === "start" ? "-ms-3" : "-me-1 ml-auto"}
    >
      <PanelLeftCloseIcon />
    </Button>
  );
  return (
    <>
      <div className="flex h-6 items-center gap-2 px-2 font-semibold">
        {hideAt === "start" && !onDock ? hide : null}
        <span className="flex w-4 shrink-0 justify-center">
          <Brand mark={mark} />
        </span>
        <span className="truncate">{name}</span>
        {hideAt === "end" || onDock ? hide : null}
      </div>
      <button
        type="button"
        className="mt-3 mb-2 flex h-(--control-h) items-center gap-2 rounded-lg border bg-background ps-[calc(--spacing(2)-1px)] pe-2 text-muted-foreground"
      >
        <MagnifierIcon className="size-4 shrink-0" />
        Search
        <Kbd className="ml-auto">⌘K</Kbd>
      </button>
      <nav aria-label={name}>
        {items.map(({ id, label, icon: Line, solid: Solid, count, dot }) => {
          const Icon = id === place ? Solid : Line;
          return (
            <a
              key={id}
              href="#"
              aria-current={id === place ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 font-normal text-muted-foreground hover:text-foreground",
                hover,
                id === place && cn(current, "font-medium text-foreground"),
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{label}</span>
              {count ? <Badge count={count} shape="rect" variant="plain" className="ms-auto" /> : dot ? <NavDot /> : null}
            </a>
          );
        })}
      </nav>
      {account ? (
        <button
          type="button"
          className={cn(
            "mt-auto flex h-(--control-h) items-center gap-2 rounded-lg px-2 font-semibold text-muted-foreground hover:text-foreground",
            hover,
          )}
        >
          <SettingsIcon className="size-4 shrink-0" />
          {account}
          <AltArrowDownIcon className="ml-auto size-4 shrink-0" />
        </button>
      ) : null}
    </>
  );
}

/** Sidebar geometry in px, mirrored from the docked aside so the rail's popover can match it. */
const SIDEBAR_WIDTH = 224; // w-56
const RAIL_WIDTH = 56; // w-14
const SIDEBAR_TOP = 16; // the aside's pt beyond the gutter, --spacing(4)
const SIDEBAR_BOTTOM = 8; // the aside's pb beyond the gutter, --spacing(2)
/** The popover keeps at least this much window around it, even when the container's gutter is 0. */
const POPOVER_MARGIN = 8;

/**
 * What a collapsed web sidebar leaves behind: the brand, search, then one icon per
 * place, then the account. A place with a count or something new carries a
 * dot; the tooltip names it and gives the count.
 *
 * Hovering the brand shows the sidebar as a popover the height of the page
 * container, held the gutter (at least 8px) off the window's top, left and
 * bottom. Inside it the items sit exactly where the docked sidebar puts them,
 * shifted right by that left margin, so docking it just drops the card. Its
 * end button docks it.
 */
export function SidebarRail({
  navigation,
  place,
  gutter,
  anchor,
  onDock,
}: {
  navigation: AppNavigation;
  place: string;
  /** The container's gutter in px. */
  gutter: number;
  /** The rail column, which spans the frame's height. */
  anchor: RefObject<HTMLDivElement | null>;
  onDock: () => void;
}) {
  const { name, mark, items, account } = navigation;
  const [open, setOpen] = useState(false);
  const margin = Math.max(gutter, POPOVER_MARGIN);
  const item = "relative grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-fill-subtle hover:text-foreground";
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          openOnHover
          delay={0}
          closeDelay={200}
          aria-label="Show sidebar"
          className="grid size-9 place-items-center rounded-lg hover:bg-fill-subtle data-popup-open:bg-fill-subtle"
        >
          <Brand mark={mark} />
        </PopoverTrigger>
        <PopoverContent
          anchor={anchor}
          side="right"
          align="start"
          // Pull the popover back over the rail to sit `margin` off the window's left and top.
          sideOffset={margin - RAIL_WIDTH}
          alignOffset={margin}
          style={{
            // Vertical padding puts the items at the docked sidebar's height; never tighter than the margin.
            paddingTop: Math.max(gutter + SIDEBAR_TOP - margin, POPOVER_MARGIN),
            paddingBottom: Math.max(gutter + SIDEBAR_BOTTOM - margin, POPOVER_MARGIN),
            height: `calc(var(--anchor-height) - ${margin * 2}px)`,
            width: SIDEBAR_WIDTH,
          }}
          // Inherit the page type, not the popover's text-sm, so rows keep the docked line height.
          className="gap-0 rounded-[calc((var(--radius)+var(--spacing)*2)*var(--corner-scale))] bg-popover px-2 text-[length:inherit] leading-[inherit] shadow-(--shadow-frame) data-open:zoom-in-100 data-closed:zoom-out-100 data-closed:slide-out-to-left-2"
        >
          <SidebarPanel
            navigation={navigation}
            place={place}
            shell="inset"
            onHide={() => setOpen(false)}
            hideAt="end"
            onDock={() => {
              setOpen(false);
              onDock();
            }}
          />
        </PopoverContent>
      </Popover>
      <Tooltip>
        <TooltipTrigger render={<button type="button" aria-label="Search" className={cn(item, "mt-3")} />}>
          <MagnifierIcon className="size-5 shrink-0" />
        </TooltipTrigger>
        <TooltipContent side="right">
          Search
          <span className="text-inverse-muted">⌘K</span>
        </TooltipContent>
      </Tooltip>
      <nav aria-label={name} className="mt-2 flex flex-col items-center gap-1">
        {items.map(({ id, label, icon: Line, solid: Solid, count, dot }) => {
          const current = id === place;
          const Icon = current ? Solid : Line;
          return (
            <Tooltip key={id}>
              <TooltipTrigger
                render={
                  <a
                    href="#"
                    aria-label={label}
                    aria-current={current ? "page" : undefined}
                    className={cn(item, current && "bg-fill text-foreground")}
                  />
                }
              >
                <Icon className="size-5 shrink-0" />
                {count || dot ? (
                  <span aria-hidden className="absolute top-1.5 end-1.5 size-1.5 rounded-full bg-foreground ring-2 ring-canvas" />
                ) : null}
              </TooltipTrigger>
              <TooltipContent side="right">
                {label}
                {count ? <span className="text-inverse-muted">{count}</span> : null}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>
      {account ? (
        <Tooltip>
          <TooltipTrigger render={<button type="button" aria-label="Account" className={cn(item, "mt-auto")} />}>
            <SettingsIcon className="size-5 shrink-0" />
          </TooltipTrigger>
          <TooltipContent side="right">{account}</TooltipContent>
        </Tooltip>
      ) : null}
    </>
  );
}
