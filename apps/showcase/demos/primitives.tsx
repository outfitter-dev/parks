"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { paletteNames, steps } from "@workspace/ui/lib/palette";
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
] as const;

function FoundationSwatches() {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Foundation</h4>
      <div className="grid grid-cols-5 gap-2">
        {swatches.map(([name, className]) => (
          <div key={name}>
            <div className={`h-10 rounded-md ring-1 ring-border-muted ${className}`} />
            <p className="mt-1 font-mono text-xs wrap-anywhere text-muted-foreground">{name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const tones = ["destructive", "warning", "success", "info"] as const;
const roles = ["", "strong", "foreground", "fill", "border"] as const;
// Every Tailwind palette name, plus the brand, which is derived from one of them.
const palette = ["brand", ...paletteNames] as const;

function token(tone: string, role: string) {
  return role ? `--${tone}-${role}` : `--${tone}`;
}

/** Each tone's roles, picked from its scale per mode. */
function RoleGrid() {
  return (
    <>
      {tones.map((tone) => (
        <div key={tone} className="space-y-2">
          <h4 className="text-sm font-medium capitalize">{tone}</h4>
          <div className="grid grid-cols-5 gap-2">
            {roles.map((role) => (
              <div key={role}>
                <div
                  className="flex h-10 items-center rounded-md px-2 ring-1 ring-border-muted"
                  style={{ background: role === "strong" || role === "foreground" ? `var(--${tone}-fill)` : `var(${token(tone, role)})` }}
                >
                  {role === "strong" || role === "foreground" ? (
                    <span className="font-medium" style={{ color: `var(${token(tone, role)})` }}>Aa</span>
                  ) : null}
                </div>
                <p className="mt-1 font-mono text-xs wrap-anywhere text-muted-foreground">{role || "base"}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/** 50 to 950 for every palette. Palettes don't change with the mode; roles pick per mode. */
function ScaleGrid() {
  return (
    <div className="grid w-full min-w-lg gap-2">
      <div className="grid grid-cols-[6rem_repeat(11,minmax(0,1fr))] gap-1">
        <span />
        {steps.map((step) => (
          <p key={step} className="text-center font-mono text-xs text-muted-foreground">{step}</p>
        ))}
      </div>
      {palette.map((scale) => (
        <div key={scale} className="grid grid-cols-[6rem_repeat(11,minmax(0,1fr))] items-center gap-1">
          <p className="font-mono text-muted-foreground">{scale}</p>
          {steps.map((step) => (
            <div
              key={step}
              className={`h-9 rounded-md ring-1 ring-border-muted bg-${scale}-${step}`}
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
      <Specimen title="Colors" className="block overflow-x-auto">
        <ScaleGrid />
      </Specimen>
      <Specimen title="Semantic colors" className="block">
        <div className="grid gap-4">
          {(["light", "dark"] as const).map((mode) => (
            <div key={mode} className={`${mode} space-y-4 rounded-lg bg-background p-3 text-foreground ring-1 ring-border`}>
              <h3 className="font-medium capitalize">{mode}</h3>
              <FoundationSwatches />
              <RoleGrid />
            </div>
          ))}
        </div>
      </Specimen>
    </>
  );
}

const scale = [
  ["Title", "text-2xl font-semibold tracking-ui-title"],
  ["Heading", "text-lg font-semibold tracking-ui-heading"],
  ["Body", "text-[length:var(--text-ui)] tracking-ui-body"],
  ["Small", "text-xs tracking-ui-small"],
  ["Label", "text-ui-label"],
] as const;

export function TypeDemo() {
  return (
    <>
      <Specimen title="Scale" className="block">
        {scale.map(([name, className]) => (
          <div key={name} className="flex items-baseline gap-4 border-b py-2 last:border-0">
            <span className="w-20 shrink-0 font-mono text-muted-foreground">{name}</span>
            <span className={className}>{name === "Label" ? "Awaiting approval" : "Donna is waiting on your approval"}</span>
          </div>
        ))}
      </Specimen>
      <Specimen title="Allo and JetBrains Mono" note="14px, regular weight, on a shared baseline." className="block">
        <div className="grid grid-cols-2 items-baseline gap-x-4 gap-y-2 text-sm">
          <h3 className="text-ui-label text-muted-foreground">Allo</h3>
          <h3 className="text-ui-label text-muted-foreground">JetBrains Mono</h3>
          <span className="[font-family:Allo]">H x gypq 012345</span>
          <span className="[font-family:'JetBrains_Mono_Variable']">H x gypq 012345</span>
        </div>
        <p className="mt-3 text-sm">Donna is running <code>outpost status</code>.</p>
      </Specimen>
      <Specimen title="Mono" className="block">
        <p className="font-mono">outpost_admin_agent_set_destination --agent donna --mode live</p>
        <p className="mt-2 font-mono text-muted-foreground">sha 7e3786f · 2026-11-22T02:47:28Z</p>
      </Specimen>
      <Specimen title="Weights" className="grid grid-cols-1 items-start sm:grid-cols-2">
        {[
          { face: "Sans", className: "font-sans", weights: [400, 500, 600, 700] },
          { face: "Monospace", className: "font-mono", weights: [400, 500] },
        ].map(({ face, className, weights }) => (
          <div key={face} className="grid gap-1">
            <h3 className="text-ui-label text-muted-foreground">{face}</h3>
            {weights.map((weight) => (
              <div key={weight} className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-muted-foreground">{weight}</span>
                <span className={className} style={{ fontWeight: weight }}>Mission control for a fleet of agents</span>
              </div>
            ))}
          </div>
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
        note="The frame radius adds the inset to the control radius. The control radius is capped at half its height."
        className="block"
      >
        <div className="max-w-sm frame p-frame rounded-[calc(var(--control-radius)_+_var(--frame-space))] bg-card shadow-(--shadow-frame) ring-1 ring-border-muted [--control-radius:min(var(--radius-lg),calc(var(--control-h)/2))]">
          <div className="panel rounded-(--control-radius) bg-panel-fill"><span className="px-inset">Panel</span></div>
          <div className="mt-2 flex h-(--control-h) items-center rounded-(--control-radius) border px-[calc(var(--panel-pad-base)*(1_+_var(--inset-ratio))_-_1px)]">
            Control · --control-h
          </div>
        </div>
      </Specimen>
      <Specimen
        title="Text inset"
        note="Text adds --inset on the left and right. Cards that end in text get a little more room below the last line."
        className="block"
      >
        <div className="max-w-sm frame p-frame bg-card shadow-(--shadow-frame) ring-1 ring-border-muted">
          <div className="flex items-start justify-between gap-3">
            <p className="px-inset font-medium">Merge once CI is green?</p>
            <Badge variant="surface" shape="pill">Approval</Badge>
          </div>
          <p className="mt-1 px-inset pb-0.5 text-muted-foreground">Text sits at --pad + --inset. The pill sits in the corner at --pad.</p>
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
            <div key={label} className={`frame p-frame bg-card shadow-(--shadow-frame) ring-1 ring-border-muted ${size}`}>
              <div className="flex items-start justify-between gap-3">
                <p className="px-inset font-medium">{label}</p>
                <Badge variant="surface" shape="pill">Corner</Badge>
              </div>
              <div className="panel mt-2 bg-panel-fill">
                <div className="flex items-center justify-between gap-3">
                  <span className="ps-inset">Panel</span>
                  <span className="rounded-inner bg-background px-1.5 py-0.5 font-mono text-xs ring-1 ring-border-muted">piece</span>
                </div>
                <p className="px-inset text-muted-foreground">Text inset follows the panel.</p>
              </div>
            </div>
          ))}
        </div>
      </Specimen>
      <Specimen
        title="Grouped rows"
        note="The row stack uses the same inset on the sides and bottom. Hairline gaps reveal the card’s background."
        className="block"
      >
        <Card className="max-w-md pb-(--corner-gap)">
          <CardHeader>
            <CardTitle>Routing history</CardTitle>
            <CardDescription>Every saved version, newest first.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="concentric grid gap-px overflow-hidden rounded-lg">
              {[
                ["14", "Donna → webhook · devin", "Live"],
                ["13", "Quiet hours 10 PM to 8 AM", "2 days ago"],
                ["12", "Rex moved to dry run", "Nov 18"],
              ].map(([version, change, when], index) => (
                <div key={version} className="flex h-(--control-h) items-center gap-3 bg-panel-fill px-text">
                  <span className="font-mono text-muted-foreground">v{version}</span>
                  <span className="min-w-0 flex-1 truncate">{change}</span>
                  {index === 0 ? <Badge tone="success" dot>{when}</Badge> : <span className="text-muted-foreground">{when}</span>}
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
            <div className={`size-16 bg-muted ring-1 ring-border-muted ${className}`} />
            <p className="mt-1 font-mono text-muted-foreground">{name}</p>
          </div>
        ))}
      </Specimen>
    </>
  );
}
