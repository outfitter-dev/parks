"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Progress } from "@workspace/ui/components/progress";
import { cn } from "@workspace/ui/lib/utils";
import { AltArrowDownIcon } from "@solar-icons/react/linear/alt-arrow-down";
import { ChatRoundDotsIcon } from "@solar-icons/react/linear/chat-round-dots";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { CodeSquareIcon } from "@solar-icons/react/linear/code-square";
import { GitBranchIcon } from "@solar-icons/react/linear/git-branch";
import { HistoryIcon } from "@solar-icons/react/linear/history";
import { InboxIcon } from "@solar-icons/react/linear/inbox";
import { RoutingIcon } from "@solar-icons/react/linear/routing";
import { UsersGroupRoundedIcon } from "@solar-icons/react/linear/users-group-rounded";
import { Widget2Icon } from "@solar-icons/react/linear/widget-2";
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
import { Shell, Stat, Heading } from "./parts";

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
  { lane: "done", title: "YOSE-43 eval harness", agent: "Ranger lead", project: "ranger", note: "Merged #56" },
];

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
              className={cn("h-1 flex-1 rounded-full", index < done ? "bg-brand" : "bg-foreground/10")}
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
          <HaloSignal tone="wait" label={`${task.agent} is working`} />
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
    { date: "10:02", title: "Picked up DENA-44", body: "Read the stack plan and the review on climb#91." },
    { date: "10:09", title: "Reproduced the hang", body: "A two-layer cycle loops forever in stackLayers." },
    { date: "10:31", title: "Wrote the fix", body: "Visited set on the parent walk; 3 new tests." },
    { date: "now", title: "Running the full gate", body: "bun run check, 2 of 4 jobs done." },
    { date: "next", title: "Open the PR", body: "Draft, then ask Codex for review." },
  ];
  return (
    <Timeline defaultValue={3}>
      {steps.map((step, index) => (
        <TimelineItem key={step.title} step={index + 1} className="pb-5 last:pb-0">
          <TimelineHeader>
            <TimelineDate>{step.date}</TimelineDate>
            <TimelineTitle>{step.title}</TimelineTitle>
          </TimelineHeader>
          <TimelineIndicator className={cn(index === 3 && "border-brand bg-brand/20")} />
          <TimelineSeparator />
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
      <Shell
        mark="O"
        name="Outpost"
        active="Overview"
        nav={[
          { label: "Overview", icon: Widget2Icon },
          { label: "Needs you", icon: ChatRoundDotsIcon, count: 2 },
          { label: "Inbox", icon: InboxIcon },
          { label: "Agents", icon: UsersGroupRoundedIcon, count: 5 },
          { label: "Routing", icon: RoutingIcon },
          { label: "History", icon: HistoryIcon },
        ]}
        title="Overview"
        actions={
          <>
            <Badge variant="outline">
              Board synced
            </Badge>
            <Button size="sm">New task</Button>
          </>
        }
      >
        <div className="flex flex-col gap-6 p-4">
          <div className="grid grid-cols-2 gap-3 @3xl:grid-cols-4">
            <Stat label="Asking you" value="2" note="Oldest 1 hr" />
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
            <div className="grid gap-4 rounded-xl bg-muted/50 p-2 @3xl:grid-cols-4 @3xl:gap-2">
              {lanes.map((lane) => (
                <div key={lane.id} className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 px-1 text-muted-foreground">
                    {lane.title}
                    <span className="ml-auto text-xs tabular-nums">{tasks.filter((task) => task.lane === lane.id).length}</span>
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
              <FramePanel className="flex flex-col gap-3">
                <span className="flex items-center gap-2">
                  <GitBranchIcon className="size-4 text-muted-foreground" />
                  climb#91
                  <Badge variant="warning" className="ml-auto">Changes requested</Badge>
                </span>
                <span className="flex items-center gap-2">
                  <CodeSquareIcon className="size-4 text-muted-foreground" />
                  CI · check
                  <Badge variant="outline" className="ml-auto">
                    2 of 4
                  </Badge>
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircleIcon className="size-4 text-muted-foreground" />
                  DENA-44
                  <Badge variant="secondary" className="ml-auto">In progress</Badge>
                </span>
              </FramePanel>
            </Frame>
          </div>
        </div>
      </Shell>
    </Viewport>
  );
}
