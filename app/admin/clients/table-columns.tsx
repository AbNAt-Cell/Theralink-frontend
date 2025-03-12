"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type { User } from "@/types/user"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export const columns: ColumnDef<Partial<User>>[] = [
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
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "balance",
    header: ({ column }) => {
      return (
        <Button
          className="font-bold"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Balance
          <ArrowUpDown />
        </Button>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "dob",
    header: "DOB",
  },
  {
    accessorKey: "assignedStaff",
    header: "Assigned Staff",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "primaryInsurance",
    header: "Primary Insurance",
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
  },
  {
    accessorKey: "lastSeenDate",
    header: "Last Seen Date",
  },
  {
    accessorKey: "nextAppointment",
    header: "Next Appointment",
  },
  {
    accessorKey: "site",
    header: "Site",
  },
  {
    accessorKey: "lastEligibilityCheck.date",
    header: "Last Eligibility Check",
  },
]
