"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TaskRecord = {
  id: string;
  task: string;
  staff: string;
  dueDate: string;
  status: string;
};

export const columns: ColumnDef<Partial<TaskRecord>>[] = [
  {
    accessorKey: "task",
    header: "Task",
  },
  {
    accessorKey: "staff",
    header: "Staff",
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString() : "-",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]; 