"use client";

import { Badge } from "@outfitter/parks/components/badge";
import { Button } from "@outfitter/parks/components/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@outfitter/parks/components/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@outfitter/parks/components/item";
import { Progress } from "@outfitter/parks/components/progress";
import { StatusDot } from "@outfitter/parks/components/status-dot";
import { cn } from "@outfitter/parks/lib/utils";
import { Widget2Icon as Widget2Bold } from "@solar-icons/react/bold/widget-2";
import { AltArrowDownIcon } from "@solar-icons/react/linear/alt-arrow-down";
import { CheckCircleIcon } from "@solar-icons/react/linear/check-circle";
import { CodeSquareIcon } from "@solar-icons/react/linear/code-square";
import { GitBranchIcon } from "@solar-icons/react/linear/git-branch";
import { Widget2Icon } from "@solar-icons/react/linear/widget-2";

import { AppFrame } from "../app-frame";
import { HaloSignal, Signal, Viewport } from "../kit";
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
import { sequoiaNavigation } from "../sequoia-navigation";
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
  {
    lane: "asking",
    title: "Merge sequoia#47 once CI is green?",
    agent: "Mardy",
    project: "sequoia",
    note: "Approval · 4 min",
  },
  {
    lane: "asking",
    title: "Run the v5 vs v6 held-out comparison?",
    agent: "Yosemite lead",
    project: "yosemite",
    note: "Choice · 1 hr",
  },
  {
    lane: "working",
    title: "Fix the parent-cycle hang in stackLayers",
    agent: "Denali lead",
    project: "denali",
    steps: { done: 3, total: 5 },
  },
  {
    lane: "working",
    title: "Trusted-install check, round 4",
    agent: "Zion lead",
    project: "zion",
    note: "Running tests",
    progress: 35,
  },
  {
    lane: "review",
    title: "rumdl replaces markdownlint",
    agent: "Bartram",
    project: "acadia",
    note: "Devin and Codex reviewing",
  },
  {
    lane: "done",
    title: "Gate policy",
    agent: "Zion lead",
    project: "zion",
    note: "Merged zion#52",
  },
  {
    lane: "done",
    title: "YOSE-43 eval harness",
    agent: "Yosemite lead",
    project: "yosemite",
    note: "Merged #56",
  },
];

const asksCount = tasks.filter((task) => task.lane === "asking").length;

const navigation = {
  ...sequoiaNavigation,
  items: [
    {
      id: "overview",
      label: "Overview",
      icon: Widget2Icon,
      solid: Widget2Bold,
    },
    ...sequoiaNavigation.items.map((item) =>
      item.id === "needs-you" ? { ...item, count: asksCount } : item
    ),
  ],
};

/** Progress and its label on one line: segments for counted steps, a bar for a percentage. */
function Meter({ task }: { task: Task }) {
  if (task.steps) {
    const { done, total } = task.steps;
    return (
      <Progress
        tone="brand"
        value={done}
        max={total}
        segments
        showValue
        aria-label={`Step ${done} of ${total}`}
      />
    );
  }
  if (task.progress === undefined) {
    return null;
  }
  return (
    <Progress
      tone="brand"
      value={task.progress}
      showValue
      aria-label="Progress"
    />
  );
}

function TaskCard({ task }: { task: Task }) {
  return (
    <Card
      variant="outline"
      size="sm"
      render={<article />}
      interactive={false}
      className="gap-2"
    >
      <CardHeader>
        <CardTitle className="truncate font-medium">{task.agent}</CardTitle>
        <CardDescription className="mt-0 truncate text-xs">
          {task.project}
        </CardDescription>
        <CardAction className="size-4 justify-center">
          {task.lane === "working" ? (
            <HaloSignal label={`${task.agent} is working`} />
          ) : (
            <Signal
              tone={
                task.lane === "asking"
                  ? "wait"
                  : task.lane === "done"
                    ? "live"
                    : "off"
              }
            />
          )}
        </CardAction>
      </CardHeader>
      <div className="*:px-inset flex flex-col gap-2 px-(--frame-space)">
        <span className="leading-snug">{task.title}</span>
        <Meter task={task} />
        {task.note ? (
          <span className="text-muted-foreground text-xs">{task.note}</span>
        ) : null}
      </div>
    </Card>
  );
}

