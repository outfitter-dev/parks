"use client";

import { Item, ItemActions, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@workspace/ui/components/item";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import { cn } from "@workspace/ui/lib/utils";
import { AltArrowDownIcon } from "@solar-icons/react/outline/alt-arrow-down";
import { CheckCircleIcon } from "@solar-icons/react/outline/check-circle";
import { CodeSquareIcon } from "@solar-icons/react/outline/code-square";
import { GitBranchIcon } from "@solar-icons/react/outline/git-branch";
import { Widget2Icon } from "@solar-icons/react/outline/widget-2";
import { Widget2Icon as Widget2Bold } from "@solar-icons/react/bold/widget-2";
import { AppFrame } from "../app-frame";
import { outpostNavigation } from "../outpost-navigation";
import { DotmCircular4 } from "../dotmatrix/dotm-circular-4";
import { DotmHex4 } from "../dotmatrix/dotm-hex-4";
import { HaloSignal, Signal, Viewport } from "../kit";
import { Frame, FrameHeader, FramePanel, FrameTitle, FrameDescription } from "../reui/frame";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "../reui/timeline";
import { Stat, Heading } from "./parts";

type Lane = "asking" | "working" | "review" | "done";

const lanes: { id: Lane; title: string }[] = [
  { id: "asking", title: "Asking you" },
  { id: "working", title: "Working" },
  { id: "review", title: "In review" },
  { id: "done", title: "Done today" },
];

type Task = {
  lane: Lane;
  title: string;
  agent: string;
  project: string;
  note?: string;
  /** Counted steps draw as segments; a bare percentage draws as a bar. */
  steps?: { done: number; total: number };
  progress?: number;
};

const tasks: Task[] = [
  { lane: "asking", title: "Merge outpost#47 once CI is green?", agent: "Donna", project: "outpost", note: "Approval · 4 min" },
  { lane: "asking", title: "Run the v5 vs v6 held-out comparison?", agent: "Ranger lead", project: "ranger", note: "Choice · 1 hr" },
  { lane: "working", title: "Fix the parent-cycle hang in stackLayers", agent: "Climb lead", project: "climb", steps: { done: 3, total: 5 } },
  { lane: "working", title: "Trusted-install check, round 4", agent: "Forge lead", project: "forge", note: "Running tests", progress: 35 },
  { lane: "review", title: "rumdl replaces markdownlint", agent: "Rex", project: "ropes", note: "Devin and Codex reviewing" },
  { lane: "done", title: "Gate policy", agent: "Forge lead", project: "forge", note: "Merged forge#52" },
  { lane: "done", title: "RNG-43 eval harness", agent: "Ranger lead", project: "ranger", note: "Merged #56" },
];

const asksCount = tasks.filter((task) => task.lane === "asking").length;

const navigation = {
  ...outpostNavigation,
  items: [
    { id: "overview", label: "Overview", icon: Widget2Icon, solid: Widget2Bold },
    ...outpostNavigation.items.map((item) => item.id === "needs-you" ? { ...item, count: asksCount } : item),
  ],
};

/** Progress and its label on one line: segments for counted steps, a bar for a percentage. */
function Meter({ task }: { task: Task }) {
  if (task.steps) {
    const { done, total } = task.steps;
    return (
      <span className="flex items-center gap-2" role="img" aria-label={`Step ${done} of ${total}`}>
        <span className="flex flex-1 gap-0.5">
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className={cn("h-1 flex-1 rounded-full", index < done ? "bg-brand" : "bg-fill-strong")}
            />
          ))}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {done}/{total}
        </span>
      </span>
    );
  }
  if (task.progress === undefined) return null;
  return (
    <span className="flex items-center gap-2">
      <Progress value={task.progress} aria-label="Progress" className="flex-1" />
      <span className="text-xs text-muted-foreground tabular-nums">{task.progress}%</span>
    </span>
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <article className="relative flex flex-col gap-2 rounded-lg border bg-background p-3 shadow-xs">
      <span className="absolute top-2 right-2 grid size-4 place-items-center">
        {task.lane === "working" ? (
          <HaloSignal label={`${task.agent} is working`} />
        ) : (
          <Signal tone={task.lane === "asking" ? "wait" : task.lane === "done" ? "live" : "off"} />
        )}
      </span>
      <span className="flex flex-col pe-4">
        <span className="text-trim-start truncate font-medium">{task.agent}</span>
        <span className="truncate text-xs text-muted-foreground">{task.project}</span>
      </span>
      <span className="leading-snug">{task.title}</span>
      <Meter task={task} />
      {task.note ? <span className="text-xs text-muted-foreground">{task.note}</span> : null}
    </article>
  );
}

