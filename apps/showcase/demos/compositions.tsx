"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardAction,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { Textarea } from "@workspace/ui/components/textarea";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import { cn } from "@workspace/ui/lib/utils";
import { ChatRoundDotsIcon } from "@solar-icons/react/linear/chat-round-dots";
import { HistoryIcon } from "@solar-icons/react/linear/history";
import { InboxIcon } from "@solar-icons/react/linear/inbox";
import { KeyIcon } from "@solar-icons/react/linear/key";
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

/** The app frame: a quiet sidebar, a top bar and the page. */
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
  return (
    <div className="flex min-h-160 bg-background text-foreground">
      <aside className="hidden w-56 shrink-0 flex-col border-r bg-muted/40 p-2 @3xl:flex">
        <div className="flex items-center gap-2 px-2 py-2 font-semibold">
          <span className="grid size-6 place-items-center rounded-md bg-brand text-xs text-brand-foreground">O</span>
          Outpost
        </div>
        <button
          type="button"
          className="mt-1 mb-2 flex h-(--control-h) items-center gap-2 rounded-lg border bg-background px-2 text-muted-foreground"
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
                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-muted-foreground hover:bg-accent hover:text-foreground",
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
        <div className="mt-auto flex items-center gap-2 rounded-lg px-2 py-2 text-muted-foreground">
          <span className="grid size-6 place-items-center rounded-full bg-muted text-xs">MG</span>
          Matt
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        {bare ? null : (
          <header className="flex h-12 items-center gap-3 px-4">
            <h1 className="font-semibold">{title}</h1>
            <div className="ml-auto flex items-center gap-2">{actions}</div>
          </header>
        )}
        <div className="min-h-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

function AskRow({ ask, active, onSelect }: { ask: Ask; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left hover:bg-accent",
        active && "bg-accent",
      )}
    >
      <span className="flex items-center gap-2 text-muted-foreground">
        <Signal tone="wait" />
        <span className="font-medium text-foreground">{ask.agent}</span>
        <span>· {ask.project}</span>
        <span className="ml-auto text-xs tabular-nums">{ask.age}</span>
      </span>
      <span className="line-clamp-2">{ask.title}</span>
    </button>
  );
}

type OptionStyle = "cards" | "stacked";
type OptionMark = "none" | "glyph" | "letter" | "number" | "yn";
type OptionLook = { style: OptionStyle; mark: OptionMark; multi: boolean };

/** Glyphs for options whose meaning has a standard sign. Others fall back to a letter. */
const optionGlyphs: Record<string, typeof CheckBold> = { Approve: CheckBold, Hold: PauseBold };

/** What sits in an option's corner tile, or null for no tile. */
function markFor(mark: OptionMark, label: string, index: number, count: number): ReactNode {
  const letter = String.fromCharCode(65 + index);
  switch (mark) {
    case "none":
      return null;
    case "glyph": {
      const Glyph = optionGlyphs[label];
      return Glyph ? <Glyph className="size-3.5" /> : letter;
    }
    case "letter":
      return letter;
    case "number":
      return String(index + 1);
    case "yn":
      return count === 2 ? (index === 0 ? "Y" : "N") : letter;
  }
}

/**
 * A bounded tile in the option's top-left corner. Neutral until its option is
 * picked; picked, it turns a dark brand tone with a light tonal mark.
 */
