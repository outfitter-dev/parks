// Renders the registry's Ask block, copied into the app the way
// `shadcn add @outfitter/ask` would, against the packed package.
import { renderToStaticMarkup } from "react-dom/server";

import { Ask } from "./src/parks/ask";

const html = renderToStaticMarkup(
  <Ask
    name="merge"
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
    shortcuts="letters"
  />
);
for (const expected of [
  "Merge sequoia#47",
  "Approve",
  "Recommended",
  'data-slot="card"',
]) {
  if (!html.includes(expected)) {
    console.error(`Ask block render is missing ${expected}`);
    console.error(html);
    process.exit(1);
  }
}
console.log("ask block ok");
