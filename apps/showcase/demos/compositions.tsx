"use client";

import { Badge } from "@outfitter/parks/components/badge";
import { Button } from "@outfitter/parks/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@outfitter/parks/components/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@outfitter/parks/components/empty";
import { Input } from "@outfitter/parks/components/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemMeta,
  ItemTitle,
} from "@outfitter/parks/components/item";
import { Label } from "@outfitter/parks/components/label";
import { Mark } from "@outfitter/parks/components/mark";
import { Progress } from "@outfitter/parks/components/progress";
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireTitle,
} from "@outfitter/parks/components/questionnaire";
import {
  SectionHeader,
  SectionHeaderDescription,
  SectionHeaderTitle,
} from "@outfitter/parks/components/section-header";
import { Textarea } from "@outfitter/parks/components/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@outfitter/parks/components/toggle-group";
import type { Tone } from "@outfitter/parks/lib/tone";
import { cn } from "@outfitter/parks/lib/utils";
import { InboxIcon as InboxDuotone } from "@solar-icons/react/bold-duotone/inbox";
import { CheckIcon as CheckBold } from "@solar-icons/react/bold/check";
import { CheckCircleIcon as CheckCircleBold } from "@solar-icons/react/bold/check-circle";
import { InboxIcon as InboxBold } from "@solar-icons/react/bold/inbox";
import { PauseIcon as PauseBold } from "@solar-icons/react/bold/pause";
import { ShieldKeyholeIcon as ShieldKeyholeBold } from "@solar-icons/react/bold/shield-keyhole";
import { AltArrowLeftIcon } from "@solar-icons/react/outline/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/outline/alt-arrow-right";
import { KeyIcon } from "@solar-icons/react/outline/key";
import { useState } from "react";
import type { ReactNode } from "react";

import { agents, asks, versions } from "#lib/fixtures";
import type { Ask } from "#lib/fixtures";

import { AppFrame, PageBar } from "./app-frame";
import { AgentModeBadge, Signal, VersionRows, Viewport } from "./kit";
import { sequoiaNavigation } from "./sequoia-navigation";
import { Stat } from "./surfaces/parts";

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
          <span className="text-muted-foreground font-normal">
            {ask.project}
          </span>
        </ItemTitle>
        <span className="ms-auto flex items-center gap-2">
          <ItemMeta className="text-xs">
            {answered ? "Answered" : ask.age}
          </ItemMeta>
          {answered ? (
            <CheckCircleBold className="text-success-strong size-3.5 shrink-0" />
          ) : (
            <span
              className="grid size-3.5 shrink-0 place-items-center"
              aria-label="Unread"
            >
              <Signal tone="new" />
            </span>
          )}
        </span>
      </ItemHeader>
      <ItemDescription
        className={cn("basis-full", !answered && "text-foreground")}
      >
        {ask.title}
      </ItemDescription>
    </Item>
  );
}

type OptionStyle = "cards" | "stacked" | "tray";
type OptionMark = "none" | "glyph" | "letter" | "number" | "yn";
type OptionTone = "neutral" | "coded";
type OptionHeader = "page" | "box";
type OptionLook = {
  style: OptionStyle;
  mark: OptionMark;
  tone: OptionTone;
  multi: boolean;
  header: OptionHeader;
};
type MarkTone = Extract<
  Tone,
  "neutral" | "success" | "warning" | "destructive" | "info" | "brand"
>;

/**
 * Mark glyphs drawn on one stroke so a check and a pause carry the same weight.
 * Solar's bold check is a thin outline while its bold pause is two solid slabs,
 * so side by side they read as different families.
 */
function MarkGlyph({ kind }: { kind: "check" | "pause" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="size-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === "check" ? (
        <path d="M5 13L9 17L19 7" />
      ) : (
        <path d="M9 6V18M15 6V18" />
      )}
    </svg>
  );
}

/** Options whose meaning has a standard sign get a glyph and a tone. Others fall back to a letter. */
const optionSigns: Record<
  string,
  { glyph: "check" | "pause"; tone: MarkTone }
> = {
  Approve: { glyph: "check", tone: "success" },
  Hold: { glyph: "pause", tone: "warning" },
};

/** Tones that letters and numbers cycle through when marks are colour coded. */
const cycleTones: readonly MarkTone[] = [
  "info",
  "brand",
  "success",
  "warning",
  "destructive",
];

