"use client"

import { ColumnDef } from "@tanstack/react-table"

import type { User } from "@/types/user"

export const columns: ColumnDef<Partial<User>>[] = [
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
    header: "Balance",
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
    accessorKey: "lastEligibilityCheck",
    header: "Last Eligibility Check",
  },
]
