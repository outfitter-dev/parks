"use client";

import type { ComponentType, ReactNode } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { DotmCircular1 } from "./dotmatrix/dotm-circular-1";
import { DotmCircular2 } from "./dotmatrix/dotm-circular-2";
import { DotmCircular3 } from "./dotmatrix/dotm-circular-3";
import { DotmCircular4 } from "./dotmatrix/dotm-circular-4";
import { DotmCircular5 } from "./dotmatrix/dotm-circular-5";
import { DotmCircular6 } from "./dotmatrix/dotm-circular-6";
import { DotmCircular7 } from "./dotmatrix/dotm-circular-7";
import { DotmCircular8 } from "./dotmatrix/dotm-circular-8";
import { DotmCircular9 } from "./dotmatrix/dotm-circular-9";
import { DotmCircular10 } from "./dotmatrix/dotm-circular-10";
import { DotmCircular11 } from "./dotmatrix/dotm-circular-11";
import { DotmCircular12 } from "./dotmatrix/dotm-circular-12";
import { DotmCircular13 } from "./dotmatrix/dotm-circular-13";
import { DotmCircular14 } from "./dotmatrix/dotm-circular-14";
import { DotmCircular15 } from "./dotmatrix/dotm-circular-15";
import { DotmCircular16 } from "./dotmatrix/dotm-circular-16";
import { DotmCircular17 } from "./dotmatrix/dotm-circular-17";
import { DotmCircular18 } from "./dotmatrix/dotm-circular-18";
import { DotmCircular19 } from "./dotmatrix/dotm-circular-19";
import { DotmCircular20 } from "./dotmatrix/dotm-circular-20";
import { DotmHex1 } from "./dotmatrix/dotm-hex-1";
import { DotmHex2 } from "./dotmatrix/dotm-hex-2";
import { DotmHex3 } from "./dotmatrix/dotm-hex-3";
import { DotmHex4 } from "./dotmatrix/dotm-hex-4";
import { DotmHex5 } from "./dotmatrix/dotm-hex-5";
import { DotmHex6 } from "./dotmatrix/dotm-hex-6";
import { DotmHex7 } from "./dotmatrix/dotm-hex-7";
import { DotmHex8 } from "./dotmatrix/dotm-hex-8";
import { DotmHex9 } from "./dotmatrix/dotm-hex-9";
import { DotmHex10 } from "./dotmatrix/dotm-hex-10";
import { DotmSquare1 } from "./dotmatrix/dotm-square-1";
import { DotmSquare2 } from "./dotmatrix/dotm-square-2";
import { DotmSquare3 } from "./dotmatrix/dotm-square-3";
import { DotmSquare4 } from "./dotmatrix/dotm-square-4";
import { DotmSquare5 } from "./dotmatrix/dotm-square-5";
import { DotmSquare6 } from "./dotmatrix/dotm-square-6";
import { DotmSquare7 } from "./dotmatrix/dotm-square-7";
import { DotmSquare8 } from "./dotmatrix/dotm-square-8";
import { DotmSquare9 } from "./dotmatrix/dotm-square-9";
import { DotmSquare10 } from "./dotmatrix/dotm-square-10";
import { DotmSquare11 } from "./dotmatrix/dotm-square-11";
import { DotmSquare12 } from "./dotmatrix/dotm-square-12";
import { DotmSquare13 } from "./dotmatrix/dotm-square-13";
import { DotmSquare14 } from "./dotmatrix/dotm-square-14";
import { DotmSquare15 } from "./dotmatrix/dotm-square-15";
import { DotmSquare16 } from "./dotmatrix/dotm-square-16";
import { DotmSquare17 } from "./dotmatrix/dotm-square-17";
import { DotmSquare18 } from "./dotmatrix/dotm-square-18";
import { DotmSquare19 } from "./dotmatrix/dotm-square-19";
import { DotmSquare20 } from "./dotmatrix/dotm-square-20";
import { HaloSignal, Specimen } from "./kit";

type Loader = ComponentType<{ size?: number; dotSize?: number; ariaLabel?: string; className?: string }>;
type Entry = { name: string; id: string; Loader: Loader };

