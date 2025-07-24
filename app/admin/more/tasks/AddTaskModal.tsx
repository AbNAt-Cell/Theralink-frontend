import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, X } from "lucide-react";

export default function AddTaskModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (task: any) => void }) {
  const [task, setTask] = useState("");
  const [staff, setStaff] = useState("");
  const [dueDate, setDueDate] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm relative">
        <button className="absolute right-4 top-4" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-6">Add Task</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Task</label>
          <Input value={task} onChange={e => setTask(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Staff</label>
          <Input value={staff} onChange={e => setStaff(e.target.value)} />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Due Date</label>
          <div className="relative">
            <Input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="pr-10"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => onSave({ task, staff, dueDate })}>Save</Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </div>
  );
} 