function OptionTile({ picked, children }: { picked: boolean; children: ReactNode }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-md text-xs font-semibold tabular-nums transition-colors",
        picked ? "bg-brand-700 text-brand-100" : "bg-foreground/6 text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

function OptionText({ option }: { option: Ask["options"][number] }) {
  return (
    <span className="grid min-w-0 gap-0.5">
      <span className="flex min-h-6 items-center gap-2 font-medium">
        {option.label}
        {option.recommended ? <Badge variant="secondary">Recommended</Badge> : null}
      </span>
      <span className="text-muted-foreground">{option.detail}</span>
    </span>
  );
}

function AskOptions({ ask, look }: { ask: Ask; look: OptionLook }) {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (label: string) =>
    setPicked((current) =>
      look.multi
        ? current.includes(label)
          ? current.filter((item) => item !== label)
          : [...current, label]
        : [label],
    );
  const stacked = look.style === "stacked";
  return (
    <div className="mt-5 grid gap-2">
      <div
        role={look.multi ? "group" : "radiogroup"}
        aria-label="Options"
        className={cn(
          stacked
            ? "frame divide-y overflow-hidden bg-card p-0 shadow-(--shadow-frame) ring-1 ring-foreground/10"
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
                  : "frame bg-card p-frame shadow-(--shadow-frame) ring-1 ring-foreground/10 hover:ring-foreground/25",
                stacked && isPicked && "bg-brand-50 hover:bg-brand-50 dark:bg-brand-950/50 dark:hover:bg-brand-950/50",
                !stacked && isPicked && "ring-2 ring-brand hover:ring-brand",
                mark === null && "px-inset",
              )}
            >
              {mark === null ? null : <OptionTile picked={isPicked}>{mark}</OptionTile>}
              <OptionText option={option} />
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

function AskDetail({ ask, look }: { ask: Ask; look: OptionLook }) {
  return (
    <div className="mx-auto w-full max-w-xl p-(--pad) @3xl:p-6">
      <p className="flex items-center gap-2 text-muted-foreground">
        <Badge variant="outline" className="capitalize">
          {ask.kind}
        </Badge>
        {ask.agent} asked {ask.age} ago
      </p>
      <h2 className="mt-3 text-lg font-semibold tracking-tight">{ask.title}</h2>
      <p className="mt-2 text-muted-foreground">{ask.context}</p>
      {ask.kind === "input" ? (
        <div className="mt-5 grid gap-2">
          <Label htmlFor="reply">Your reply</Label>
          <Textarea id="reply" placeholder="Use the ubuntu-24 runner image…" />
          <div className="flex justify-end">
            <Button>Send reply</Button>
          </div>
        </div>
      ) : (
        <AskOptions key={`${look.mark}-${look.multi}`} ask={ask} look={look} />
      )}
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
  const [look, setLook] = useState<OptionLook>({ style: "cards", mark: "none", multi: false });
  const ask = asks.find((item) => item.id === selected) ?? asks[0];
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <Choice
          label="Options"
          value={look.style}
          options={[
            { value: "cards", label: "Cards" },
            { value: "stacked", label: "Stacked" },
          ]}
          onChange={(style) => setLook({ ...look, style })}
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
          onChange={(next) => setLook({ ...look, multi: next === "multi" })}
        />
      </div>
      <Viewport>
        <AppFrame place="needs-you" title="Needs you" bare>
          <div className="grid h-full @3xl:grid-cols-[minmax(--spacing(64),--spacing(88))_1fr]">
            <div className="flex flex-col border-b @3xl:border-r @3xl:border-b-0">
              <div className="flex h-12 shrink-0 items-center gap-2 ps-4 pe-2">
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
                <div className="p-2 pt-0">
                  {asks.map((item) => (
                    <AskRow key={item.id} ask={item} active={item.id === ask?.id} onSelect={() => setSelected(item.id)} />
                  ))}
                </div>
              )}
            </div>
            {view === "open" && ask ? <AskDetail key={ask.id} ask={ask} look={look} /> : null}
          </div>
        </AppFrame>
      </Viewport>
    </div>
  );
}

export function AgentsComposition() {
  return (
    <Viewport>
      <AppFrame place="agents" title="Agents" actions={<Button size="sm">New agent</Button>}>
        <div className="grid gap-3 p-(--pad) @2xl:grid-cols-3">
          {[
            ["Live", "3"],
            ["Dry run", "1"],
            ["Failing", "1"],
          ].map(([label, value]) => (
            <Card key={label} size="sm">
              <CardHeader>
                <CardDescription>{label}</CardDescription>
                <CardTitle className="text-2xl tabular-nums">{value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-(--pad)">Agent</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead className="hidden @2xl:table-cell">Destination</TableHead>
              <TableHead className="pr-(--pad) text-right">Last seen</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents.map((agent) => (
              <TableRow key={agent.name}>
                <TableCell className="pl-(--pad) font-medium">{agent.name}</TableCell>
                <TableCell className="text-muted-foreground">{agent.runtime}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-2">
                    <Signal tone={agent.tone} />
                    {agent.mode}
                  </span>
                </TableCell>
                <TableCell className="hidden font-mono text-muted-foreground @2xl:table-cell">{agent.destination}</TableCell>
                <TableCell className="pr-(--pad) text-right text-muted-foreground">{agent.seen}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AppFrame>
    </Viewport>
  );
}

function VersionsBounded() {
  return (
    <div className="concentric divide-y overflow-hidden rounded-lg bg-muted">
      {versions.map((item, index) => (
        <div key={item.version} className="flex h-(--control-h) items-center gap-3 px-text">
          <span className="font-mono text-muted-foreground">v{item.version}</span>
          <span className="min-w-0 flex-1 truncate">{item.change}</span>
          {index === 0 ? <Badge variant="success">Live</Badge> : <span className="text-muted-foreground">{item.when}</span>}
        </div>
      ))}
    </div>
  );
}

/** The open list: no container, more air, and the live version marked with a signal instead of a pill. */
function VersionsOpen() {
  return (
    <ol className="grid">
      {versions.map((item, index) => (
        <li key={item.version} className="flex items-baseline gap-4 border-b border-foreground/6 py-3 last:border-b-0">
          <span className="w-8 shrink-0 font-mono text-muted-foreground">v{item.version}</span>
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
            <CardContent className={cn(list === "open" && "px-inset")}>
              {list === "open" ? <VersionsOpen /> : <VersionsBounded />}
            </CardContent>
            <CardFooter>
              <Button variant="ghost">Compare</Button>
              <Button variant="outline">Roll back to v13</Button>
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
              <Button variant="outline" className="w-full">
                End admin now
              </Button>
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
    <span className="grid size-9 place-items-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
      {children}
    </span>
  );
}

export function SignInComposition() {
  return (
    <Viewport>
      <div className="grid min-h-160 place-items-center gap-(--pad) bg-muted/40 p-(--pad) @3xl:grid-cols-2">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-lg">Sign in to Outpost</CardTitle>
            <CardDescription>Use your Vercel account. Outpost only reads who you are.</CardDescription>
            <CardAction>
              <TonalMark>
                <InboxBold className="size-4.5" />
              </TonalMark>
            </CardAction>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Continue with Vercel</Button>
          </CardContent>
        </Card>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-lg">Approve this device?</CardTitle>
            <CardDescription>A CLI on another computer asked to act as you.</CardDescription>
            <CardAction>
              <TonalMark>
                <ShieldKeyholeBold className="size-4.5" />
              </TonalMark>
            </CardAction>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Label htmlFor="code" className="ps-text">Code shown on that device</Label>
            <Input id="code" defaultValue="KXQM-7TRD" className="font-mono tracking-widest" />
          </CardContent>
          <CardFooter>
            <Button className="flex-1">Approve</Button>
            <Button variant="secondary" className="flex-1">
              Deny
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Viewport>
  );
}
