"use client";

/*
 * AskQueue, from the Parks registry: a queue of questions waiting on a
 * person. The list sits beside the open ask on a wide container; on a narrow
 * one the list and the ask are two screens, with a progress strip and
 * previous / next. Choice asks use the Ask block (stacked or tray, with
 * shortcuts); input asks take a written reply. Open lists every ask, marking
 * the answered ones; Answered lists only those. Answers stay in the queue and
 * are reported through `onAnswer`.
 */

import { Badge } from "@outfitter/parks/components/badge";
import { Button } from "@outfitter/parks/components/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@outfitter/parks/components/empty";
import {
  Item,
  ItemDescription,
  ItemHeader,
  ItemMeta,
  ItemTitle,
} from "@outfitter/parks/components/item";
import { Label } from "@outfitter/parks/components/label";
import { StatusDot } from "@outfitter/parks/components/status-dot";
import { Textarea } from "@outfitter/parks/components/textarea";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@outfitter/parks/components/toggle-group";
import { cn } from "@outfitter/parks/lib/utils";
import { CheckCircleIcon } from "@solar-icons/react/bold/check-circle";
import { AltArrowLeftIcon } from "@solar-icons/react/outline/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/outline/alt-arrow-right";
import { useState } from "react";
import type { ReactNode } from "react";

import { Ask } from "../ask/ask";
import type { AskOption } from "../ask/ask";

type QueueAsk = {
  id: string;
  /** The question. */
  title: string;
  /** Who or what asked, shown first in the row. */
  from: string;
  /** A second label beside `from`, such as a project. */
  source?: string;
  /** How long ago it was asked. */
  age: string;
  /** A short label for the kind of ask, shown as a badge. */
  kind?: string;
  /** Background for the person answering. */
  context?: ReactNode;
  /** Choices; an ask without options takes a written reply. */
  options?: readonly AskOption[];
  multiple?: boolean;
};

type AskQueueProps = {
  asks: readonly QueueAsk[];
  title?: ReactNode;
  /** Placed before the title, such as an app shell's sidebar toggle. */
  start?: ReactNode;
  layout?: "stacked" | "tray";
  shortcuts?: "letters" | "numbers";
  onAnswer?: (id: string, answer: string[]) => void;
  className?: string;
};

