"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type { BillingSubmission } from "@/types/billing"

export const columns: ColumnDef<Partial<BillingSubmission>>[] = [
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
    accessorKey: "id",
    header: "Batch ID",
  },
  {
    accessorKey: "claims",
    header: "Claims",
  },
  {
    accessorKey: "lines",
    header: "Lines",
  },
  {
    accessorKey: "totalBilled",
    header: "Total Billed",
  },
  {
    accessorKey: "subDate",
    header: "Sub Date",
  },
  {
    accessorKey: "payer",
    header: "Payer",
  },
  {
    accessorKey: "site",
    header: "Site",
  },
  {
    accessorKey: "status",
    header: "Ack Status",
  },
  {
    accessorKey: "res",
    header: "Res",
  },
]
