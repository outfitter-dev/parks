import { describe, expect, it } from "vitest";
import { cnState } from "../packages/ui/src/lib/utils";

describe("cnState", () => {
  it("merges a string className with the base classes", () => {
    expect(cnState("px-2 text-sm", "px-4")).toBe("text-sm px-4");
  });

  it("keeps a state callback as a callback", () => {
    const merged = cnState<{ open: boolean }>("px-2", (state) => (state.open ? "px-4" : undefined));
    expect(typeof merged).toBe("function");
    if (typeof merged !== "function") return;
    expect(merged({ open: true })).toBe("px-4");
    expect(merged({ open: false })).toBe("px-2");
  });
});
