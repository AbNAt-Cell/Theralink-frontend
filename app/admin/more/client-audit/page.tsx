"use client";

import React, { useState } from "react";
import { columns, ClientAuditRecord } from "./table-columns";
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
const clientList = [
  { id: "1", name: "Bolton, Jayleigh (Auspicious community service)" },
  { id: "2", name: "Demings, Desmond (Auspicious Community Service)" },
  { id: "3", name: "Edwards, Tysen (Auspicious Community service)" },
];
const sectionList = [
  "Auth. Servicex",
  "Authorization",
  "Client",
  "Client collateral contacts",
  "Client communication pref",
  "Client Diagnosis",
];
const actionList = ["Insert", "Update", "Delete", "Select"];

const mockData: ClientAuditRecord[] = [
  {
    id: "1",
    client: "Mfoniso Ibokette",
    byStaff: "Mfoniso Ibokette",
    affectedSection: "Client",
    action: "Update",
    date: "2024-06-04",
  },
];

export default function ClientAuditPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [action, setAction] = useState("");
  const [affectedSection, setAffectedSection] = useState("");
  const [client, setClient] = useState("");
  const [staff, setStaff] = useState("");
  const [site, setSite] = useState("");

  // Filtering logic (mock, not implemented)
  const filteredData = mockData;

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Client Audit</h1>
      <div className="bg-white rounded-2xl border p-6 mb-4">
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
          <div className="flex flex-col min-w-[180px]">
            <label className="mb-1 font-medium">Affected Section</label>
            <Select value={affectedSection} onValueChange={setAffectedSection}>
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
            <label className="mb-1 font-medium">Client</label>
            <Select value={client} onValueChange={setClient}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {clientList.map(c => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col min-w-[180px]">
            <label className="mb-1 font-medium">Staff</label>
            <Select value={staff} onValueChange={setStaff}>
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
        </div>
        {/* <div className="flex flex-col min-w-[180px] mt-6">
          <label className="mb-1 font-medium">Site</label>
          <Input value={site} onChange={e => setSite(e.target.value)} placeholder="" />
        </div>
        <div className="flex gap-4 mt-6">
          <Button variant="secondary">Filter</Button>
          <Button variant="outline">Clear</Button>
        </div> */}
      </div>
      <div className="flex flex-col min-w-[180px] mt-4">
          <label className="mb-1 font-medium">Site</label>
          <Input className="w-[300px]" value={site} onChange={e => setSite(e.target.value)} placeholder="" />
        </div>
        <div className="flex gap-4 mt-4 mb-4">
          <Button variant="secondary">Filter</Button>
          <Button variant="outline">Clear</Button>
        </div>
      <div className="bg-[#f8fafc] rounded-2xl overflow-hidden ">
        <DataTable columns={columns} data={filteredData} />
      </div>
    </div>
  );
}
