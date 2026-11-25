"use client";

import { Badge } from "@outfitter/parks/components/badge";
import { Button } from "@outfitter/parks/components/button";
import {
  Card,
  CardHeader,
  CardLead,
  CardMeta,
  CardTitle,
} from "@outfitter/parks/components/card";
import { InlineCode } from "@outfitter/parks/components/inline-code";
import { Message } from "@outfitter/parks/components/message";
import { Textarea } from "@outfitter/parks/components/textarea";
import { Trace, TraceStep } from "@outfitter/parks/components/trace";
import { MultiFileDiff } from "@pierre/diffs/react";
import { ArrowUpIcon } from "@solar-icons/react/bold/arrow-up";
import { ChatRoundDotsIcon as ChatRoundDotsBold } from "@solar-icons/react/bold/chat-round-dots";
import { PenNewSquareIcon } from "@solar-icons/react/bold/pen-new-square";
import { ChatRoundDotsIcon } from "@solar-icons/react/linear/chat-round-dots";
import { CodeSquareIcon } from "@solar-icons/react/linear/code-square";
import { MagnifierIcon } from "@solar-icons/react/linear/magnifier";
import { PaperclipIcon } from "@solar-icons/react/linear/paperclip";
import { PenIcon } from "@solar-icons/react/linear/pen";
import { StarsIcon } from "@solar-icons/react/linear/stars";
import { useState } from "react";

import { AppFrame } from "../app-frame";
import type { AppNavigation } from "../app-sidebar";
import { HaloSignal, Viewport } from "../kit";
import { FileType } from "../reui/file-type";
import { CodeBlock, CodeFrame } from "./parts";

const navigation = {
  name: "Sequoia",
  mark: "O",
  items: [
    {
      id: "rename",
      label: "Rename the ask route",
      icon: ChatRoundDotsIcon,
      solid: ChatRoundDotsBold,
    },
    {
      id: "fleet",
      label: "Fleet digest, Friday",
      icon: ChatRoundDotsIcon,
      solid: ChatRoundDotsBold,
    },
    {
      id: "permit",
      label: "Permit for overnight merges",
      icon: ChatRoundDotsIcon,
      solid: ChatRoundDotsBold,
    },
    {
      id: "bartram",
      label: "Why did Bartram go quiet?",
      icon: ChatRoundDotsIcon,
      solid: ChatRoundDotsBold,
    },
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
const diffOptions = {
  diffStyle: "unified",
  diffIndicators: "classic",
  disableFileHeader: true,
} as const;

const options = [
  {
    label: "Ship as /v1/asks",
    detail:
      "Plural, matches threads and agents. Keep /v1/ask as an alias for two weeks.",
    recommended: true,
  },
  {
    label: "Keep /v1/ask",
    detail: "No migration. The odd one out among the routes.",
  },
  { label: "Both, no deadline", detail: "Least churn, but two names forever." },
];

function AskCard() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <Card variant="tray" className="gap-2">
      <CardHeader className="pt-1">
        <CardLead>
          <ChatRoundDotsIcon className="text-brand-strong size-4" />
        </CardLead>
        <CardTitle className="font-medium">
          Which route name should ship?
        </CardTitle>
        <CardMeta>ask.choice@1</CardMeta>
      </CardHeader>
      <div className="grid gap-2 px-(--frame-space) @3xl:grid-cols-3">
        {options.map((option) => (
          <Card
            key={option.label}
            variant="outline"
            size="sm"
            render={<button type="button" />}
            aria-pressed={picked === option.label}
            onClick={() => setPicked(option.label)}
            selected={picked === option.label}
            className="*:px-inset gap-1"
          >
            <span className="flex items-center gap-2 font-medium">
              {option.label}
              {option.recommended ? (
                <Badge className="ml-auto">Recommended</Badge>
              ) : null}
            </span>
            <span className="text-muted-foreground">{option.detail}</span>
          </Card>
        ))}
      </div>
      {picked ? (
        <p className="text-muted-foreground *:px-inset px-(--frame-space) text-xs">
          <span>Posts an answer@1 reply as you and wakes the agent.</span>
        </p>
      ) : null}
    </Card>
  );
}

function Composer() {
  return (
    <div className="bg-background focus-within:ring-focus-ring rounded-2xl border p-2 shadow-xs focus-within:ring-2">
      <div className="flex flex-wrap gap-1.5 px-1 pb-2">
        <Badge
          variant="outline"
          size="lg"
          mono
          icon={<FileType type="ts" size="mini" />}
        >
          routes.ts
        </Badge>
        <Badge
          variant="outline"
          size="lg"
          mono
          icon={<FileType type="md" size="mini" />}
        ></Badge>
      </div>
      <Textarea
        rows={2}
        aria-label="Message"
        placeholder="Reply, or ask Mardy to do something"
        className="field-sizing-fixed min-h-0 resize-none border-0 bg-transparent px-2 py-0 text-[length:inherit] focus-visible:ring-0 md:text-[length:inherit]"
      />
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-sm" aria-label="Attach">
          <PaperclipIcon />
        </Button>
        <Button variant="ghost" size="sm">
          <StarsIcon data-icon="inline-start" />
          Mardy · Devin
        </Button>
        <Button
          size="icon-sm"
          className="ml-auto rounded-full"
          aria-label="Send"
        >
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
          <Message from="you">
            Can you make the ask route plural like the others, and check nothing
            else calls it?
          </Message>

          <Message from="agent" author="Mardy">
            <Trace>
              <TraceStep
                icon={<MagnifierIcon />}
                title="Searched for /v1/ask"
                detail="3 results"
              />
              <TraceStep
                icon={<PenIcon />}
                title="Edited src/http/routes.ts"
                detail="+2 −1"
                defaultOpen
              >
                <CodeFrame label={routeFile}>
                  <MultiFileDiff
                    oldFile={before}
                    newFile={after}
                    options={diffOptions}
                    className="workbench-code"
                  />
                </CodeFrame>
              </TraceStep>
              <TraceStep
                icon={<CodeSquareIcon />}
                title="Ran bun run test routes"
                detail="18 passed"
              >
                <CodeBlock
                  code={"✓ test/http/routes.test.ts (18)\nTests  18 passed"}
                  label="Output"
                />
              </TraceStep>
            </Trace>
            <p>
              The route is now <InlineCode>/v1/asks</InlineCode>. Two callers
              used the old name: the CLI and the iOS share extension. The CLI is
              updated. The extension ships separately, so the old name has to
              keep working for a while.
            </p>
            <AskCard />
          </Message>

          <Message from="you">Go with the recommendation.</Message>

          <Message from="agent" author="Mardy">
            <span className="text-muted-foreground flex items-center gap-2">
              <HaloSignal size={20} label="Working" className="text-brand" />
              Adding the alias and a deprecation header
            </span>
          </Message>

          <div className="bg-background sticky bottom-0 mt-auto pt-2">
            <Composer />
          </div>
        </div>
      </AppFrame>
    </Viewport>
  );
}
