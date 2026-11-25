"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { AltArrowRightIcon } from "@solar-icons/react/linear/alt-arrow-right";
import { CheckIcon } from "@solar-icons/react/linear/check";
import * as React from "react";

import { groupLabel } from "#lib/header";
import {
  menuRow,
  menuRowFocusChildren,
  menuRowIndicator,
  menuRowIndicatorSlot,
} from "#lib/row";
import { isTone } from "#lib/tone";
import type { Tone } from "#lib/tone";
import { cnState } from "#lib/utils";

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<
    MenuPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  >) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={cnState(
            "z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-border-muted duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({
  className,
  indent,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & {
  /** Line the label up with items that have a leading icon. */
  indent?: boolean;
  /** shadcn's name for `indent`. */
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-indent={indent ?? inset}
      className={cnState(groupLabel, "px-1.5 py-1 data-indent:ps-7", className)}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  indent,
  inset,
  variant = "default",
  tone: toneProp,
  ...props
}: MenuPrimitive.Item.Props & {
  /** Indent past the icon column of items with a leading icon. */
  indent?: boolean;
  /** shadcn's name for `indent`. */
  inset?: boolean;
  /** shadcn's name for a destructive item: an alias for `tone="destructive"`. */
  variant?: "default" | "destructive";
  /** The item's colour role (see #lib/tone). Defaults to neutral. */
  tone?: Tone;
}) {
  const tone: Tone = isTone(toneProp)
    ? toneProp
    : variant === "destructive"
      ? "destructive"
      : "neutral";
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-indent={indent ?? inset}
      data-variant={tone === "destructive" ? "destructive" : variant}
      data-tone={tone}
      className={cnState(
        menuRow,
        "group/dropdown-menu-item data-[tone=neutral]:focus:**:text-accent-foreground not-data-[tone=neutral]:text-tone-strong not-data-[tone=neutral]:focus:bg-tone-fill not-data-[tone=neutral]:focus:text-tone-strong not-data-[tone=neutral]:*:[svg]:text-tone-strong",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  indent,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & {
  /** Indent past the icon column of items with a leading icon. */
  indent?: boolean;
  /** shadcn's name for `indent`. */
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-indent={indent ?? inset}
      className={cnState(
        menuRow,
        menuRowFocusChildren,
        "data-popup-open:bg-accent data-popup-open:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
      <AltArrowRightIcon className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cnState(
        "w-auto min-w-24 rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-border-muted duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
        className
      )}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  indent,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & {
  /** Indent past the icon column of items with a leading icon. */
  indent?: boolean;
  /** shadcn's name for `indent`. */
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-indent={indent ?? inset}
      className={cnState(
        menuRow,
        menuRowFocusChildren,
        menuRowIndicator,
        className
      )}
      checked={checked}
      {...props}
    >
      <span
        className={menuRowIndicatorSlot}
        data-slot="dropdown-menu-checkbox-item-indicator"
      >
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return (
    <MenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

function DropdownMenuRadioItem({
  className,
  children,
  indent,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & {
  /** Indent past the icon column of items with a leading icon. */
  indent?: boolean;
  /** shadcn's name for `indent`. */
  inset?: boolean;
}) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-indent={indent ?? inset}
      className={cnState(
        menuRow,
        menuRowFocusChildren,
        menuRowIndicator,
        className
      )}
      {...props}
    >
      <span
        className={menuRowIndicatorSlot}
        data-slot="dropdown-menu-radio-item-indicator"
      >
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cnState("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cnState(
        "ml-auto text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
