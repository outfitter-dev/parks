import { Badge } from "@outfitter/parks/components/badge";
import { Button } from "@outfitter/parks/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@outfitter/parks/components/card";
import { defaultTheme } from "@outfitter/parks/lib/theme";
import { cn } from "@outfitter/parks/lib/utils";
// Runs inside a throwaway app that installed the packed @outfitter/parks.
// It imports the published entry points the way an app would and renders
// them on the server, so a broken export map or import alias fails here.
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const html = renderToStaticMarkup(
  h(
    Card,
    null,
    h(CardHeader, null, h(CardTitle, null, "Merge once CI is green?")),
    h(
      CardContent,
      null,
      h(Badge, null, "Recommended"),
      h(Button, null, "Approve")
    )
  )
);

const expectations = [
  ['data-slot="card"', html.includes('data-slot="card"')],
  ['data-slot="button"', html.includes('data-slot="button"')],
  ["Approve", html.includes("Approve")],
  ["cn merges", cn("p-2", "p-4") === "p-4"],
  ["default theme", defaultTheme.color.brand === "orange"],
];
const failed = expectations.filter(([, ok]) => !ok);
if (failed.length > 0) {
  console.error(
    "render check failed:",
    failed.map(([name]) => name).join(", ")
  );
  console.error(html);
  process.exit(1);
}
console.log("render ok");
