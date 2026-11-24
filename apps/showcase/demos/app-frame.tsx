"use client";

import type { ComponentProps } from "react";

import { useShell } from "#lib/shell";

import { AppFrame as ShellFrame } from "../registry/app-shell/app-shell";

export { PageBar, SidebarToggle } from "../registry/app-shell/app-shell";

/** The registry's AppFrame, styled by the showcase's theme panel. */
export function AppFrame(
  props: Omit<ComponentProps<typeof ShellFrame>, "shell">
) {
  return <ShellFrame {...props} shell={useShell()} />;
}