/** What sits in an option's corner tile and its tone, or null for no tile. */
function markFor(
  mark: OptionMark,
  label: string,
  index: number,
  count: number
): { content: ReactNode; tone: MarkTone } | null {
  const letter = String.fromCharCode(65 + index);
  const cycled = cycleTones[index % cycleTones.length] ?? "neutral";
  switch (mark) {
    case "none": {
      return null;
    }
    case "glyph": {
      const sign = optionSigns[label];
      return sign
        ? { content: <MarkGlyph kind={sign.glyph} />, tone: sign.tone }
        : { content: letter, tone: cycled };
    }
    case "letter": {
      return { content: letter, tone: cycled };
    }
    case "number": {
      return { content: String(index + 1), tone: cycled };
    }
    case "yn": {
      return count === 2
        ? index === 0
          ? { content: "Y", tone: "success" }
          : { content: "N", tone: "destructive" }
        : { content: letter, tone: cycled };
    }
  }
}

/**
 * Where each layout puts its choices: cards in a grid, or rows in one box.
 * Tray is the stacked box set in a muted tray, so it takes the stacked rows.
 */
const stackedBox =
  "gap-0 overflow-hidden rounded-lg border border-border-muted bg-card";
const stackedRow =
  "rounded-none border-x-0 border-t-0 border-b-border-muted last:border-b-0 data-checked:border-b-border-muted data-checked:bg-brand-fill data-checked:ring-0 hover:data-checked:bg-brand-fill";
const choiceClass: Record<OptionStyle, string> = {
  cards: "",
  stacked: stackedRow,
  tray: stackedRow,
};

function OptionText({ option }: { option: Ask["options"][number] }) {
  return (
    <>
      <span className="flex min-h-6 items-center gap-2 font-medium">
        {option.label}
        {option.recommended ? <Badge>Recommended</Badge> : null}
      </span>
      <QuestionnaireChoiceDescription>
        {option.detail}
      </QuestionnaireChoiceDescription>
    </>
  );
}

/**
 * The ask's options on shadcn's Questionnaire. Letters and numbers come from
 * the questionnaire's shortcuts, so pressing the key picks the option; glyph
 * and Y/N marks are passed in. The demo strip picks the layout and marks.
 */
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
        : [label]
    );
  const shortcuts =
    look.mark === "letter"
      ? "letters"
      : look.mark === "number"
        ? "numbers"
        : undefined;
  const boxed = look.style !== "cards";
  const inBox = boxed && look.header === "box";
  const choices = (
    <QuestionnaireChoices
      aria-label="Options"
      className={boxed && !inBox ? stackedBox : boxed ? "gap-0" : undefined}
    >
      {ask.options.map((option, index) => {
        const mark = markFor(
          look.mark,
          option.label,
          index,
          ask.options.length
        );
        const tone = mark && look.tone === "coded" ? mark.tone : "neutral";
        const passMark = mark !== null && shortcuts === undefined;
        return (
          // Every option leads with a box: its mark, or a radio or checkbox
          // when there is none, so the rows never read as more header.
          <QuestionnaireChoice
            key={option.label}
            value={option.label}
            checked={picked.includes(option.label)}
            onChange={() => toggle(option.label)}
            mark={passMark ? mark.content : undefined}
            tone={tone}
            className={choiceClass[look.style]}
          >
            <OptionText option={option} />
          </QuestionnaireChoice>
        );
      })}
    </QuestionnaireChoices>
  );
  const hint =
    picked.length > 0
      ? `Posts “${picked.join(", ")}” to the thread as you.`
      : shortcuts
        ? `Pick an option, or press its ${shortcuts === "letters" ? "letter" : "number"}.`
        : look.multi
          ? "Pick any that apply."
          : "Pick an option to answer.";
  // The legend names the fieldset, so it stays its direct child. In a box the
  // visible header is a plain line above the rows, hidden from assistive tech
  // because the legend already says it.
  const body = inBox ? (
    <div className={stackedBox}>
      <p
        aria-hidden
        className="border-border w-full border-b px-3 py-2.5 text-base leading-snug font-medium text-pretty"
      >
        {ask.title}
      </p>
      {choices}
    </div>
  ) : (
    choices
  );
  const subtext = (
    <AskSubtext
      hint={hint}
      boxed={boxed}
      reply={picked.length === 0}
      onReply={(text) => onPick([text])}
    />
  );
  return (
    <Questionnaire
      shortcuts={shortcuts}
      onSubmit={(event) => event.preventDefault()}
      className="mt-5 gap-2"
    >
      <QuestionnaireItem name={ask.id} multiple={look.multi} className="gap-2">
        <QuestionnaireTitle className="sr-only">{ask.title}</QuestionnaireTitle>
        {look.style === "tray" ? (
          <Card variant="tray" className="grid">
            {body}
            {subtext}
          </Card>
        ) : (
          <>
            {body}
            {subtext}
          </>
        )}
      </QuestionnaireItem>
    </Questionnaire>
  );
}

