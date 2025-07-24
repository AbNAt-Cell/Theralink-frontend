import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { CheckedState } from "@radix-ui/react-checkbox";

export default function DateFilterPanel({ open, onClose, onApply }: { open: boolean; onClose: () => void; onApply: (filter: any) => void }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [importantOnly, setImportantOnly] = useState(false);

  if (!open) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs">
      <h2 className="text-lg font-bold mb-4">Select Date</h2>
      <div className="mb-3">
        <label className="block mb-1 font-medium">Start Date</label>
        <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
      </div>
      <div className="mb-3">
        <label className="block mb-1 font-medium">End Date</label>
        <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Checkbox checked={importantOnly} onCheckedChange={(checked: CheckedState) => typeof checked === 'boolean' && setImportantOnly(checked)} id="important-only" />
        <label htmlFor="important-only" className="text-sm">Show Important tasks only</label>
      </div>
      <Button type="button" variant="secondary" onClick={() => onApply({ startDate, endDate, importantOnly })}>Apply</Button>
    </div>
  );
} 