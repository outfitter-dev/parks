import { Children, createElement } from "react";
import type { ReactNode } from "react";

/**
 * Wraps the text among `children` in a span that trims its line box
 * (`text-trim`), so a label centres on its capitals in a fixed-height
 * control. The trim has to sit on the text's own box: bare text in a flex
 * container gets an anonymous box that no class reaches, and it then centres
 * on the font's line box, which sits high. Text that runs together
 * (`{count} items`) stays one label; icons and other elements pass through.
 */
export function trimLabel(
  children: ReactNode,
  className = "text-trim"
): ReactNode[] {
  const out: ReactNode[] = [];
  let run: (string | number)[] = [];
  const flush = () => {
    if (run.join("").trim() !== "") {
      out.push(
        createElement("span", { className, key: `label-${out.length}` }, ...run)
      );
    }
    run = [];
  };
  for (const child of Children.toArray(children)) {
    if (typeof child === "string" || typeof child === "number") {
      run.push(child);
    } else {
      flush();
      out.push(child);
    }
  }
  flush();
  return out;
}
