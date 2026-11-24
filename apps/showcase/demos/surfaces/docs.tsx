"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@outfitter/parks/components/alert";
import { Button } from "@outfitter/parks/components/button";
import { Card } from "@outfitter/parks/components/card";
import { GroupLabel } from "@outfitter/parks/components/group-label";
import { Kbd } from "@outfitter/parks/components/kbd";
import { Mark } from "@outfitter/parks/components/mark";
import { NavItem } from "@outfitter/parks/components/nav-item";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@outfitter/parks/components/tabs";
import { cn } from "@outfitter/parks/lib/utils";
import { AltArrowLeftIcon } from "@solar-icons/react/outline/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/outline/alt-arrow-right";
import { InfoCircleIcon } from "@solar-icons/react/outline/info-circle";
import { MagnifierIcon } from "@solar-icons/react/outline/magnifier";
import type { ReactNode } from "react";

import { Viewport } from "../kit";
import { CodeBlock } from "./parts";

const sections = [
  { title: "Start", pages: ["Introduction", "Quickstart", "Concepts"] },
  {
    title: "Guides",
    pages: ["Ask from an agent", "Route to a webhook", "Mute a channel"],
  },
  {
    title: "Reference",
    pages: ["CLI", "MCP tools", "HTTP API", "Block shapes"],
  },
];

const onPage = [
  "Install the CLI",
  "Sign in",
  "Send your first ask",
  "What happens next",
];

const installs: Record<string, string> = {
  bun: "bun add -g @outfitter/sequoia",
  npm: "npm install -g @outfitter/sequoia",
  brew: "brew install outfitter-dev/tap/sequoia",
};

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="relative ps-10">
      <Mark
        shape="circle"
        className="bg-fill-subtle text-foreground ring-border-muted absolute start-0 top-0 font-medium ring-1"
      >
        {n}
      </Mark>
      <h2 id={title} className="mb-2 font-semibold">
        {title}
      </h2>
      <div className="text-muted-foreground flex flex-col gap-3">
        {children}
      </div>
    </section>
  );
}

/** A docs site: section nav, a readable article column and an on-this-page rail. */
export function DocsSurface() {
  return (
    <Viewport>
      <div className="bg-background text-foreground min-h-160">
        <header className="flex h-12 items-center gap-4 px-4">
          <span className="flex items-center gap-2 font-semibold">
            <Mark variant="solid" className="font-normal">
              O
            </Mark>
            Sequoia{" "}
            <span className="text-muted-foreground font-normal">Docs</span>
          </span>
          <Button
            variant="secondary"
            className="text-muted-foreground ms-auto w-64 min-w-0 shrink justify-start gap-2 rounded-lg"
          >
            <MagnifierIcon className="size-4" />
            Search docs
            <Kbd className="ms-auto">/</Kbd>
          </Button>
        </header>
        <div className="mx-auto grid max-w-6xl @3xl:grid-cols-[13rem_1fr] @5xl:grid-cols-[13rem_1fr_12rem]">
          <nav
            aria-label="Docs"
            className="hidden flex-col gap-5 p-4 @3xl:flex"
          >
            {sections.map((section) => (
              <div key={section.title}>
                <GroupLabel className="mb-1 px-2">{section.title}</GroupLabel>
                {section.pages.map((page) => (
                  <NavItem
                    key={page}
                    href="#"
                    current={page === "Quickstart"}
                    size="sm"
                    className="text-sm"
                  >
                    {page}
                  </NavItem>
                ))}
              </div>
            ))}
          </nav>

          <article className="min-w-0 px-4 py-8 @3xl:px-10">
            <p className="text-muted-foreground">Start</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Quickstart
            </h1>
            <p className="text-muted-foreground mt-3 max-w-prose text-lg">
              Install the CLI, sign in with your Vercel account, and send an ask
              from an agent to your phone in about five minutes.
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
                      <CodeBlock
                        code={command}
                        label="Terminal"
                        language="bash"
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </Step>
              <Step n={2} title="Sign in">
                <p>
                  Run the sign-in command. It opens a device approval page, and
                  the CLI waits until you approve it.
                </p>
                <CodeBlock
                  code={
                    "sequoia login\n✓ Approved on this Mac · signed in as Muir"
                  }
                  label="Terminal"
                />
              </Step>
              <Step n={3} title="Send your first ask">
                <p>
                  Agents ask through the MCP tool or the CLI. Options become
                  buttons on every device.
                </p>
                <CodeBlock
                  code={`sequoia ask create --to muir \\\n  --question "Merge sequoia#47 once CI is green?" \\\n  --option Approve --option Hold`}
                  label="Terminal"
                  language="bash"
                  numbers
                />
                <Alert tone="info">
                  <InfoCircleIcon />
                  <AlertTitle>Keep it to four options</AlertTitle>
                  <AlertDescription>
                    Four is the most an iPhone notification can show as actions.
                  </AlertDescription>
                </Alert>
              </Step>
              <Step n={4} title="What happens next">
                <p>
                  The ask lands in Needs you. Your answer posts back to the
                  thread as an answer@1 block, which wakes the agent.
                </p>
              </Step>
            </div>

            <nav
              aria-label="Pages"
              className="mt-12 grid max-w-prose grid-cols-2 gap-3"
            >
              <Card
                variant="outline"
                size="sm"
                render={<a href="#" />}
                className="*:px-inset gap-0.5"
              >
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  <AltArrowLeftIcon className="size-3" />
                  Previous
                </span>
                Introduction
              </Card>
              <Card
                variant="outline"
                size="sm"
                render={<a href="#" />}
                className="*:px-inset items-end gap-0.5"
              >
                <span className="text-muted-foreground flex items-center gap-1 text-xs">
                  Next
                  <AltArrowRightIcon className="size-3" />
                </span>
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
                      "text-muted-foreground hover:text-foreground -ms-px block border-s py-1 ps-3",
                      index === 1
                        ? "border-foreground text-foreground"
                        : "border-transparent"
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
