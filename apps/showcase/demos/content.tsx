"use client";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@outfitter/parks/components/attachment";
import { Prose } from "@outfitter/parks/components/prose";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@outfitter/parks/components/questionnaire";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@outfitter/parks/components/resizable";
import { Spinner } from "@outfitter/parks/components/spinner";
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@outfitter/parks/components/trace";
import { CloseIcon } from "@solar-icons/react/bold/close";
import { RefreshIcon } from "@solar-icons/react/bold/refresh";
import { CodeSquareIcon } from "@solar-icons/react/outline/code-square";
import { DangerTriangleIcon } from "@solar-icons/react/outline/danger-triangle";
import { DocumentTextIcon } from "@solar-icons/react/outline/document-text";
import { GalleryIcon } from "@solar-icons/react/outline/gallery";
import { MagnifierIcon } from "@solar-icons/react/outline/magnifier";
import { PenIcon } from "@solar-icons/react/outline/pen";
import { UploadMinimalisticIcon } from "@solar-icons/react/outline/upload-minimalistic";
import { useState } from "react";

import { Specimen } from "./kit";

export function AttachmentDemo() {
  return (
    <>
      <Specimen
        title="States"
        note="A file on its way into a thread. Uploading and processing shimmer the name; an error takes the destructive tone and offers a retry."
      >
        <Attachment state="done">
          <AttachmentMedia>
            <DocumentTextIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>routing-v12.md</AttachmentTitle>
            <AttachmentDescription>4.2 KB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Remove">
              <CloseIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="uploading">
          <AttachmentMedia>
            <Spinner />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>board-export.csv</AttachmentTitle>
            <AttachmentDescription>Uploading · 62%</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
        <Attachment state="error">
          <AttachmentMedia>
            <DangerTriangleIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>trace.har</AttachmentTitle>
            <AttachmentDescription>Too large (32 MB)</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction aria-label="Retry">
              <RefreshIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
        <Attachment state="idle">
          <AttachmentMedia>
            <UploadMinimalisticIcon />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>Drop a file</AttachmentTitle>
            <AttachmentDescription>Up to 25 MB</AttachmentDescription>
          </AttachmentContent>
        </Attachment>
      </Specimen>
      <Specimen
        title="Group"
        note="A row of attachments scrolls sideways and fades at its edges."
        className="block"
      >
        <AttachmentGroup>
          {[
            "screenshot-1.png",
            "screenshot-2.png",
            "screenshot-3.png",
            "run-4810.log",
            "notes.md",
          ].map((name) => (
            <Attachment key={name} size="sm">
              <AttachmentMedia>
                {name.endsWith(".png") ? <GalleryIcon /> : <DocumentTextIcon />}
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{name}</AttachmentTitle>
              </AttachmentContent>
            </Attachment>
          ))}
        </AttachmentGroup>
      </Specimen>
    </>
  );
}

export function TraceDemo() {
  return (
    <Specimen
      title="Tool steps"
      note="What an agent did, one line per step. A running step shimmers, an error takes the destructive tone, and a step with output opens to show it."
      className="block max-w-lg"
    >
      <Trace>
        <TraceLine>
          <TraceIcon>
            <MagnifierIcon />
          </TraceIcon>
          <TraceTitle>Searched for /v1/ask</TraceTitle>
          <TraceDescription>3 results</TraceDescription>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <PenIcon />
              </TraceIcon>
              <TraceTitle>Edited src/http/routes.ts</TraceTitle>
              <TraceDescription>+2 −1</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            Renamed the route to /v1/asks and kept /v1/ask as an alias.
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine status="error">
              <TraceIcon>
                <CodeSquareIcon />
              </TraceIcon>
              <TraceTitle>Ran bun run test routes</TraceTitle>
              <TraceDescription>1 failed</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            routes.test.ts › keeps the old name: expected 200, got 404.
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine status="running">
          <TraceIcon>
            <PenIcon />
          </TraceIcon>
          <TraceTitle>Adding the deprecation header</TraceTitle>
        </TraceLine>
        <TraceLine status="pending">
          <TraceIcon>
            <CodeSquareIcon />
          </TraceIcon>
          <TraceTitle>Re-run the tests</TraceTitle>
        </TraceLine>
      </Trace>
    </Specimen>
  );
}

export function ResizableDemo() {
  return (
    <>
      <Specimen
        title="Panels"
        note="Drag the handle, or focus it and use the arrow keys."
        className="block"
      >
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-48 rounded-lg border"
        >
          <ResizablePanel defaultSize="30" minSize="20">
            <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
              Threads
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="70">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="65">
                <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
                  Thread
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize="35">
                <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
                  Composer
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Specimen>
      <Specimen
        title="Plain handle"
        note="Without the grip, the handle is just the 1px rule."
        className="block"
      >
        <ResizablePanelGroup
          orientation="horizontal"
          className="min-h-24 rounded-lg border"
        >
          <ResizablePanel defaultSize="50">
            <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
              Before
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize="50">
            <div className="text-muted-foreground flex h-full items-center justify-center p-4 text-sm">
              After
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Specimen>
    </>
  );
}

const channelChoices = [
  {
    value: "outfitter",
    label: "#outfitter",
    description: "Everything, for anyone following along.",
  },
  {
    value: "toolkit",
    label: "#toolkit",
    description: "Shared tooling: Ropes, Climb, Forge.",
  },
  {
    value: "signals",
    label: "#signals",
    description: "Alerts and automated notices only.",
  },
];

