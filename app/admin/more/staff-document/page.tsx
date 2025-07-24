"use client";

import React, { useState } from "react";
import { columns, StaffDocument } from "./table-columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "@/components/TableFilters";
import { useRouter } from "next/navigation";

// Mock staff list
const staffList = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
];

// Mock data
const mockDocuments: StaffDocument[] = [];

const filters: Filter[] = [
  { label: "From", value: "from" },
  { label: "To", value: "to" },
  { label: "Staff", value: "staff" },
];

export default function StaffDocumentsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [staff, setStaff] = useState("all");
  const router = useRouter();

  // Filtered data logic (mock, not implemented)
  const filteredData = mockDocuments;

  // Clear filter handler
  const handleClearFilter = () => {
    setFrom("");
    setTo("");
    setStaff("all");
  };

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Staff Documents</h1>
        <div className="flex flex-wrap gap-4">
          <Button variant="outline">Staff Document Template</Button>
          <Button variant="outline" onClick={() => router.push('/admin/more/staff-document/new')}>Add Staff Document</Button>
        </div>
      </div>
      <div className="relative bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">From</label>
            <Input
              type="date"
              value={from}
              onChange={e => setFrom(e.target.value)}
              className="min-w-[160px] text-[#0348E9]"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">To</label>
            <Input
              type="date"
              value={to}
              onChange={e => setTo(e.target.value)}
              className="min-w-[160px] text-[#0348E9]"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Staff</label>
            <Select value={staff} onValueChange={setStaff}>
              <SelectTrigger className="min-w-[160px]">
                <SelectValue placeholder="Staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Staff</SelectItem>
                {staffList.map(s => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            className="absolute right-5 top-1/2 -translate-y-1/2"
            onClick={handleClearFilter}
          >
            Clear Filter
          </Button>
        </div>
      </div>
      <p>There is no staff document</p>
      {/* <DataTable columns={columns} data={filteredData} filters={filters} /> */}
    </div>
  );
}
