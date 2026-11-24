"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "#components/button";
import { cnState } from "#lib/utils";

/*
 * A Toggle is a Button that stays pressed. It takes Button's sizes
 * (including the icon sizes), `shape` and neutral emphasis variants, and
 * adds one pressed look: a filled background and full-strength text, the
 * same fill a selected row uses. Base UI marks the pressed state with
 * `data-pressed` and `aria-pressed`.
 *
 * `ghost` is the default, as shadcn's `default` toggle is; `default` stays
 * an alias for it.
 */
type ToggleEmphasis = "ghost" | "outline" | "secondary";

const toggleAliases = { default: "ghost" } as const satisfies Record<
  string,
  ToggleEmphasis
>;

type ToggleVariant = ToggleEmphasis | keyof typeof toggleAliases;

const pressed =
  "data-pressed:bg-fill data-pressed:text-foreground data-pressed:hover:bg-fill-strong data-[variant=outline]:data-pressed:border-border-strong";

function toggleVariants({
  variant,
  size,
  shape,
}: {
  variant?: ToggleVariant | null;
  size?: VariantProps<typeof buttonVariants>["size"];
  shape?: VariantProps<typeof buttonVariants>["shape"];
} = {}) {
  const emphasis = resolveToggle(variant);
  return cnState(
    buttonVariants({ variant: emphasis, size, shape }),
    pressed,
    undefined
  );
}

function resolveToggle(
  variant: ToggleVariant | null | undefined
): ToggleEmphasis {
  const value = variant ?? "ghost";
  return value in toggleAliases
    ? toggleAliases[value as keyof typeof toggleAliases]
    : (value as ToggleEmphasis);
}

type ToggleProps = TogglePrimitive.Props &
  Omit<VariantProps<typeof buttonVariants>, "variant"> & {
    /** Emphasis: ghost (default), outline or secondary. */
    variant?: ToggleVariant | null;
  };

function Toggle({
  className,
  variant,
  size = "default",
  shape = "pill",
  ...props
}: ToggleProps) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      data-tone="neutral"
      data-variant={resolveToggle(variant)}
      className={cnState(toggleVariants({ variant, size, shape }), className)}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
export type { ToggleProps, ToggleVariant };
