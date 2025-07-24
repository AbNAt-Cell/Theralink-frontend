"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const templates = [
  { id: "1", name: "No Data Found" },
  // { id: "2", name: "Training" },
];
const staffList = [
  { id: "1", name: "Mfoniso Ibokette" },
  // { id: "2", name: "Jane Smith" },
];

export default function AddStaffDocumentForm() {
  const [template, setTemplate] = useState("");
  const [staff, setStaff] = useState("");
  const [date, setDate] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // stub: handle form submission
  };

  return (
    <div className=" flex items-center justify-center bg-[#fafbfc]">
      <ArrowLeft className="w-9 h-9 absolute left-16 top-40 cursor-pointer" onClick={() => router.back()}/>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-12 w-full max-w-3xl relative">
        <h2 className="text-2xl font-bold mb-10">Add Staff Documents</h2>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select Template</label>
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger className="w-full h-14 text-base bg-[#fafbfc] border border-[#E5E7EB]">
              <SelectValue placeholder="Select Template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-medium">Select Staff</label>
          <Select value={staff} onValueChange={setStaff}>
            <SelectTrigger className="w-full h-14 text-base bg-[#fafbfc] border border-[#E5E7EB]">
              <SelectValue placeholder="Select Staff" />
            </SelectTrigger>
            <SelectContent>
              {staffList.map(s => (
                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-10">
          <label className="block mb-2 font-medium">Implementation date</label>
          <div className="relative">
            <Input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full h-14 text-base bg-[#fafbfc] border border-[#E5E7EB] pr-12"
              placeholder="Select Implementation Date"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-4 mt-8">
          <Button type="submit" variant="secondary">Submit</Button>
          <Button type="button" variant="outline" className="font-bold  rounded border border-[#0A2259] text-[#0A2259]" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
} 