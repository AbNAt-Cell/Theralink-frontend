"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import React from "react";

// Define a Service type if not already available
export type Service = {
  id: string;
  serviceCode: string;
  serviceName: string;
  unit: string;
  rate: string;
  dateEffective: string;
  rules: string;
};

type OnDelete = (id: string) => void;

export function getColumns(onDelete: OnDelete): ColumnDef<Partial<Service>>[] {
  return [
    {
      accessorKey: "serviceCode",
      header: () => <div className="text-center w-full">Service Code</div>,
      cell: info => <div className="text-center">{info.getValue() as string}</div>,
    },
    {
      accessorKey: "serviceName",
      header: () => <div className="text-center w-full">Service Name</div>,
      cell: info => <div className="text-center">{info.getValue() as string}</div>,
    },
    {
      accessorKey: "unit",
      header: () => <div className="text-center w-full">Unit</div>,
      cell: info => <div className="text-center">{info.getValue() as string}</div>,
    },
    {
      accessorKey: "rate",
      header: () => <div className="text-center w-full">Rate</div>,
      cell: info => <div className="text-center">{info.getValue() as string}</div>,
    },
    {
      accessorKey: "dateEffective",
      header: () => <div className="text-center w-full">Date Effective</div>,
      cell: info => <div className="text-center">{info.getValue() as string}</div>,
    },
    {
      accessorKey: "rules",
      header: () => <div className="text-center w-full">Rules</div>,
      cell: info => <div className="text-center">{info.getValue() as string}</div>,
    },
    {
      id: "actions",
      header: () => <div className="text-center w-full"></div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
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
