"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import React from "react";

export type Site = {
  id: string;
  site: string;
  address: string;
  phone: string;
  clients: number;
};

type OnEdit = (id: string) => void;
type OnDelete = (id: string) => void;

export function getColumns(onEdit: OnEdit, onDelete: OnDelete): ColumnDef<Partial<Site>>[] {
  return [
    {
      accessorKey: "site",
      header: () => <div className="text-center w-full">Site</div>,
      cell: info => <div className="text-center">{info.getValue() as string}</div>,
    },
    {
      accessorKey: "address",
      header: () => <div className="text-center w-full">Address</div>,
      cell: info => <div className="text-center">{info.getValue() as string}</div>,
    },
    {
      accessorKey: "phone",
      header: () => <div className="text-center w-full">Phone</div>,
      cell: info => <div className="text-center">{info.getValue() as string}</div>,
    },
    {
      accessorKey: "clients",
      header: () => <div className="text-center w-full"># of clients</div>,
      cell: info => <div className="text-center">{info.getValue() as number}</div>,
    },
    {
      id: "actions",
      header: () => <div className="text-center w-full"></div>,
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => row.original.id && onEdit(row.original.id)}
          >
            <Pencil className="text-blue-900" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => row.original.id && onDelete(row.original.id)}
          >
            <Trash2 className="text-destructive" />
          </Button>
        </div>
      ),
    },
  ];
}


