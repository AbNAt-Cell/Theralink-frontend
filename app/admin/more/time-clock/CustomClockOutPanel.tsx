import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const sectionList = [
  "Sick Leave",
  "vocation leave",
  "PTO (Paid Time off)",
  "Maternity leave",
  "Client Diagnosis",
];

export default function CustomClockOutPanel() {
  const [clockDate, setClockDate] = useState("");
  const [clockTime, setClockTime] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div className="bg-white rounded-xl p-6 w-full max-w-xs flex flex-col gap-4 border">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-lg">Custom Clock Out</span>
        <Button className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" type="button">Click to CLOCK OUT</Button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Clock Date</label>
        <Input type="date" value={clockDate} onChange={e => setClockDate(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Clock Time</label>
        <Input type="time" value={clockTime} onChange={e => setClockTime(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Select Reason</label>
        <select className="w-full border rounded px-3 py-2" value={reason} onChange={e => setReason(e.target.value)}>
          <option value="">Select Reason</option>
          {sectionList.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} />
      </div>
      <Button className="bg-[#0A2259] text-white font-bold rounded mt-2" type="button">Clock Out</Button>
    </div>
  );
} 