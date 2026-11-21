import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Merges a component's base classes with a Base UI `className` prop, which may
 * be a string or a function of the component's state. A function is kept as a
 * function so Base UI can still call it.
 */
export function cnState<State>(
  base: string,
  className: string | ((state: State) => string | undefined) | undefined,
) {
  if (typeof className === "function") {
    return (state: State) => cn(base, className(state));
  }
  return cn(base, className);
}
