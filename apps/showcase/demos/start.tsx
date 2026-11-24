"use client";

import { Prose } from "@outfitter/parks/components/prose";

import { Ask } from "../registry/ask/ask";
import { Specimen } from "./kit";
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
const add = `bunx shadcn add @outfitter/ask`;

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
            off the theme. <code>bunx parks contrast</code> scores every text
            role on its surface in light and dark.
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
        title="ask"
        note="A question with stacked choices, keyboard shortcuts and an optional tray."
        className="block max-w-xl"
      >
        <Ask
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
    </>
  );
}
