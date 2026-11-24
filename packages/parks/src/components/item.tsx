"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import { Separator } from "#components/separator";
import { cnState } from "#lib/utils";

/*
 * A row: lead, title, description, meta and trailing actions. Started from
 * shadcn's Item (base flavour), with these additions:
 *
 * - `ItemMeta`, a muted tabular value on the title line (a time, a path, a
 *   version), between the content and the actions.
 * - `ItemGroup` variants: `open` (spaced rows, shadcn's default), `list`
 *   (rows divided by a hairline, no container) and `bounded` (the same,
 *   inside a panel). Divided groups square their rows' corners.
 * - `selected` on Item, read as `data-selected`.
 * - Rows rendered as links or buttons get the table-style hover fill.
 * - A Badge in the actions becomes a pill, concentric with the row's end.
 * - ItemGroup sets no list role (shadcn's does, without matching listitems).
 *   For a real list, set role="list" on the group and role="listitem" on
 *   each Item.
 */
const itemGroupVariants = cva("group/item-group flex w-full flex-col", {
  variants: {
    variant: {
      open: "gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2",
      list: "*:data-[slot=item]:not-last:border-border-muted *:data-[slot=item]:rounded-none *:data-[slot=item]:border-0 *:data-[slot=item]:not-last:border-b",
      bounded:
        "bg-panel-fill *:data-[slot=item]:not-last:border-border-muted overflow-hidden rounded-lg *:data-[slot=item]:rounded-none *:data-[slot=item]:border-0 *:data-[slot=item]:not-last:border-b",
    },
  },
  defaultVariants: {
    variant: "open",
  },
});

function ItemGroup({
  className,
  variant = "open",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemGroupVariants>) {
  return (
    <div
      data-slot="item-group"
      data-variant={variant}
      className={cnState(itemGroupVariants({ variant }), className)}
      {...props}
    />
  );
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cnState("my-2", className)}
      {...props}
    />
  );
}

const itemVariants = cva(
  "group/item focus-visible:border-ring focus-visible:ring-focus-ring [a]:hover:bg-fill-subtle [button]:hover:bg-fill-subtle data-selected:bg-fill flex w-full flex-wrap items-center rounded-lg border text-left text-sm transition-colors duration-100 outline-none focus-visible:ring-3",
  {
    variants: {
      variant: {
        default: "border-transparent",
        outline: "border-border",
        muted: "bg-panel-fill border-transparent",
      },
      size: {
        default: "gap-2.5 px-3 py-2.5",
        sm: "gap-2.5 px-3 py-2",
        // The control-height row: one line, the same height as a button.
        xs: "px-text min-h-(--control-h) gap-3 py-1 in-data-[slot=dropdown-menu-content]:p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

type ItemProps = useRender.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & {
    /** The current or picked row: a quiet fill, and `data-selected`. */
    selected?: boolean;
  };

/**
 * @example
 * <ItemGroup variant="list">
 *   <Item size="sm">
 *     <ItemMedia><StatusDot tone="success" /></ItemMedia>
 *     <ItemContent><ItemTitle>claude-code</ItemTitle></ItemContent>
 *     <ItemMeta>.claude/skills</ItemMeta>
 *   </Item>
 * </ItemGroup>
 */
function Item({
  className,
  variant = "default",
  size = "default",
  selected,
  render,
  ...props
}: ItemProps) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cnState(itemVariants({ variant, size }), className),
        ...{
          "data-variant": variant,
          "data-size": size,
          ...(selected ? { "data-selected": "" } : {}),
        },
      },
      props
    ),
    render,
    state: {
      slot: "item",
      variant,
      size,
      selected: Boolean(selected),
    },
  });
}

const itemMediaVariants = cva(
  "flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        icon: "[&_svg:not([class*='size-'])]:size-4",
        image:
          "size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/** The lead: a StatusDot, Mark, Avatar, icon, checkbox or short mono label. */
function ItemMedia({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cnState(itemMediaVariants({ variant }), className)}
      {...props}
    />
  );
}

function ItemContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-content"
      className={cnState(
        "flex min-w-0 flex-1 flex-col gap-1 group-data-[size=xs]/item:gap-0 [&+[data-slot=item-content]]:flex-none",
        className
      )}
      {...props}
    />
  );
}

function ItemTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-title"
      className={cnState(
        "line-clamp-1 flex w-fit max-w-full items-center gap-2 text-sm leading-snug font-medium underline-offset-4",
        className
      )}
      {...props}
    />
  );
}

function ItemDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="item-description"
      className={cnState(
        "line-clamp-2 text-left text-sm leading-normal font-normal text-muted-foreground group-data-[size=xs]/item:text-xs [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className
      )}
      {...props}
    />
  );
}

/**
 * A short muted value on the title line: a time, a path, a count. With a
 * description below, it stays on the title's line.
 *
 * @example
 * <ItemMeta>2 min ago</ItemMeta>
 */
function ItemMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-meta"
      className={cnState(
        "shrink-0 text-sm leading-snug whitespace-nowrap text-muted-foreground tabular-nums group-has-data-[slot=item-description]/item:self-start",
        className
      )}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-actions"
      className={cnState(
        "flex items-center gap-2 *:data-[slot=badge]:rounded-full",
        className
      )}
      {...props}
    />
  );
}

function ItemHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-header"
      className={cnState(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  );
}

function ItemFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-footer"
      className={cnState(
        "flex basis-full items-center justify-between gap-2",
        className
      )}
      {...props}
    />
  );
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemMeta,
  ItemHeader,
  ItemFooter,
  itemVariants,
  itemGroupVariants,
};
export type { ItemProps };