function RunTimeline() {
  const steps = [
    {
      date: "10:02",
      title: "Picked up DENA-44",
      body: "Read the stack plan and the review on denali#91.",
    },
    {
      date: "10:09",
      title: "Reproduced the hang",
      body: "A two-layer cycle loops forever in stackLayers.",
    },
    {
      date: "10:31",
      title: "Wrote the fix",
      body: "Visited set on the parent walk; 3 new tests.",
    },
    {
      date: "now",
      title: "Running the full gate",
      body: "bun run check, 2 of 4 jobs done.",
    },
    {
      date: "next",
      title: "Open the PR",
      body: "Draft, then ask Codex for review.",
    },
  ];
  return (
    <Timeline defaultValue={3}>
      {steps.map((step, index) => (
        <TimelineItem
          key={step.title}
          step={index + 1}
          className="gap-0 pb-3 last:pb-0"
        >
          <TimelineHeader className="flex h-5 items-center gap-2">
            <TimelineTitle className="text-trim min-w-0 flex-1">
              {step.title}
            </TimelineTitle>
            <TimelineDate className="text-trim mb-0 shrink-0 font-normal tabular-nums">
              {step.date}
            </TimelineDate>
          </TimelineHeader>
          <TimelineIndicator
            className={cn(
              "mt-0.5",
              index === 3 && "border-brand bg-brand-fill"
            )}
          />
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
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <StatusDot tone="success" />
              Synced
            </span>
            <Button size="sm">New task</Button>
          </>
        }
      >
        <div className="flex flex-col gap-6 p-4">
          <dl className="grid grid-cols-2 gap-3 @3xl:grid-cols-4">
            <Stat
              label="Asking you"
              value={String(asksCount)}
              note="Oldest 1 hr"
            />
            <Stat label="Working" value="2" note="Across 2 projects" />
            <Stat label="In review" value="1" note="Waiting on reviewers" />
            <Stat label="Done today" value="2" note="Both merged" />
          </dl>

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
            <Card
              variant="tray"
              className="grid gap-4 @3xl:grid-cols-4 @3xl:gap-2"
            >
              {lanes.map((lane) => (
                <div key={lane.id} className="flex flex-col gap-2">
                  <span className="text-muted-foreground flex items-center gap-2 px-1">
                    {lane.title}
                    <Badge
                      count={
                        tasks.filter((task) => task.lane === lane.id).length
                      }
                      className="ms-auto"
                    />
                  </span>
                  {tasks
                    .filter((task) => task.lane === lane.id)
                    .map((task) => (
                      <TaskCard key={task.title} task={task} />
                    ))}
                </div>
              ))}
            </Card>
          </section>

          <div className="grid gap-4 @3xl:grid-cols-[1fr_20rem]">
            <Card>
              <CardHeader>
                <CardTitle>Denali lead · fix the parent-cycle hang</CardTitle>
                <CardDescription>
                  Run card, edited in place as the run moves
                </CardDescription>
              </CardHeader>
              <CardContent className="*:px-inset px-(--frame-space)">
                <RunTimeline />
              </CardContent>
            </Card>
            <Card className="self-start">
              <CardHeader>
                <CardTitle>Linked</CardTitle>
                <CardDescription>Objects this run touches</CardDescription>
              </CardHeader>
              <CardContent className="px-(--frame-space)">
                <ItemGroup variant="open" className="gap-1">
                  <Item size="xs" className="px-0">
                    <ItemMedia variant="icon">
                      <GitBranchIcon className="text-muted-foreground" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="font-normal">denali#91</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Badge tone="warning" dot>
                        Changes requested
                      </Badge>
                    </ItemActions>
                  </Item>
                  <Item size="xs" className="px-0">
                    <ItemMedia variant="icon">
                      <CodeSquareIcon className="text-muted-foreground" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="font-normal">CI · check</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Badge
                        tone="info"
                        icon={
                          <HaloSignal
                            size={12}
                            label="Running"
                            className="text-tone-mark"
                          />
                        }
                      >
                        2 of 4
                      </Badge>
                    </ItemActions>
                  </Item>
                  <Item size="xs" className="px-0">
                    <ItemMedia variant="icon">
                      <CheckCircleIcon className="text-muted-foreground" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="font-normal">DENA-44</ItemTitle>
                    </ItemContent>
                    <ItemActions>
                      <Badge tone="info" live>
                        In progress
                      </Badge>
                    </ItemActions>
                  </Item>
                </ItemGroup>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppFrame>
    </Viewport>
  );
}
