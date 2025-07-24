"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface DefaultGoalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: DefaultGoalFormData) => void;
  initialData?: DefaultGoalFormData;
  isEdit?: boolean;
}

export interface DefaultGoalFormData {
  goalName: string;
  startDate: string;
  description: string;
  interventions: string;
  objective: string;
  serviceType: string;
  staffTypes: string;
  frequency: string;
  daily: string;
}

const dailyOptions = [
  "Daily",
  "Weekly",
  "Monthly",
  "Bi-Monthly",
  "Semi-Annually",
  "Quarterly",
  "Yearly",
];

export const DefaultGoalModal: React.FC<DefaultGoalModalProps> = ({ open, onClose, onSubmit }) => {
  const [form, setForm] = useState<DefaultGoalFormData>({
    goalName: "",
    startDate: "",
    description: "",
    interventions: "",
    objective: "",
    serviceType: "",
    staffTypes: "",
    frequency: "",
    daily: "",
  });

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 md:p-10 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-semibold">Add New Default Goals</h2>
          <button onClick={onClose} className="text-4xl font-thin text-black hover:text-gray-600 absolute right-6 top-6 md:static">×</button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Goal Name</label>
            <Input name="goalName" value={form.goalName} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description <span className="text-xs text-gray-500">(Use the curly brackets {'{ClientName}'} to insert the client's name automatically)</span></label>
            <Input name="description" value={form.description} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Interventions</label>
            <Input name="interventions" value={form.interventions} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Objective</label>
            <Input name="objective" value={form.objective} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Service Type</label>
            <Input name="serviceType" value={form.serviceType} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Staff Types</label>
            <Input name="staffTypes" value={form.staffTypes} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Frequency</label>
            <Input name="frequency" value={form.frequency} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Daily</label>
            <Select value={form.daily} onValueChange={v => setForm(f => ({ ...f, daily: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                {dailyOptions.map(opt => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 flex gap-4 mt-6">
            <Button type="submit" variant="secondary" >Submit</Button>
            <Button type="button" variant="outlineSecondary" onClick={onClose} className="border-blue-900 text-blue-900">Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
