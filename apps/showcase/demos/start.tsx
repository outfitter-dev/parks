"use client";

import { Prose } from "@outfitter/parks/components/prose";
import { QuestionnaireForm } from "@outfitter/parks/components/questionnaire";

import { asks } from "#lib/fixtures";

import { QuestionnaireQueue } from "../registry/ask-queue/ask-queue";
import type { QuestionnaireQuestion } from "../registry/ask-queue/ask-queue";
import { AppFrame, SidebarToggle } from "./app-frame";
import { Specimen, Viewport } from "./kit";
import { sequoiaNavigation } from "./sequoia-navigation";
import { CodeBlock } from "./surfaces/parts";

const install = `bun add @outfitter/parks`;
const stylesheet = `/* app.css */
@import "@outfitter/parks/styles.css";

/* Optional: tune any seed after the import. */
:root {
  --neutral-hue: 250;
}`;
const component = `import { Button } from "@outfitter/parks/components/button";

export function Save() {
  return <Button>Save</Button>;
}`;
const registries = `{
  "registries": {
    "@outfitter": "https://parks.outfitter.dev/r/{name}.json"
  }
}`;
const add = `bunx shadcn add @outfitter/questionnaire`;

/** The showcase's asks as an Ask queue sees them. */
const queueAsks: QuestionnaireQuestion[] = asks.map((item) => ({
  id: item.id,
  title: item.title,
  from: item.agent,
  source: item.project,
  age: item.age,
  kind: item.kind,
  context: item.context,
  options: item.kind === "input" ? undefined : item.options,
}));

/** How an app installs Parks and themes it. */
export function InstallDemo() {
  return (
    <>
      <Specimen
        title="Install"
        note="React 19 and Tailwind CSS 4 are peer dependencies."
        className="block max-w-2xl"
      >
        <CodeBlock code={install} language="bash" />
      </Specimen>
      <Specimen
        title="Import the stylesheet"
        note="Once, from the app's root CSS. It brings in Tailwind, the Parks tokens and Outfitter's default theme, and scans the package's components."
        className="block max-w-2xl"
      >
        <CodeBlock code={stylesheet} language="css" label="app.css" />
      </Specimen>
      <Specimen
        title="Use a component"
        note="Import each component by path."
        className="block max-w-2xl"
      >
        <CodeBlock code={component} language="tsx" />
      </Specimen>
      <Specimen
        title="Check your UI"
        note="The package ships the rules this showcase follows."
        className="block max-w-2xl"
      >
        <Prose size="sm">
          <p>
            <code>bunx parks check</code> flags colours and lengths that drift
            off the theme. <code>bunx parks contrast app.css</code> scores every
            text role in your compiled stylesheet in light and dark; it needs{" "}
            <code>playwright-core</code> and Chromium, as the package README
            shows.
          </p>
        </Prose>
      </Specimen>
    </>
  );
}

/** The shadcn registry: copy-in blocks that build on the package. */
export function RegistryDemo() {
  return (
    <>
      <Specimen
        title="Add the registry"
        note="Blocks are copied into your app and depend on @outfitter/parks for components and tokens, so they stay on the theme."
        className="block max-w-2xl"
      >
        <CodeBlock code={registries} language="json" label="components.json" />
        <CodeBlock code={add} language="bash" className="mt-3" />
      </Specimen>
      <Specimen
        title="questionnaire"
        note="A question with stacked choices, keyboard shortcuts and an optional tray."
        className="block max-w-xl"
      >
        <QuestionnaireForm
          name="sample-ask"
          question="Merge sequoia#47 once checks pass?"
          options={[
            {
              label: "Approve",
              detail: "Merge when the last check passes.",
              recommended: true,
            },
            { label: "Hold", detail: "Leave it open to look at." },
          ]}
          layout="tray"
        />
      </Specimen>
      <Specimen
        title="questionnaire-queue"
        note="A queue of questions: the list beside the open question, or two screens with progress when narrow. Choices use QuestionnaireForm; open questions take a written reply."
        className="block"
      >
        <Viewport>
          <AppFrame navigation={sequoiaNavigation} place="needs-you">
            <QuestionnaireQueue
              asks={queueAsks}
              title="Needs you"
              start={<SidebarToggle />}
              layout="tray"
              shortcuts="letters"
            />
          </AppFrame>
        </Viewport>
      </Specimen>
      <Specimen
        title="app-shell"
        note="The frame above: a sidebar that docks when wide and opens as a modal over the page when narrow, with a page bar and toggle. Try the Phone width."
        className="block max-w-2xl"
      >
        <p className="text-muted-foreground">
          <code>bunx shadcn add @outfitter/app-shell</code>
        </p>
      </Specimen>
    </>
  );
}
