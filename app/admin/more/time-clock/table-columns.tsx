"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TimeClockRecord = {
  id: string;
  staff: string;
  timeIn: string;
  timeOut: string;
  hoursWorked: string;
  approved: string;
};

export type StaffClockedInRecord = {
  id: string;
  staff: string;
  timeIn: string;
};

export type StaffTotalHoursRecord = {
  id: string;
  staff: string;
  totalHours: string;
};

export const timeClockColumns: ColumnDef<Partial<TimeClockRecord>>[] = [
  { accessorKey: "staff", header: "Staff" },
  { accessorKey: "timeIn", header: "Time In" },
  { accessorKey: "timeOut", header: "Time Out" },
  { accessorKey: "hoursWorked", header: "Hours Worked" },
  { accessorKey: "approved", header: "Approved" },
  { accessorKey: "action", header: "Action" },
];

export const staffClockedInColumns: ColumnDef<Partial<StaffClockedInRecord>>[] = [
  { accessorKey: "id", header: "Staff ID" },
  { accessorKey: "staff", header: "Staff" },
  { accessorKey: "timeIn", header: "Time In" },
];

export const staffTotalHoursColumns: ColumnDef<Partial<StaffTotalHoursRecord>>[] = [
  { accessorKey: "id", header: "Staff ID" },
  { accessorKey: "staff", header: "Staff" },
  { accessorKey: "totalHours", header: "Total Hours" },
]; 