const circular: Entry[] = [
  { name: "Half helix", id: "circular-1", Loader: DotmCircular1 },
  { name: "Three orbits", id: "circular-2", Loader: DotmCircular2 },
  { name: "Plasma", id: "circular-3", Loader: DotmCircular3 },
  { name: "Radar", id: "circular-4", Loader: DotmCircular4 },
  { name: "Pinwheel", id: "circular-5", Loader: DotmCircular5 },
  { name: "Off-centre orbit", id: "circular-6", Loader: DotmCircular6 },
  { name: "Scan gate", id: "circular-7", Loader: DotmCircular7 },
  { name: "Pulse burst", id: "circular-8", Loader: DotmCircular8 },
  { name: "Cardinal beacon", id: "circular-9", Loader: DotmCircular9 },
  { name: "Binary tiers", id: "circular-10", Loader: DotmCircular10 },
  { name: "Crescent", id: "circular-11", Loader: DotmCircular11 },
  { name: "Stepped beacon", id: "circular-12", Loader: DotmCircular12 },
  { name: "Twin helix", id: "circular-13", Loader: DotmCircular13 },
  { name: "DNA ladder", id: "circular-14", Loader: DotmCircular14 },
  { name: "Braille motifs", id: "circular-15", Loader: DotmCircular15 },
  { name: "Braille scanline", id: "circular-16", Loader: DotmCircular16 },
  { name: "Braille checker", id: "circular-17", Loader: DotmCircular17 },
  { name: "Mirrored pairs", id: "circular-18", Loader: DotmCircular18 },
  { name: "Inner orbit", id: "circular-19", Loader: DotmCircular19 },
  { name: "Braille glyphs", id: "circular-20", Loader: DotmCircular20 },
];

const hex: Entry[] = [
  { name: "Perimeter chase", id: "hex-1", Loader: DotmHex1 },
  { name: "Three spokes", id: "hex-2", Loader: DotmHex2 },
  { name: "Diagonal bands", id: "hex-3", Loader: DotmHex3 },
  { name: "Vertex handoff", id: "hex-4", Loader: DotmHex4 },
  { name: "Counter spirals", id: "hex-5", Loader: DotmHex5 },
  { name: "Chevrons", id: "hex-6", Loader: DotmHex6 },
  { name: "Hourglass", id: "hex-7", Loader: DotmHex7 },
  { name: "Symbol flips", id: "hex-8", Loader: DotmHex8 },
  { name: "Four petals", id: "hex-9", Loader: DotmHex9 },
  { name: "Liquid swirl", id: "hex-10", Loader: DotmHex10 },
];

const square: Entry[] = [
  { name: "Corner ripple", id: "square-1", Loader: DotmSquare1 },
  { name: "Snake route", id: "square-2", Loader: DotmSquare2 },
  { name: "Spiral tail", id: "square-3", Loader: DotmSquare3 },
  { name: "Counter rings", id: "square-4", Loader: DotmSquare4 },
  { name: "Diagonal snake", id: "square-5", Loader: DotmSquare5 },
  { name: "Five snakes", id: "square-6", Loader: DotmSquare6 },
  { name: "Tetromino drop", id: "square-7", Loader: DotmSquare7 },
  { name: "Column stack", id: "square-8", Loader: DotmSquare8 },
  { name: "Braille cells", id: "square-9", Loader: DotmSquare9 },
  { name: "CRT scanline", id: "square-10", Loader: DotmSquare10 },
  { name: "Diamond ripple", id: "square-11", Loader: DotmSquare11 },
  { name: "Corner rings", id: "square-12", Loader: DotmSquare12 },
  { name: "Fan blade", id: "square-13", Loader: DotmSquare13 },
  { name: "Kaleidoscope", id: "square-14", Loader: DotmSquare14 },
  { name: "Helix", id: "square-15", Loader: DotmSquare15 },
  { name: "Narrow helix", id: "square-16", Loader: DotmSquare16 },
  { name: "Single strand", id: "square-17", Loader: DotmSquare17 },
  { name: "Equalizer", id: "square-18", Loader: DotmSquare18 },
  { name: "Figure eight", id: "square-19", Loader: DotmSquare19 },
  { name: "Ring trains", id: "square-20", Loader: DotmSquare20 },
];

/** Dot sizes that keep the grid crisp at each loader size. */
const dotSizes = { 16: 2, 24: 3, 40: 5 } as const;

