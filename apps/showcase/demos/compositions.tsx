"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Kbd } from "@workspace/ui/components/kbd";
import { Label } from "@workspace/ui/components/label";
import { Progress } from "@workspace/ui/components/progress";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import { cn } from "@workspace/ui/lib/utils";
import { ChatRoundDotsIcon } from "@solar-icons/react/linear/chat-round-dots";
import { HistoryIcon } from "@solar-icons/react/linear/history";
import { InboxIcon } from "@solar-icons/react/linear/inbox";
import { KeyIcon } from "@solar-icons/react/linear/key";
import { SidebarMinimalisticIcon } from "@solar-icons/react/linear/sidebar-minimalistic";
import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { CheckCircleIcon as CheckCircleBold } from "@solar-icons/react/bold/check-circle";
import { SettingsIcon } from "@solar-icons/react/linear/settings";
import { AltArrowDownIcon } from "@solar-icons/react/linear/alt-arrow-down";
import { MagnifierIcon } from "@solar-icons/react/linear/magnifier";
import { RoutingIcon } from "@solar-icons/react/linear/routing";
import { ShieldKeyholeIcon } from "@solar-icons/react/linear/shield-keyhole";
import { UsersGroupRoundedIcon } from "@solar-icons/react/linear/users-group-rounded";
import { InboxIcon as InboxBold } from "@solar-icons/react/bold/inbox";
import { CheckIcon as CheckBold } from "@solar-icons/react/bold/check";
import { PauseIcon as PauseBold } from "@solar-icons/react/bold/pause";
import { ChatRoundDotsIcon as ChatRoundDotsBold } from "@solar-icons/react/bold/chat-round-dots";
import { HistoryIcon as HistoryBold } from "@solar-icons/react/bold/history";
import { RoutingIcon as RoutingBold } from "@solar-icons/react/bold/routing";
import { ShieldKeyholeIcon as ShieldKeyholeBold } from "@solar-icons/react/bold/shield-keyhole";
import { UsersGroupRoundedIcon as UsersGroupRoundedBold } from "@solar-icons/react/bold/users-group-rounded";
import { agents, asks, versions, type Ask } from "#lib/fixtures";
import { Signal, Viewport } from "./kit";

type Place = "needs-you" | "inbox" | "agents" | "routing" | "history" | "admin";

/**
 * Each place has a line glyph and a solid one. The solid glyph marks the
 * current place. A place shows either a count or a dot, never both.
 */
const places: { id: Place; label: string; icon: typeof InboxIcon; solid: typeof InboxIcon; count?: number; dot?: boolean }[] = [
  { id: "needs-you", label: "Needs you", icon: ChatRoundDotsIcon, solid: ChatRoundDotsBold, count: asks.length },
  { id: "inbox", label: "Inbox", icon: InboxIcon, solid: InboxBold, dot: true },
  { id: "agents", label: "Agents", icon: UsersGroupRoundedIcon, solid: UsersGroupRoundedBold, count: 5 },
  { id: "routing", label: "Routing", icon: RoutingIcon, solid: RoutingBold },
  { id: "history", label: "History", icon: HistoryIcon, solid: HistoryBold, count: 128 },
  { id: "admin", label: "Admin", icon: ShieldKeyholeIcon, solid: ShieldKeyholeBold },
];

/**
 * A count in a rounded rectangle. It is at least square, so one digit sits
 * centred in a square; more digits widen it leftward from a fixed right edge.
 */
function NavCount({ value }: { value: number }) {
  return (
    <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-md bg-foreground/10 px-1 text-xs font-medium text-foreground tabular-nums">
      {value}
    </span>
  );
}

/** The dot form, for a place that has something new but no useful number. */
function NavDot() {
  return (
    <span className="ml-auto grid size-5 place-items-center" aria-label="New">
      <span className="size-1.5 rounded-full bg-foreground" />
    </span>
  );
}

function Brand() {
  return (
    <span className="grid size-6 shrink-0 place-items-center rounded-md bg-brand text-xs text-brand-foreground">O</span>
  );
}

