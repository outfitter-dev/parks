import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

import {
  header,
  headerAction,
  headerDescription,
  headerLead,
  headerMeta,
  headerTitle,
} from "#lib/header";
import { cnState } from "#lib/utils";

/*
 * Started from shadcn's Card (base flavour). Additions:
 *
 * - `variant`: `raised` (shadcn's look), `outline` (an edge, no shadow),
 *   `filled` (a panel fill, no edge) and `tray` (a muted well that holds
 *   other cards; cards inside it keep concentric corners).
 * - `size`: `sm`, `default`, `lg`. Every size goes through `frame`, so the
 *   radius follows the padding.
 * - `selected` (one brand ring) and `interactive` (hover ring, implied by
 *   rendering a link or button), read as data attributes.
 * - A card with no header, content or footer pads evenly on all sides.
 * - Header slots `CardLead` and `CardMeta`; `CardAction` takes several
 *   children. The header layout is shared with Dialog and Popover
 *   (#lib/header).
 */
const cardVariants = cva(
  "group/card frame text-card-foreground focus-visible:ring-focus-ring data-selected:ring-brand data-selected:hover:ring-brand *:[img:first-child]:rounded-t-frame *:[img:last-child]:rounded-b-frame flex flex-col gap-(--frame-space) overflow-hidden py-(--frame-space) text-sm outline-none not-has-[>[data-slot^=card-]]:px-(--frame-space) focus-visible:ring-2 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-disabled:pointer-events-none data-disabled:opacity-50 data-interactive:cursor-pointer data-interactive:text-start data-selected:ring-2 data-[size=lg]:[--frame-pad:calc(var(--pad)*1.5)] data-[size=sm]:[--frame-pad:var(--frame-pad-sm)]",
  {
    variants: {
      variant: {
        raised:
          "bg-card ring-border-muted data-interactive:hover:ring-border-strong shadow-(--shadow-frame) ring-1",
        outline:
          "bg-card ring-border data-interactive:hover:ring-border-strong ring-1",
        filled: "bg-panel-fill data-interactive:hover:bg-fill",
        tray: "bg-muted gap-(--frame-space) [--frame-pad:--spacing(1.5)] [--tray-radius:calc(var(--frame-radius)-var(--frame-space))] **:data-[slot=card]:rounded-[calc(var(--tray-radius)*var(--corner-scale))]",
      },
    },
    defaultVariants: {
      variant: "raised",
    },
  }
);

type CardProps = useRender.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    size?: "sm" | "default" | "lg";
    /** The one selected look: a brand ring. */
    selected?: boolean;
    /** Hover feedback for a card that is a link or button. */
    interactive?: boolean;
    disabled?: boolean;
  };

/**
 * @example
 * <Card variant="outline" size="sm" render={<button type="button" />} selected>
 *   <CardHeader>
 *     <CardTitle>Webhook</CardTitle>
 *     <CardDescription>Posts each event to a URL.</CardDescription>
 *   </CardHeader>
 * </Card>
 */
function Card({
  className,
  variant = "raised",
  size = "default",
  selected = false,
  interactive,
  disabled = false,
  render,
  onClick,
  ...props
}: CardProps) {
  const isInteractive = interactive ?? Boolean(render);
  // A disabled card that is a link or button can't be focused or activated.
  const blocked = disabled && isInteractive;
  const isButton = React.isValidElement(render) && render.type === "button";
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      { className: cnState(cardVariants({ variant }), className) },
      props,
      blocked
        ? {
            "aria-disabled": true,
            tabIndex: -1,
            ...(isButton && { disabled: true }),
            onClick: (event) => event.preventDefault(),
          }
        : { onClick }
    ),
    render,
    state: {
      slot: "card",
      variant,
      size,
      selected,
      interactive: isInteractive,
      disabled,
    },
  });
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cnState(
        header,
        "group/card-header @container/card-header rounded-t-frame px-(--frame-space) [.border-b]:pb-(--frame-space)",
        className
      )}
      {...props}
    />
  );
}

function CardLead({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-lead"
      className={cnState(headerLead, "ps-inset", className)}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cnState(
        headerTitle,
        "px-inset text-base font-semibold group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cnState(headerDescription, "px-inset text-sm", className)}
      {...props}
    />
  );
}

function CardMeta({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-meta"
      className={cnState(headerMeta, "pe-inset", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cnState(headerAction, className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cnState(
        "px-(--corner-gap) [--radius:var(--field-radius)] [--text-offset:calc(var(--frame-space)*(1+var(--inset-ratio))-var(--corner-gap))] [&_[data-slot=input]]:mx-(--text-offset) [&_[data-slot=input]]:w-[calc(100%-2*var(--text-offset))]",
        className
      )}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cnState(
        "corner-tray mt-auto flex items-center justify-end gap-2 rounded-b-frame *:data-[slot=button]:h-(--corner-control-h)",
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardLead,
  CardTitle,
  CardMeta,
  CardAction,
  CardDescription,
  CardContent,
  cardVariants,
  type CardProps,
};
