"use client";

/*
 * Ask: a question for a person with a few choices, from the Parks registry.
 * The question heads a box of stacked rows. Every row leads with a box: its
 * letter or number when `shortcuts` is set (and pressing the key picks it),
 * otherwise a radio button, or a checkbox when `multiple`. The line under the
 * box gives the hint, or what will be posted once something is picked.
 * `layout="tray"` sets the box and line in a muted tray.
 */

import { Badge } from "@outfitter/parks/components/badge";
import { Card } from "@outfitter/parks/components/card";
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireTitle,
} from "@outfitter/parks/components/questionnaire";
import { cn } from "@outfitter/parks/lib/utils";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";

type AskOption = {
  label: string;
  detail?: ReactNode;
  recommended?: boolean;
};

type AskProps = {
  /** Names the form field, so a page with several asks keeps them apart. */
  name: string;
  question: string;
  options: readonly AskOption[];
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

const row =
  "rounded-none border-x-0 border-t-0 border-b-border-muted last:border-b-0 data-checked:border-b-border-muted data-checked:bg-brand-fill data-checked:ring-0 hover:data-checked:bg-brand-fill";

function defaultHint(
  picked: readonly string[],
  multiple: boolean,
  shortcuts: AskProps["shortcuts"]
) {
  if (picked.length > 0) {
    return `Posts “${picked.join(", ")}” as your answer.`;
  }
  if (shortcuts) {
    return `Pick an option, or press its ${shortcuts === "letters" ? "letter" : "number"}.`;
  }
  return multiple ? "Pick any that apply." : "Pick an option to answer.";
}

export function Ask({
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
}: AskProps) {
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
      <QuestionnaireChoices aria-label="Options" className="gap-0">
        {options.map((option) => (
          <QuestionnaireChoice
            key={option.label}
            value={option.label}
            checked={picked.includes(option.label)}
            onChange={() => toggle(option.label)}
            className={row}
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
      className={cn("gap-2", className)}
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

export type { AskOption, AskProps };
