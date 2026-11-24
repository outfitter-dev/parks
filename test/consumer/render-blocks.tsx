// Renders every registry block, copied into the app at its target path the
// way `shadcn add @outfitter/<block>` would, against the packed package.
import { renderToStaticMarkup } from "react-dom/server";

import { AppFrame, PageBar } from "./components/parks/app-shell/app-shell";
import { AskQueue } from "./components/parks/ask-queue/ask-queue";
import { Ask } from "./components/parks/ask/ask";
import { CodeBlock } from "./components/parks/code-block/code-block";

const options = [
  {
    label: "Approve",
    detail: "Merge when the last check passes.",
    recommended: true,
  },
  { label: "Hold", detail: "Leave it open to look at." },
];

const renders: [string, string, string[]][] = [
  [
    "ask",
    renderToStaticMarkup(
      <Ask
        name="merge"
        question="Merge sequoia#47 once checks pass?"
        options={options}
        layout="tray"
        shortcuts="letters"
      />
    ),
    ["Merge sequoia#47", "Recommended", 'data-slot="card"'],
  ],
  [
    "ask-queue",
    renderToStaticMarkup(
      <AskQueue
        title="Needs you"
        asks={[
          {
            id: "a1",
            title: "Merge sequoia#47 once checks pass?",
            from: "Mardy",
            source: "sequoia",
            age: "4 min",
            options,
          },
          {
            id: "a2",
            title: "Which runner should the check use?",
            from: "Bartram",
            age: "1 hr",
          },
        ]}
      />
    ),
    ["Needs you", "Mardy", "Bartram", "Answered"],
  ],
  [
    "code-block",
    renderToStaticMarkup(
      <CodeBlock
        code="bun add @outfitter/parks"
        label="Install"
        language="bash"
      />
    ),
    ["Install", "Copy"],
  ],
  [
    "app-shell",
    renderToStaticMarkup(
      <AppFrame
        navigation={{ name: "Sequoia", mark: "S", items: [] }}
        place="home"
      >
        <PageBar title="Home" />
      </AppFrame>
    ),
    ['data-shell="inset"', "Sequoia", "Home"],
  ],
];

let failed = false;
for (const [name, html, expected] of renders) {
  const missing = expected.filter((text) => !html.includes(text));
  if (missing.length > 0) {
    failed = true;
    console.error(`${name} block render is missing ${missing.join(", ")}`);
  }
}
if (failed) {
  process.exit(1);
}
console.log(`blocks ok (${renders.map(([name]) => name).join(", ")})`);
