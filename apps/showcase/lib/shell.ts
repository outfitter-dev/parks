/**
 * How the app frame draws its sidebar and main area. Everything inside the
 * main area is shared; only the frame changes.
 *
 * - `inset` (the web default): the sidebar sits flush on a neutral canvas and
 *   the page is a rounded, lifted container held off the window edges by
 *   `gutter`. At a gutter of 0 the container meets the top, right and bottom
 *   edges, so only its left corners stay rounded.
 * - `floating` (the Apple basis): the sidebar is a floating, inset panel over
 *   one continuous page surface, the way macOS 26 draws it.
 *
 * The theme panel writes this store and AppFrame reads it.
 */

import { useSyncExternalStore } from "react";

import { defaultShell } from "../registry/app-shell/app-shell";
import type { Shell, ShellStyle } from "../registry/app-shell/app-shell";

export { defaultShell } from "../registry/app-shell/app-shell";
export type { Shell, ShellStyle } from "../registry/app-shell/app-shell";

let current = defaultShell;
const listeners = new Set<() => void>();

export function setShell(next: Shell) {
  if (next.style === current.style && next.gutter === current.gutter) {
    return;
  }
  current = next;
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useShell(): Shell {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => defaultShell
  );
}

export function isShellStyle(value: string): value is ShellStyle {
  return value === "inset" || value === "floating";
}
