"use client";

/* The sidebar for the Parks app shell: the full panel and the icon rail. */

import { Badge } from "@outfitter/parks/components/badge";
import { Button } from "@outfitter/parks/components/button";
import { Kbd } from "@outfitter/parks/components/kbd";
import { Mark } from "@outfitter/parks/components/mark";
import { NavItem } from "@outfitter/parks/components/nav-item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@outfitter/parks/components/popover";
import { StatusDot } from "@outfitter/parks/components/status-dot";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@outfitter/parks/components/tooltip";
import { cn } from "@outfitter/parks/lib/utils";
import { AltArrowDownIcon } from "@solar-icons/react/outline/alt-arrow-down";
import { MagnifierIcon } from "@solar-icons/react/outline/magnifier";
import { PanelLeftCloseIcon } from "@solar-icons/react/outline/panel-left-close";
import { PanelLeftOpenIcon } from "@solar-icons/react/outline/panel-left-open";
import { SettingsIcon } from "@solar-icons/react/outline/settings";
import { useState } from "react";
import type { ComponentProps, ComponentType, RefObject } from "react";

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
    /** Where the place lives. Omit it only in a mock-up. */
    href?: string;
  }[];
  account?: string;
  /** Links the account control to a page instead of opening a menu. */
  accountHref?: string;
  /** Shows the search control. Defaults to true. */
  search?: boolean;
  /**
   * Renders the links, such as Next.js's `Link`, so moving between places is
   * client-side and keeps the sidebar's state. Defaults to a plain `<a>`.
   */
  link?: ComponentType<ComponentProps<"a"> & { href: string }>;
};

/** The dot form, for a place that has something new but no useful number. */
function NavDot() {
  return (
    <span className="ml-auto grid size-5 place-items-center">
      <StatusDot size="xs" label="New" />
    </span>
  );
}

function Brand({ mark }: { mark: string }) {
  return (
    <Mark tone="brand" variant="solid">
      {mark}
    </Mark>
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
  onHide,
  hideAt,
  onDock,
}: {
  navigation: AppNavigation;
  place: string;
  onHide: () => void;
  hideAt: "start" | "end";
  /** Shown from the rail: the end button docks the sidebar instead of hiding it. */
  onDock?: () => void;
}) {
  const {
    name,
    mark,
    items,
    account,
    accountHref,
    search = true,
    link: Anchor = "a",
  } = navigation;
  const hide = onDock ? (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Dock sidebar"
      onClick={onDock}
      className="-me-1 ml-auto"
    >
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
      {search ? (
        <Button variant="secondary" shape="rect" className="mt-3 mb-2 w-full">
          <MagnifierIcon className="size-4 shrink-0" />
          Search
          <Kbd className="ml-auto">⌘K</Kbd>
        </Button>
      ) : (
        <div className="mt-3" />
      )}
      <nav aria-label={name}>
        {items.map(
          ({ id, label, icon: Line, solid: Solid, count, dot, href }) => {
            const Icon = id === place ? Solid : Line;
            return (
              <NavItem
                key={id}
                render={<Anchor href={href ?? "#"} />}
                current={id === place}
              >
                <Icon />
                <span className="truncate">{label}</span>
                {count ? (
                  <Badge
                    count={count}
                    shape="rect"
                    variant="plain"
                    className="ms-auto"
                  />
                ) : dot ? (
                  <NavDot />
                ) : null}
              </NavItem>
            );
          }
        )}
      </nav>
      {account ? (
        <NavItem
          render={
            accountHref ? (
              <Anchor href={accountHref} />
            ) : (
              <button type="button" />
            )
          }
          className="mt-auto"
        >
          <SettingsIcon />
          <span className="truncate">{account}</span>
          {accountHref ? null : <AltArrowDownIcon className="ms-auto" />}
        </NavItem>
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
  const {
    name,
    mark,
    items,
    account,
    accountHref,
    search = true,
    link: Anchor = "a",
  } = navigation;
  const [open, setOpen] = useState(false);
  const margin = Math.max(gutter, POPOVER_MARGIN);
  const item =
    "relative grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-fill-subtle hover:text-foreground";
  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          openOnHover
          delay={0}
          closeDelay={200}
          render={
            <Button
              variant="ghost"
              size="icon-lg"
              shape="rect"
              aria-label="Show sidebar"
            />
          }
        >
          <Brand mark={mark} />
        </PopoverTrigger>
        <PopoverContent
          variant="frame"
          anchor={anchor}
          side="right"
          align="start"
          // Pull the popover back over the rail to sit `margin` off the window's left and top.
          sideOffset={margin - RAIL_WIDTH}
          alignOffset={margin}
          // Following a link closes the popover, even when the app's link
          // component keeps the frame mounted; the sidebar stays collapsed.
          onClick={(event) => {
            if (
              event.target instanceof Element &&
              event.target.closest("a[href]")
            ) {
              setOpen(false);
            }
          }}
          style={{
            // Vertical padding puts the items at the docked sidebar's height; never tighter than the margin.
            paddingTop: Math.max(gutter + SIDEBAR_TOP - margin, POPOVER_MARGIN),
            paddingBottom: Math.max(
              gutter + SIDEBAR_BOTTOM - margin,
              POPOVER_MARGIN
            ),
            height: `calc(var(--anchor-height) - ${margin * 2}px)`,
            width: SIDEBAR_WIDTH,
          }}
        >
          <SidebarPanel
            navigation={navigation}
            place={place}
            onHide={() => setOpen(false)}
            hideAt="end"
            onDock={() => {
              setOpen(false);
              onDock();
            }}
          />
        </PopoverContent>
      </Popover>
      {search ? (
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon-lg"
                shape="rect"
                aria-label="Search"
                className="mt-3"
              />
            }
          >
            <MagnifierIcon className="size-5 shrink-0" />
          </TooltipTrigger>
          <TooltipContent side="right">
            Search
            <span className="text-inverse-muted">⌘K</span>
          </TooltipContent>
        </Tooltip>
      ) : null}
      <nav aria-label={name} className="mt-2 flex flex-col items-center gap-1">
        {items.map(
          ({ id, label, icon: Line, solid: Solid, count, dot, href }) => {
            const current = id === place;
            const Icon = current ? Solid : Line;
            return (
              <Tooltip key={id}>
                <TooltipTrigger
                  render={
                    <Anchor
                      href={href ?? "#"}
                      aria-label={label}
                      aria-current={current ? "page" : undefined}
                      className={cn(item, current && "bg-fill text-foreground")}
                    />
                  }
                >
                  <Icon className="size-5 shrink-0" />
                  {count || dot ? (
                    <StatusDot
                      size="xs"
                      variant="overlay"
                      className="absolute end-1.5 top-1.5"
                    />
                  ) : null}
                </TooltipTrigger>
                <TooltipContent side="right">
                  {label}
                  {count ? (
                    <span className="text-inverse-muted">{count}</span>
                  ) : null}
                </TooltipContent>
              </Tooltip>
            );
          }
        )}
      </nav>
      {account ? (
        <Tooltip>
          <TooltipTrigger
            render={
              accountHref ? (
                <Anchor
                  href={accountHref}
                  aria-label="Account"
                  className={cn(item, "mt-auto")}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="icon-lg"
                  shape="rect"
                  aria-label="Account"
                  className="mt-auto"
                />
              )
            }
          >
            <SettingsIcon className="size-5 shrink-0" />
          </TooltipTrigger>
          <TooltipContent side="right">{account}</TooltipContent>
        </Tooltip>
      ) : null}
    </>
  );
}
