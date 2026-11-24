"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import type * as React from "react";

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
 * The header of a section or a detail view that sits on the page rather than
 * in a frame: the same grid and slots as Card, Dialog and Alert headers
 * (#lib/header), without the frame's padding. `size="default"` is a section
 * heading (`font-medium`, body size); `size="lg"` titles a detail view
 * (`text-lg font-semibold`). Badges that qualify the title go inside
 * SectionHeaderTitle, after the text.
 */
type SectionHeaderSize = "default" | "lg";

/**
 * @example
 * <SectionHeader>
 *   <SectionHeaderTitle>Work by state</SectionHeaderTitle>
 *   <SectionHeaderAction><Button size="sm" variant="secondary">All projects</Button></SectionHeaderAction>
 * </SectionHeader>
 */
function SectionHeader({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: SectionHeaderSize }) {
  return (
    <div
      data-slot="section-header"
      data-size={size}
      className={cnState(header, "group/section-header", className)}
      {...props}
    />
  );
}

function SectionHeaderLead({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-header-lead"
      className={cnState(headerLead, className)}
      {...props}
    />
  );
}

/** The title, an `h2` by default; pass `render={<h1 />}` or `render={<h3 />}` for another level. */
function SectionHeaderTitle({
  className,
  render,
  ...props
}: useRender.ComponentProps<"h2">) {
  return useRender({
    defaultTagName: "h2",
    props: mergeProps<"h2">(
      {
        className: cnState(
          headerTitle,
          "flex flex-wrap items-center gap-x-2 gap-y-1 font-medium group-data-[size=lg]/section-header:text-lg group-data-[size=lg]/section-header:font-semibold",
          className
        ),
        ...{ "data-slot": "section-header-title" },
      },
      props
    ),
    render,
  });
}

function SectionHeaderDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="section-header-description"
      className={cnState(headerDescription, "mt-0.5 max-w-prose", className)}
      {...props}
    />
  );
}

function SectionHeaderMeta({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-header-meta"
      className={cnState(headerMeta, className)}
      {...props}
    />
  );
}

function SectionHeaderAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="section-header-action"
      className={cnState(headerAction, className)}
      {...props}
    />
  );
}

export {
  SectionHeader,
  SectionHeaderLead,
  SectionHeaderTitle,
  SectionHeaderDescription,
  SectionHeaderMeta,
  SectionHeaderAction,
  type SectionHeaderSize,
};
