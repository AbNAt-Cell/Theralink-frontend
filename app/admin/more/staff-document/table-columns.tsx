"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Staff } from "@/types/staff";

export type StaffDocument = {
  id: string;
  from: string; // ISO date string
  to: string;   // ISO date string
  staff: Staff;
  documentName: string;
  documentType: string;
};

export const columns: ColumnDef<Partial<StaffDocument>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="mx-3"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "from",
    header: "From",
    cell: ({ row }) => row.original.from ? new Date(row.original.from).toLocaleDateString() : "-",
  },
  {
    accessorKey: "to",
    header: "To",
    cell: ({ row }) => row.original.to ? new Date(row.original.to).toLocaleDateString() : "-",
  },
  {
    accessorKey: "staff.name",
    header: "Staff",
    cell: ({ row }) => row.original.staff?.name || "-",
  },
  {
    accessorKey: "documentName",
    header: "Document Name",
  },
  {
    accessorKey: "documentType",
    header: "Document Type",
  },
]; 