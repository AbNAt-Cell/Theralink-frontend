"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type { BillingRemittance } from "@/types/billing"

export const columns: ColumnDef<Partial<BillingRemittance>>[] = [
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
    accessorKey: "controlNumber",
    header: "Control #",
  },
  {
    accessorKey: "batchId",
    header: "Batch ID",
  },
  {
    accessorKey: "payerName",
    header: "Payer Name",
  },
  {
    accessorKey: "processDate",
    header: "Process Date",
  },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
  },
  {
    accessorKey: "amountBilled",
    header: "Amount Billed",
  },
  {
    accessorKey: "diff",
    header: "Diff",
  },
  {
    accessorKey: "percentReceived",
    header: "% Received",
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
  },
  {
    accessorKey: "adjAmount",
    header: "Adj Amt",
  },
  {
    accessorKey: "adjCode",
    header: "Adj Code",
  },
  {
    accessorKey: "numberOfCodes",
    header: "# of Code",
  },
  {
    accessorKey: "numberOfServiceLines",
    header: "# of Service lines",
  },
]
