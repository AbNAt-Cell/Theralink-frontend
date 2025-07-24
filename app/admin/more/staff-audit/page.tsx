"use client";

import React, { useState } from "react";
import { columns, StaffAuditRecord } from "./table-columns";
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

const staffList = [
  { id: "1", name: "Mfoniso Ibokette" },
];
const sectionList = [
  "Staff Billing Profile",
  "Staff caseload",
  "staff certifications",
  "staff credentails",
  "staff Document Tags",
  "Staff Email Notification settings",
];
const actionList = ["Insert", "Update", "Delete", "Select"];

const mockData: StaffAuditRecord[] = [
  {
    id: "1",
    affectedStaff: "H0034 Med Management:95",
    affectedBy: "H0034 Med Management:95",
    section: "15 Minutes",
    action: "$13:53",
    dateTime: "2024-06-04",
  },
];

export default function StaffAuditPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [affectedStaff, setAffectedStaff] = useState("");
  const [affectedBy, setAffectedBy] = useState("");
  const [section, setSection] = useState("");
  const [action, setAction] = useState("");

  // Filtering logic (mock, not implemented)
  const filteredData = mockData;

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Staff Audit</h1>
      <div className="bg-white rounded-2xl border p-6 mb-6">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex flex-col min-w-[180px]">
            <label className="mb-1 font-medium">From</label>
            <Input className="min-w-[160px] text-[#0348E9]" type="date" value={from} onChange={e => setFrom(e.target.value)} />
          </div>
          <div className="flex flex-col min-w-[180px]">
            <label className="mb-1 font-medium">To</label>
            <Input className="min-w-[160px] text-[#0348E9]" type="date" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div className="flex flex-col min-w-[180px]">
            <label className="mb-1 font-medium">Affected Staff</label>
            <Select value={affectedStaff} onValueChange={setAffectedStaff}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map(s => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col min-w-[180px]">
            <label className="mb-1 font-medium">Affected By</label>
            <Select value={affectedBy} onValueChange={setAffectedBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map(s => (
                  <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col min-w-[180px]">
            <label className="mb-1 font-medium">Section</label>
            <Select value={section} onValueChange={setSection}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {sectionList.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col min-w-[180px]">
            <label className="mb-1 font-medium">Action</label>
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {actionList.map(a => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mb-6">
          <Button variant="secondary">Filter</Button>
          <Button variant="outline">Clear</Button>
        </div>
      <div className="bg-[#f8fafc] rounded-2xl overflow-hidden">
        <DataTable  columns={columns} data={filteredData} />
      </div>
    </div>
  );
}
