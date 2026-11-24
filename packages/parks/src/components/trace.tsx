"use client";

/*
 * Trace: the steps an agent took, one line each, built on Collapsible. A
 * step shows an icon, a title and an optional detail such as a count. A
 * running step swaps its icon for the spinner; a failed step takes the
 * destructive tone. A step with children opens in place to show them.
 */

import { AltArrowRightIcon } from "@solar-icons/react/outline/alt-arrow-right";
import type * as React from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "#components/collapsible";
import { Spinner } from "#components/spinner";
import { cnState } from "#lib/utils";

type TraceStatus = "done" | "running" | "failed";

function Trace({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="trace"
      className={cnState("flex min-w-0 flex-col gap-1.5 text-sm", className)}
      {...props}
    />
  );
}

type TraceStepProps = Omit<React.ComponentProps<"li">, "title"> & {
  /** A glyph for the kind of step: search, edit, run. */
  icon?: React.ReactNode;
  title: React.ReactNode;
  /** A short result after the title, such as "3 results" or "+2 −1". */
  detail?: React.ReactNode;
  status?: TraceStatus;
  /** Open a step with children on first render. */
  defaultOpen?: boolean;
};

function TraceStepSummary({
  icon,
  title,
  detail,
  status,
}: Pick<TraceStepProps, "icon" | "title" | "detail" | "status">) {
  return (
    <span
      data-slot="trace-step-summary"
      className="flex min-w-0 items-center gap-2"
    >
      <span
        data-slot="trace-step-icon"
        className="flex size-4 shrink-0 items-center justify-center [&_svg]:size-4"
      >
        {status === "running" ? <Spinner /> : icon}
      </span>
      <span data-slot="trace-step-title" className="min-w-0 truncate">
        {title}
      </span>
      {detail ? (
        <span
          data-slot="trace-step-detail"
          className="text-fg-subtle group-data-[status=failed]/trace-step:text-destructive shrink-0 tabular-nums"
        >
          {detail}
        </span>
      ) : null}
    </span>
  );
}

function TraceStep({
  icon,
  title,
  detail,
  status = "done",
  defaultOpen,
  className,
  children,
  ...props
}: TraceStepProps) {
  const summary = (
    <TraceStepSummary
      icon={icon}
      title={title}
      detail={detail}
      status={status}
    />
  );
  return (
    <li
      data-slot="trace-step"
      data-status={status}
      className={cnState(
        "group/trace-step text-muted-foreground data-[status=failed]:text-destructive data-[status=running]:text-foreground min-w-0",
        className
      )}
      {...props}
    >
      {children ? (
        <Collapsible defaultOpen={defaultOpen}>
          <CollapsibleTrigger className="group/trace-trigger hover:text-foreground focus-visible:ring-focus-ring flex max-w-full min-w-0 items-center gap-1 rounded-md text-start outline-none focus-visible:ring-2">
            {summary}
            <AltArrowRightIcon className="text-fg-subtle size-3.5 shrink-0 transition-transform group-data-[panel-open]/trace-trigger:rotate-90" />
          </CollapsibleTrigger>
          <CollapsibleContent className="text-foreground mt-2 ps-6">
            {children}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        summary
      )}
    </li>
  );
}

export { Trace, TraceStep };
export type { TraceStatus, TraceStepProps };