/**
 * The line under the options: the hint, then an inline "reply in chat" that
 * opens a one-line reply in place. Under a box its text starts where the
 * rows' text starts (their padding plus the box's 1px border).
 */
function AskSubtext({
  hint,
  boxed,
  reply,
  onReply,
}: {
  hint: string;
  boxed: boolean;
  reply: boolean;
  onReply: (text: string) => void;
}) {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState("");
  const send = () => {
    if (text.trim() === "") {
      return;
    }
    onReply(text.trim());
    setReplying(false);
    setText("");
  };
  if (replying) {
    return (
      <div className="flex items-center gap-2">
        <Input
          autoFocus
          size="sm"
          placeholder="Reply in the thread…"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              send();
            }
            if (event.key === "Escape") {
              setReplying(false);
            }
          }}
        />
        <Button size="sm" variant="ghost" onClick={() => setReplying(false)}>
          Cancel
        </Button>
        <Button size="sm" disabled={text.trim() === ""} onClick={send}>
          Send
        </Button>
      </div>
    );
  }
  return (
    <p
      className={cn(
        "text-muted-foreground",
        boxed && "ps-[calc(var(--spacing)*3+1px)]"
      )}
      aria-live="polite"
    >
      {hint}
      {reply ? (
        <>
          {" "}
          Or{" "}
          <button
            type="button"
            onClick={() => setReplying(true)}
            className="text-foreground decoration-border-strong hover:decoration-foreground underline underline-offset-4"
          >
            reply in chat
          </button>
          .
        </>
      ) : null}
    </p>
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
      <p className="text-muted-foreground flex items-start gap-2">
        <Badge variant="outline" className="capitalize">
          {ask.kind}
        </Badge>
        <span className="min-h-5 leading-5">
          {ask.agent} asked {ask.age} ago
        </span>
      </p>
      {look.style !== "cards" &&
      look.header === "box" &&
      ask.kind !== "input" ? (
        // The box carries the question as its header, so the page keeps only the context.
        <p className="text-muted-foreground mt-3 text-pretty">{ask.context}</p>
      ) : (
        <SectionHeader size="lg" className="mt-3">
          <SectionHeaderTitle>{ask.title}</SectionHeaderTitle>
          <SectionHeaderDescription className="mt-2">
            {ask.context}
          </SectionHeaderDescription>
        </SectionHeader>
      )}
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
            {picked.length > 0 ? (
              <span className="text-muted-foreground">Sent</span>
            ) : null}
            <Button
              disabled={reply.trim() === ""}
              onClick={() => onPick([reply.trim()])}
            >
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
  const done = asks.filter(
    (item) => (answers[item.id] ?? []).length > 0
  ).length;
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
                  answered
                    ? "bg-brand"
                    : "bg-fill-strong group-hover:bg-border-strong",
                  index === current && "h-3",
                  index === current && !answered && "bg-fg-subtle"
                )}
              />
            </button>
          );
        })}
      </div>
      <p className="text-muted-foreground flex text-xs tabular-nums">
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
        size="sm"
        aria-label={label}
        value={[value]}
        onValueChange={(next) => {
          const found = options.find((option) => option.value === next[0]);
          if (found) {
            onChange(found.value);
          }
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
  const [look, setLook] = useState<OptionLook>({
    style: "cards",
    mark: "none",
    tone: "neutral",
    multi: false,
    header: "page",
  });
  const index = Math.max(
    0,
    asks.findIndex((item) => item.id === selected)
  );
  const ask = asks[index];
  const replied = asks.filter((item) => (answers[item.id] ?? []).length > 0);
  const done = replied.length;
  const open = (next: number) => {
    const target = asks[next];
    if (!target) {
      return;
    }
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
          label="Header"
          value={look.header}
          options={[
            { value: "page", label: "Page" },
            { value: "box", label: "In box" },
          ]}
          onChange={(header) => setLook({ ...look, header })}
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
        <AppFrame navigation={sequoiaNavigation} place="needs-you">
          <div className="grid h-full @3xl:grid-cols-[minmax(--spacing(64),--spacing(88))_1fr]">
            <div
              className={cn(
                "flex flex-col @3xl:border-r",
                screen === "ask" && "@max-3xl:hidden"
              )}
            >
              <PageBar title="Needs you" className="pe-2">
                <ToggleGroup
                  aria-label="Show"
                  value={[view]}
                  onValueChange={(next) => {
                    if (next[0] === "open" || next[0] === "answered") {
                      setView(next[0]);
                    }
                  }}
                >
                  <ToggleGroupItem value="open">Open</ToggleGroupItem>
                  <ToggleGroupItem value="answered">Answered</ToggleGroupItem>
                </ToggleGroup>
              </PageBar>
              {view === "answered" && done > 0 ? (
                <div className="p-2 pt-0">
                  {replied.map((item) => (
                    <AskRow
                      key={item.id}
                      ask={item}
                      active={false}
                      answered
                      onSelect={() => {
                        setView("open");
                        open(asks.indexOf(item));
                      }}
                    />
                  ))}
                </div>
              ) : null}
              {view === "answered" && done === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia>
                      <Mark size="lg">
                        <InboxDuotone />
                      </Mark>
                    </EmptyMedia>
                    <EmptyTitle>Nothing answered yet today</EmptyTitle>
                    <EmptyDescription>
                      Asks you reply to move here, with the reply attached.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : null}
              {view === "open" ? (
                <>
                  <p className="text-muted-foreground px-4 pb-2 text-xs tabular-nums @3xl:hidden">
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
              ) : null}
            </div>
            {view === "open" && ask ? (
              <div
                className={cn(
                  "flex min-h-160 flex-col @3xl:min-h-0",
                  screen === "list" && "@max-3xl:hidden"
                )}
              >
                <div className="grid gap-3 px-2 pb-3 @3xl:hidden">
                  <div className="flex h-14 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setScreen("list")}
                    >
                      <AltArrowLeftIcon data-icon="inline-start" />
                      All asks
                    </Button>
                    <span className="text-muted-foreground ml-auto pe-2 tabular-nums">
                      {index + 1} of {asks.length}
                    </span>
                  </div>
                  <div className="px-2">
                    <AskProgress
                      current={index}
                      answers={answers}
                      onJump={open}
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <AskDetail
                    key={`${ask.id}-${look.mark}-${look.multi}`}
                    ask={ask}
                    look={look}
                    picked={answers[ask.id] ?? []}
                    onPick={(next) =>
                      setAnswers({ ...answers, [ask.id]: next })
                    }
                  />
                </div>
                <div className="bg-background sticky bottom-0 flex items-center gap-2 border-t p-2 @3xl:hidden">
                  <Button
                    variant="ghost"
                    disabled={index === 0}
                    onClick={() => open(index - 1)}
                  >
                    <AltArrowLeftIcon data-icon="inline-start" />
                    Previous
                  </Button>
                  {last ? (
                    <Button
                      className="ml-auto"
                      variant={answered ? "default" : "secondary"}
                      onClick={() => setScreen("list")}
                    >
                      {done === asks.length ? "Done" : "Back to list"}
                    </Button>
                  ) : (
                    <Button
                      className="ml-auto"
                      variant={answered ? "default" : "secondary"}
                      onClick={() => open(index + 1)}
                    >
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
      <AppFrame
        navigation={sequoiaNavigation}
        place="agents"
        title="Agents"
        actions={<Button size="sm">New agent</Button>}
      >
        <div className="mx-auto w-full max-w-2xl px-(--pad) pt-2 pb-(--pad)">
          <dl className="grid grid-cols-3 gap-3">
            <Stat label="Live" value="3" />
            <Stat label="Dry run" value="1" />
            <Stat label="Failing" value="1" />
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
          navigation={sequoiaNavigation}
          place="admin"
          title="Admin"
          actions={
            <Badge tone="warning" dot>
              Elevated · 11:42 left
            </Badge>
          }
        >
          <div className="grid gap-(--pad) p-(--pad) @5xl:grid-cols-[1fr_--spacing(80)]">
            <Card>
              <CardHeader>
                <CardTitle>Routing versions</CardTitle>
                <CardDescription>
                  Each save makes a new version. Older ones stay here.
                </CardDescription>
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
                  <ItemMedia variant="icon">
                    <KeyIcon className="text-muted-foreground" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="font-normal">
                      Passkey confirmed at 9:38 PM
                    </ItemTitle>
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
      <EmptyHeader className="mx-auto px-8">
        <EmptyMedia className="mb-3">
          <TonalMark>{mark}</TonalMark>
        </EmptyMedia>
        <EmptyTitle
          render={<h2 />}
          className="text-xl font-semibold text-balance"
        >
          {title}
        </EmptyTitle>
        <EmptyDescription className="max-w-64 leading-normal">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      <div className="grid gap-3 px-8">{children}</div>
    </Card>
  );
}

export function SignInComposition() {
  return (
    <Viewport>
      <div className="bg-fill-subtle grid min-h-160 place-items-center gap-(--pad) p-(--pad) @3xl:grid-cols-2">
        <AuthCard
          mark={<InboxBold className="size-6" />}
          title="Sign in to Sequoia"
          description="Use your Vercel account. Sequoia only reads who you are."
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
            <Input
              id="code"
              defaultValue="KXQM-7TRD"
              className="h-(--button-h) text-center font-mono tracking-widest [--button-h:calc(var(--spacing)*9)]"
            />
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