export function QuestionnaireDemo() {
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <>
      <Specimen
        title="Walkthrough"
        note="One question at a time. Press a letter to pick a choice, Enter to move on, and the arrow keys to move between choices."
        className="block max-w-lg"
      >
        <Questionnaire
          shortcuts="letters"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setSubmitted(
              [...data.entries()]
                .map(([key, value]) => `${key}=${String(value)}`)
                .join(", ")
            );
          }}
        >
          <QuestionnaireProgress />
          <QuestionnaireItem name="channel" required>
            <QuestionnaireTitle>
              Where should Rex post its run summaries?
            </QuestionnaireTitle>
            <QuestionnaireChoices>
              {channelChoices.map((choice) => (
                <QuestionnaireChoice key={choice.value} value={choice.value}>
                  {choice.label}
                  <QuestionnaireChoiceDescription>
                    {choice.description}
                  </QuestionnaireChoiceDescription>
                </QuestionnaireChoice>
              ))}
            </QuestionnaireChoices>
          </QuestionnaireItem>
          <QuestionnaireItem name="events" multiple>
            <QuestionnaireTitle>
              Which events should wake it?
            </QuestionnaireTitle>
            <QuestionnaireDescription>
              Pick any that apply.
            </QuestionnaireDescription>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="pr-review">
                A review on its pull request
              </QuestionnaireChoice>
              <QuestionnaireChoice value="ci-failed">
                A failed check
              </QuestionnaireChoice>
              <QuestionnaireChoice value="mention">
                A mention in a thread
              </QuestionnaireChoice>
            </QuestionnaireChoices>
          </QuestionnaireItem>
          <QuestionnaireItem name="note">
            <QuestionnaireTitle>Anything it should know?</QuestionnaireTitle>
            <QuestionnaireInput placeholder="Optional" />
          </QuestionnaireItem>
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireSkip />
            <QuestionnaireNext />
            <QuestionnaireSubmit>Save</QuestionnaireSubmit>
          </QuestionnaireActions>
        </Questionnaire>
        {submitted ? (
          <p className="text-muted-foreground mt-3 font-mono text-xs">
            {submitted}
          </p>
        ) : null}
      </Specimen>
      <Specimen
        title="Indicators"
        note="Without shortcuts or marks, a choice leads with a radio, or a checkbox when the question takes several answers."
        className="grid max-w-3xl gap-6 sm:grid-cols-2"
      >
        <Questionnaire>
          <QuestionnaireItem name="runner">
            <QuestionnaireTitle>Which runner image?</QuestionnaireTitle>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="ubuntu-24" defaultChecked>
                ubuntu-24
              </QuestionnaireChoice>
              <QuestionnaireChoice value="ubuntu-22">
                ubuntu-22
              </QuestionnaireChoice>
            </QuestionnaireChoices>
          </QuestionnaireItem>
        </Questionnaire>
        <Questionnaire>
          <QuestionnaireItem name="notify" multiple>
            <QuestionnaireTitle>Who should hear about it?</QuestionnaireTitle>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="matt" defaultChecked>
                Matt
              </QuestionnaireChoice>
              <QuestionnaireChoice value="donna">Donna</QuestionnaireChoice>
            </QuestionnaireChoices>
          </QuestionnaireItem>
        </Questionnaire>
      </Specimen>
      <Specimen
        title="Marks"
        note="A choice can lead with its own mark on a tone instead of the letter or the radio."
        className="block max-w-lg"
      >
        <Questionnaire>
          <QuestionnaireItem name="merge">
            <QuestionnaireTitle>
              Merge outpost#47 once checks pass?
            </QuestionnaireTitle>
            <QuestionnaireChoices className="grid-cols-2">
              <QuestionnaireChoice value="yes" mark="Y" tone="success">
                Yes, merge it
              </QuestionnaireChoice>
              <QuestionnaireChoice value="no" mark="N" tone="destructive">
                No, hold it
              </QuestionnaireChoice>
            </QuestionnaireChoices>
          </QuestionnaireItem>
        </Questionnaire>
      </Specimen>
    </>
  );
}

export function ProseDemo() {
  return (
    <Specimen
      title="Rendered Markdown"
      note="Prose styles plain HTML, such as rendered Markdown, after shadcn's Typography. Use it for long-form text, never for app UI."
      className="block"
    >
      <Prose className="max-w-2xl">
        <h2>Routing v12</h2>
        <p>
          Routing decides which agent hears about which event. Version 12 moves
          pull request reviews to the agent that opened the pull request, and
          sends failed checks to <a href="#routing">#signals</a> as well.
        </p>
        <h3>What changes</h3>
        <ul>
          <li>Reviews go to the author agent, not the whole channel.</li>
          <li>
            Failed checks post to <code>#signals</code>, with the run attached.
          </li>
          <li>Quiet hours now apply to digests too.</li>
        </ul>
        <blockquote>
          If an agent is muted, its events queue and arrive as one digest when
          it is unmuted.
        </blockquote>
        <h3>Rolling back</h3>
        <ol>
          <li>Open Admin and elevate.</li>
          <li>
            Pick version 11 and press <kbd>Restore</kbd>.
          </li>
        </ol>
        <pre>
          <code>{`outpost routing restore --version 11`}</code>
        </pre>
        <hr />
        <p>
          <strong>Note:</strong> restoring keeps version 12 in history, so you
          can return to it.
        </p>
      </Prose>
      <div className="mt-6 max-w-sm rounded-lg border p-3">
        <Prose size="sm">
          <h3>Small size</h3>
          <p>A tighter rhythm for prose inside cards, bubbles and panels.</p>
          <ul>
            <li>Smaller headings</li>
            <li>Less space between blocks</li>
          </ul>
        </Prose>
      </div>
    </Specimen>
  );
}
