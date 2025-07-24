"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomClockOutPanel from "./CustomClockOutPanel";
import { DataTable } from "@/components/ui/data-table";
import { timeClockColumns, staffClockedInColumns, staffTotalHoursColumns, TimeClockRecord, StaffClockedInRecord, StaffTotalHoursRecord } from "./table-columns";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";

const mockTimeClock: TimeClockRecord[] = [
  {
    id: "1",
    staff: "Mfoniso Ibokette",
    timeIn: "11/5/2024 10:00 PM",
    timeOut: "11/5/2024 10:00 PM",
    hoursWorked: "69h 53m",
    approved: "15 Minutes",
  },
];
const mockStaffClockedIn: StaffClockedInRecord[] = [
  { id: "2gg81", staff: "Idiasuyi Victor", timeIn: "11/5/2024 10:00 PM" },
];
const mockStaffTotalHours: StaffTotalHoursRecord[] = [
  { id: "2gg81", staff: "Idiasuyi Victor", totalHours: "6h 43m" },
];

export default function TimeClockPage() {
  const [showTrashed, setShowTrashed] = useState(false);
  const [staff, setStaff] = useState("");

  // Safely override the action column
  const timeClockCols = (timeClockColumns as any[]).map(col =>
    col && col.accessorKey === "action"
      ? { ...col, cell: () => (
        <div className='flex gap-2'>
          <Pencil className='w-4 h-4 text-blue-600 cursor-pointer' />
          <Trash2 className='w-4 h-4 text-red-600 cursor-pointer' />
        </div>
      ) }
      : col
  );

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Time Clock</h1>
      <div className="bg-white rounded-2xl border p-4 mb-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4 justify-between w-full">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="border border-dashed rounded-full px-4 py-2 text-gray-600 bg-[#fafbfc] cursor-pointer">
              TaskDate | 11/10/2023 - 11/10/2024
            </span>
            <Input className="min-w-[120px]" placeholder="Staff" value={staff} onChange={e => setStaff(e.target.value)} />
            <div className="flex items-center gap-2">
              <Switch checked={showTrashed} onCheckedChange={setShowTrashed} />
              <span>Show Trashed</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary">Generate Report</Button>
            <span className="text-gray-400 cursor-pointer select-none">Clear Filter</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <div className="w-full max-w-xs">
          <CustomClockOutPanel />
        </div>
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-[#f3f5f7] rounded-xl p-4">
            <DataTable columns={timeClockCols} data={mockTimeClock} />
          </div>
          <div className="bg-[#f3f5f7] rounded-xl p-4">
            <div className="font-semibold mb-2">Staff Currently Clocked In</div>
            <div className="text-xs text-gray-500 mb-2">The following is a list of currently clocked in staff, including when they clocked in and how long they have been clocked in for.</div>
            <DataTable columns={staffClockedInColumns} data={mockStaffClockedIn} />
          </div>
          <div className="bg-[#f3f5f7] rounded-xl p-4">
            <div className="font-semibold mb-2">Staff Total Hrs Worked</div>
            <DataTable columns={staffTotalHoursColumns} data={mockStaffTotalHours} />
          </div>
        </div>
      </div>
    </div>
  );
} 