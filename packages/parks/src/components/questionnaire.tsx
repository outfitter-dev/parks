"use client";

/*
 * shadcn's Questionnaire (on @shadcn/react): a form that walks one question
 * at a time, with choices, keyboard shortcuts (A–Z or 1–9 with `shortcuts`
 * on the root), progress and previous / skip / next. Asks for a person's answer use it.
 *
 * A choice is a selectable card: the checked card takes the brand ring, like
 * a selected Card. Its lead is one of three things, in this order: a `mark`
 * you pass (a glyph or letter on a tone), the shortcut letter when the root
 * has `shortcuts`, or a checkbox / radio indicator. Pass `indicator={false}`
 * to drop the indicator.
 */

import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { CheckIcon } from "@solar-icons/react/bold/check";
import * as React from "react";

import { Button } from "#components/button";
import { Mark } from "#components/mark";
import type { Tone } from "#lib/tone";
import { cnState } from "#lib/utils";

function Questionnaire({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Root>) {
  return (
    <QuestionnairePrimitive.Root
      data-slot="questionnaire"
      className={cnState("flex w-full min-w-0 flex-col gap-4", className)}
      {...props}
    />
  );
}

function QuestionnaireProgress({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Progress>) {
  return (
    <QuestionnairePrimitive.Progress
      data-slot="questionnaire-progress"
      className={cnState(
        // parks-ignore literal-length: a choice column sized in characters fits its label.
        "min-h-lh w-fit min-w-[14ch] text-xs font-medium text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    />
  );
}

function QuestionnaireItem({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Item>) {
  return (
    <QuestionnairePrimitive.Item
      data-slot="questionnaire-item"
      className={cnState(
        "flex min-w-0 flex-col gap-4 border-0 p-0 outline-none",
        className
      )}
      {...props}
    />
  );
}

function QuestionnaireTitle({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Title>) {
  return (
    <QuestionnairePrimitive.Title
      data-slot="questionnaire-title"
      className={cnState(
        "text-base leading-snug font-medium text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-4",
        className
      )}
      {...props}
    />
  );
}

function QuestionnaireDescription({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Description>) {
  return (
    <QuestionnairePrimitive.Description
      data-slot="questionnaire-description"
      className={cnState(
        "text-sm text-pretty text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

function QuestionnaireChoices({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choices>) {
  return (
    <QuestionnairePrimitive.Choices
      data-slot="questionnaire-choices"
      className={cnState(
        "group/questionnaire-choices grid min-w-0 gap-2",
        className
      )}
      {...props}
    />
  );
}

function QuestionnaireChoice({
  children,
  className,
  mark,
  tone = "neutral",
  indicator = true,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Choice> & {
  /** A lead tile in place of the shortcut letter: a glyph, letter or number. */
  mark?: React.ReactNode;
  /** The lead tile's tone. Neutral tiles turn brand once checked. */
  tone?: Tone;
  /** The checkbox / radio indicator, shown when there is no mark or shortcut. */
  indicator?: boolean;
}) {
  return (
    <QuestionnairePrimitive.Choice
      data-slot="questionnaire-choice"
      data-tone={tone}
      className={cnState(
        "group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-border-muted bg-card px-3 py-2.5 text-start text-sm transition-colors outline-none select-none hover:bg-ghost-hover has-[>input:focus-visible]:ring-2 has-[>input:focus-visible]:ring-focus-ring data-invalid:border-invalid-border data-checked:border-brand data-checked:ring-1 data-checked:ring-brand",
        "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-slot="questionnaire-choice-input"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      />
      {mark === undefined ? (
        <QuestionnairePrimitive.ChoiceShortcut
          data-slot="questionnaire-choice-shortcut"
          render={<QuestionnaireChoiceMark tone={tone} />}
        />
      ) : (
        <QuestionnaireChoiceMark tone={tone}>{mark}</QuestionnaireChoiceMark>
      )}
      {indicator && mark === undefined ? (
        <>
          {/* Two elements, not one with a radio variant: any class naming
              rounded-full opts out of the smooth-corner shape globally. */}
          <span
            aria-hidden="true"
            data-slot="questionnaire-choice-indicator"
            className="border-input bg-field group-data-checked/questionnaire-choice:border-primary group-data-checked/questionnaire-choice:bg-primary pointer-events-none mt-0.5 hidden size-4 shrink-0 items-center justify-center rounded-full border group-data-[shortcut]/questionnaire-choice:hidden! group-data-[type=radio]/questionnaire-choice:flex"
          >
            <span className="bg-primary-foreground hidden size-2 rounded-full group-data-checked/questionnaire-choice:block" />
          </span>
          <span
            aria-hidden="true"
            data-slot="questionnaire-choice-indicator"
            className="border-input bg-field text-primary-foreground group-data-checked/questionnaire-choice:border-primary group-data-checked/questionnaire-choice:bg-primary pointer-events-none mt-0.5 hidden size-4 shrink-0 items-center justify-center rounded-xs border group-data-[shortcut]/questionnaire-choice:hidden! group-data-[type=checkbox]/questionnaire-choice:flex"
          >
            <CheckIcon className="hidden size-3.5 group-data-checked/questionnaire-choice:block" />
          </span>
        </>
      ) : null}
      <QuestionnairePrimitive.ChoiceLabel
        data-slot="questionnaire-choice-label"
        className="flex min-w-0 flex-1 flex-col gap-0.5 leading-snug group-has-data-[slot=questionnaire-choice-mark]/questionnaire-choice:min-h-6 group-has-data-[slot=questionnaire-choice-mark]/questionnaire-choice:justify-center"
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
    </QuestionnairePrimitive.Choice>
  );
}

/** The lead tile of a choice: a Mark that lights up when its choice is checked. */
function QuestionnaireChoiceMark({
  className,
  tone = "neutral",
  ...props
}: React.ComponentProps<typeof Mark>) {
  return (
    <Mark
      data-slot="questionnaire-choice-mark"
      tone={tone}
      className={cnState(
        "pointer-events-none data-[tone=neutral]:bg-fill-subtle group-data-checked/questionnaire-choice:bg-tone group-data-checked/questionnaire-choice:text-tone-contrast group-data-checked/questionnaire-choice:data-[tone=neutral]:bg-brand group-data-checked/questionnaire-choice:data-[tone=neutral]:text-brand-foreground",
        className
      )}
      {...props}
    />
  );
}

function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="questionnaire-choice-description"
      className={cnState("text-muted-foreground", className)}
      {...props}
    />
  );
}

function QuestionnaireInput({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Input>) {
  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="group/questionnaire-input relative w-full min-w-0"
    >
      <QuestionnairePrimitive.Input
        data-slot="questionnaire-input"
        className={cnState(
          "h-(--control-h) w-full min-w-0 rounded-lg border border-input bg-field px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-field-disabled disabled:opacity-50 aria-invalid:border-invalid-border aria-invalid:ring-3 aria-invalid:ring-invalid-ring md:text-sm",
          "selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground",
          className
        )}
        {...props}
      />
    </div>
  );
}

function QuestionnaireError({
  className,
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Error>) {
  return (
    <QuestionnairePrimitive.Error
      data-slot="questionnaire-error"
      className={cnState("mt-2 text-sm text-destructive", className)}
      {...props}
    />
  );
}

function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cnState(
        "grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:min-h-8",
        className
      )}
      {...props}
    />
  );
}

type QuestionnaireNavProps = Pick<
  React.ComponentProps<typeof Button>,
  "size" | "variant"
>;

function QuestionnairePrevious({
  children,
  className,
  size = "default",
  variant = "secondary",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Previous> &
  QuestionnaireNavProps) {
  return (
    <QuestionnairePrimitive.Previous
      data-slot="questionnaire-previous"
      render={<Button size={size} variant={variant} />}
      className={cnState(
        "col-start-1 row-start-1 min-h-11 justify-self-start sm:min-h-0",
        className
      )}
      {...props}
    >
      {children ?? "Previous"}
    </QuestionnairePrimitive.Previous>
  );
}

function QuestionnaireSkip({
  children,
  className,
  size = "default",
  variant = "ghost",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Skip> &
  QuestionnaireNavProps) {
  return (
    <QuestionnairePrimitive.Skip
      data-slot="questionnaire-skip"
      render={<Button size={size} variant={variant} />}
      className={cnState(
        "col-start-2 row-start-1 min-h-11 justify-self-end sm:min-h-0",
        className
      )}
      {...props}
    >
      {children ?? "Skip"}
    </QuestionnairePrimitive.Skip>
  );
}

function QuestionnaireNext({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Next> &
  QuestionnaireNavProps) {
  return (
    <QuestionnairePrimitive.Next
      data-slot="questionnaire-next"
      render={<Button size={size} variant={variant} />}
      className={cnState(
        "col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0",
        className
      )}
      {...props}
    >
      {children ?? "Next"}
    </QuestionnairePrimitive.Next>
  );
}

function QuestionnaireSubmit({
  children,
  className,
  size = "default",
  variant = "default",
  ...props
}: React.ComponentProps<typeof QuestionnairePrimitive.Submit> &
  QuestionnaireNavProps) {
  return (
    <QuestionnairePrimitive.Submit
      data-slot="questionnaire-submit"
      render={<Button size={size} variant={variant} />}
      className={cnState(
        "col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0",
        className
      )}
      {...props}
    >
      {children ?? "Submit"}
    </QuestionnairePrimitive.Submit>
  );
}

export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoiceMark,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
};