/**
 * The full sidebar: brand, search, places and the account. The toggle sits
 * outside it (see AppFrame), so the brand row leaves room for it at the end.
 */
function SidebarPanel({ place }: { place: Place }) {
  return (
    <>
      <div className="flex h-6 items-center gap-2 ps-2 pe-9 font-semibold">
        <Brand />
        Outpost
      </div>
      <button
        type="button"
        className="mt-3 mb-2 flex h-(--control-h) items-center gap-2 rounded-lg border bg-background px-2 text-muted-foreground"
      >
        <MagnifierIcon className="size-4" />
        Search
        <Kbd className="ml-auto">⌘K</Kbd>
      </button>
      <nav aria-label="Outpost">
        {places.map(({ id, label, icon: Line, solid: Solid, count, dot }) => {
          const Icon = id === place ? Solid : Line;
          return (
            <a
              key={id}
              href="#"
              aria-current={id === place ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 font-semibold text-muted-foreground hover:bg-accent hover:text-foreground",
                id === place && "bg-accent text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
              {count ? <NavCount value={count} /> : dot ? <NavDot /> : null}
            </a>
          );
        })}
      </nav>
      <button
        type="button"
        className="mt-auto flex h-(--control-h) items-center gap-2 rounded-lg px-2 font-semibold text-muted-foreground hover:bg-accent hover:text-foreground"
      >
        <SettingsIcon className="size-4" />
        Matt
        <AltArrowDownIcon className="ml-auto size-3.5" />
      </button>
    </>
  );
}

/** Frame widths at or above this dock the sidebar; below it the sidebar opens over the page. Sits between the tablet (820px) and a laptop window with the workbench nav (~960px). */
const DOCK_MIN_WIDTH = 896;

/** Shared motion for the sidebar: its shape, the space it takes, and the header clearance. */
const sidebarMotion = "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none";

/**
 * The app frame: an inset sidebar and the page. The sidebar floats inside the
 * window with a gap on every side, the way macOS 26 draws it. The toggle is
 * pinned to the sidebar's top end corner, so collapsing carries it along as
 * the sidebar shrinks into a circle in the top corner that holds only it.
 *
 * Wide frames dock the expanded sidebar beside the page; narrow ones start
 * collapsed and open it over the page. Page headers are as tall as the circle's
 * centre line needs, and read `--clear` to step past the circle while it shows.
 */
function AppFrame({
  place,
  title,
  actions,
  bare = false,
  children,
}: {
  place: Place;
  title: string;
  actions?: ReactNode;
  /** Leave the top bar out, so the page can give each column its own header. */
  bare?: boolean;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
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
  const motion = ready ? sidebarMotion : "transition-none";

  return (
    <div
      ref={frameRef}
      className={cn(
        "relative flex min-h-160 overflow-hidden bg-background text-foreground",
        docked ? "[--clear:--spacing(0)]" : "[--clear:--spacing(11)]",
      )}
    >
      {/* Holds the docked sidebar's width in the page flow, and gives it up as the sidebar shrinks. */}
      <div
        aria-hidden
        className={cn("shrink-0 transition-[width]", motion, docked ? "w-[calc(--spacing(56)+--spacing(2))]" : "w-0")}
      />
      {overlay ? (
        <button
          type="button"
          aria-label="Hide sidebar"
          onClick={() => setExpanded(false)}
          className="absolute inset-0 z-20 bg-foreground/20 animate-in fade-in-0 duration-300"
        />
      ) : null}
      <aside
        aria-label="Sidebar"
        className={cn(
          "absolute start-2 top-2 z-30 overflow-hidden bg-muted/85 shadow-(--shadow-frame) ring-1 ring-foreground/8 backdrop-blur-xl",
          "transition-[width,height,border-radius,box-shadow]",
          motion,
          expanded
            ? "h-[calc(100%-var(--spacing)*4)] w-56 rounded-[calc((var(--radius)+var(--spacing)*2)*var(--corner-scale))]"
            : "size-10 rounded-[--spacing(5)] [corner-shape:round]",
          overlay && "bg-muted shadow-xl",
        )}
        onKeyDown={(event) => {
          if (event.key === "Escape" && overlay) setExpanded(false);
        }}
      >
        <div
          inert={!expanded}
          className={cn(
            "absolute inset-y-0 start-0 flex w-56 flex-col p-2 transition-opacity",
            motion,
            expanded ? "opacity-100 delay-100" : "opacity-0 duration-150",
          )}
        >
          <SidebarPanel place={place} />
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={expanded ? "Hide sidebar" : "Show sidebar"}
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          className="absolute end-1.5 top-1.5"
        >
          <SidebarMinimalisticIcon />
        </Button>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        {bare ? null : (
          <header
            className={cn(
              "flex h-14 items-center gap-3 pe-4 ps-[calc(--spacing(4)+var(--clear))] transition-[padding]",
              motion,
            )}
          >
            <h1 className="font-semibold">{title}</h1>
            <div className="ml-auto flex items-center gap-2">{actions}</div>
          </header>
        )}
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function AskRow({
  ask,
  active,
  answered,
  onSelect,
}: {
  ask: Ask;
  active: boolean;
  answered: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left hover:bg-accent",
        active && "@3xl:bg-accent",
      )}
    >
      <span className="flex items-center gap-2 text-muted-foreground">
        <span className="font-medium text-foreground">{ask.agent}</span>
        <span>{ask.project}</span>
        <span className="ml-auto text-xs tabular-nums">{answered ? "Answered" : ask.age}</span>
        {answered ? (
          <CheckCircleBold className="size-3.5 shrink-0 text-success-strong" />
        ) : (
          <span className="grid size-3.5 shrink-0 place-items-center" aria-label="Unread">
            <Signal tone="new" />
          </span>
        )}
      </span>
      <span className={cn("line-clamp-2", answered && "text-muted-foreground")}>{ask.title}</span>
    </button>
  );
}

type OptionStyle = "cards" | "stacked" | "tray";
type OptionMark = "none" | "glyph" | "letter" | "number" | "yn";
type OptionTone = "neutral" | "coded";
type OptionLook = { style: OptionStyle; mark: OptionMark; tone: OptionTone; multi: boolean };
type MarkTone = "neutral" | "success" | "warning" | "destructive" | "info" | "brand";

/**
 * Mark glyphs drawn on one stroke so a check and a pause carry the same weight.
 * Solar's bold check is a thin outline while its bold pause is two solid slabs,
 * so side by side they read as different families.
 */
function MarkGlyph({ kind }: { kind: "check" | "pause" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      {kind === "check" ? <path d="M5 13L9 17L19 7" /> : <path d="M9 6V18M15 6V18" />}
    </svg>
  );
}

/** Options whose meaning has a standard sign get a glyph and a tone. Others fall back to a letter. */
const optionSigns: Record<string, { glyph: "check" | "pause"; tone: MarkTone }> = {
  Approve: { glyph: "check", tone: "success" },
  Hold: { glyph: "pause", tone: "warning" },
};

/** Tones that letters and numbers cycle through when marks are colour coded. */
const cycleTones: readonly MarkTone[] = ["info", "brand", "success", "warning", "destructive"];

/** What sits in an option's corner tile and its tone, or null for no tile. */
function markFor(mark: OptionMark, label: string, index: number, count: number): { content: ReactNode; tone: MarkTone } | null {
  const letter = String.fromCharCode(65 + index);
  const cycled = cycleTones[index % cycleTones.length] ?? "neutral";
  switch (mark) {
    case "none":
      return null;
    case "glyph": {
      const sign = optionSigns[label];
      return sign ? { content: <MarkGlyph kind={sign.glyph} />, tone: sign.tone } : { content: letter, tone: cycled };
    }
    case "letter":
      return { content: letter, tone: cycled };
    case "number":
      return { content: String(index + 1), tone: cycled };
    case "yn":
      return count === 2
        ? index === 0
          ? { content: "Y", tone: "success" }
          : { content: "N", tone: "destructive" }
        : { content: letter, tone: cycled };
  }
}

/**
 * Tile colours per tone. Unpicked is a light fill with a dark mark; picked
 * inverts to a dark fill with a light 100-level mark. Neutral is used when
 * marks are not colour coded, and keeps the brand for the picked state.
 * In dark mode the unpicked fill drops to the 950 step so it sits in the
 * dark surface instead of glowing.
 */
const tileTones: Record<MarkTone, { idle: string; picked: string }> = {
  neutral: { idle: "bg-foreground/6 text-muted-foreground", picked: "bg-brand-700 text-brand-100" },
  success: { idle: "bg-success-100 text-success-800 dark:bg-success-950 dark:text-success-300", picked: "bg-success-700 text-success-100" },
  warning: { idle: "bg-warning-100 text-warning-800 dark:bg-warning-950 dark:text-warning-300", picked: "bg-warning-700 text-warning-100" },
  destructive: {
    idle: "bg-destructive-100 text-destructive-800 dark:bg-destructive-950 dark:text-destructive-300",
    picked: "bg-destructive-700 text-destructive-100",
  },
  info: { idle: "bg-info-100 text-info-800 dark:bg-info-950 dark:text-info-300", picked: "bg-info-700 text-info-100" },
  brand: { idle: "bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300", picked: "bg-brand-700 text-brand-100" },
};

/** A bounded tile in the option's top-left corner, light until its option is picked. */
function OptionTile({ picked, tone, children }: { picked: boolean; tone: MarkTone; children: ReactNode }) {
  const colours = tileTones[tone];
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-md text-xs font-semibold tabular-nums transition-colors",
        picked ? colours.picked : colours.idle,
      )}
    >
      {children}
    </span>
  );
}

