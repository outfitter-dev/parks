import { describe, expect, it } from "vitest";
import { cn, cnState } from "../packages/parks/src/lib/utils";

describe("packages/parks cn", () => {
  it("keeps custom utilities that tailwind-merge does not know", () => {
    expect(cn("text-trim", "text-sm", "text-primary-foreground")).toBe("text-trim text-sm text-primary-foreground");
  });

  it("lets a later padding win over the frame padding", () => {
    expect(cn("p-frame", "p-0")).toBe("p-0");
    expect(cn("px-inset", "px-text")).toBe("px-text");
    expect(cn("ps-2", "ps-text")).toBe("ps-text");
  });

  it("lets a later radius win over the token radii", () => {
    expect(cn("rounded-frame", "rounded-inner")).toBe("rounded-inner");
    expect(cn("rounded-lg", "rounded-field")).toBe("rounded-field");
  });
});

describe("packages/parks cnState", () => {
  it("merges a string className like cn", () => {
    expect(cnState("p-2 text-trim", "p-4")).toBe("text-trim p-4");
  });

  it("passes state through a function className", () => {
    const merged = cnState<{ open: boolean }>("p-2", (state) => (state.open ? "p-4" : undefined));
    expect(typeof merged).toBe("function");
    if (typeof merged !== "function") return;
    expect(merged({ open: true })).toBe("p-4");
    expect(merged({ open: false })).toBe("p-2");
  });

  it("handles a missing className", () => {
    expect(cnState("p-2", undefined)).toBe("p-2");
  });
});
