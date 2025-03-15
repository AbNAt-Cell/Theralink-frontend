"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type { Staff } from "@/types/staff"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const columns: ColumnDef<Partial<Staff>>[] = [
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
    accessorKey: "name",
    header: "Staff",
    cell: ({ row }) => (
      <Link href={`/admin/staff/${row.original.id}`} className="text-primary hover:underline">
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "credentials",
    header: "Credentials",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "race",
    header: "Race",
  },
  {
    accessorKey: "site",
    header: "Site",
  },
  {
    accessorKey: "phone",
    header: "Mobile Phone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "lastDocument",
    header: "Last Document",
  },
  {
    accessorKey: "lastLogin",
    header: "Last Login",
  },
  {
    accessorKey: "numberOfCases",
    header: ({ column }) => {
      return (
        <Button
          className="font-bold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          # of Cases
          <ArrowUpDown />
        </Button>
      )
    },
    enableSorting: true,
  },
]
