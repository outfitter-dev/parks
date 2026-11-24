import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { Card } from "../packages/parks/src/components/card";

describe("Card", () => {
  it("disables a button card natively and takes it out of the tab order", () => {
    const html = renderToStaticMarkup(
      createElement(Card, {
        disabled: true,
        render: createElement("button", { type: "button" }),
      })
    );
    expect(html).toMatch(/\sdisabled=""/u);
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('tabindex="-1"');
  });

  it("marks a disabled link card without a native disabled attribute", () => {
    const html = renderToStaticMarkup(
      createElement(Card, {
        disabled: true,
        render: createElement("a", { href: "/zion" }),
      })
    );
    expect(html).not.toMatch(/\sdisabled=""/u);
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('tabindex="-1"');
  });

  it("leaves a plain disabled card alone", () => {
    const html = renderToStaticMarkup(createElement(Card, { disabled: true }));
    expect(html).not.toContain("aria-disabled");
    expect(html).not.toContain("tabindex");
  });
});
