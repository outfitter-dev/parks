"use client";

/*
 * Data table: our Table rendered from a TanStack Table v9 instance, after
 * shadcn's data-table guide and its Tasks example. TanStack owns rows and
 * state; this file owns markup, styling and the reusable controls.
 *
 * Every table shares one features object, so the controls below can be
 * typed against it:
 *
 *   const columns = dataTableColumns<Run>()
 *   const table = useDataTable({ data, columns: [...] })
 *   <DataTableToolbar table={table} filterColumn="agent" />
 *   <DataTable table={table} />
 *   <DataTablePagination table={table} />
 */

import { AltArrowDownIcon } from "@solar-icons/react/outline/alt-arrow-down";
import { AltArrowLeftIcon } from "@solar-icons/react/outline/alt-arrow-left";
import { AltArrowRightIcon } from "@solar-icons/react/outline/alt-arrow-right";
import { AltArrowUpIcon } from "@solar-icons/react/outline/alt-arrow-up";
import { DoubleAltArrowLeftIcon } from "@solar-icons/react/outline/double-alt-arrow-left";
import { DoubleAltArrowRightIcon } from "@solar-icons/react/outline/double-alt-arrow-right";
import { EyeClosedIcon } from "@solar-icons/react/outline/eye-closed";
import { SortVerticalIcon } from "@solar-icons/react/outline/sort-vertical";
import { Tuning2Icon } from "@solar-icons/react/outline/tuning-2";
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
  useTable,
} from "@tanstack/react-table";
import type {
  Column,
  ReactTable,
  RowData,
  TableOptions,
} from "@tanstack/react-table";
import * as React from "react";

import { Button } from "#components/button";
import { Checkbox } from "#components/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#components/dropdown-menu";
import { Input } from "#components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#components/table";
import { cnState } from "#lib/utils";

const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
});

type DataTableFeatures = typeof dataTableFeatures;
type DataTableInstance<TData extends RowData> = ReactTable<
  DataTableFeatures,
  TData
>;
type DataTableOptions<TData extends RowData> = Omit<
  TableOptions<DataTableFeatures, TData>,
  "features"
>;

/** A column helper typed against the shared features. */
function dataTableColumns<TData extends RowData>() {
  return createColumnHelper<DataTableFeatures, TData>();
}

/** useTable with the shared features. Keep data and columns stable. */
function useDataTable<TData extends RowData>(
  options: DataTableOptions<TData>
): DataTableInstance<TData> {
  return useTable<DataTableFeatures, TData>({
    features: dataTableFeatures,
    ...options,
  });
}

/** The select column: a header checkbox for the page and one per row. */
function dataTableSelectColumn<TData extends RowData>() {
  return dataTableColumns<TData>().display({
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={
          table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(value)}
        aria-label="Select all rows on this page"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  });
}

type DataTableProps<TData extends RowData> = {
  table: DataTableInstance<TData>;
  /** Shown in one full-width row when no rows match. */
  empty?: React.ReactNode;
  className?: string;
};