function OptionText({ option }: { option: Ask["options"][number] }) {
  return (
    // The label row is as tall as the corner tile, which adds 2px above the
    // label's text; pb-0.5 adds the same below the detail so the option looks
    // evenly padded.
    <span className="grid min-w-0 gap-0.5 pb-0.5">
      <span className="flex min-h-6 items-center gap-2 font-medium">
        {option.label}
        {option.recommended ? <Badge variant="secondary">Recommended</Badge> : null}
      </span>
      <span className="text-muted-foreground">{option.detail}</span>
    </span>
  );
}

function AskOptions({
  ask,
  look,
  picked,
  onPick,
}: {
  ask: Ask;
  look: OptionLook;
  picked: readonly string[];
  onPick: (next: string[]) => void;
}) {
  const toggle = (label: string) =>
    onPick(
      look.multi
        ? picked.includes(label)
          ? picked.filter((item) => item !== label)
          : [...picked, label]
        : [label],
    );
  const stacked = look.style === "stacked";
  const tray = look.style === "tray";
  return (
    <div className="mt-5 grid gap-2">
      <div
        role={look.multi ? "group" : "radiogroup"}
        aria-label="Options"
        className={cn(
          stacked
            ? "frame divide-y overflow-hidden bg-card p-0 shadow-(--shadow-frame) ring-1 ring-foreground/10"
            : tray
              ? "frame grid gap-1.5 bg-muted p-1.5 [--tray-radius:calc(var(--frame-radius)-var(--spacing)*1.5)]"
              : "grid gap-2",
        )}
      >
        {ask.options.map((option, index) => {
          const isPicked = picked.includes(option.label);
          const mark = markFor(look.mark, option.label, index, ask.options.length);
          return (
            <button
              key={option.label}
              type="button"
              role={look.multi ? "checkbox" : "radio"}
              aria-checked={isPicked}
              onClick={() => toggle(option.label)}
              className={cn(
                "flex w-full items-start gap-3 text-left",
                stacked
                  ? "p-frame hover:bg-muted/60"
                  : cn(
                      "frame bg-card p-frame shadow-(--shadow-frame) ring-1 ring-foreground/10 hover:ring-foreground/25",
                      // Concentric with the tray: its radius less the tray's padding.
                      tray && "rounded-[calc(var(--tray-radius)*var(--corner-scale))]",
                    ),
                stacked && isPicked && "bg-brand-50 hover:bg-brand-50 dark:bg-brand-950/50 dark:hover:bg-brand-950/50",
                !stacked && isPicked && "ring-2 ring-brand hover:ring-brand",
              )}
            >
              {mark === null ? (
                <span className="px-inset">
                  <OptionText option={option} />
                </span>
              ) : (
                <>
                  <OptionTile picked={isPicked} tone={look.tone === "coded" ? mark.tone : "neutral"}>
                    {mark.content}
                  </OptionTile>
                  <OptionText option={option} />
                </>
              )}
            </button>
          );
        })}
      </div>
      <p className="mt-1 text-muted-foreground" aria-live="polite">
        {picked.length > 0
          ? `Posts “${picked.join(", ")}” to the thread as you.`
          : look.multi
            ? "Pick any that apply."
            : "Pick an option to answer."}
      </p>
    </div>
  );
}

