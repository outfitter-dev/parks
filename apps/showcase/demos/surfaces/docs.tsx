"use client";

import { useState, type ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@workspace/ui/components/alert";
import { Kbd } from "@workspace/ui/components/kbd";
import { cn } from "@workspace/ui/lib/utils";
import { AltArrowLeftIcon } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { InfoCircleIcon } from "@solar-icons/react/linear/info-circle";
import { MagnifierIcon } from "@solar-icons/react/linear/magnifier";
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
      <span className="absolute start-0 top-0 grid size-6 place-items-center rounded-full bg-foreground/6 text-xs font-medium tabular-nums ring-1 ring-foreground/10">
        {n}
      </span>
      <h2 id={title} className="mb-2 font-semibold">{title}</h2>
      <div className="flex flex-col gap-3 text-muted-foreground">{children}</div>
    </section>
  );
}

/** A docs site: section nav, a readable article column and an on-this-page rail. */
export function DocsSurface() {
  const [manager, setManager] = useState("bun");
  return (
    <Viewport>
      <div className="min-h-160 bg-background text-foreground">
        <header className="flex h-12 items-center gap-4 px-4">
          <span className="flex items-center gap-2 font-semibold">
            <span className="grid size-6 place-items-center rounded-md bg-foreground text-xs text-background">O</span>
            Outpost <span className="font-normal text-muted-foreground">Docs</span>
          </span>
          <button
            type="button"
            className="ml-auto flex h-(--control-h) w-64 max-w-full items-center gap-2 rounded-lg border bg-muted/40 px-2 text-muted-foreground"
          >
            <MagnifierIcon className="size-4" />
            Search docs
            <Kbd className="ml-auto">/</Kbd>
          </button>
        </header>
        <div className="mx-auto grid max-w-6xl @3xl:grid-cols-[13rem_1fr] @5xl:grid-cols-[13rem_1fr_12rem]">
          <nav aria-label="Docs" className="hidden flex-col gap-5 p-4 @3xl:flex">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="mb-1 px-2 text-xs font-medium text-muted-foreground">{section.title}</p>
                {section.pages.map((page) => (
                  <a
                    key={page}
                    href="#"
                    aria-current={page === "Quickstart" ? "page" : undefined}
                    className={cn(
                      "block rounded-md px-2 py-1 text-muted-foreground hover:text-foreground",
                      page === "Quickstart" && "bg-accent font-medium text-foreground",
                    )}
                  >
                    {page}
                  </a>
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
                <div className="flex gap-1" role="tablist" aria-label="Package manager">
                  {Object.keys(installs).map((key) => (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={key === manager}
                      onClick={() => setManager(key)}
                      className={cn(
                        "rounded-md px-2 py-0.5 font-mono text-xs hover:text-foreground",
                        key === manager && "bg-accent text-foreground",
                      )}
                    >
                      {key}
                    </button>
                  ))}
                </div>
                <CodeBlock code={installs[manager] ?? ""} label="Terminal" />
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
                />
                <Alert variant="info">
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
              <a href="#" className="flex flex-col gap-0.5 rounded-lg border p-3 hover:bg-accent/60">
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><AltArrowLeftIcon className="size-3" />Previous</span>
                Introduction
              </a>
              <a href="#" className="flex flex-col items-end gap-0.5 rounded-lg border p-3 hover:bg-accent/60">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">Next<AltArrowRightIcon className="size-3" /></span>
                Concepts
              </a>
            </nav>
          </article>

          <aside className="hidden py-8 pe-4 @5xl:block">
            <p className="mb-2 text-xs font-medium text-muted-foreground">On this page</p>
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
