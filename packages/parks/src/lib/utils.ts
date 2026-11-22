import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's own utilities. Register this
 * package's utilities (globals.css) so they merge like the ones they stand
 * in for: `p-frame` against `p-0`, `px-text` against `px-4`, and so on.
 * `text-trim` gets its own group, or it would read as a text colour and be
 * dropped by `text-primary-foreground`.
 */
const twMerge = extendTailwindMerge<"text-trim">({
  extend: {
    classGroups: {
      "text-trim": ["text-trim"],
      p: [{ p: ["frame"] }],
      px: [{ px: ["inset", "text"] }],
      ps: [{ ps: ["inset", "text"] }],
      pe: [{ pe: ["inset", "text"] }],
      rounded: [{ rounded: ["frame", "inner", "field"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** A Base UI `className`: a string, or a function of the component's state. */
export type StateClassName<State> = string | ((state: State) => string | undefined) | undefined;

/**
 * Merges a component's own classes with its `className` prop, which comes
 * last. Base UI lets `className` be a function of the component's state; a
 * function stays a function so Base UI can still call it. Components always
 * merge `className` through this, never through `cn`, which would drop it.
 */
export function cnState(...inputs: [...ClassValue[], string | undefined]): string;
export function cnState<State>(
  ...inputs: [...ClassValue[], StateClassName<State>]
): string | ((state: State) => string);
export function cnState<State>(...inputs: [...ClassValue[], StateClassName<State>]) {
  const className = inputs[inputs.length - 1] as StateClassName<State>;
  const base = inputs.slice(0, -1) as ClassValue[];
  if (typeof className === "function") {
    return (state: State) => cn(base, className(state));
  }
  return cn(base, className);
}