function AskDetail({
  ask,
  look,
  picked,
  onPick,
}: {
  ask: Ask;
  look: OptionLook;
  picked: readonly string[];
  onPick: (next: string[]) => void;
}) {
  const [reply, setReply] = useState("");
  return (
    <div className="mx-auto w-full max-w-xl p-(--pad) @3xl:p-6">
      <p className="flex items-start gap-2 text-muted-foreground">
        <Badge variant="outline" className="capitalize">
          {ask.kind}
        </Badge>
        <span className="min-h-5 leading-5">
          {ask.agent} asked {ask.age} ago
        </span>
      </p>
      <h2 className="mt-3 text-lg font-semibold tracking-tight">{ask.title}</h2>
      <p className="mt-2 text-muted-foreground">{ask.context}</p>
      {ask.kind === "input" ? (
        <div className="mt-5 grid gap-2">
          <Label htmlFor="reply">Your reply</Label>
          <Textarea
            id="reply"
            placeholder="Use the ubuntu-24 runner image…"
            value={reply}
            onChange={(event) => setReply(event.target.value)}
          />
          <div className="flex items-center justify-end gap-3">
            {picked.length > 0 ? <span className="text-muted-foreground">Sent</span> : null}
            <Button disabled={reply.trim() === ""} onClick={() => onPick([reply.trim()])}>
              Send reply
            </Button>
          </div>
        </div>
      ) : (
        <AskOptions ask={ask} look={look} picked={picked} onPick={onPick} />
      )}
    </div>
  );
}

