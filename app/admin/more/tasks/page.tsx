"use client";

import React, { useState } from "react";
import { columns, TaskRecord } from "./table-columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import AddTaskModal from "./AddTaskModal";
import DateFilterPanel from "./DateFilterPanel";

const mockData: TaskRecord[] = [];

export default function TasksPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [datePanelOpen, setDatePanelOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({ start: "11/10/2023", end: "11/10/2024", importantOnly: false });
  const [filteredData, setFilteredData] = useState(mockData);

  // filtering logic

  return (
    <div className="">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <Button variant="secondary" onClick={() => setAddModalOpen(true)}>Add New Task</Button>
      </div>
      <div className="bg-white rounded-xl border p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span
            className="border border-dashed rounded-full px-4 py-2 text-gray-600 bg-[#fafbfc] cursor-pointer"
            onClick={() => setDatePanelOpen(true)}
          >
            TaskDate | {dateFilter.start} - {dateFilter.end}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 cursor-pointer select-none" onClick={() => setDateFilter({ start: "11/10/2023", end: "11/10/2024", importantOnly: false })}>
            Clear Filter
          </span>
        </div>
      </div>
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white rounded-xl border p-12 min-h-[350px]">
          <img src="/images/notfound.png" alt="No Tasks" className="" />
          <p className="text-gray-500">No Tasks</p>
        </div>
      ) : (
        <div className="bg-[#f8fafc] rounded-2xl overflow-hidden">
          <DataTable columns={columns} data={filteredData} />
        </div>
      )}
      <AddTaskModal open={addModalOpen} onClose={() => setAddModalOpen(false)} onSave={() => setAddModalOpen(false)} />
      {datePanelOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/20">
          <DateFilterPanel open={datePanelOpen} onClose={() => setDatePanelOpen(false)} onApply={filter => { setDateFilter(filter); setDatePanelOpen(false); }} />
        </div>
      )}
    </div>
  );
} 