"use client";

import { FileTree, useFileTree, useFileTreeSelection } from "@pierre/trees/react";
import { Item, ItemGroup, ItemMeta } from "@workspace/ui/components/item";
import { Badge } from "@workspace/ui/components/badge";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@workspace/ui/components/empty";
import { Button } from "@workspace/ui/components/button";
import { ToggleGroup, ToggleGroupItem } from "@workspace/ui/components/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "@workspace/ui/components/tooltip";
import { BoxIcon } from "@solar-icons/react/outline/box";
import { BoxIcon as BoxBold } from "@solar-icons/react/bold/box";
import { ChecklistIcon } from "@solar-icons/react/outline/checklist";
import { ChecklistIcon as ChecklistBold } from "@solar-icons/react/bold/checklist";
import { HistoryIcon } from "@solar-icons/react/outline/history";
import { HistoryIcon as HistoryBold } from "@solar-icons/react/bold/history";
import { LayersMinimalisticIcon } from "@solar-icons/react/outline/layers-minimalistic";
import { LayersMinimalisticIcon as LayersMinimalisticBold } from "@solar-icons/react/bold/layers-minimalistic";
import { SettingsIcon } from "@solar-icons/react/outline/settings";
import { SettingsIcon as SettingsBold } from "@solar-icons/react/bold/settings";
import { WrenchIcon } from "@solar-icons/react/outline/wrench";
import { AppFrame } from "../app-frame";
import type { AppNavigation } from "../app-sidebar";
import { Signal, Viewport } from "../kit";
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
import { ExplorerLayout } from "./explorer-layout";
import { CodeBlock, Heading } from "./parts";

const navigation = {
  name: "Skillset",
  mark: "S",
  items: [
    { id: "source", label: "Source", icon: LayersMinimalisticIcon, solid: LayersMinimalisticBold },
    { id: "plugins", label: "Plugins", icon: BoxIcon, solid: BoxBold, count: 3 },
    { id: "checks", label: "Checks", icon: ChecklistIcon, solid: ChecklistBold, count: 1 },
    { id: "changes", label: "Changes", icon: HistoryIcon, solid: HistoryBold, count: 2 },
    { id: "settings", label: "Settings", icon: SettingsIcon, solid: SettingsBold },
  ],
} satisfies AppNavigation;

const skillsPath = "plugins/outfitter-dev/skills";
const landingPath = `${skillsPath}/landing/`;
const landingFile = `${landingPath}SKILL.md`;
const newSkillPath = `${skillsPath}/bluf-asks/`;

const sourcePaths = [
  "plugins/outfitter-dev/plugin.yaml",
  `${skillsPath}/building/`,
  landingFile,
  `${skillsPath}/reckoning/`,
  newSkillPath,
  "rules/RULES.md",
  "skillset.yaml",
];

const sourceStatusStyles = `
  [data-item-section="decoration"]:has(> span) {
    flex: none;
    justify-content: center;
    align-items: center;
    margin-inline-start: auto;
    width: var(--trees-git-lane-width);
  }
  [data-item-section="decoration"]:has(> span) + [data-item-section="git"] {
    display: none;
  }
  [data-item-section="decoration"] > [title="New"] { color: var(--info); }
  [data-item-section="decoration"] > [title="Drifted"] { color: var(--warning); }
  [data-item-section="decoration"] > [title="Issue"] { color: var(--destructive); }
  [data-item-section="decoration"] [data-icon-name="file-tree-icon-dot"] {
    fill: currentColor;
  }
  [data-item-section="git"] [data-icon-name="file-tree-icon-dot"] {
    transform: none;
  }
`;

const targets = [
  { name: "Claude Code", path: ".claude/skills/landing/SKILL.md", state: "drift" as const },
  { name: "Codex", path: ".agents/skills/landing/SKILL.md", state: "ok" as const },
  { name: "Cursor", path: ".cursor/skills/landing/SKILL.md", state: "ok" as const },
  { name: "Plugin", path: "plugins/outfitter-dev/skills/landing/SKILL.md", state: "ok" as const },
];

const frontmatter = `---
name: landing
description: Merge a reviewed, green change or stack under
  existing authority, bottom-up, and confirm what landed.
metadata:
  skillset:
    targets: [claude, codex, cursor]
    version: 0.4.0
---`;

