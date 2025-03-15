"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type { NewBilling } from "@/types/billing"
import Link from "next/link"

export const columns: ColumnDef<Partial<NewBilling>>[] = [
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
    accessorKey: "client.name",
    header: "Client",
    cell: ({ row }) => (
      <Link href={`/admin/clients/${row.original.client?.id}`} className="text-primary hover:underline">
        {row.original.client?.name}
      </Link>
    ),
  },
  {
    accessorKey: "dos",
    header: "DOS",
  },
  {
    accessorKey: "clientDob",
    header: "Clients DOB(Age)",
  },
  {
    accessorKey: "insurance",
    header: "Insurance",
  },
  {
    accessorKey: "template",
    header: "Template",
  },
  {
    accessorKey: "staff",
    header: "Staff",
  },
  {
    accessorKey: "staffNpi",
    header: "Staff NPI",
  },
  {
    accessorKey: "site",
    header: "Site",
  },
  {
    accessorKey: "serviceCode",
    header: "Srv. Code",
  },
  {
    accessorKey: "units",
    header: "Units",
  },
  {
    accessorKey: "rate",
    header: "Rate",
  },
  {
    accessorKey: "toBill",
    header: "To Bill",
  },
  {
    accessorKey: "status",
    header: "Bill Status",
  },
]
