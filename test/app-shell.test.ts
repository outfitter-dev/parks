import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  SidebarPanel,
  SidebarRail,
} from "../apps/showcase/registry/app-shell/app-sidebar";
import type { AppNavigation } from "../apps/showcase/registry/app-shell/app-sidebar";

const Icon = () => createElement("svg");
const linked: AppNavigation = {
  name: "Zion",
  mark: "Z",
  items: [
    { id: "inbox", label: "Inbox", icon: Icon, solid: Icon, href: "/inbox" },
    { id: "admin", label: "Admin", icon: Icon, solid: Icon, href: "/admin" },
  ],
  account: "Muir",
  accountHref: "/account",
  search: false,
};
const mock: AppNavigation = {
  name: "Zion",
  mark: "Z",
  items: [{ id: "inbox", label: "Inbox", icon: Icon, solid: Icon }],
  account: "Muir",
};

const panel = (navigation: AppNavigation) =>
  renderToStaticMarkup(
    createElement(SidebarPanel, {
      navigation,
      place: "inbox",
      onHide: () => {},
      hideAt: "end",
    })
  );
const rail = (navigation: AppNavigation) =>
  renderToStaticMarkup(
    createElement(SidebarRail, {
      navigation,
      place: "inbox",
      gutter: 8,
      anchor: { current: null },
      onDock: () => {},
    })
  );

describe("app-shell sidebar", () => {
  for (const [mode, render] of [
    ["panel", panel],
    ["rail", rail],
  ] as const) {
    it(`${mode} links places and the account, and can hide search`, () => {
      const html = render(linked);
      expect(html).toContain('href="/inbox"');
      expect(html).toContain('href="/admin"');
      expect(html).toContain('href="/account"');
      expect(html).not.toContain("Search");
    });

    it(`${mode} keeps the mock-up defaults without hrefs`, () => {
      const html = render(mock);
      expect(html).toContain('href="#"');
      expect(html).toContain("Search");
      expect(html).not.toContain('href="/account"');
    });
  }
});
