"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export type FileTableRow = {
  id: string;
  fileName: string;
  fileTags?: string;
  uploadedBy?: string;
  files?: string;
  dateUploaded?: string;
  onEdit?: (row: FileTableRow) => void;
  onDelete?: (id: string) => void;
};

export const columns: ColumnDef<FileTableRow>[] = [
  {
    accessorKey: "fileName",
    header: "File Name",
    cell: ({ row }) => (
      <span className="truncate block max-w-[120px] md:max-w-xs">{row.original.fileName}</span>
    ),
  },
  {
    accessorKey: "fileTags",
    header: "File Tags",
    cell: ({ row }) => (
      <span className="truncate block max-w-[100px] md:max-w-xs">{row.original.fileTags || "-"}</span>
    ),
  },
  {
    accessorKey: "uploadedBy",
    header: "Uploaded By",
    cell: ({ row }) => (
      <span className="truncate block max-w-[100px] md:max-w-xs">{row.original.uploadedBy || "-"}</span>
    ),
  },
  {
    accessorKey: "files",
    header: "Files",
    cell: ({ row }) => (
      <span className="truncate block max-w-[100px] md:max-w-xs">{row.original.files || "-"}</span>
    ),
  },
  {
    accessorKey: "dateUploaded",
    header: "Date Uploaded",
    cell: ({ row }) => (
      <span className="truncate block max-w-[100px] md:max-w-xs">{row.original.dateUploaded || "-"}</span>
    ),
  },
  {
  id: "actions",
  header: "Actions",
  cell: ({ row }) => (
    <div className="flex gap-2">
      <Button
        size="icon"
        variant="ghost"
        className="text-green-600 hover:text-green-800"
        title="Edit"
        onClick={() => row.original.onEdit?.(row.original)}
      >
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="text-red-600 hover:text-red-800"
        title="Delete"
        onClick={() => row.original.onDelete?.(row.original.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  ),
  enableSorting: false,
  enableHiding: false,
},
]; 