"use client";

import type { ComponentType, ReactNode } from "react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { Specimen } from "./kit";
import { Dotm3x3_2 } from "./loaders/dotmatrix/dotm-3x3-2";
import { Dotm3x3_5 } from "./loaders/dotmatrix/dotm-3x3-5";
import { DotmCircular1 } from "./loaders/dotmatrix/dotm-circular-1";
import { DotmCircular5 } from "./loaders/dotmatrix/dotm-circular-5";
import { DotmSquare1 } from "./loaders/dotmatrix/dotm-square-1";
import { DotmSquare3 } from "./loaders/dotmatrix/dotm-square-3";
import { Classic } from "./loaders/loading-ui/classic";
import { Dots } from "./loaders/loading-ui/dots";
import { DotsRing } from "./loaders/loading-ui/dots-ring";
import { DualArc } from "./loaders/loading-ui/dual-arc";
import { PulseDot } from "./loaders/loading-ui/pulse-dot";
import { QuarterRing } from "./loaders/loading-ui/quarter-ring";
import { Ring } from "./loaders/loading-ui/ring";
import { Spokes } from "./loaders/loading-ui/spokes";

/**
 * The wrapper every loader would sit in: one status role and label, the
 * current text colour, and a slower loop under reduced motion instead of none.
 */
function Spinner({
  label = "Loading",
  announces = false,
  className,
  children,
}: {
  label?: string;
  /** The loader already renders its own status role (Dot Matrix does). */
  announces?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      role={announces ? undefined : "status"}
      aria-label={announces ? undefined : label}
      className={cn(
        "inline-grid size-4 shrink-0 place-items-center *:size-full motion-reduce:**:[animation-duration:3s]!",
        className,
      )}
    >
      {children}
    </span>
  );
}

type LoadingUiLoader = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

/** Pulse dot fills its box, so it renders at half size to match the others' weight. */
const loadingUi: { name: string; Loader: LoadingUiLoader; className?: string }[] = [
  { name: "Ring", Loader: Ring },
  { name: "Quarter ring", Loader: QuarterRing },
  { name: "Dual arc", Loader: DualArc },
  { name: "Spokes", Loader: Spokes },
  { name: "Classic", Loader: Classic },
  { name: "Dots ring", Loader: DotsRing },
  { name: "Dots", Loader: Dots },
  { name: "Pulse dot", Loader: PulseDot, className: "scale-50" },
];

type DotMatrixLoader = ComponentType<{ size?: number; dotSize?: number; ariaLabel?: string }>;

const dotMatrix: { name: string; Loader: DotMatrixLoader }[] = [
  { name: "3×3 wave", Loader: Dotm3x3_2 },
  { name: "3×3 wave, reversed", Loader: Dotm3x3_5 },
  { name: "Square sweep", Loader: DotmSquare1 },
  { name: "Square 3", Loader: DotmSquare3 },
  { name: "Circular 1", Loader: DotmCircular1 },
  { name: "Circular 5", Loader: DotmCircular5 },
];

/** Dot sizes that keep a five-dot grid crisp at each loader size. */
const dotSizes = { 16: 2, 24: 3, 40: 5 } as const;

function Cell({ name, children }: { name: string; children: ReactNode }) {
  return (
    <figure className="grid justify-items-center gap-2">
      <div className="flex h-10 items-center gap-4 text-foreground">{children}</div>
      <figcaption className="text-muted-foreground">{name}</figcaption>
    </figure>
  );
}

export function LoadersDemo() {
  return (
    <>
      <Specimen
        title="In context"
        note="The same pending button and status row with each family's simplest loader."
        className="grid gap-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button disabled>
            <Spinner label="Approving">
              <Ring aria-hidden />
            </Spinner>
            Approving
          </Button>
          <Button variant="outline" disabled>
            <Spinner label="Re-running">
              <Spokes aria-hidden />
            </Spinner>
            Re-running
          </Button>
          <Button disabled>
            <Spinner announces>
              <Dotm3x3_2 size={16} dotSize={2} ariaLabel="Approving" />
            </Spinner>
            Approving
          </Button>
          <Button variant="outline" disabled>
            <Spinner announces>
              <DotmSquare1 size={16} dotSize={2} ariaLabel="Re-running" />
            </Spinner>
            Re-running
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Spinner label="Delivering">
              <QuarterRing aria-hidden />
            </Spinner>
            Delivering to Donna
          </span>
          <span className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400">
            <Spinner announces>
              <Dotm3x3_5 size={16} dotSize={2} ariaLabel="Waiting" />
            </Spinner>
            Waiting on Rex
          </span>
        </div>
      </Specimen>

      <Specimen
        title="Loading UI"
        note="SVG and CSS, no dependencies. Shown at 16, 24 and 40 px in the current text colour."
        className="grid grid-cols-2 gap-6 sm:grid-cols-4"
      >
        {loadingUi.map(({ name, Loader, className }) => (
          <Cell key={name} name={name}>
            <Spinner>
              <Loader aria-hidden className={className} />
            </Spinner>
            <Spinner className="size-6">
              <Loader aria-hidden className={className} />
            </Spinner>
            <Spinner className="size-10">
              <Loader aria-hidden className={className} />
            </Spinner>
          </Cell>
        ))}
      </Specimen>

      <Specimen
        title="Dot Matrix"
        note="A five-dot grid driven by CSS, with reduced motion built in. Shown at 16, 24 and 40 px."
        className="grid grid-cols-2 gap-6 sm:grid-cols-3"
      >
        {dotMatrix.map(({ name, Loader }) => (
          <Cell key={name} name={name}>
            {([16, 24, 40] as const).map((size) => (
              <Spinner key={size} announces className="size-auto">
                <Loader size={size} dotSize={dotSizes[size]} />
              </Spinner>
            ))}
          </Cell>
        ))}
      </Specimen>
    </>
  );
}