/**
 * Progress through the queue on a phone: one segment per ask, filled once it is
 * answered and ringed where you are. Each segment jumps to its ask.
 */
function AskProgress({
  current,
  answers,
  onJump,
}: {
  current: number;
  answers: Readonly<Record<string, readonly string[]>>;
  onJump: (index: number) => void;
}) {
  const done = asks.filter((item) => (answers[item.id] ?? []).length > 0).length;
  return (
    <div className="grid gap-2">
      <div className="flex gap-1">
        {asks.map((item, index) => {
          const answered = (answers[item.id] ?? []).length > 0;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={`Ask ${index + 1} of ${asks.length}${answered ? ", answered" : ""}`}
              aria-current={index === current ? "step" : undefined}
              onClick={() => onJump(index)}
              className="group flex h-4 flex-1 items-center"
            >
              <span
                className={cn(
                  "h-1.5 w-full rounded-full transition-all",
                  answered ? "bg-brand" : "bg-foreground/10 group-hover:bg-foreground/20",
                  index === current && "h-3",
                  index === current && !answered && "bg-foreground/30",
                )}
              />
            </button>
          );
        })}
      </div>
      <p className="flex text-xs text-muted-foreground tabular-nums">
        <span>{done} answered</span>
        <span className="ml-auto">{asks.length - done} left</span>
      </p>
    </div>
  );
}

