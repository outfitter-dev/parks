"use client";

import { useState } from "react";
import { MultiFileDiff } from "@pierre/diffs/react";
import { Mark } from "@workspace/ui/components/mark";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { InlineCode } from "@workspace/ui/components/inline-code";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import { ArrowUpIcon } from "@solar-icons/react/bold/arrow-up";
import { ChatRoundDotsIcon } from "@solar-icons/react/outline/chat-round-dots";
import { ChatRoundDotsIcon as ChatRoundDotsBold } from "@solar-icons/react/bold/chat-round-dots";
import { CodeSquareIcon } from "@solar-icons/react/outline/code-square";
import { MagnifierIcon } from "@solar-icons/react/outline/magnifier";
import { PaperclipIcon } from "@solar-icons/react/bold/paperclip";
import { PenIcon } from "@solar-icons/react/outline/pen";
import { PenNewSquareIcon } from "@solar-icons/react/bold/pen-new-square";
import { StarsIcon } from "@solar-icons/react/outline/stars";
import { DotmCircular4 } from "../dotmatrix/dotm-circular-4";
import { AppFrame } from "../app-frame";
import type { AppNavigation } from "../app-sidebar";
import { Viewport } from "../kit";
import { FileType } from "../reui/file-type";
import { CodeBlock, CodeFrame, Trace, TraceLine, Turn } from "./parts";

const navigation = {
  name: "Outpost",
  mark: "O",
  items: [
    { id: "rename", label: "Rename the ask route", icon: ChatRoundDotsIcon, solid: ChatRoundDotsBold },
    { id: "fleet", label: "Fleet digest, Friday", icon: ChatRoundDotsIcon, solid: ChatRoundDotsBold },
    { id: "permit", label: "Permit for overnight merges", icon: ChatRoundDotsIcon, solid: ChatRoundDotsBold },
    { id: "rex", label: "Why did Rex go quiet?", icon: ChatRoundDotsIcon, solid: ChatRoundDotsBold },
  ],
} satisfies AppNavigation;

const routeFile = "src/http/routes.ts";
const before = {
  name: routeFile,
  contents: `export const routes = {
  ask: "/v1/ask",
  answer: "/v1/asks/:id/answer",
};
`,
};
const after = {
  name: routeFile,
  contents: `export const routes = {
  ask: "/v1/asks",
  legacyAsk: "/v1/ask",
  answer: "/v1/asks/:id/answer",
};
`,
};
const diffOptions = { diffStyle: "unified", diffIndicators: "classic", disableFileHeader: true } as const;

const options = [
  { label: "Ship as /v1/asks", detail: "Plural, matches threads and agents. Keep /v1/ask as an alias for two weeks.", recommended: true },
  { label: "Keep /v1/ask", detail: "No migration. The odd one out among the routes." },
  { label: "Both, no deadline", detail: "Least churn, but two names forever." },
];

function AskCard() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-2 rounded-xl border bg-background p-3 shadow-xs">
      <span className="flex items-center gap-2">
        <ChatRoundDotsIcon className="size-4 text-brand-strong" />
        <span className="font-medium">Which route name should ship?</span>
        <span className="ml-auto text-xs text-muted-foreground">ask.choice@1</span>
      </span>
      <div className="grid gap-2 @3xl:grid-cols-3">
        {options.map((option) => (
          <button
            key={option.label}
            type="button"
            aria-pressed={picked === option.label}
            onClick={() => setPicked(option.label)}
            className={cn(
              "flex flex-col gap-1 rounded-lg border p-2.5 text-left hover:bg-ghost-hover",
              picked === option.label && "border-border-strong bg-accent ring-2 ring-border-muted",
            )}
          >
            <span className="flex items-center gap-2 font-medium">
              {option.label}
              {option.recommended ? <Badge className="ml-auto">Recommended</Badge> : null}
            </span>
            <span className="text-muted-foreground">{option.detail}</span>
          </button>
        ))}
      </div>
      {picked ? <p className="text-xs text-muted-foreground">Posts an answer@1 reply as you and wakes the agent.</p> : null}
    </div>
  );
}

function Composer() {
  return (
    <div className="rounded-2xl border bg-background p-2 shadow-xs focus-within:ring-2 focus-within:ring-focus-ring">
      <div className="flex flex-wrap gap-1.5 px-1 pb-2">
        <span className="flex items-center gap-1.5 rounded-md bg-fill-subtle py-0.5 ps-0.5 pe-2 text-xs ring-1 ring-border-muted">
          <FileType type="ts" size="mini" />
          routes.ts
        </span>
        <span className="flex items-center gap-1.5 rounded-md bg-fill-subtle py-0.5 ps-0.5 pe-2 text-xs ring-1 ring-border-muted">
          <FileType type="md" size="mini" />
          POST-118
        </span>
      </div>
      <Textarea
        rows={2}
        aria-label="Message"
        placeholder="Reply, or ask Donna to do something"
        className="field-sizing-fixed min-h-0 resize-none border-0 bg-transparent px-2 py-0 text-[length:inherit] focus-visible:ring-0 md:text-[length:inherit]"
      />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Attach">
          <PaperclipIcon />
        </Button>
        <Button variant="ghost" size="sm">
          <StarsIcon data-icon="inline-start" />
          Donna · Devin
        </Button>
        <Button size="icon-sm" className="ml-auto rounded-full" aria-label="Send">
          <ArrowUpIcon />
        </Button>
      </div>
    </div>
  );
}

/** A modern assistant thread: tool trace, diffs, an inline ask and a composer with context. */
export function AssistantSurface() {
  return (
    <Viewport>
      <AppFrame
        navigation={navigation}
        place="rename"
        title="Rename the ask route"
        actions={
          <Button variant="ghost" size="icon-sm" aria-label="New chat">
            <PenNewSquareIcon />
          </Button>
        }
      >
        <div className="mx-auto flex min-h-full max-w-3xl flex-col gap-6 px-4 py-6">
          <Turn from="you">Can you make the ask route plural like the others, and check nothing else calls it?</Turn>

          <Turn from="agent" name="Donna">
            <Trace>
              <TraceLine icon={MagnifierIcon} title="Searched for /v1/ask" detail="3 results" />
              <TraceLine icon={PenIcon} title="Edited src/http/routes.ts" detail="+2 −1" defaultOpen>
                <CodeFrame label={routeFile}>
                  <MultiFileDiff oldFile={before} newFile={after} options={diffOptions} className="workbench-code" />
                </CodeFrame>
              </TraceLine>
              <TraceLine icon={CodeSquareIcon} title="Ran bun run test routes" detail="18 passed" tone="ok">
                <CodeBlock code={"✓ test/http/routes.test.ts (18)\nTests  18 passed"} label="Output" />
              </TraceLine>
            </Trace>
            <p>
              The route is now <InlineCode>/v1/asks</InlineCode>. Two callers used the old name: the
              CLI and the iOS share extension. The CLI is updated. The extension ships separately, so the old name has to keep working for a while.
            </p>
            <AskCard />
          </Turn>

          <Turn from="you">Go with the recommendation.</Turn>

          <Turn from="agent" name="Donna">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Mark tone="brand" size="lg" shape="circle">
                <DotmCircular4 size={20} dotSize={3} ariaLabel="Working" />
              </Mark>
              Adding the alias and a deprecation header
            </span>
          </Turn>

          <div className="sticky bottom-0 mt-auto bg-background pt-2">
            <Composer />
          </div>
        </div>
      </AppFrame>
    </Viewport>
  );
}
