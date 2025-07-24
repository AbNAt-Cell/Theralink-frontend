"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Goals } from "@/types/goal";

export const columns: ColumnDef<Goals & { handleOpenEdit?: () => void; handleDelete?: () => void }>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-center w-full">Goal Name</div>,
    cell: ({ row }) => <span className="text-center block w-full">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "startDate",
    header: () => <div className="text-center w-full">Start Date</div>,
    cell: ({ row }) => <span className="text-center block w-full">{row.getValue("startDate")}</span>,
  },
  {
    id: "actions",
    header: () => <div className="text-center w-full">Action</div>,
    cell: ({ row }) => (
      <div className="flex gap-2 justify-center">
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="text-green-600 hover:text-green-800"
            title="Edit"
            onClick={() => row.original.handleOpenEdit?.()}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-red-600 hover:text-red-800"
            title="Delete"
            onClick={() => row.original.handleDelete?.()}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
