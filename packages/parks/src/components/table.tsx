"use client";

import * as React from "react";

import { cnState } from "#lib/utils";

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cnState(
          "w-full caption-bottom border-separate border-spacing-0 text-sm",
          className
        )}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead data-slot="table-header" className={cnState(className)} {...props} />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cnState(
        "[&>tr:last-child>td]:border-b-transparent",
        className
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cnState(
        "bg-fill-subtle font-medium [&>tr:first-child>td]:border-t [&>tr>td]:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cnState(
        "group/row [&:has(+tr:hover)>td]:border-b-transparent [&:has(+tr[data-state=selected])>td]:border-b-transparent",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cnState(
        "h-10 border-b px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cnState(
        "border-b p-2 align-middle whitespace-nowrap transition-colors [&:has([role=checkbox])]:pr-0 in-data-[slot=table-body]:group-hover/row:border-b-transparent in-data-[slot=table-body]:group-hover/row:bg-fill-subtle in-data-[slot=table-body]:group-hover/row:first:rounded-s-(--field-radius) in-data-[slot=table-body]:group-hover/row:last:rounded-e-(--field-radius) in-data-[slot=table-body]:group-data-[state=selected]/row:first:rounded-s-(--field-radius) in-data-[slot=table-body]:group-data-[state=selected]/row:last:rounded-e-(--field-radius) in-data-[slot=table-body]:group-has-aria-expanded/row:bg-fill-subtle in-data-[slot=table-body]:group-data-[state=selected]/row:border-b-transparent in-data-[slot=table-body]:group-data-[state=selected]/row:bg-muted",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cnState("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
