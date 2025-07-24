"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./table-columns";
import { Pencil, Trash2 } from "lucide-react";
import type { Goals } from "@/types/goal";
import { DefaultGoalModal } from "./goalModal";

const initialGoals: Goals[] = [];

export default function ClinicFilePage() {
  const [goals, setGoals] = useState<Goals[]>(initialGoals);
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const router = useRouter();

  const handleDelete = (idx: number) => {
    setGoals(prevGoals => prevGoals.filter((_, i) => i !== idx));
  };

  const handleAddCompliance = (newGoals: Goals) => {
    setGoals((prev) => [...prev, { ...newGoals, name: newGoals.goalName }]);
    setShowModal(false);
  };

  const handleEditCompliance = (updatedGoals: Goals) => {
    if (editIdx !== null) {
      setGoals((prev) =>
        prev.map((item, idx) =>
          idx === editIdx ? { ...updatedGoals, name: updatedGoals.goalName } : item
        )
      );
      setEditIdx(null);
      setShowModal(false);
    }
  };

  const handleOpenEdit = (idx: number) => {
    setEditIdx(idx);
    setShowModal(true);
  };

  const enhancedGoals = goals.map((goal, idx) => ({
    ...goal,
    handleOpenEdit: () => handleOpenEdit(idx),
    handleDelete: () => handleDelete(idx),
  }));

  return (
    <div className="">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Default Goals</h1>
        <div className="flex gap-4">
          <Button variant="outlineSecondary">View Treatment Plan Template</Button>
          <Button variant="secondary" onClick={() => setShowModal(true)}>Add New Goals</Button>
        </div>
      </div>

      <div className='flex flex-col gap-4 text-center rounded-2xl overflow-hidden'>        
        <DataTable columns={columns} data={enhancedGoals} />      
      </div>

      {/* Modal logic here */}
      {/* {showModal && (
        <GoalsModal
          onClose={() => { setShowModal(false); setEditIdx(null); }}
          onSubmit={editIdx === null ? handleAddCompliance : handleEditCompliance}
          initialData={
            editIdx !== null && goals[editIdx]
              ? {
                  goalName: goals[editIdx].name,
                  description: goals[editIdx].description ?? "",
                  interventions: goals[editIdx].interventions ?? [],
                  objective: goals[editIdx].objective ?? "",
                  startDate: goals[editIdx].startDate ?? "",
                  endDate: goals[editIdx].endDate ?? "",
                  frequency: goals[editIdx].frequency ?? "",
                  progress: goals[editIdx].progress ?? ""
                }
              : undefined
          }
          isEdit={editIdx !== null}
        />
      )} */}
      <DefaultGoalModal
        open={showModal}
          onClose={() => { setShowModal(false); setEditIdx(null); }}
          onSubmit={editIdx === null ? handleAddCompliance : handleEditCompliance}
          isEdit={editIdx !== null}
      />
    </div>
  );
}
