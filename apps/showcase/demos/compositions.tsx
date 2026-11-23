"use client";

import { useState, type ReactNode } from "react";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemHeader, ItemMedia, ItemMeta, ItemTitle } from "@workspace/ui/components/item";
import { Badge } from "@workspace/ui/components/badge";
import { Mark } from "@workspace/ui/components/mark";
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
import { Label } from "@workspace/ui/components/label";
import { Progress } from "@workspace/ui/components/progress";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import type { Tone } from "@workspace/ui/lib/tone";
import { cn } from "@workspace/ui/lib/utils";
import { KeyIcon } from "@solar-icons/react/outline/key";
import { AltArrowLeftIcon } from "@solar-icons/react/outline/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/outline/alt-arrow-right";
import { InboxIcon as InboxBold } from "@solar-icons/react/bold/inbox";
import { ShieldKeyholeIcon as ShieldKeyholeBold } from "@solar-icons/react/bold/shield-keyhole";
import { CheckCircleIcon as CheckCircleBold } from "@solar-icons/react/bold/check-circle";
import { CheckIcon as CheckBold } from "@solar-icons/react/bold/check";
import { PauseIcon as PauseBold } from "@solar-icons/react/bold/pause";
import { agents, asks, versions, type Ask } from "#lib/fixtures";
import { AppFrame, SidebarToggle } from "./app-frame";
import { AgentModeBadge, Signal, VersionRows, Viewport } from "./kit";
import { outpostNavigation } from "./outpost-navigation";

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
    <Item
      render={<button type="button" />}
      size="sm"
      onClick={onSelect}
      aria-pressed={active}
      className={cn("gap-y-1", active && "@3xl:bg-fill")}
    >
      <ItemHeader>
        <ItemTitle className="gap-2">
          {ask.agent}
          <span className="font-normal text-muted-foreground">{ask.project}</span>
        </ItemTitle>
        <span className="ms-auto flex items-center gap-2">
          <ItemMeta className="text-xs">{answered ? "Answered" : ask.age}</ItemMeta>
          {answered ? (
            <CheckCircleBold className="size-3.5 shrink-0 text-success-strong" />
          ) : (
            <span className="grid size-3.5 shrink-0 place-items-center" aria-label="Unread">
              <Signal tone="new" />
            </span>
          )}
        </span>
      </ItemHeader>
      <ItemDescription className={cn("basis-full", !answered && "text-foreground")}>{ask.title}</ItemDescription>
    </Item>
  );
}

type OptionStyle = "cards" | "stacked" | "tray";
type OptionMark = "none" | "glyph" | "letter" | "number" | "yn";
type OptionTone = "neutral" | "coded";
type OptionLook = { style: OptionStyle; mark: OptionMark; tone: OptionTone; multi: boolean };
type MarkTone = Extract<Tone, "neutral" | "success" | "warning" | "destructive" | "info" | "brand">;

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
 * Tiles read the tone roles, so light and dark come from the theme.
 * Unpicked is the tone's fill with its foreground mark; picked is the strong
 * tone with its contrast mark. Neutral is used when marks are not colour
 * coded: a fainter fill, and the brand once picked.
 */
/** A bounded tile in the option's top-left corner, light until its option is picked. */
function OptionTile({ picked, tone, children }: { picked: boolean; tone: MarkTone; children: ReactNode }) {
  return (
    <Mark
      aria-hidden
      tone={picked && tone === "neutral" ? "brand" : tone}
      selected={picked}
      className={cn(!picked && tone === "neutral" && "bg-fill-subtle")}
    >
      {children}
    </Mark>
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
        {option.recommended ? <Badge>Recommended</Badge> : null}
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
            ? "frame divide-y overflow-hidden bg-card p-0 shadow-(--shadow-frame) ring-1 ring-border-muted"
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
                  ? "p-frame hover:bg-ghost-hover"
                  : cn(
                      "frame bg-card p-frame shadow-(--shadow-frame) ring-1 ring-border-muted hover:ring-border-strong",
                      // Concentric with the tray: its radius less the tray's padding.
                      tray && "rounded-[calc(var(--tray-radius)*var(--corner-scale))]",
                    ),
                stacked && isPicked && "bg-brand-fill hover:bg-brand-fill",
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
                  answered ? "bg-brand" : "bg-fill-strong group-hover:bg-border-strong",
                  index === current && "h-3",
                  index === current && !answered && "bg-fg-subtle",
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
        <AppFrame navigation={outpostNavigation} place="needs-you">
          <div className="grid h-full @3xl:grid-cols-[minmax(--spacing(64),--spacing(88))_1fr]">
            <div className={cn("flex flex-col @3xl:border-r", screen === "ask" && "@max-3xl:hidden")}>
              <div className="flex h-14 shrink-0 items-center gap-1.5 ps-3 pe-2">
                <SidebarToggle />
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
                  <div className="flex h-14 items-center gap-1">
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
      <AppFrame navigation={outpostNavigation} place="agents" title="Agents" actions={<Button size="sm">New agent</Button>}>
        <div className="mx-auto w-full max-w-2xl px-(--pad) pt-2 pb-(--pad)">
          <dl className="grid grid-cols-3 gap-3">
            {[
              ["Live", "3"],
              ["Dry run", "1"],
              ["Failing", "1"],
            ].map(([label, value]) => (
              <div key={label} className="frame bg-panel-fill p-frame">
                <dt className="px-inset text-muted-foreground">{label}</dt>
                <dd className="px-inset text-2xl font-semibold tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          <ItemGroup variant="list" className="mt-6">
            {agents.map((agent) => (
              <Item key={agent.name} size="sm" className="px-text">
                <ItemContent>
                  <ItemTitle>{agent.name}</ItemTitle>
                  <ItemDescription className="truncate">
                    {agent.runtime}
                    <span className="hidden @2xl:inline">
                      {" · "}
                      <span className="font-mono">{agent.destination}</span>
                    </span>
                  </ItemDescription>
                </ItemContent>
                <ItemMeta>{agent.seen}</ItemMeta>
                <ItemActions className="self-start">
                  <AgentModeBadge tone={agent.tone} mode={agent.mode} />
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </AppFrame>
    </Viewport>
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
        navigation={outpostNavigation}
        place="admin"
        title="Admin"
        actions={
          <Badge tone="warning" dot>Elevated · 11:42 left</Badge>
        }
      >
        <div className="grid gap-(--pad) p-(--pad) @5xl:grid-cols-[1fr_--spacing(80)]">
          <Card>
            <CardHeader>
              <CardTitle>Routing versions</CardTitle>
              <CardDescription>Each save makes a new version. Older ones stay here.</CardDescription>
            </CardHeader>
            <CardContent>
              <VersionRows variant={list === "open" ? "list" : "bounded"} />
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
              <Item variant="muted" size="xs">
                <ItemMedia variant="icon"><KeyIcon className="text-muted-foreground" /></ItemMedia>
                <ItemContent>
                  <ItemTitle className="font-normal">Passkey confirmed at 9:38 PM</ItemTitle>
                </ItemContent>
              </Item>
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
    <Mark tone="brand" size="xl" shape="circle">
      {children}
    </Mark>
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
      <div className="grid min-h-160 place-items-center gap-(--pad) bg-fill-subtle p-(--pad) @3xl:grid-cols-2">
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