function DataTable<TData extends RowData>({
  table,
  empty = "No results.",
  className,
}: DataTableProps<TData>) {
  const { rows } = table.getRowModel();
  const columnCount = table.getVisibleLeafColumns().length;
  return (
    <Table data-slot="data-table" className={cnState(className)}>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length ? (
          rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() ? "selected" : undefined}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columnCount}
              className="text-muted-foreground h-24 text-center whitespace-normal"
            >
              {empty}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

type DataTableColumnHeaderProps<TData extends RowData, TValue> = {
  column: Column<DataTableFeatures, TData, TValue>;
  title: string;
  className?: string;
};

/** A header that sorts and hides its column from a small menu. */
function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cnState(className)}>{title}</div>;
  }
  const sorted = column.getIsSorted();
  const SortIcon =
    sorted === "desc"
      ? AltArrowDownIcon
      : sorted === "asc"
        ? AltArrowUpIcon
        : SortVerticalIcon;
  return (
    <div
      data-slot="data-table-column-header"
      className={cnState("flex items-center", className)}
    >
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="sm"
              className="data-popup-open:bg-ghost-hover -ml-2"
            />
          }
        >
          {title}
          <SortIcon
            data-icon="inline-end"
            className={sorted ? undefined : "text-muted-foreground"}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          {column.getCanSort() ? (
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                <AltArrowUpIcon /> Ascending
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                <AltArrowDownIcon /> Descending
              </DropdownMenuItem>
            </DropdownMenuGroup>
          ) : null}
          {column.getCanSort() && column.getCanHide() ? (
            <DropdownMenuSeparator />
          ) : null}
          {column.getCanHide() ? (
            <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
              <EyeClosedIcon /> Hide
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

type DataTableViewOptionsProps<TData extends RowData> = {
  table: DataTableInstance<TData>;
  /** Column labels for the menu; the column id is used otherwise. */
  labels?: Partial<Record<string, string>>;
};

/** A menu that shows and hides the table's hideable columns. */
function DataTableViewOptions<TData extends RowData>({
  table,
  labels,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="secondary" size="sm" className="ml-auto" />}
      >
        <Tuning2Icon data-icon="inline-start" />
        View
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Columns</DropdownMenuLabel>
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
              >
                {labels?.[column.id] ?? column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type DataTableToolbarProps<TData extends RowData> = {
  table: DataTableInstance<TData>;
  /** The column the search box filters. Leave out for no search box. */
  filterColumn?: string;
  filterPlaceholder?: string;
  labels?: Partial<Record<string, string>>;
  /** Extra controls between the search box and the view menu. */
  children?: React.ReactNode;
  className?: string;
};

/** A search box for one column, any extra controls, and the view menu. */
function DataTableToolbar<TData extends RowData>({
  table,
  filterColumn,
  filterPlaceholder = "Filter…",
  labels,
  children,
  className,
}: DataTableToolbarProps<TData>) {
  const column = filterColumn ? table.getColumn(filterColumn) : undefined;
  const value = column?.getFilterValue();
  return (
    <div
      data-slot="data-table-toolbar"
      className={cnState("flex items-center gap-2", className)}
    >
      {column ? (
        <Input
          size="sm"
          placeholder={filterPlaceholder}
          aria-label={filterPlaceholder}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => column.setFilterValue(event.target.value)}
          className="max-w-64"
        />
      ) : null}
      {children}
      <DataTableViewOptions table={table} labels={labels} />
    </div>
  );
}

const pageSizes = [10, 20, 50] as const;

type DataTablePaginationProps<TData extends RowData> = {
  table: DataTableInstance<TData>;
  /** Show the selected-row count. On when the table has a select column. */
  showSelection?: boolean;
  className?: string;
};

/** The selection count, rows per page, page position and page buttons. */
function DataTablePagination<TData extends RowData>({
  table,
  showSelection = table.getColumn("select") !== undefined,
  className,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.state.pagination;
  const sizes = pageSizes.map((size) => ({
    value: String(size),
    label: String(size),
  }));
  return (
    <div
      data-slot="data-table-pagination"
      className={cnState(
        "flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm",
        className
      )}
    >
      <div className="text-muted-foreground flex-1">
        {showSelection
          ? `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} selected`
          : null}
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">Rows per page</span>
        <Select
          items={sizes}
          value={String(pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
        >
          <SelectTrigger size="sm" className="w-16" aria-label="Rows per page">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sizes.map((size) => (
              <SelectItem key={size.value} value={size.value}>
                {size.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium tabular-nums">
          Page {pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="icon-sm"
            className="hidden sm:inline-flex"
            aria-label="First page"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <DoubleAltArrowLeftIcon />
          </Button>
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Previous page"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <AltArrowLeftIcon />
          </Button>
          <Button
            variant="secondary"
            size="icon-sm"
            aria-label="Next page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <AltArrowRightIcon />
          </Button>
          <Button
            variant="secondary"
            size="icon-sm"
            className="hidden sm:inline-flex"
            aria-label="Last page"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <DoubleAltArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

export {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
  DataTableViewOptions,
  dataTableColumns,
  dataTableFeatures,
  dataTableSelectColumn,
  useDataTable,
};
export type { DataTableFeatures, DataTableInstance, DataTableOptions };
