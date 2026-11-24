import { describe, expect, it } from "vitest";

import { contrastRatio } from "../packages/parks/src/rules/contrast";
import { checkSource } from "../packages/parks/src/rules/source";

const rulesIn = (text: string) =>
  checkSource(text).map((violation) => violation.rule);

describe("parks source rules", () => {
  it("accepts roles, the Tailwind scale and hairlines", () => {
    expect(
      rulesIn(
        `<div className="bg-card text-muted-foreground p-4 border-[1px] ring-tone-border" />`
      )
    ).toEqual([]);
  });

  it("flags opacity modifiers, dark: variants, literal and palette colours", () => {
    expect(rulesIn(`<div className="bg-foreground/10" />`)).toEqual([
      "colour-opacity",
    ]);
    expect(rulesIn(`<div className="dark:bg-card" />`)).toEqual([
      "dark-variant",
    ]);
    expect(rulesIn(`<div style={{ color: "#ff0000" }} />`)).toEqual([
      "literal-colour",
    ]);
    expect(rulesIn(`<div className="text-red-500" />`)).toEqual([
      "palette-colour",
    ]);
  });

  it("allows text sizes with a line height", () => {
    expect(rulesIn(`<p className="text-xs/5" />`)).toEqual([]);
  });

  it("flags literal lengths beyond hairlines", () => {
    expect(rulesIn(`<div className="w-[13px]" />`)).toEqual(["literal-length"]);
  });

  it("flags an outline button with no solid partner", () => {
    expect(rulesIn(`<Button variant="outline">Edit</Button>`)).toEqual([
      "lone-outline-button",
    ]);
    expect(
      rulesIn(
        `<Button variant="outline">Cancel</Button>\n<Button>Save</Button>`
      )
    ).toEqual([]);
  });

  it("honours a parks-ignore comment on the line above", () => {
    expect(
      rulesIn(
        `// parks-ignore dark-variant: blend mode\n<div className="dark:mix-blend-lighten" />`
      )
    ).toEqual([]);
  });

  it("reports the line of each finding", () => {
    expect(checkSource(`\n\n<div className="dark:bg-card" />`)[0]?.line).toBe(
      3
    );
  });
});

describe("contrast ratio", () => {
  it("matches the WCAG reference values", () => {
    expect(contrastRatio([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 5);
    expect(contrastRatio([255, 255, 255], [255, 255, 255])).toBeCloseTo(1, 5);
    expect(contrastRatio([118, 118, 118], [255, 255, 255])).toBeCloseTo(
      4.54,
      2
    );
  });
});
