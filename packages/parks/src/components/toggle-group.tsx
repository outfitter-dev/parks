"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import type { buttonVariants } from "#components/button";
import { toggleVariants } from "#components/toggle";
import type { ToggleVariant } from "#components/toggle";
import { segmentItem, segmentTrack } from "#lib/segment";
import type { ControlSize } from "#lib/size";
import { cnState } from "#lib/utils";

/*
 * Two looks, from shadcn's ToggleGroup:
 *
 * - `segmented` (the default) is the one segmented control (#lib/segment):
 *   a track whose pressed segment is raised, drawn the same as TabsList.
 *   Use it to switch a filter or a view when there is no panel to show;
 *   use Tabs when each choice shows its own panel.
 * - `ghost`, `outline` and `secondary` are a row of separate Toggles,
 *   `spacing` apart, for a toolbar.
 *
 * `size` is the control scale (xs, sm, default, lg); a row of separate
 * toggles also takes the icon sizes.
 */
type ToggleGroupVariant = "segmented" | ToggleVariant;

type ToggleGroupStyle = {
  variant: ToggleGroupVariant;
  /** The control scale; separate toggles also take the icon sizes. */
  size: ControlSize | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  shape?: VariantProps<typeof buttonVariants>["shape"];
};

const ToggleGroupContext = React.createContext<ToggleGroupStyle>({
  variant: "segmented",
  size: "default",
});

function ToggleGroup({
  className,
  variant = "segmented",
  size = "default",
  shape,
  spacing = 1,
  orientation = "horizontal",
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  Partial<ToggleGroupStyle> & {
    /** Gap between separate toggles, in spacing steps. The segmented look ignores it. */
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }) {
  const segmented = variant === "segmented";
  return (
    <ToggleGroupPrimitive
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-orientation={orientation}
      orientation={orientation}
      style={
        segmented ? undefined : ({ "--gap": spacing } as React.CSSProperties)
      }
      className={cnState(
        segmented
          ? segmentTrack
          : "flex w-fit items-center gap-[--spacing(var(--gap))] data-vertical:flex-col data-vertical:items-stretch",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, shape }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
}

function ToggleGroupItem({ className, ...props }: TogglePrimitive.Props) {
  const { variant, size, shape } = React.useContext(ToggleGroupContext);
  const segmented = variant === "segmented";
  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={variant}
      className={cnState(
        segmented ? segmentItem : toggleVariants({ variant, size, shape }),
        "focus-visible:z-10",
        className
      )}
      {...props}
    />
  );
}

export { ToggleGroup, ToggleGroupItem };
export type { ToggleGroupVariant };
