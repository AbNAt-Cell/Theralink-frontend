"use client";

import { ColumnDef } from "@tanstack/react-table";

export type StaffAuditRecord = {
  id: string;
  affectedStaff: string;
  affectedBy: string;
  section: string;
  action: string;
  dateTime: string; // ISO string or formatted date
};

export const columns: ColumnDef<Partial<StaffAuditRecord>>[] = [
  {
    accessorKey: "affectedStaff",
    header: "Affected Staff",
  },
  {
    accessorKey: "affectedBy",
    header: "Affected By",
  },
  {
    accessorKey: "section",
    header: "Section",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
  {
    accessorKey: "dateTime",
    header: "Date & Time",
    cell: ({ row }) => row.original.dateTime ? new Date(row.original.dateTime).toLocaleDateString() : "-",
  },
]; 