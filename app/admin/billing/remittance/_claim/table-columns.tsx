"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type { BillingClaim } from "@/types/billing"

export const columns: ColumnDef<Partial<BillingClaim>>[] = [
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
    accessorKey: "claimControlNumber",
    header: "Claim Control #",
  },
  {
    accessorKey: "controlNumber",
    header: "Control #",
  },
  {
    accessorKey: "memberName",
    header: "Member Name",
  },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
  },
  {
    accessorKey: "serviceDate",
    header: "Service Date",
  },
  {
    accessorKey: "payerControlNumber",
    header: "Payer Control #",
  },
  {
    accessorKey: "payerName",
    header: "Payer Name",
  },
  {
    accessorKey: "policyNumber",
    header: "Policy #",
  },
  {
    accessorKey: "amountBilled",
    header: "Amt. Billed",
  },
  {
    accessorKey: "amountPaid",
    header: "Amt. Paid",
  },
  {
    accessorKey: "patientResponsibility",
    header: "Pt. Responsibility",
  },
  {
    accessorKey: "diff",
    header: "Diff",
  },
  {
    accessorKey: "numberOfServiceLines",
    header: "# of Service Lines",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "worked",
    header: "Worked",
  },
]
