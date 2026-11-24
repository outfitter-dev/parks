"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import * as React from "react";

import { isTone } from "#lib/tone";
import type { Tone } from "#lib/tone";
import { cnState } from "#lib/utils";

/*
 * shadcn's Progress, with two additions:
 *
 * - `segments` draws counted steps (3 of 5) as separate segments instead
 *   of one bar. `true` makes one segment per step up to `max`; a number
 *   sets the count.
 * - `showValue` puts the value at the end of the bar's line: the
 *   percentage, or "done/max" for segments. Pass a node to show your own.
 *
 * `tone` colours the filled part (#lib/tone); neutral fills with the
 * primary. Labels and values as children keep shadcn's layout: they wrap
 * above a full-width bar.
 */
type ProgressProps = ProgressPrimitive.Root.Props & {
  tone?: Tone;
  segments?: boolean | number;
  showValue?: boolean | React.ReactNode;
};

function Progress({
  className,
  children,
  value,
  min = 0,
  max = 100,
  tone,
  segments,
  showValue,
  ...props
}: ProgressProps) {
  const count =
    segments === true ? max : typeof segments === "number" ? segments : 0;
  const current = value ?? min;
  const span = max - min;
  // How far through the range the value is, from 0 to 1.
  const fraction =
    span > 0 ? (Math.min(Math.max(current, min), max) - min) / span : 0;
  const filled = count > 0 ? Math.round(fraction * count) : 0;
  const valueLabel =
    showValue === true
      ? count > 0
        ? `${current}/${max}`
        : `${Math.round(fraction * 100)}%`
      : showValue || null;
  return (
    <ProgressPrimitive.Root
      value={value}
      min={min}
      max={max}
      data-slot="progress"
      data-tone={isTone(tone) ? tone : "neutral"}
      data-inline={valueLabel == null ? undefined : ""}
      className={cnState(
        "flex flex-wrap gap-3 data-inline:flex-nowrap data-inline:items-center data-inline:gap-2",
        className
      )}
      {...props}
    >
      {children}
      {count > 0 ? (
        <span
          data-slot="progress-track"
          className="flex h-1 w-full min-w-0 gap-0.5"
        >
          {Array.from({ length: count }, (_, index) => (
            <span
              key={index}
              data-slot="progress-segment"
              data-filled={index < filled ? "" : undefined}
              className="bg-muted data-filled:bg-tone h-full flex-1 rounded-full"
            />
          ))}
        </span>
      ) : (
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      )}
      {valueLabel == null ? null : (
        <span
          data-slot="progress-value"
          className="text-muted-foreground shrink-0 text-xs tabular-nums"
        >
          {valueLabel}
        </span>
      )}
    </ProgressPrimitive.Root>
  );
}

function ProgressTrack({ className, ...props }: ProgressPrimitive.Track.Props) {
  return (
    <ProgressPrimitive.Track
      className={cnState(
        "relative flex h-1 w-full min-w-0 items-center overflow-x-hidden rounded-full bg-muted",
        className
      )}
      data-slot="progress-track"
      {...props}
    />
  );
}

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={cnState("h-full bg-tone transition-all", className)}
      {...props}
    />
  );
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={cnState("text-sm font-medium", className)}
      data-slot="progress-label"
      {...props}
    />
  );
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={cnState(
        "ml-auto text-sm text-muted-foreground tabular-nums",
        className
      )}
      data-slot="progress-value"
      {...props}
    />
  );
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
};
export type { ProgressProps };
