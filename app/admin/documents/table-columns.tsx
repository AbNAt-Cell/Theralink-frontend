"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type { Document } from "@/types/document"
import Link from "next/link"

export const columns: ColumnDef<Partial<Document>>[] = [
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
    header: "ID",
  },
  {
    accessorKey: "dos",
    header: "Dos",
  },
  {
    accessorKey: "template",
    header: "Template",
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => (
      <Link href={`/admin/clients/${row.original.client?.id}`} className="text-primary hover:underline">
        {row.original.client?.name}
      </Link>
    ),
  },
  {
    accessorKey: "dob",
    header: "DOB",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "placeOfService",
    header: "Place of Service",
  },
  {
    accessorKey: "staff",
    header: "Staff (Supervisor)",
  },
  {
    accessorKey: "dx",
    header: "Dx",
  },
  {
    accessorKey: "status",
    header: "Doc Status",
  },
  {
    accessorKey: "payer",
    header: "Payer",
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "serviceRate",
    header: "Service Rate",
  },
  {
    accessorKey: "totalBill",
    header: "Total Bill",
  },
  {
    accessorKey: "datePaid",
    header: "Date Paid",
  },
  {
    accessorKey: "lastBill",
    header: "Last Bill",
  },
  {
    accessorKey: "payStatus",
    header: "Pay Status",
  },
]
