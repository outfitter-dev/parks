import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { BreadcrumbPath } from "../packages/parks/src/components/breadcrumb";
import { fitBreadcrumb, hiddenByLimit } from "../packages/parks/src/lib/breadcrumb-fit";

describe("fitBreadcrumb", () => {
  // Root, three ancestors, current. The overflow trigger costs 30.
  const widths = [80, 100, 100, 100, 120];

  it("folds nothing when the path fits", () => {
    expect(fitBreadcrumb(widths, 30, 500, true)).toEqual({ hidden: 0, compactRoot: false });
  });

  it("folds ancestors nearest the root first, paying for the trigger once", () => {
    // 500 + 30 - 100 = 430
    expect(fitBreadcrumb(widths, 30, 450, true)).toEqual({ hidden: 1, compactRoot: false });
    // 430 - 100 = 330
    expect(fitBreadcrumb(widths, 30, 340, true)).toEqual({ hidden: 2, compactRoot: false });
  });

  it("never folds the root or the current item", () => {
    expect(fitBreadcrumb(widths, 30, 100, false)).toEqual({ hidden: 3, compactRoot: false });
  });

  it("drops the root's label only when everything foldable has folded and it has an icon", () => {
    expect(fitBreadcrumb(widths, 30, 100, true)).toEqual({ hidden: 3, compactRoot: true });
  });

  it("leaves a two-item path alone", () => {
    expect(fitBreadcrumb([80, 120], 30, 50, true)).toEqual({ hidden: 0, compactRoot: false });
  });
});

describe("hiddenByLimit", () => {
  it("counts the overflow trigger as a position", () => {
    expect(hiddenByLimit(5, 4)).toBe(2);
    expect(hiddenByLimit(4, 4)).toBe(0);
  });

  it("keeps at least root, overflow and current", () => {
    expect(hiddenByLimit(6, 1)).toBe(4);
    expect(hiddenByLimit(6, Number.NaN)).toBe(4);
  });
});

describe("BreadcrumbPath", () => {
  const items = [
    { label: "Workbench", href: "/" },
    { label: "Skillset", href: "/skillset" },
    { label: "Source", href: "/source" },
    { label: "Landing" },
  ];

  it("renders the shadcn structure with the last entry as the current page", () => {
    const html = renderToStaticMarkup(createElement(BreadcrumbPath, { items, maxItems: 8 }));
    expect(html).toMatch(/^<nav aria-label="Breadcrumb" data-slot="breadcrumb"/);
    expect(html).toContain('data-slot="breadcrumb-list"');
    expect(html).toMatch(/<a [^>]*href="\/skillset"/);
    expect(html).toMatch(/aria-current="page"[^>]*>.*Landing/);
  });

  it("folds ancestors past maxItems into one overflow menu", () => {
    const html = renderToStaticMarkup(createElement(BreadcrumbPath, { items, maxItems: 3 }));
    const visible = html.split('<div aria-hidden')[0] ?? "";
    expect(visible).toContain('aria-label="Show 2 hidden breadcrumbs"');
    expect(visible).not.toContain("/skillset");
    expect(visible).toContain('href="/"');
  });
});
