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
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
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
  ["warning", "bg-warning"],
  ["success", "bg-success"],
  ["info", "bg-info"],
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

const tones = ["destructive", "warning", "success", "info"] as const;
const roles = ["", "strong", "foreground", "fill", "border"] as const;
const scales = ["neutral", "brand", ...tones] as const;
const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function token(tone: string, role: string) {
  return role ? `--${tone}-${role}` : `--${tone}`;
}

/** Each tone's roles, picked from its scale per mode. */
function RoleGrid() {
  return (
    <div className="grid w-full gap-3">
      {tones.map((tone) => (
        <div key={tone} className="grid grid-cols-[6rem_repeat(5,minmax(0,1fr))] items-end gap-2">
          <p className="pb-1 font-mono text-muted-foreground">{tone}</p>
          {roles.map((role) => (
            <div key={role}>
              <div
                className="flex h-10 items-center rounded-md px-2 ring-1 ring-foreground/10"
                style={{ background: role === "strong" || role === "foreground" ? `var(--${tone}-fill)` : `var(${token(tone, role)})` }}
              >
                {role === "strong" || role === "foreground" ? (
                  <span className="font-medium" style={{ color: `var(${token(tone, role)})` }}>Aa</span>
                ) : null}
              </div>
              <p className="mt-1 font-mono text-xs text-muted-foreground">{role || "base"}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** 50 to 950 for every scale. Scales don't change with the mode. */
function ScaleGrid() {
  return (
    <div className="grid w-full gap-2">
      <div className="grid grid-cols-[6rem_repeat(11,minmax(0,1fr))] gap-1">
        <span />
        {steps.map((step) => (
          <p key={step} className="text-center font-mono text-xs text-muted-foreground">{step}</p>
        ))}
      </div>
      {scales.map((scale) => (
        <div key={scale} className="grid grid-cols-[6rem_repeat(11,minmax(0,1fr))] items-center gap-1">
          <p className="font-mono text-muted-foreground">{scale}</p>
          {steps.map((step) => (
            <div
              key={step}
              className="h-9 rounded-md ring-1 ring-foreground/10"
              style={{ background: `var(--${scale}-${step})` }}
              title={`${scale}-${step}`}
            />
          ))}
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
      <Specimen
        title="Semantic roles, light"
        note="Base marks dots and solid fills. Strong is for titles and glyphs, foreground for tinted text."
        className="light block bg-background text-foreground"
      >
        <RoleGrid />
      </Specimen>
      <Specimen title="Semantic roles, dark" className="dark block bg-background text-foreground">
        <RoleGrid />
      </Specimen>
      <Specimen
        title="Scales"
        note="Use as bg-success-100, text-warning-700 and so on. Each scale derives from its seeds."
        className="block"
      >
        <ScaleGrid />
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
        <div className="max-w-sm frame p-frame bg-card shadow-(--shadow-frame) ring-1 ring-foreground/10">
          <div className="panel bg-muted"><span className="px-inset">Panel · --radius</span></div>
          <div className="mt-2 flex h-(--control-h) items-center rounded-lg border px-3">
            Control · --control-h
          </div>
        </div>
      </Specimen>
      <Specimen
        title="Text inset"
        note="Frame padding is even on every side so corner pieces stay concentric. Text adds --inset on the left and right so it doesn't read top-heavy."
        className="block"
      >
        <div className="max-w-sm frame p-frame bg-card shadow-(--shadow-frame) ring-1 ring-foreground/10">
          <div className="flex items-start justify-between gap-3">
            <p className="px-inset font-medium">Merge once CI is green?</p>
            <span className="rounded-lg bg-muted px-2 py-0.5 text-xs">Approval</span>
          </div>
          <p className="mt-1 px-inset text-muted-foreground">Text sits at --pad + --inset. The pill sits in the corner at --pad.</p>
        </div>
      </Specimen>
      <Specimen
        title="Nesting"
        note="Each level pads evenly and its text inset is a share of that padding, so smaller and deeper containers get a smaller inset. Corners stay concentric all the way down."
        className="block"
      >
        <div className="grid max-w-2xl items-start gap-4 sm:grid-cols-2">
          {[
            ["Frame", ""],
            ["Small frame", "[--frame-pad:var(--frame-pad-sm)]"],
          ].map(([label, size]) => (
            <div key={label} className={`frame p-frame bg-card shadow-(--shadow-frame) ring-1 ring-foreground/10 ${size}`}>
              <div className="flex items-start justify-between gap-3">
                <p className="px-inset font-medium">{label}</p>
                <span className="rounded-lg bg-muted px-2 py-0.5 text-xs">Corner</span>
              </div>
              <div className="panel mt-2 bg-muted">
                <div className="flex items-center justify-between gap-3">
                  <span className="ps-inset">Panel</span>
                  <span className="rounded-inner bg-background px-1.5 py-0.5 font-mono text-xs ring-1 ring-foreground/10">piece</span>
                </div>
                <p className="px-inset text-muted-foreground">Text inset follows the panel.</p>
              </div>
            </div>
          ))}
        </div>
      </Specimen>
      <Specimen
        title="Grouped rows"
        note="Several rows that belong together share one contained surface. The container spans the card content and takes the concentric radius (frame radius minus the corner gap); rows are --control-h tall, divided by hairlines, and their text lines up with the card title."
        className="block"
      >
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Routing history</CardTitle>
            <CardDescription>Every saved version, newest first.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="concentric divide-y overflow-hidden rounded-lg bg-muted">
              {[
                ["14", "Donna → webhook · devin", "Live"],
                ["13", "Quiet hours 10 PM to 8 AM", "2 days ago"],
                ["12", "Rex moved to dry run", "Nov 18"],
              ].map(([version, change, when], index) => (
                <div key={version} className="flex h-(--control-h) items-center gap-3 px-text">
                  <span className="font-mono text-muted-foreground">v{version}</span>
                  <span className="min-w-0 flex-1 truncate">{change}</span>
                  {index === 0 ? <Badge variant="success" dot>{when}</Badge> : <span className="text-muted-foreground">{when}</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </Specimen>
      <Specimen title="Radius steps">
        {[
          ["sm", "rounded-sm"],
          ["md", "rounded-md"],
          ["lg (panel)", "rounded-lg"],
          ["xl", "rounded-xl"],
          ["frame", "rounded-frame"],
          ["inner", "rounded-inner"],
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