function QueueRow({
  ask,
  active,
  answered,
  onSelect,
}: {
  ask: QueueAsk;
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
          {ask.from}
          {ask.source ? (
            <span className="text-muted-foreground font-normal">
              {ask.source}
            </span>
          ) : null}
        </ItemTitle>
        <span className="ms-auto flex items-center gap-2">
          <ItemMeta className="text-xs">
            {answered ? "Answered" : ask.age}
          </ItemMeta>
          {answered ? (
            <CheckCircleIcon className="text-success-strong size-3.5 shrink-0" />
          ) : (
            <span className="grid size-3.5 shrink-0 place-items-center">
              <StatusDot tone="info" label="Unread" />
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

function QueueProgress({
  asks,
  current,
  answers,
  onJump,
}: {
  asks: readonly QueueAsk[];
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

function WrittenReply({
  ask,
  answer,
  onAnswer,
}: {
  ask: QueueAsk;
  answer: readonly string[];
  onAnswer: (answer: string[]) => void;
}) {
  const [text, setText] = useState(answer[0] ?? "");
  const id = `reply-${ask.id}`;
  return (
    <div className="mt-5 grid gap-2">
      <Label htmlFor={id}>Your reply</Label>
      <Textarea
        id={id}
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
      <div className="flex items-center justify-end gap-3">
        {answer.length > 0 ? (
          <span className="text-muted-foreground">Sent</span>
        ) : null}
        <Button
          disabled={text.trim() === ""}
          onClick={() => onAnswer([text.trim()])}
        >
          Send reply
        </Button>
      </div>
    </div>
  );
}

function QueueDetail({
  ask,
  answer,
  layout,
  shortcuts,
  onAnswer,
}: {
  ask: QueueAsk;
  answer: readonly string[];
  layout: AskQueueProps["layout"];
  shortcuts: AskQueueProps["shortcuts"];
  onAnswer: (answer: string[]) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-xl p-(--pad) @3xl:p-6">
      <p className="text-muted-foreground flex items-start gap-2">
        {ask.kind ? (
          <Badge variant="outline" className="capitalize">
            {ask.kind}
          </Badge>
        ) : null}
        <span className="min-h-5 leading-5">
          {ask.from} asked {ask.age} ago
        </span>
      </p>
      {ask.context ? (
        <div className="text-muted-foreground mt-3 text-pretty">
          {ask.context}
        </div>
      ) : null}
      {ask.options && ask.options.length > 0 ? (
        <Ask
          key={ask.id}
          className="mt-5"
          name={ask.id}
          question={ask.title}
          options={ask.options}
          multiple={ask.multiple}
          layout={layout}
          shortcuts={shortcuts}
          defaultValue={answer}
          onPick={onAnswer}
        />
      ) : (
        <>
          <p className="mt-3 text-base font-medium text-pretty">{ask.title}</p>
          <WrittenReply
            key={ask.id}
            ask={ask}
            answer={answer}
            onAnswer={onAnswer}
          />
        </>
      )}
    </div>
  );
}

export function AskQueue({
  asks,
  title = "Asks",
  start,
  layout = "stacked",
  shortcuts,
  onAnswer,
  className,
}: AskQueueProps) {
  const [view, setView] = useState<"open" | "answered">("open");
  const [selected, setSelected] = useState(asks[0]?.id);
  /** Which of the two narrow screens shows. Wide containers show both. */
  const [screen, setScreen] = useState<"list" | "ask">("list");
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const index = Math.max(
    0,
    asks.findIndex((item) => item.id === selected)
  );
  const ask = asks[index];
  const isAnswered = (id: string) => (answers[id] ?? []).length > 0;
  const done = asks.filter((item) => isAnswered(item.id)).length;
  const answered = ask ? isAnswered(ask.id) : false;
  const last = index === asks.length - 1;
  const open = (next: number) => {
    const target = asks[next];
    if (target) {
      setSelected(target.id);
      setScreen("ask");
    }
  };
  const answer = (id: string, next: string[]) => {
    setAnswers((current) => ({ ...current, [id]: next }));
    onAnswer?.(id, next);
  };
  const shown =
    view === "answered" ? asks.filter((item) => isAnswered(item.id)) : asks;

  return (
    // The query container wraps the grid: an element can't query its own width.
    <div className={cn("@container h-full", className)}>
      <div className="grid h-full @3xl:grid-cols-[minmax(--spacing(64),--spacing(88))_1fr]">
        <div
          className={cn(
            "flex flex-col @3xl:border-r",
            screen === "ask" && "@max-3xl:hidden"
          )}
        >
          <div className="flex min-h-14 items-center gap-1.5 ps-3 pe-2">
            {start}
            <h2 className="min-w-0 truncate font-semibold">{title}</h2>
            <ToggleGroup
              aria-label="Show"
              className="ms-auto"
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
          </div>
          {shown.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>
                  {view === "answered"
                    ? "Nothing answered yet"
                    : "Nothing waiting"}
                </EmptyTitle>
                <EmptyDescription>
                  {view === "answered"
                    ? "Asks you answer move here, with the answer attached."
                    : "New asks appear here."}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <p className="text-muted-foreground px-4 pb-2 text-xs tabular-nums @3xl:hidden">
                {done} of {asks.length} answered
              </p>
              <div className="p-2 pt-0">
                {shown.map((item) => (
                  <QueueRow
                    key={item.id}
                    ask={item}
                    active={item.id === ask?.id}
                    answered={isAnswered(item.id)}
                    onSelect={() => open(asks.indexOf(item))}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        {ask ? (
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
                <QueueProgress
                  asks={asks}
                  current={index}
                  answers={answers}
                  onJump={open}
                />
              </div>
            </div>
            <div className="flex-1">
              <QueueDetail
                key={ask.id}
                ask={ask}
                answer={answers[ask.id] ?? []}
                layout={layout}
                shortcuts={shortcuts}
                onAnswer={(next) => answer(ask.id, next)}
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
    </div>
  );
}

export type { AskQueueProps, QueueAsk };