function RunTimeline() {
  const steps = [
    { date: "10:02", title: "Picked up CLI-44", body: "Read the stack plan and the review on climb#91." },
    { date: "10:09", title: "Reproduced the hang", body: "A two-layer cycle loops forever in stackLayers." },
    { date: "10:31", title: "Wrote the fix", body: "Visited set on the parent walk; 3 new tests." },
    { date: "now", title: "Running the full gate", body: "bun run check, 2 of 4 jobs done." },
    { date: "next", title: "Open the PR", body: "Draft, then ask Codex for review." },
  ];
  return (
    <Timeline defaultValue={3}>
      {steps.map((step, index) => (
        <TimelineItem key={step.title} step={index + 1} className="gap-0 pb-3 last:pb-0">
          <TimelineHeader className="flex h-5 items-center gap-2">
            <TimelineTitle className="text-trim min-w-0 flex-1">{step.title}</TimelineTitle>
            <TimelineDate className="text-trim mb-0 shrink-0 font-normal tabular-nums">{step.date}</TimelineDate>
          </TimelineHeader>
          <TimelineIndicator className={cn("mt-0.5", index === 3 && "border-brand bg-brand-fill")} />
          <TimelineSeparator className="mt-0.5" />
          <TimelineContent>{step.body}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

/** Mission control: the fleet at a glance, work by Board state, and one run in detail. */
export function BoardSurface() {
  return (
    <Viewport>
      <AppFrame
        navigation={navigation}
        place="overview"
        title="Overview"
        actions={
          <>
            <Badge tone="success" icon={<DotmHex4 size={12} dotSize={2} ariaLabel="Syncing" />}>
              Board synced
            </Badge>
            <Button size="sm">New task</Button>
          </>
        }
      >
        <div className="flex flex-col gap-6 p-4">
          <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4">
            <Stat label="Asking you" value={String(asksCount)} note="Oldest 1 hr" />
            <Stat label="Working" value="2" note="Across 2 projects" />
            <Stat label="In review" value="1" note="Waiting on reviewers" />
            <Stat label="Done today" value="2" note="Both merged" />
          </div>

          <section>
            <Heading
              action={
                <Button variant="secondary" size="sm">
                  All projects
                  <AltArrowDownIcon data-icon="inline-end" />
                </Button>
              }
            >
              Work by state
            </Heading>
            <div className="grid gap-4 rounded-xl bg-fill-subtle p-2 @3xl:grid-cols-4 @3xl:gap-2">
              {lanes.map((lane) => (
                <div key={lane.id} className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 px-1 text-muted-foreground">
                    {lane.title}
                    <Badge count={tasks.filter((task) => task.lane === lane.id).length} className="ms-auto" />
                  </span>
                  {tasks
                    .filter((task) => task.lane === lane.id)
                    .map((task) => (
                      <TaskCard key={task.title} task={task} />
                    ))}
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-4 @3xl:grid-cols-[1fr_20rem]">
            <Frame>
              <FrameHeader>
                <FrameTitle>Climb lead · fix the parent-cycle hang</FrameTitle>
                <FrameDescription>Run card, edited in place as the run moves</FrameDescription>
              </FrameHeader>
              <FramePanel>
                <RunTimeline />
              </FramePanel>
            </Frame>
            <Frame className="self-start">
              <FrameHeader>
                <FrameTitle>Linked</FrameTitle>
                <FrameDescription>Objects this run touches</FrameDescription>
              </FrameHeader>
              <FramePanel>
                <ItemGroup variant="open" className="gap-1">
                  <Item size="xs" className="px-0">
                    <ItemMedia variant="icon"><GitBranchIcon className="text-muted-foreground" /></ItemMedia>
                    <ItemContent><ItemTitle className="font-normal">climb#91</ItemTitle></ItemContent>
                    <ItemActions><Badge tone="warning" dot>Changes requested</Badge></ItemActions>
                  </Item>
                  <Item size="xs" className="px-0">
                    <ItemMedia variant="icon"><CodeSquareIcon className="text-muted-foreground" /></ItemMedia>
                    <ItemContent><ItemTitle className="font-normal">CI · check</ItemTitle></ItemContent>
                    <ItemActions>
                      <Badge tone="info" icon={<DotmCircular4 size={12} dotSize={2} ariaLabel="Running" />}>2 of 4</Badge>
                    </ItemActions>
                  </Item>
                  <Item size="xs" className="px-0">
                    <ItemMedia variant="icon"><CheckCircleIcon className="text-muted-foreground" /></ItemMedia>
                    <ItemContent><ItemTitle className="font-normal">CLI-44</ItemTitle></ItemContent>
                    <ItemActions><Badge tone="info" live>In progress</Badge></ItemActions>
                  </Item>
                </ItemGroup>
              </FramePanel>
            </Frame>
          </div>
        </div>
      </AppFrame>
    </Viewport>
  );
}