function Cell({ entry: { name, id, Loader } }: { entry: Entry }) {
  return (
    <figure className="grid justify-items-center gap-2">
      <div className="flex h-10 items-center gap-4 text-foreground">
        {([16, 24, 40] as const).map((size) => (
          <Loader key={size} size={size} dotSize={dotSizes[size]} ariaLabel={name} />
        ))}
      </div>
      <figcaption className="text-center text-muted-foreground">
        {name}
        <span className="block font-mono text-xs opacity-70">{id}</span>
      </figcaption>
    </figure>
  );
}

function Gallery({ title, note, entries }: { title: string; note: string; entries: Entry[] }) {
  return (
    <Specimen title={title} note={note} className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      {entries.map((entry) => (
        <Cell key={entry.id} entry={entry} />
      ))}
    </Specimen>
  );
}

function Round({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-grid place-items-center rounded-full bg-muted text-foreground ${className ?? ""}`}>{children}</span>
  );
}

export function DotMatrixDemo() {
  return (
    <>
      <Specimen
        title="Halo signal"
        note="The Signal dot with a halo and a travelling arc, in the signal's own colour. At 20px the dot matches a plain 8px Signal."
        className="flex flex-col gap-5"
      >
        <span className="flex flex-wrap items-center gap-6">
          {(["wait", "live", "off", "alert"] as const).map((tone) => (
            <span key={tone} className="flex items-center gap-3">
              <HaloSignal tone={tone} size={16} label={tone} />
              <HaloSignal tone={tone} size={20} label={tone} />
              <HaloSignal tone={tone} size={28} label={tone} />
              <HaloSignal tone={tone} size={40} label={tone} />
            </span>
          ))}
        </span>
        <span className="flex flex-wrap items-center gap-4">
          <Badge variant="outline">
            <span className="lead"><HaloSignal tone="wait" size={16} label="Working" /></span>
            Working
          </Badge>
          <Button variant="secondary" disabled>
            <HaloSignal tone="live" size={16} label="Deploying" data-icon="inline-start" />
            Deploying
          </Button>
          <span className="inline-flex items-center gap-2">
            <HaloSignal tone="wait" label="Climb lead is working" />
            Climb lead is working
          </span>
        </span>
      </Specimen>

      <Specimen
        title="In rounded containers"
        note="Radar (circular 4) inside round and pill-shaped bounds, where the circular mask follows the container."
        className="flex flex-wrap items-center gap-4"
      >
        <Round className="size-6">
          <DotmCircular4 size={16} dotSize={2} ariaLabel="Syncing" />
        </Round>
        <Round className="size-8">
          <DotmCircular4 size={20} dotSize={2} ariaLabel="Syncing" />
        </Round>
        <Round className="size-10">
          <DotmCircular4 size={28} dotSize={3} ariaLabel="Syncing" />
        </Round>
        <Button variant="outline" size="icon" className="rounded-full" disabled>
          <DotmCircular4 size={16} dotSize={2} ariaLabel="Re-running" />
        </Button>
        <Badge variant="outline" className="gap-1.5">
          <DotmCircular4 size={12} dotSize={1.5} ariaLabel="Delivering" />
          Delivering
        </Badge>
        <Badge variant="secondary" className="gap-1.5 text-brand-700 dark:text-brand-300">
          <DotmCircular2 size={12} dotSize={1.5} ariaLabel="Waiting" />
          Waiting on Rex
        </Badge>
      </Specimen>

      <Specimen
        title="Hexagonal and square, in place"
        note="The same pending states where the container is square or has no bounds."
        className="flex flex-wrap items-center gap-4"
      >
        <Button disabled>
          <DotmSquare1 size={16} dotSize={2} ariaLabel="Approving" />
          Approving
        </Button>
        <Button variant="outline" disabled>
          <DotmHex2 size={16} dotSize={2} ariaLabel="Routing" />
          Routing
        </Button>
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <DotmHex4 size={16} dotSize={2} ariaLabel="Delivering" />
          Delivering to Donna
        </span>
        <span className="inline-grid size-10 place-items-center rounded-lg bg-muted text-foreground">
          <DotmSquare11 size={28} dotSize={3} ariaLabel="Loading" />
        </span>
      </Specimen>

      <Gallery title="Circular" note="Masked to a circle. Shown at 16, 24 and 40 px." entries={circular} />
      <Gallery title="Hexagonal" note="A 3-4-5-4-3 honeycomb. Shown at 16, 24 and 40 px." entries={hex} />
      <Gallery title="Square" note="A full 5×5 grid. Shown at 16, 24 and 40 px." entries={square} />
    </>
  );
}
