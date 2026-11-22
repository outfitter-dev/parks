"use client";

import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { BellIcon } from "@solar-icons/react/linear/bell";
import { ChatRoundDotsIcon } from "@solar-icons/react/linear/chat-round-dots";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { HistoryIcon } from "@solar-icons/react/linear/history";
import { InboxIcon } from "@solar-icons/react/linear/inbox";
import { KeyIcon } from "@solar-icons/react/linear/key";
import { MagnifierIcon } from "@solar-icons/react/linear/magnifier";
import { RoutingIcon } from "@solar-icons/react/linear/routing";
import { SettingsIcon } from "@solar-icons/react/linear/settings";
import { ShieldKeyholeIcon } from "@solar-icons/react/linear/shield-keyhole";
import { UsersGroupRoundedIcon } from "@solar-icons/react/linear/users-group-rounded";
import { BellIcon as BellBold } from "@solar-icons/react/bold/bell";
import { InboxIcon as InboxDuo } from "@solar-icons/react/bold-duotone/inbox";
import { Specimen } from "./kit";

const swatches = [
  ["background", "bg-background"],
  ["card", "bg-card"],
  ["muted", "bg-muted"],
  ["accent", "bg-accent"],
  ["border", "bg-border"],
  ["muted-foreground", "bg-muted-foreground"],
  ["foreground", "bg-foreground"],
  ["primary", "bg-primary"],
  ["brand", "bg-brand"],
  ["destructive", "bg-destructive"],
] as const;

function SwatchRow() {
  return (
    <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-5">
      {swatches.map(([name, className]) => (
        <div key={name}>
          <div className={`h-12 rounded-lg ring-1 ring-foreground/10 ${className}`} />
          <p className="mt-1 font-mono text-muted-foreground">{name}</p>
        </div>
      ))}
    </div>
  );
}

export function ColorDemo() {
  return (
    <>
      <Specimen title="Light" className="light block bg-background text-foreground">
        <SwatchRow />
      </Specimen>
      <Specimen title="Dark" className="dark block bg-background text-foreground">
        <SwatchRow />
      </Specimen>
    </>
  );
}

const scale = [
  ["Title", "text-2xl font-semibold tracking-tight"],
  ["Heading", "text-lg font-semibold"],
  ["Body", "text-[length:var(--text-ui)]"],
  ["Small", "text-xs"],
] as const;

export function TypeDemo() {
  return (
    <>
      <Specimen title="Scale" className="block">
        {scale.map(([name, className]) => (
          <div key={name} className="flex items-baseline gap-4 border-b py-2 last:border-0">
            <span className="w-20 shrink-0 font-mono text-muted-foreground">{name}</span>
            <span className={className}>Donna is waiting on your approval</span>
          </div>
        ))}
      </Specimen>
      <Specimen title="Mono" className="block">
        <p className="font-mono">outpost_admin_agent_set_destination --agent donna --mode live</p>
        <p className="mt-2 font-mono text-muted-foreground">sha 7e3786f · 2026-11-22T02:47:28Z</p>
      </Specimen>
      <Specimen title="Weights" className="block">
        {[400, 500, 600, 700].map((weight) => (
          <p key={weight} style={{ fontWeight: weight }}>
            {weight} · Mission control for a fleet of agents
          </p>
        ))}
      </Specimen>
    </>
  );
}

export function ShapeDemo() {
  return (
    <>
      <Specimen
        title="Concentric corners"
        note="Set the inner radius and the padding. The frame radius is their sum."
        className="block"
      >
        <div className="max-w-sm rounded-frame bg-card p-(--pad) shadow-(--shadow-frame) ring-1 ring-foreground/10">
          <div className="rounded-lg bg-muted p-3">Inner surface · --radius</div>
          <div className="mt-2 flex h-(--control-h) items-center rounded-lg border px-3">
            Control · --control-h
          </div>
        </div>
      </Specimen>
      <Specimen title="Radius steps">
        {[
          ["sm", "rounded-sm"],
          ["md", "rounded-md"],
          ["lg (inner)", "rounded-lg"],
          ["xl", "rounded-xl"],
          ["frame", "rounded-frame"],
        ].map(([name, className]) => (
          <div key={name} className="text-center">
            <div className={`size-16 bg-muted ring-1 ring-foreground/10 ${className}`} />
            <p className="mt-1 font-mono text-muted-foreground">{name}</p>
          </div>
        ))}
      </Specimen>
    </>
  );
}

const icons = [
  ["inbox", InboxIcon],
  ["bell", BellIcon],
  ["chat-round-dots", ChatRoundDotsIcon],
  ["check-circle", CheckCircleIcon],
  ["users-group-rounded", UsersGroupRoundedIcon],
  ["routing", RoutingIcon],
  ["history", HistoryIcon],
  ["key", KeyIcon],
  ["shield-keyhole", ShieldKeyholeIcon],
  ["settings", SettingsIcon],
  ["magnifier", MagnifierIcon],
  ["alt-arrow-right", AltArrowRightIcon],
] as const;

export function IconsDemo() {
  return (
    <>
      <Specimen title="Linear, the default style" note="Import each icon from @solar-icons/react/linear/<name>.">
        <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-6">
          {icons.map(([name, Icon]) => (
            <div key={name} className="flex flex-col items-center gap-2 rounded-lg p-3 hover:bg-muted">
              <Icon className="size-5" />
              <span className="text-center font-mono text-xs text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </Specimen>
      <Specimen title="Other styles" note="Bold for selected states, duotone for empty states.">
        <BellBold className="size-6" />
        <InboxDuo className="size-10 text-brand" />
      </Specimen>
      <p className="text-muted-foreground">Solar icons by 480 Design, CC BY 4.0.</p>
    </>
  );
}
