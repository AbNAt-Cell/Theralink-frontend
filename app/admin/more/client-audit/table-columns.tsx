"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ClientAuditRecord = {
  id: string;
  client: string;
  byStaff: string;
  affectedSection: string;
  action: string;
  date: string; // ISO string or formatted date
};

export const columns: ColumnDef<Partial<ClientAuditRecord>>[] = [
  {
    accessorKey: "client",
    header: "Client",
  },
  {
    accessorKey: "byStaff",
    header: "By Staff",
  },
  {
    accessorKey: "affectedSection",
    header: "Affected Section",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => row.original.date ? new Date(row.original.date).toLocaleDateString() : "-",
  },
]; 