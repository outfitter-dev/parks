"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
  DataTableToolbar,
  dataTableColumns,
  dataTableSelectColumn,
  useDataTable,
} from "@workspace/ui/components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MenuDotsIcon } from "@solar-icons/react/bold/menu-dots";
import { Specimen } from "./kit";

type Delivery = {
  id: string;
  agent: string;
  channel: string;
  status: "delivered" | "queued" | "retrying" | "failed";
  attempts: number;
  at: string;
};

const statusTone = {
  delivered: "success",
  queued: "neutral",
  retrying: "warning",
  failed: "destructive",
} as const;

const agentsCycle = ["Donna", "Rex", "Forge", "Ranger", "Climb"];
const channelsCycle = ["outfitter", "toolkit", "signals", "test-outpost"];
const statusCycle: Delivery["status"][] = ["delivered", "delivered", "queued", "retrying", "delivered", "failed"];

// Fixtures only: 23 deliveries so the table has three pages at ten rows.
const deliveries: Delivery[] = Array.from({ length: 23 }, (_, index) => ({
  id: `dlv_${(4810 + index * 7).toString(36)}`,
  agent: agentsCycle[index % agentsCycle.length] ?? "Donna",
  channel: channelsCycle[(index * 3) % channelsCycle.length] ?? "outfitter",
  status: statusCycle[index % statusCycle.length] ?? "delivered",
  attempts: (index % 4) + 1,
  at: `2026-11-24T${String(7 + Math.floor((index * 13) / 60)).padStart(2, "0")}:${String((index * 13) % 60).padStart(2, "0")}:00`,
}));

const columnLabels = { agent: "Agent", channel: "Channel", status: "Status", attempts: "Attempts", at: "Sent" };

const helper = dataTableColumns<Delivery>();
const columns = helper.columns([
  dataTableSelectColumn<Delivery>(),
  helper.accessor("agent", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Agent" />,
    cell: ({ row }) => <span className="font-medium">{row.original.agent}</span>,
  }),
  helper.accessor("channel", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Channel" />,
    cell: ({ row }) => <span className="font-mono text-muted-foreground">#{row.original.channel}</span>,
  }),
  helper.accessor("status", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge tone={statusTone[row.original.status]} variant="tint" className="capitalize">
        {row.original.status}
      </Badge>
    ),
  }),
  helper.accessor("attempts", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Attempts" className="justify-end" />,
    cell: ({ row }) => <div className="text-right tabular-nums">{row.original.attempts}</div>,
  }),
  helper.accessor("at", {
    header: ({ column }) => <DataTableColumnHeader column={column} title="Sent" />,
    cell: ({ row }) => <span className="text-muted-foreground tabular-nums">{row.original.at.slice(11, 16)}</span>,
  }),
  helper.display({
    id: "actions",
    enableHiding: false,
    cell: () => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Delivery actions" />}>
            <MenuDotsIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>Copy delivery ID</DropdownMenuItem>
            <DropdownMenuItem>Open thread</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Retry delivery</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  }),
]);

export function DataTableDemo() {
  const table = useDataTable({ data: deliveries, columns, getRowId: (row) => row.id });
  return (
    <Specimen
      title="Deliveries"
      note="TanStack Table v9 on our Table, after shadcn's guide. Sort or hide a column from its header, filter by agent, pick rows, and page through."
      className="block space-y-3"
    >
      <DataTableToolbar table={table} filterColumn="agent" filterPlaceholder="Filter agents…" labels={columnLabels} />
      <DataTable table={table} empty="No deliveries match." />
      <DataTablePagination table={table} />
    </Specimen>
  );
}