/** Skillset: the source tree on the left, one skill with its rendered outputs on the right. */
export function SkillsetSurface() {
  const { model } = useFileTree({
    paths: sourcePaths,
    initialExpansion: "closed",
    initialExpandedPaths: ["plugins", "plugins/outfitter-dev", skillsPath, "rules"],
    initialSelectedPaths: [landingPath],
    flattenEmptyDirectories: false,
    itemHeight: 28,
    icons: { set: "complete", colored: true },
    gitStatus: [
      { path: landingFile, status: "modified" },
      { path: "rules/RULES.md", status: "added" },
    ],
    unsafeCSS: sourceStatusStyles,
    renderRowDecoration: ({ row }) => {
      const title = row.path === landingPath ? "Drifted" : row.path === newSkillPath ? "New" : null;
      return title ? { icon: { name: "file-tree-icon-dot", width: 6, height: 6 }, title } : null;
    },
  });
  const selectedPath = useFileTreeSelection(model).at(-1) ?? landingPath;
  const showLanding = selectedPath === landingPath || selectedPath === landingFile;
  const path = showLanding
    ? ["camp", "outfitter-dev", "landing"]
    : ["camp", ...selectedPath.split("/").filter(Boolean)];
  return (
    <Viewport>
      <AppFrame navigation={navigation} place="source">
        <ExplorerLayout
          browserLabel=".skillset"
          browser={<FileTree model={model} className="workbench-file-tree mb-2 h-84" aria-label="Skillset source files" />}
          path={path}
          actions={showLanding ? (
            <>
              <Button variant="outline" size="sm">Explain</Button>
              <Button size="sm">Build</Button>
            </>
          ) : null}
        >
          {showLanding ? (
            <LandingDetails />
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No preview</EmptyTitle>
                <EmptyDescription className="font-mono text-xs">{selectedPath}</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </ExplorerLayout>
      </AppFrame>
    </Viewport>
  );
}

function LandingDetails() {
  return (
    <>
      <div className="flex flex-wrap items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold">landing</h2>
            <Badge mono>.md</Badge>
          </div>
          <p className="text-muted-foreground">
            Merge a reviewed, green change or stack under existing authority, bottom-up, and confirm what landed.
          </p>
        </div>
        <Badge tone="warning">1 output drifted</Badge>
      </div>

      <ToggleGroup aria-label="Show" defaultValue={["outputs"]}>
        <ToggleGroupItem value="outputs">Outputs</ToggleGroupItem>
        <ToggleGroupItem value="source">Source</ToggleGroupItem>
        <ToggleGroupItem value="changes">Changes</ToggleGroupItem>
      </ToggleGroup>

      <section>
        <Heading>Rendered for each target</Heading>
        <ItemGroup variant="list" className="grid grid-cols-[max-content_minmax(0,1fr)_max-content] gap-x-2 rounded-lg border [--row-action-inset:--spacing(1)]">
          {targets.map((target) => {
            const drifted = target.state === "drift";
            return (
              <Item key={target.name} size="xs" className="col-span-3 grid min-h-9 grid-cols-subgrid gap-x-2 py-(--row-action-inset) ps-2.5 pe-(--row-action-inset)">
                <Tooltip>
                  <TooltipTrigger render={<span tabIndex={0} />} className="flex items-center gap-1.5 rounded-xs text-xs font-medium focus-visible:outline-2 focus-visible:outline-ring">
                    <Signal tone={drifted ? "wait" : "live"} />
                    {target.name}
                    <span className="sr-only"> · {drifted ? "Hand-edited" : "In sync"}</span>
                  </TooltipTrigger>
                  <TooltipContent>{drifted ? "Hand-edited since it was rendered" : "In sync with the source"}</TooltipContent>
                </Tooltip>
                <ItemMeta title={target.path} className="min-w-0 truncate font-mono text-xs">{target.path}</ItemMeta>
                {drifted ? (
                  <Tooltip>
                    <TooltipTrigger render={<Button
                      variant="ghost"
                      shape="rect"
                      size="icon-sm"
                      aria-label={`Repair ${target.name} output`}
                      className="rounded-inset-action"
                    />}>
                      <WrenchIcon />
                    </TooltipTrigger>
                    <TooltipContent>Repair output</TooltipContent>
                  </Tooltip>
                ) : null}
              </Item>
            );
          })}
        </ItemGroup>
      </section>

      <div className="grid gap-6 @5xl:grid-cols-[1.4fr_1fr]">
        <section className="min-w-0">
          <Heading>Frontmatter</Heading>
          <CodeBlock code={frontmatter} label="SKILL.md" language="yaml" numbers />
        </section>
        <section>
          <Heading>Change ledger</Heading>
          <Timeline defaultValue={2}>
            {[
              { date: "2026-11-22", label: "Nov 22", version: "0.5.0", pending: true, body: "Adds the confirm-what-landed step." },
              { date: "2026-11-20", label: "Nov 20", version: "0.4.0", body: "Bottom-up merge order for stacks." },
              { date: "2026-11-14", label: "Nov 14", version: "0.3.0", body: "Merge queue support." },
            ].map((entry, index) => (
              <TimelineItem key={entry.version} step={index + 1} className="group-data-[orientation=vertical]/timeline:not-last:pb-3">
                <TimelineHeader className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <TimelineTitle className="font-medium">{entry.version}</TimelineTitle>
                    <Badge tone={entry.pending ? "warning" : "neutral"}>
                      {entry.pending ? "Pending" : "Released"}
                    </Badge>
                  </div>
                  <TimelineDate dateTime={entry.date} className="mb-0 shrink-0 font-normal">{entry.label}</TimelineDate>
                </TimelineHeader>
                <TimelineIndicator className="group-data-[orientation=vertical]/timeline:top-0.5" />
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:translate-y-5" />
                <TimelineContent className="text-xs">{entry.body}</TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </section>
      </div>
    </>
  );
}
