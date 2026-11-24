"use client";

import {
  SectionHeader,
  SectionHeaderAction,
  SectionHeaderTitle,
} from "@outfitter/parks/components/section-header";
import type { ReactNode } from "react";

/** Shared pieces for the surface compositions. */

export { CodeBlock, CodeFrame } from "../../registry/code-block/code-block";
export { Stat } from "@outfitter/parks/components/stat";

/** A section heading inside a page. */
export function Heading({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <SectionHeader className="mb-2">
      <SectionHeaderTitle>{children}</SectionHeaderTitle>
      {action ? <SectionHeaderAction>{action}</SectionHeaderAction> : null}
    </SectionHeader>
  );
}
