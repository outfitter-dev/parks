"use client";

import { useState } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";
import { AltArrowDownIcon } from "@solar-icons/react/linear/alt-arrow-down";
import { FolderIcon } from "@solar-icons/react/linear/folder";
import { BoxIcon } from "@solar-icons/react/linear/box";
import { ChecklistIcon } from "@solar-icons/react/linear/checklist";
import { HistoryIcon } from "@solar-icons/react/linear/history";
import { LayersMinimalisticIcon } from "@solar-icons/react/linear/layers-minimalistic";
import { SettingsIcon } from "@solar-icons/react/linear/settings";
import { Viewport } from "../kit";
import { FileType } from "../reui/file-type";
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
import { CodeBlock, Crumbs, Heading, Shell } from "./parts";

type Node = { name: string; type: string; children?: Node[]; state?: "drift" | "new" };

const source: Node[] = [
  {
    name: "plugins",
    type: "folder",
    children: [
      {
        name: "outfitter-dev",
        type: "folder",
        children: [
          { name: "plugin.yaml", type: "yaml" },
          {
            name: "skills",
            type: "folder",
            children: [
              { name: "building", type: "folder", children: [] },
              { name: "landing", type: "folder", children: [], state: "drift" },
              { name: "reckoning", type: "folder", children: [] },
              { name: "bluf-asks", type: "folder", children: [], state: "new" },
            ],
          },
        ],
      },
    ],
  },
  { name: "rules", type: "folder", children: [{ name: "RULES.md", type: "md" }] },
  { name: "skillset.yaml", type: "yaml" },
];

function TreeRow({ node, depth, selected, onSelect }: { node: Node; depth: number; selected: string; onSelect: (name: string) => void }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(node.name)}
        aria-current={node.name === selected ? "true" : undefined}
        className={cn(
          "flex h-7 w-full items-center gap-2 rounded-md pe-2 text-left hover:bg-accent",
          node.name === selected && "bg-accent",
        )}
        style={{ paddingInlineStart: `calc(${depth} * var(--spacing) * 4 + var(--spacing) * 2)` }}
      >
        {node.children ? <AltArrowDownIcon className={cn("size-3 text-muted-foreground", node.children.length === 0 && "-rotate-90")} /> : <span className="w-3" />}
        {node.children ? (
          <FolderIcon className="size-4 text-muted-foreground" />
        ) : (
          <FileType type={node.type} size="mini" />
        )}
        <span className="truncate font-mono text-xs">{node.name}</span>
        {node.state === "drift" ? <span className="ml-auto size-1.5 rounded-full bg-warning" aria-label="Drifted" /> : null}
        {node.state === "new" ? <span className="ml-auto text-xs text-info-foreground">new</span> : null}
      </button>
      {node.children ? (
        <ul>
          {node.children.map((child) => (
            <TreeRow key={child.name} node={child} depth={depth + 1} selected={selected} onSelect={onSelect} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

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
  const [selected, setSelected] = useState("landing");
  return (
    <Viewport>
      <Shell
        mark="S"
        name="Skillset"
        active="Source"
        nav={[
          { label: "Source", icon: LayersMinimalisticIcon },
          { label: "Plugins", icon: BoxIcon, count: 3 },
          { label: "Checks", icon: ChecklistIcon, count: 1 },
          { label: "Changes", icon: HistoryIcon, count: 2 },
          { label: "Settings", icon: SettingsIcon },
        ]}
        title={<Crumbs items={["camp", "outfitter-dev", "landing"]} />}
        actions={
          <>
            <Button variant="outline" size="sm">Explain</Button>
            <Button size="sm">Build</Button>
          </>
        }
      >
        <div className="grid min-h-full @3xl:grid-cols-[16rem_1fr]">
          <div className="border-b p-2 @3xl:border-r @3xl:border-b-0">
            <p className="px-2 py-1 text-xs text-muted-foreground">.skillset</p>
            <ul>
              {source.map((node) => (
                <TreeRow key={node.name} node={node} depth={0} selected={selected} onSelect={setSelected} />
              ))}
            </ul>
          </div>

          <div className="flex min-w-0 flex-col gap-6 p-4">
            <div className="flex flex-wrap items-start gap-3">
              <FileType type="md" size="sm" />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold">landing</h2>
                <p className="text-muted-foreground">
                  Merge a reviewed, green change or stack under existing authority, bottom-up, and confirm what landed.
                </p>
              </div>
              <Badge variant="warning">1 output drifted</Badge>
            </div>

            <Tabs defaultValue="outputs">
              <TabsList>
                <TabsTrigger value="outputs">Outputs</TabsTrigger>
                <TabsTrigger value="source">Source</TabsTrigger>
                <TabsTrigger value="changes">Changes</TabsTrigger>
              </TabsList>
            </Tabs>

            <section>
              <Heading>Rendered for each target</Heading>
              <ul className="divide-y rounded-lg border">
                {targets.map((target) => (
                  <li key={target.name} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2.5">
                    <span className="w-28 font-medium">{target.name}</span>
                    <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">{target.path}</span>
                    {target.state === "drift" ? (
                      <>
                        <Badge variant="warning" dot>Hand-edited</Badge>
                        <Button variant="secondary" size="sm">Repair</Button>
                      </>
                    ) : (
                      <Badge variant="success" dot>In sync</Badge>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            <div className="grid gap-6 @5xl:grid-cols-[1.4fr_1fr]">
              <section className="min-w-0">
                <Heading>Frontmatter</Heading>
                <CodeBlock code={frontmatter} label="SKILL.md" numbers />
              </section>
              <section>
                <Heading>Change ledger</Heading>
                <Timeline defaultValue={2}>
                  {[
                    { date: "Nov 22", title: "Pending · minor", body: "Adds the confirm-what-landed step." },
                    { date: "Nov 20", title: "Released 0.4.0", body: "Bottom-up merge order for stacks." },
                    { date: "Nov 14", title: "Released 0.3.0", body: "Merge queue support." },
                  ].map((entry, index) => (
                    <TimelineItem key={entry.title} step={index + 1} className="pb-5 last:pb-0">
                      <TimelineHeader>
                        <TimelineDate>{entry.date}</TimelineDate>
                        <TimelineTitle>{entry.title}</TimelineTitle>
                      </TimelineHeader>
                      <TimelineIndicator />
                      <TimelineSeparator />
                      <TimelineContent>{entry.body}</TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </section>
            </div>
          </div>
        </div>
      </Shell>
    </Viewport>
  );
}
