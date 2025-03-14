"use client"

import { ColumnDef } from "@tanstack/react-table"
import type { Site } from "@/types/site"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"


export const columns: ColumnDef<Partial<Site>>[] = [
  {
    accessorKey: "name",
    header: "Site",
  },
  {
    accessorKey: "address",
    header: "Address",
  },

  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "numberOfClients",
    header: "# of Clients",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Button
          size="icon"
          onClick={() => console.log("Edit", row.original)}
          variant="outline"
        >
          <Edit />
        </Button>
        <Button
          size="icon"
          onClick={() => console.log("Delete", row.original)}
          variant="outline"
        >
          <Trash2 className="text-destructive" />
        </Button>
      </div>
    )
  }
]
