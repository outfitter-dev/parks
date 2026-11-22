import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { rewrite } from "../scripts/ui-add";

const ui = join(import.meta.dirname, "../packages/ui");
const iconMap: Record<string, string> = JSON.parse(readFileSync(join(ui, "icons.json"), "utf8"));
const solarIcons = join(ui, "node_modules/@solar-icons/react/dist/icons");

describe("ui:add icon rewrite", () => {
  it("swaps a placeholder for its Solar icon and import", () => {
    const source = [
      'import { cn } from "cn"',
      'import { IconPlaceholder } from "#components/app/(create)/components/icon-placeholder"',
      "",
      "export const A = () => (",
      '  <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDown01Icon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" className="size-4" />',
      ")",
    ].join("\n");
    const { code, missing } = rewrite(source);
    expect(missing).toEqual([]);
    expect(code).toContain('import { cn } from "#lib/utils"');
    expect(code).toContain('import { AltArrowDownIcon } from "@solar-icons/react/linear/alt-arrow-down"');
    expect(code).toContain('<AltArrowDownIcon className="size-4" />');
    expect(code).not.toContain("IconPlaceholder");
  });

  it("reports a Lucide name with no mapping and leaves it in place", () => {
    const source = '<IconPlaceholder lucide="NotARealIcon" />';
    const { code, missing } = rewrite(source);
    expect(missing).toEqual(["NotARealIcon"]);
    expect(code).toBe(source);
  });

  for (const [lucide, solar] of Object.entries(iconMap)) {
    if (lucide.startsWith("$")) continue;
    it(`maps ${lucide} to an icon Solar ships`, () => {
      expect(existsSync(join(solarIcons, `${solar}.mjs`))).toBe(true);
    });
  }
});
