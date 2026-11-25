"use client";

/*
 * QuestionnaireForm: a question with choices in the Questionnaire family.
 * The question heads a box of stacked rows. Every row leads with a box: its
 * letter or number when `shortcuts` is set (and pressing the key picks it),
 * otherwise a radio button, or a checkbox when `multiple`. The line under the
 * box gives the hint, or what will be posted once something is picked.
 * `layout="tray"` sets the box and line in a muted tray.
 */

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

import { Badge } from "#components/badge";
import { Card } from "#components/card";
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireTitle,
} from "#components/questionnaire-base";
import { cnState } from "#lib/utils";

type QuestionnaireOption = {
  label: string;
  detail?: ReactNode;
  recommended?: boolean;
};

type QuestionnaireFormProps = {
  /** Names the form field, so a page with several asks keeps them apart. */
  name: string;
  question: string;
  options: readonly QuestionnaireOption[];
  multiple?: boolean;
  shortcuts?: "letters" | "numbers";
  layout?: "stacked" | "tray";
  /** Labels picked when the ask first renders, such as an earlier answer. */
  defaultValue?: readonly string[];
  /** Called with the picked labels whenever the selection changes. */
  onPick?: (picked: string[]) => void;
  /** Replaces the default hint under the box. */
  hint?: ReactNode;
  className?: string;
};

function defaultHint(
  picked: readonly string[],
  multiple: boolean,
  shortcuts: QuestionnaireFormProps["shortcuts"]
) {
  if (picked.length > 0) {
    return `Posts “${picked.join(", ")}” as your answer.`;
  }
  if (shortcuts) {
    return `Pick an option, or press its ${shortcuts === "letters" ? "letter" : "number"}.`;
  }
  return multiple ? "Pick any that apply." : "Pick an option to answer.";
}

export function QuestionnaireForm({
  name,
  question,
  options,
  multiple = false,
  shortcuts,
  layout = "stacked",
  defaultValue = [],
  onPick,
  hint,
  className,
}: QuestionnaireFormProps) {
  const [picked, setPicked] = useState<string[]>([...defaultValue]);
  const toggle = (label: string) => {
    let next = [label];
    if (multiple) {
      next = picked.includes(label)
        ? picked.filter((item) => item !== label)
        : [...picked, label];
    }
    setPicked(next);
    onPick?.(next);
  };

  const box = (
    <div className="border-border-muted bg-card overflow-hidden rounded-lg border">
      {/* The legend below names the fieldset; this line is what people see. */}
      <p
        aria-hidden
        className="border-border border-b px-3 py-2.5 text-base leading-snug font-medium text-pretty"
      >
        {question}
      </p>
      <QuestionnaireChoices aria-label="Options" variant="list">
        {options.map((option) => (
          <QuestionnaireChoice
            key={option.label}
            value={option.label}
            checked={picked.includes(option.label)}
            onChange={() => toggle(option.label)}
          >
            <span className="flex min-h-6 items-center gap-2 font-medium">
              {option.label}
              {option.recommended ? <Badge>Recommended</Badge> : null}
            </span>
            {option.detail ? (
              <QuestionnaireChoiceDescription>
                {option.detail}
              </QuestionnaireChoiceDescription>
            ) : null}
          </QuestionnaireChoice>
        ))}
      </QuestionnaireChoices>
    </div>
  );
  const line = (
    <p
      className="text-muted-foreground ps-[calc(var(--spacing)*3+1px)]"
      aria-live="polite"
    >
      {hint ?? defaultHint(picked, multiple, shortcuts)}
    </p>
  );

  return (
    <Questionnaire
      shortcuts={shortcuts}
      onSubmit={(event: FormEvent) => event.preventDefault()}
      className={cnState("gap-2", className)}
    >
      <QuestionnaireItem name={name} multiple={multiple} className="gap-2">
        <QuestionnaireTitle className="sr-only">{question}</QuestionnaireTitle>
        {layout === "tray" ? (
          <Card variant="tray" className="grid">
            {box}
            {line}
          </Card>
        ) : (
          <>
            {box}
            {line}
          </>
        )}
      </QuestionnaireItem>
    </Questionnaire>
  );
}

export type { QuestionnaireOption, QuestionnaireFormProps };
