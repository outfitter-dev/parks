"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { InlineCode } from "@workspace/ui/components/inline-code";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRightIcon } from "@solar-icons/react/outline/arrow-right";
import { BoltIcon } from "@solar-icons/react/outline/bolt";
import { BoltIcon as BoltBold } from "@solar-icons/react/bold/bolt";
import { DangerTriangleIcon } from "@solar-icons/react/outline/danger-triangle";
import { DatabaseIcon } from "@solar-icons/react/outline/database";
import { DatabaseIcon as DatabaseBold } from "@solar-icons/react/bold/database";
import { ShieldCheckIcon } from "@solar-icons/react/outline/shield-check";
import { ShieldCheckIcon as ShieldCheckBold } from "@solar-icons/react/bold/shield-check";
import { StructureIcon } from "@solar-icons/react/outline/structure";
import { StructureIcon as StructureBold } from "@solar-icons/react/bold/structure";
import { AppFrame } from "../app-frame";
import type { AppNavigation } from "../app-sidebar";
import { Viewport } from "../kit";
import { Frame, FrameHeader, FramePanel, FrameTitle } from "../reui/frame";
import { ExplorerLayout } from "./explorer-layout";
import { CodeBlock, Heading } from "./parts";

const navigation = {
  name: "Trails",
  mark: "T",
  items: [
    { id: "topo", label: "Topo", icon: StructureIcon, solid: StructureBold, count: 7 },
    { id: "resources", label: "Resources", icon: DatabaseIcon, solid: DatabaseBold, count: 3 },
    { id: "signals", label: "Signals", icon: BoltIcon, solid: BoltBold, count: 2 },
    { id: "warden", label: "Warden", icon: ShieldCheckIcon, solid: ShieldCheckBold, count: 1 },
  ],
} satisfies AppNavigation;

type Intent = "read" | "write" | "destroy";

const topo: { group: string; trails: { id: string; intent: Intent }[] }[] = [
  {
    group: "ask",
    trails: [
      { id: "ask.create", intent: "write" },
      { id: "ask.get", intent: "read" },
      { id: "ask.answer", intent: "write" },
      { id: "ask.withdraw", intent: "destroy" },
    ],
  },
  {
    group: "agent",
    trails: [
      { id: "agent.list", intent: "read" },
      { id: "agent.set-mode", intent: "write" },
    ],
  },
  { group: "thread", trails: [{ id: "thread.reply", intent: "write" }] },
];

const intentTones = { read: "neutral", write: "info", destroy: "destructive" } as const;

function IntentMark({ intent, className }: { intent: Intent; className?: string }) {
  return <Badge variant={intentTones[intent]} className={cn("font-mono", className)}>{intent}</Badge>;
}

const input = `z.object({
  to: AgentId,
  kind: z.enum(["approval", "choice", "input"]),
  question: z.string().max(140),
  options: z.array(Option).max(4),
  deadline: z.iso.datetime().optional(),
})`;

const output = `z.object({
  id: AskId,
  thread: ThreadRef,
  state: z.literal("open"),
})`;

function Node({ label, kind, current }: { label: string; kind: "trail" | "resource" | "signal"; current?: boolean }) {
  const Icon = kind === "resource" ? DatabaseIcon : kind === "signal" ? BoltIcon : StructureIcon;
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 font-mono text-xs shadow-xs",
        current && "border-border-strong ring-2 ring-border-muted",
      )}
    >
      <Icon className="size-3.5 text-muted-foreground" />
      {label}
    </span>
  );
}

/** A Trails topo explorer: every trail by group, and one trail's contract rendered on each surface. */
export function TrailsSurface() {
  return (
    <Viewport>
      <AppFrame navigation={navigation} place="topo">
        <ExplorerLayout
          browserLabel="Contracts"
          path={["outpost", "ask", "ask.create"]}
          actions={<Button variant="secondary" size="sm">Open lock</Button>}
          browser={
            <nav aria-label="Trail contracts" className="flex flex-col gap-3 px-2 pb-2">
              {topo.map((group) => (
                <div key={group.group}>
                  <p className="px-2 pb-1 text-xs text-muted-foreground">{group.group}</p>
                  {group.trails.map((trail) => (
                    <a
                      key={trail.id}
                      href="#"
                      aria-current={trail.id === "ask.create" ? "page" : undefined}
                      className={cn(
                        "flex h-7 items-center gap-2 rounded-md ps-2 pe-1 font-mono text-xs hover:bg-accent",
                        trail.id === "ask.create" && "bg-accent",
                      )}
                    >
                      {trail.id}
                      <IntentMark intent={trail.intent} className="ms-auto" />
                    </a>
                  ))}
                </div>
              ))}
            </nav>
          }
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-mono text-lg font-semibold">ask.create</h2>
              <IntentMark intent="write" />
              <Badge>v2</Badge>
            </div>
            <p className="mt-1 text-muted-foreground">Ask Matt a question with up to four options. Posts an <InlineCode>ask.choice@1</InlineCode> block to the thread.</p>
          </div>

          <section>
            <Heading>Rendered on each surface</Heading>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Surface</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Derived from intent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  ["CLI", "outpost ask create", "No confirm prompt"],
                  ["MCP", "outpost_ask_create", "destructiveHint: false"],
                  ["HTTP", "POST /v1/ask", "201 Created"],
                  ["Library", "ask.create(input)", "Result<Ask, AskError>"],
                ].map(([surface, name, derived]) => (
                  <TableRow key={surface}>
                    <TableCell>{surface}</TableCell>
                    <TableCell className="font-mono text-xs">{name}</TableCell>
                    <TableCell className="text-muted-foreground">{derived}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>

          <div className="grid gap-4 @5xl:grid-cols-2">
            <CodeBlock code={input} label="Input schema" language="typescript" numbers />
            <CodeBlock code={output} label="Output schema" language="typescript" numbers />
          </div>

          <div className="grid gap-4 @6xl:grid-cols-[1fr_18rem]">
            <Frame>
              <FrameHeader>
                <FrameTitle>Composes and fires</FrameTitle>
              </FrameHeader>
              <FramePanel className="flex flex-wrap items-center gap-2">
                <Node label="agent.get" kind="trail" />
                <ArrowRightIcon className="size-4 text-muted-foreground" />
                <Node label="ask.create" kind="trail" current />
                <ArrowRightIcon className="size-4 text-muted-foreground" />
                <Node label="board" kind="resource" />
                <ArrowRightIcon className="size-4 text-muted-foreground" />
                <Node label="ask.opened" kind="signal" />
              </FramePanel>
            </Frame>
            <Frame>
              <FrameHeader>
                <FrameTitle>Warden</FrameTitle>
              </FrameHeader>
              <FramePanel className="flex items-start gap-2">
                <DangerTriangleIcon className="mt-0.5 size-4 shrink-0 text-warning-strong" />
                <span>
                  <span className="font-mono text-xs">version-without-examples</span>
                  <span className="block text-muted-foreground">v1 has no examples. Add one or mark it retired.</span>
                </span>
              </FramePanel>
            </Frame>
          </div>
        </ExplorerLayout>
      </AppFrame>
    </Viewport>
  );
}
