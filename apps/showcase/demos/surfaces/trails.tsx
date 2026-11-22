"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowRightIcon } from "@solar-icons/react/linear/arrow-right";
import { BoltIcon } from "@solar-icons/react/linear/bolt";
import { DangerTriangleIcon } from "@solar-icons/react/linear/danger-triangle";
import { DatabaseIcon } from "@solar-icons/react/linear/database";
import { ShieldCheckIcon } from "@solar-icons/react/linear/shield-check";
import { StructureIcon } from "@solar-icons/react/linear/structure";
import { Viewport } from "../kit";
import { Frame, FrameHeader, FramePanel, FrameTitle } from "../reui/frame";
import { CodeBlock, Crumbs, Heading, Shell } from "./parts";

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

function IntentMark({ intent }: { intent: Intent }) {
  return (
    <span
      className={cn(
        "rounded px-1 font-mono text-xs",
        intent === "read" && "bg-foreground/6 text-muted-foreground",
        intent === "write" && "bg-info-fill text-info-foreground",
        intent === "destroy" && "bg-destructive-fill text-destructive-foreground",
      )}
    >
      {intent}
    </span>
  );
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
        current && "border-foreground/30 ring-2 ring-foreground/6",
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
      <Shell
        mark="T"
        name="Trails"
        active="Topo"
        nav={[
          { label: "Topo", icon: StructureIcon, count: 7 },
          { label: "Resources", icon: DatabaseIcon, count: 3 },
          { label: "Signals", icon: BoltIcon, count: 2 },
          { label: "Warden", icon: ShieldCheckIcon, count: 1 },
        ]}
        title={<Crumbs items={["outpost", "ask", "ask.create"]} />}
        actions={<Button variant="outline" size="sm">Open lock</Button>}
      >
        <div className="grid min-h-full @3xl:grid-cols-[14rem_1fr]">
          <nav aria-label="Trails" className="flex flex-col gap-3 border-b p-3 @3xl:border-r @3xl:border-b-0">
            {topo.map((group) => (
              <div key={group.group}>
                <p className="px-2 pb-1 text-xs text-muted-foreground">{group.group}</p>
                {group.trails.map((trail) => (
                  <a
                    key={trail.id}
                    href="#"
                    aria-current={trail.id === "ask.create" ? "page" : undefined}
                    className={cn(
                      "flex h-7 items-center gap-2 rounded-md px-2 font-mono text-xs hover:bg-accent",
                      trail.id === "ask.create" && "bg-accent",
                    )}
                  >
                    {trail.id}
                    <span className="ml-auto">
                      <IntentMark intent={trail.intent} />
                    </span>
                  </a>
                ))}
              </div>
            ))}
          </nav>

          <div className="flex min-w-0 flex-col gap-6 p-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-mono text-lg font-semibold">ask.create</h2>
                <IntentMark intent="write" />
                <Badge variant="secondary">v2</Badge>
              </div>
              <p className="mt-1 text-muted-foreground">Ask Matt a question with up to four options. Posts an ask.choice@1 block to the thread.</p>
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
              <section className="min-w-0">
                <Heading>Input</Heading>
                <CodeBlock code={input} label="input" />
              </section>
              <section className="min-w-0">
                <Heading>Output</Heading>
                <CodeBlock code={output} label="output" />
              </section>
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
          </div>
        </div>
      </Shell>
    </Viewport>
  );
}