/** A labelled single-choice control for the demo strip above a composition. */
function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{label}</span>
      <ToggleGroup
        variant="outline"
        size="sm"
        value={[value]}
        onValueChange={(next) => {
          const found = options.find((option) => option.value === next[0]);
          if (found) onChange(found.value);
        }}
      >
        {options.map((option) => (
          <ToggleGroupItem key={option.value} value={option.value}>
            {option.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export function NeedsYouComposition() {
  const [view, setView] = useState<"open" | "answered">("open");
  const [selected, setSelected] = useState(asks[0]?.id);
  /** Which of the two phone screens shows. Wider frames show both columns. */
  const [screen, setScreen] = useState<"list" | "ask">("list");
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [look, setLook] = useState<OptionLook>({ style: "cards", mark: "none", tone: "neutral", multi: false });
  const index = Math.max(0, asks.findIndex((item) => item.id === selected));
  const ask = asks[index];
  const done = asks.filter((item) => (answers[item.id] ?? []).length > 0).length;
  const open = (next: number) => {
    const target = asks[next];
    if (!target) return;
    setSelected(target.id);
    setScreen("ask");
  };
  const answered = ask ? (answers[ask.id] ?? []).length > 0 : false;
  const last = index === asks.length - 1;
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Choice
          label="Options"
          value={look.style}
          options={[
            { value: "cards", label: "Cards" },
            { value: "stacked", label: "Stacked" },
            { value: "tray", label: "Tray" },
          ]}
          onChange={(style) => setLook({ ...look, style })}
        />
        <Choice
          label="Tone"
          value={look.tone}
          options={[
            { value: "neutral", label: "Neutral" },
            { value: "coded", label: "Coded" },
          ]}
          onChange={(tone) => setLook({ ...look, tone })}
        />
        <Choice
          label="Mark"
          value={look.mark}
          options={[
            { value: "none", label: "None" },
            { value: "glyph", label: "Glyph" },
            { value: "letter", label: "A–D" },
            { value: "number", label: "1–9" },
            { value: "yn", label: "Y/N" },
          ]}
          onChange={(mark) => setLook({ ...look, mark })}
        />
        <Choice
          label="Select"
          value={look.multi ? "multi" : "single"}
          options={[
            { value: "single", label: "One" },
            { value: "multi", label: "Many" },
          ]}
          onChange={(next) => {
            setLook({ ...look, multi: next === "multi" });
            setAnswers({});
          }}
        />
      </div>
      <Viewport>
        <AppFrame place="needs-you" title="Needs you" bare>
          <div className="grid h-full @3xl:grid-cols-[minmax(--spacing(64),--spacing(88))_1fr]">
            <div className={cn("flex flex-col @3xl:border-r", screen === "ask" && "@max-3xl:hidden")}>
              <div className="flex h-14 shrink-0 items-center gap-2 pe-2 ps-[calc(--spacing(4)+var(--clear))] transition-[padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none">
                <h1 className="font-semibold">Needs you</h1>
                <Tabs
                  value={view}
                  onValueChange={(next) => setView(next === "answered" ? "answered" : "open")}
                  className="ml-auto"
                >
                  <TabsList>
                    <TabsTrigger value="open">Open</TabsTrigger>
                    <TabsTrigger value="answered">Answered</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {view === "answered" ? (
                <div className="grid flex-1 place-items-center p-(--pad) text-center">
                  <div>
                    <p className="font-medium">Nothing answered yet today</p>
                    <p className="mt-1 text-muted-foreground">Asks you reply to move here, with the reply attached.</p>
                  </div>
                </div>
              ) : (
                <>
                  <p className="px-4 pb-2 text-xs text-muted-foreground tabular-nums @3xl:hidden">
                    {done} of {asks.length} answered
                  </p>
                  <div className="p-2 pt-0">
                    {asks.map((item, itemIndex) => (
                      <AskRow
                        key={item.id}
                        ask={item}
                        active={item.id === ask?.id}
                        answered={(answers[item.id] ?? []).length > 0}
                        onSelect={() => open(itemIndex)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            {view === "open" && ask ? (
              <div className={cn("flex min-h-160 flex-col @3xl:min-h-0", screen === "list" && "@max-3xl:hidden")}>
                <div className="grid gap-3 px-2 pb-3 @3xl:hidden">
                  <div className="flex h-14 items-center gap-1 ps-(--clear) transition-[padding] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none">
                    <Button variant="ghost" size="sm" onClick={() => setScreen("list")}>
                      <AltArrowLeftIcon data-icon="inline-start" />
                      All asks
                    </Button>
                    <span className="ml-auto pe-2 text-muted-foreground tabular-nums">
                      {index + 1} of {asks.length}
                    </span>
                  </div>
                  <div className="px-2">
                    <AskProgress current={index} answers={answers} onJump={open} />
                  </div>
                </div>
                <div className="flex-1">
                  <AskDetail
                    key={`${ask.id}-${look.mark}-${look.multi}`}
                    ask={ask}
                    look={look}
                    picked={answers[ask.id] ?? []}
                    onPick={(next) => setAnswers({ ...answers, [ask.id]: next })}
                  />
                </div>
                <div className="sticky bottom-0 flex items-center gap-2 border-t bg-background p-2 @3xl:hidden">
                  <Button variant="ghost" disabled={index === 0} onClick={() => open(index - 1)}>
                    <AltArrowLeftIcon data-icon="inline-start" />
                    Previous
                  </Button>
                  {last ? (
                    <Button className="ml-auto" variant={answered ? "default" : "secondary"} onClick={() => setScreen("list")}>
                      {done === asks.length ? "Done" : "Back to list"}
                    </Button>
                  ) : (
                    <Button className="ml-auto" variant={answered ? "default" : "secondary"} onClick={() => open(index + 1)}>
                      {answered ? "Next" : "Skip"}
                      <AltArrowRightIcon data-icon="inline-end" />
                    </Button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </AppFrame>
      </Viewport>
    </div>
  );
}

/**
 * The fleet on a constrained page: a readable column instead of a full-width
 * table, with each agent as a stacked row (name and mode, then runtime and
 * destination) and dividers between rows.
 */
export function AgentsComposition() {
  return (
    <Viewport>
      <AppFrame place="agents" title="Agents" actions={<Button size="sm">New agent</Button>}>
        <div className="mx-auto w-full max-w-2xl px-(--pad) pt-2 pb-(--pad)">
          <dl className="grid grid-cols-3 gap-3">
            {[
              ["Live", "3"],
              ["Dry run", "1"],
              ["Failing", "1"],
            ].map(([label, value]) => (
              <div key={label} className="frame bg-muted/60 p-frame">
                <dt className="px-inset text-muted-foreground">{label}</dt>
                <dd className="px-inset text-2xl font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-6 grid">
            {agents.map((agent) => (
              <li
                key={agent.name}
                className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 border-b border-foreground/6 px-text py-3 last:border-b-0"
              >
                <span className="font-medium">{agent.name}</span>
                <span className="inline-flex items-center gap-2 justify-self-end">
                  <Signal tone={agent.tone} />
                  {agent.mode}
                </span>
                <span className="min-w-0 truncate text-muted-foreground">
                  {agent.runtime}
                  <span className="hidden @2xl:inline">
                    {" · "}
                    <span className="font-mono">{agent.destination}</span>
                  </span>
                </span>
                <span className="justify-self-end text-muted-foreground tabular-nums">{agent.seen}</span>
              </li>
            ))}
          </ul>
        </div>
      </AppFrame>
    </Viewport>
  );
}

function VersionsBounded() {
  return (
    <div className="concentric divide-y overflow-hidden rounded-lg bg-muted">
      {versions.map((item, index) => (
        <div key={item.version} className="flex h-(--control-h) items-center gap-3 px-text">
          <span className="w-8 shrink-0 font-mono text-muted-foreground tabular-nums">v{item.version}</span>
          <span className="min-w-0 flex-1 truncate">{item.change}</span>
          {index === 0 ? (
            <span className="flex items-center gap-2 font-medium text-success-strong">
              <Signal tone="live" />
              Live
            </span>
          ) : (
            <span className="text-muted-foreground">{item.when}</span>
          )}
        </div>
      ))}
    </div>
  );
}

/** The open list: no container, more air, and the live version marked with a signal instead of a pill. */
function VersionsOpen() {
  return (
    <ol className="grid px-text">
      {versions.map((item, index) => (
        <li key={item.version} className="flex items-baseline gap-2.5 border-b border-foreground/6 py-3 last:border-b-0">
          <span className="shrink-0 font-mono text-muted-foreground tabular-nums">v{item.version}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate">{item.change}</span>
            <span className="text-muted-foreground">{item.when}</span>
          </span>
          {index === 0 ? (
            <span className="flex items-center gap-2 font-medium text-success-strong">
              <Signal tone="live" />
              Live
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function AdminComposition() {
  const [list, setList] = useState<"open" | "bounded">("open");
  return (
    <div className="grid gap-4">
      <Choice
        label="Version list"
        value={list}
        options={[
          { value: "open", label: "Open" },
          { value: "bounded", label: "Bounded" },
        ]}
        onChange={setList}
      />
    <Viewport>
      <AppFrame
        place="admin"
        title="Admin"
        actions={
          <Badge variant="outline">
            <span className="lead"><Signal tone="wait" /></span>Elevated · 11:42 left
          </Badge>
        }
      >
        <div className="grid gap-(--pad) p-(--pad) @5xl:grid-cols-[1fr_--spacing(80)]">
          <Card>
            <CardHeader>
              <CardTitle>Routing versions</CardTitle>
              <CardDescription>Each save makes a new version. Older ones stay here.</CardDescription>
            </CardHeader>
            <CardContent>
              {list === "open" ? <VersionsOpen /> : <VersionsBounded />}
            </CardContent>
            <CardFooter>
              <Button variant="secondary">Compare</Button>
              <Button>Roll back to v13</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Elevation</CardTitle>
              <CardDescription>Admin access ends on its own.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <Progress value={78} aria-label="Time left" />
              <div className="flex h-(--control-h) items-center rounded-lg bg-muted pe-text [--lead-size:var(--control-h)]">
                <span className="lead"><KeyIcon className="size-4 text-muted-foreground" /></span>
                Passkey confirmed at 9:38 PM
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">End admin now</Button>
            </CardFooter>
          </Card>
        </div>
      </AppFrame>
    </Viewport>
    </div>
  );
}

/** A circular tonal mark: the glyph and its ground come from the same brand ramp. */
function TonalMark({ children }: { children: ReactNode }) {
  return (
    <span className="grid size-12 place-items-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
      {children}
    </span>
  );
}

/**
 * A centred auth card: the mark on top, then the title and a short line held
 * to a narrow measure, then the actions at full width. Roomier than an app
 * card because it is the only thing on the page.
 */
function AuthCard({
  mark,
  title,
  description,
  children,
}: {
  mark: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="w-full max-w-sm gap-6 py-8">
      <div className="flex flex-col items-center px-8 text-center">
        <TonalMark>{mark}</TonalMark>
        <h2 className="mt-5 text-xl font-semibold tracking-tight text-balance">{title}</h2>
        <p className="mt-2 max-w-64 text-pretty text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-3 px-8">{children}</div>
    </Card>
  );
}

export function SignInComposition() {
  return (
    <Viewport>
      <div className="grid min-h-160 place-items-center gap-(--pad) bg-muted/40 p-(--pad) @3xl:grid-cols-2">
        <AuthCard
          mark={<InboxBold className="size-6" />}
          title="Sign in to Outpost"
          description="Use your Vercel account. Outpost only reads who you are."
        >
          <Button size="lg" className="w-full">
            Continue with Vercel
          </Button>
        </AuthCard>
        <AuthCard
          mark={<ShieldKeyholeBold className="size-6" />}
          title="Approve this device?"
          description="A CLI on another computer asked to act as you."
        >
          <div className="grid gap-2">
            <Label htmlFor="code" className="justify-center">
              Code shown on that device
            </Label>
            <Input id="code" defaultValue="KXQM-7TRD" className="h-(--button-h) text-center font-mono tracking-widest [--button-h:calc(var(--spacing)*9)]" />
          </div>
          <div className="mt-1 grid gap-2">
            <Button size="lg" className="w-full">
              Approve
            </Button>
            <Button size="lg" variant="ghost" className="w-full">
              Deny
            </Button>
          </div>
        </AuthCard>
      </div>
    </Viewport>
  );
}
