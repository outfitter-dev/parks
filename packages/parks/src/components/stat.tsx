/*
 * Stat: a stat tile, a label over a value with an optional note, on a filled
 * card. Place tiles inside a <dl> so each label names its value.
 */

import type * as React from "react";

import { Card } from "#components/card";
import { cnState } from "#lib/utils";

type StatProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  note?: React.ReactNode;
  className?: string;
};

function Stat({ label, value, note, className }: StatProps) {
  return (
    <Card
      data-slot="stat"
      variant="filled"
      size="sm"
      className={cnState("*:px-inset gap-0.5", className)}
    >
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-2xl font-semibold tabular-nums">{value}</dd>
      {note === undefined || note === null || note === false ? null : (
        <dd className="text-muted-foreground text-xs">{note}</dd>
      )}
    </Card>
  );
}

export { Stat };
export type { StatProps };
