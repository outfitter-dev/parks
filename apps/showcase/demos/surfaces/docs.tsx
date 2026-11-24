"use client";

import type { ReactNode } from "react";
import { Mark } from "@workspace/ui/components/mark";
import { GroupLabel } from "@workspace/ui/components/group-label";
import { Card } from "@workspace/ui/components/card";
import { NavItem } from "@workspace/ui/components/nav-item";
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Kbd } from "@workspace/ui/components/kbd";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";
import { AltArrowLeftIcon } from "@solar-icons/react/outline/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/outline/alt-arrow-right";
import { InfoCircleIcon } from "@solar-icons/react/outline/info-circle";
import { MagnifierIcon } from "@solar-icons/react/outline/magnifier";
import { Viewport } from "../kit";
import { CodeBlock } from "./parts";

const sections = [
  { title: "Start", pages: ["Introduction", "Quickstart", "Concepts"] },
  { title: "Guides", pages: ["Ask from an agent", "Route to a webhook", "Mute a channel"] },
  { title: "Reference", pages: ["CLI", "MCP tools", "HTTP API", "Block shapes"] },
];

const onPage = ["Install the CLI", "Sign in", "Send your first ask", "What happens next"];

const installs: Record<string, string> = {
  bun: "bun add -g @outfitter/outpost",
  npm: "npm install -g @outfitter/outpost",
  brew: "brew install outfitter-dev/tap/outpost",
};

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="relative ps-10">
      <Mark shape="circle" className="absolute start-0 top-0 bg-fill-subtle font-medium text-foreground ring-1 ring-border-muted">
        {n}
      </Mark>
      <h2 id={title} className="mb-2 font-semibold">{title}</h2>
      <div className="flex flex-col gap-3 text-muted-foreground">{children}</div>
    </section>
  );
}

/** A docs site: section nav, a readable article column and an on-this-page rail. */
export function DocsSurface() {
  return (
    <Viewport>
      <div className="min-h-160 bg-background text-foreground">
        <header className="flex h-12 items-center gap-4 px-4">
          <span className="flex items-center gap-2 font-semibold">
            <Mark variant="solid" className="font-normal">O</Mark>
            Outpost <span className="font-normal text-muted-foreground">Docs</span>
          </span>
          <Button variant="secondary" className="ms-auto w-64 min-w-0 shrink justify-start gap-2 rounded-lg text-muted-foreground">
            <MagnifierIcon className="size-4" />
            Search docs
            <Kbd className="ms-auto">/</Kbd>
          </Button>
        </header>
        <div className="mx-auto grid max-w-6xl @3xl:grid-cols-[13rem_1fr] @5xl:grid-cols-[13rem_1fr_12rem]">
          <nav aria-label="Docs" className="hidden flex-col gap-5 p-4 @3xl:flex">
            {sections.map((section) => (
              <div key={section.title}>
                <GroupLabel className="mb-1 px-2">{section.title}</GroupLabel>
                {section.pages.map((page) => (
                  <NavItem key={page} href="#" current={page === "Quickstart"} size="sm" className="text-sm">
                    {page}
                  </NavItem>
                ))}
              </div>
            ))}
          </nav>

          <article className="min-w-0 px-4 py-8 @3xl:px-10">
            <p className="text-muted-foreground">Start</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Quickstart</h1>
            <p className="mt-3 max-w-prose text-lg text-muted-foreground">
              Install the CLI, sign in with your Vercel account, and send an ask from an agent to your phone in about five minutes.
            </p>

            <div className="mt-8 flex max-w-prose flex-col gap-8">
              <Step n={1} title="Install the CLI">
                <Tabs defaultValue="bun">
                  <TabsList aria-label="Package manager">
                    {Object.keys(installs).map((manager) => (
                      <TabsTrigger key={manager} value={manager}>
                        {manager}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.entries(installs).map(([manager, command]) => (
                    <TabsContent key={manager} value={manager}>
                      <CodeBlock code={command} label="Terminal" language="bash" />
                    </TabsContent>
                  ))}
                </Tabs>
              </Step>
              <Step n={2} title="Sign in">
                <p>Run the sign-in command. It opens a device approval page, and the CLI waits until you approve it.</p>
                <CodeBlock code={"outpost login\n✓ Approved on this Mac · signed in as Matt"} label="Terminal" />
              </Step>
              <Step n={3} title="Send your first ask">
                <p>Agents ask through the MCP tool or the CLI. Options become buttons on every device.</p>
                <CodeBlock
                  code={`outpost ask create --to matt \\\n  --question "Merge outpost#47 once CI is green?" \\\n  --option Approve --option Hold`}
                  label="Terminal"
                  language="bash"
                  numbers
                />
                <Alert tone="info">
                  <InfoCircleIcon />
                  <AlertTitle>Keep it to four options</AlertTitle>
                  <AlertDescription>Four is the most an iPhone notification can show as actions.</AlertDescription>
                </Alert>
              </Step>
              <Step n={4} title="What happens next">
                <p>The ask lands in Needs you. Your answer posts back to the thread as an answer@1 block, which wakes the agent.</p>
              </Step>
            </div>

            <nav aria-label="Pages" className="mt-12 grid max-w-prose grid-cols-2 gap-3">
              <Card variant="outline" size="sm" render={<a href="#" />} className="gap-0.5 *:px-inset">
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><AltArrowLeftIcon className="size-3" />Previous</span>
                Introduction
              </Card>
              <Card variant="outline" size="sm" render={<a href="#" />} className="items-end gap-0.5 *:px-inset">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">Next<AltArrowRightIcon className="size-3" /></span>
                Concepts
              </Card>
            </nav>
          </article>

          <aside className="hidden py-8 pe-4 @5xl:block">
            <GroupLabel className="mb-2">On this page</GroupLabel>
            <ul className="border-s">
              {onPage.map((item, index) => (
                <li key={item}>
                  <a
                    href={`#${item}`}
                    className={cn(
                      "-ms-px block border-s py-1 ps-3 text-muted-foreground hover:text-foreground",
                      index === 1 ? "border-foreground text-foreground" : "border-transparent",
                    )}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </Viewport>
  );
}
