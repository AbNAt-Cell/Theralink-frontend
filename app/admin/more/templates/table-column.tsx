"use client";

import { ColumnDef } from "@tanstack/react-table";

export type ServiceTableRow = {
  name: string;
  type: string;
  pos: string;
  timeRecording: string;
  fileTemplate: string;
  canApplyClientSig: string;
  showClientProgress: string;
  showService: string;
};

export const columns: ColumnDef<ServiceTableRow>[] = [
  {
    accessorKey: "name",
    header: () => <div className="text-center w-full">Name</div>,
    cell: ({ row }) => <span className="text-center block w-full">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "type",
    header: () => <div className="text-center w-full">Type</div>,
    cell: ({ row }) => <span className="text-center block w-full">{row.getValue("type")}</span>,
  },
  {
    accessorKey: "pos",
    header: () => <div className="text-center w-full">POS</div>,
    cell: ({ row }) => <span className="text-center block w-full">{row.getValue("pos")}</span>,
  },
  {
    accessorKey: "timeRecording",
    header: () => <div className="text-center w-full">Time Recording</div>,
    cell: ({ row }) => <span className="text-center block w-full">{row.getValue("timeRecording")}</span>,
  },
  {
    accessorKey: "fileTemplate",
    header: () => <div className="text-center w-full">File Template</div>,
    cell: ({ row }) => <span className="text-center block w-full">{row.getValue("fileTemplate")}</span>,
  },
  {
    accessorKey: "canApplyClientSig",
    header: () => <div className="text-center w-full">Can Apply Client Sig.</div>,
    cell: ({ row }) => <span className="text-center block w-full">{row.getValue("canApplyClientSig")}</span>,
  },
  {
    accessorKey: "showClientProgress",
    header: () => <div className="text-center w-full">show client progress</div>,
    cell: ({ row }) => <span className="text-center block w-full">{row.getValue("showClientProgress")}</span>,
  },
  {
    accessorKey: "showService",
    header: () => <div className="text-center w-full">Show service</div>,
    cell: ({ row }) => <span className="text-center block w-full">{row.getValue("showService")}</span>,
  },
];
