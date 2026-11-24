/*
 * HaloSignal: the loading signal for work in progress. A dot sits inside a
 * faint halo of its own colour, and a short arc travels around the halo. It
 * stops moving under reduced motion. `tone` colours it from the tone roles;
 * without one it takes the muted text colour. At 16px the dot matches a
 * StatusDot; inside a badge icon it shrinks to leave room for the halo.
 */

import type * as React from "react";

import type { Tone } from "#lib/tone";
import { cnState } from "#lib/utils";

type HaloSignalProps = Omit<React.ComponentProps<"svg">, "children"> & {
  tone?: Tone;
  /** Rendered size in pixels. */
  size?: number;
  /** What is happening, for assistive tech: "Working", "Syncing". */
  label: string;
};

function HaloSignal({
  tone,
  size = 16,
  label,
  className,
  ...props
}: HaloSignalProps) {
  return (
    <svg
      {...props}
      data-slot="halo-signal"
      role="img"
      aria-label={label}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      data-tone={tone}
      className={cnState(
        "shrink-0",
        tone ? "text-tone-mark" : "text-muted-foreground",
        className
      )}
    >
      <circle
        cx="8"
        cy="8"
        r="4"
        fill="currentColor"
        className="in-data-[slot=badge-icon]:[r:--spacing(0.833)]"
      />
      <circle
        cx="8"
        cy="8"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.18"
        strokeWidth="1.5"
      />
      <circle
        cx="8"
        cy="8"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="11 33"
        className="origin-center animate-spin [animation-duration:1.2s] [transform-box:fill-box] motion-reduce:animate-none"
      />
    </svg>
  );
}

export { HaloSignal };
export type { HaloSignalProps };
