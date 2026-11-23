"use client";

import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { PanelLeftCloseIcon } from "@solar-icons/react/outline/panel-left-close";
import { PanelLeftOpenIcon } from "@solar-icons/react/outline/panel-left-open";

import { useShell } from "#lib/shell";
import { SidebarPanel, SidebarRail, type AppNavigation } from "./app-sidebar";

/** Frame widths at or above this dock the sidebar; below it the sidebar opens over the page. Sits between the tablet (820px) and a laptop window with the workbench nav (~960px). */
const DOCK_MIN_WIDTH = 896;

/** Shared motion for the sidebar: where it sits and the space it takes. */
const sidebarMotion = "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";

const SidebarContext = createContext<{
  expanded: boolean;
  docked: boolean;
  /** The collapsed sidebar left a rail, which carries the way back in. */
  rail: boolean;
  ready: boolean;
  toggle: () => void;
} | null>(null);

/**
 * Shows the sidebar from the page header, just before the title. While the
 * sidebar is docked it carries its own hide button, so this one folds away to
 * nothing; when the sidebar leaves, it grows back in and pushes the title over.
 * Header rows use `gap-1.5`, which the folded state cancels with its margins.
 */
export function SidebarToggle() {
  const sidebar = useContext(SidebarContext);
  if (!sidebar) return null;
  const folded = sidebar.docked || sidebar.rail;
  return (
    <div
      inert={folded}
      className={cn(
        "flex shrink-0 overflow-hidden transition-[width,margin,opacity] ease-out motion-reduce:transition-none",
        sidebar.ready ? "duration-300" : "duration-0",
        folded ? "ms-1 -me-1.5 w-0 opacity-0" : "w-7 opacity-100",
      )}
    >
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={sidebar.expanded ? "Hide sidebar" : "Show sidebar"}
        aria-expanded={sidebar.expanded}
        onClick={sidebar.toggle}
      >
        {sidebar.expanded ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
      </Button>
    </div>
  );
}

/**
 * The app frame: the sidebar and the page. Wide frames dock the expanded
 * sidebar beside the page; narrow ones start collapsed and open it over the
 * page. The toggle sits before the title in each page header, so it never
 * moves and the headers need no room for a collapsed control.
 *
 * Two shell styles share everything inside the page (see `#lib/shell`):
 * - inset (web): the sidebar sits flush on the canvas and the page is a
 *   rounded, lifted container held `--g` off the window's top, right and
 *   bottom. At a gutter of 0 its right corners square off against the edge.
 * - floating (Apple): the sidebar floats inside the window with a gap on
 *   every side, the way macOS 26 draws it, over one continuous page.
 */
export function AppFrame({
  navigation,
  place,
  title,
  actions,
  children,
}: {
  navigation: AppNavigation;
  place: string;
  /** Omit the title when the page supplies pane-level headers. */
  title?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const shell = useShell();
  const inset = shell.style === "inset";
  const flush = shell.gutter === 0;
  const [wide, setWide] = useState(true);
  const [expanded, setExpanded] = useState(true);
  // Transitions start after the first measurement, so a narrow frame doesn't animate closed on load.
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => {
      const next = frame.offsetWidth >= DOCK_MIN_WIDTH;
      setWide((previous) => {
        if (previous !== next) setExpanded(next);
        return next;
      });
    };
    measure();
    setExpanded(frame.offsetWidth >= DOCK_MIN_WIDTH);
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    const frameId = requestAnimationFrame(() => setReady(true));
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
    };
  }, []);

  const docked = wide && expanded;
  const overlay = !wide && expanded;
  // The web style leaves an icon rail where a collapsed sidebar was, on frames wide enough to dock it.
  const rail = inset && wide && !expanded;
  const motion = ready ? sidebarMotion : "transition-none";
  const hide = () => setExpanded(false);

  const backdrop = overlay ? (
    <button
      type="button"
      aria-label="Hide sidebar"
      onClick={hide}
      className="absolute inset-0 z-20 bg-foreground/20 animate-in fade-in-0 duration-300"
    />
  ) : null;

  const header = title == null ? null : (
    <header className="flex h-14 items-center gap-1.5 ps-3 pe-4">
      <SidebarToggle />
      <h1 className="min-w-0 font-semibold">{title}</h1>
      <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>
    </header>
  );

  return (
    <SidebarContext.Provider value={{ expanded, docked, rail, ready, toggle: () => setExpanded(!expanded) }}>
      <div
        ref={frameRef}
        data-shell={shell.style}
        className={cn(
          "relative flex min-h-160 overflow-hidden text-foreground",
          // --g is the container's gutter: the theme's value, or nothing on a phone.
          inset ? "bg-canvas [--g:var(--shell-gutter,--spacing(2))] @max-md:[--g:0px]" : "bg-background",
        )}
      >
        {/* Holds the docked sidebar's width in the page flow, and gives it up as the sidebar shrinks. */}
        <div
          aria-hidden
          className={cn(
            "shrink-0 transition-[width]",
            motion,
            docked ? (inset ? "w-56" : "w-[calc(--spacing(56)+--spacing(2))]") : rail ? "w-14" : "w-0",
          )}
        />
        {backdrop}
        {inset ? (
          <div
            ref={railRef}
            inert={!rail}
            className={cn(
              "absolute inset-y-0 start-0 z-10 flex w-14 flex-col items-center pt-[calc(var(--g)+--spacing(2.5))] pb-(--g) transition-opacity",
              motion,
              rail ? "opacity-100 delay-150" : "pointer-events-none opacity-0",
            )}
          >
            <SidebarRail navigation={navigation} place={place} gutter={shell.gutter} anchor={railRef} onDock={() => setExpanded(true)} />
          </div>
        ) : null}
        <aside
          aria-label="Sidebar"
          inert={!expanded}
          className={cn(
            "absolute z-30 flex w-56 flex-col transition-[translate,opacity,box-shadow]",
            motion,
            expanded ? "translate-x-0 opacity-100" : "-translate-x-[calc(100%+--spacing(4))] opacity-0",
            inset
              ? // Flush on the canvas. The brand row lines up with the page header,
                // and opened over the page its hide button lands on the header toggle.
                cn(
                  "inset-y-0 start-0 pe-2 pt-[calc(var(--g)+--spacing(4))] pb-[calc(var(--g)+--spacing(2))]",
                  overlay ? "w-64 bg-canvas ps-[calc(var(--g)+--spacing(4))] shadow-xl" : "ps-2",
                )
              : cn(
                  "inset-y-2 start-2 rounded-[calc((var(--radius)+var(--spacing)*2)*var(--corner-scale))] bg-muted/85 p-2 shadow-(--shadow-frame) ring-1 ring-foreground/8 backdrop-blur-xl",
                  overlay && "bg-muted shadow-xl",
                ),
          )}
          onKeyDown={(event) => {
            if (event.key === "Escape" && overlay) hide();
          }}
        >
          <SidebarPanel navigation={navigation} place={place} shell={shell.style} onHide={hide} hideAt={wide ? "end" : "start"} />
        </aside>
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            inset &&
              cn(
                "my-(--g) me-(--g) overflow-hidden bg-background shadow-(--shadow-frame) ring-1 ring-foreground/8 transition-[margin,border-radius]",
                motion,
                // Beside the docked sidebar or its rail the container meets it; otherwise it holds the gutter on the left too.
                docked || rail ? "ms-0" : "ms-(--g)",
                "rounded-[calc(var(--radius)*var(--corner-scale))] @max-md:rounded-none @max-md:ring-0 @max-md:shadow-none",
                // At a gutter of 0 the container meets the window's edges and squares off there.
                flush && "rounded-e-none",
                flush && !docked && !rail && "rounded-s-none",
              ),
          )}
        >
          {header}
          <div className="min-h-0 flex-1">{children}</div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
