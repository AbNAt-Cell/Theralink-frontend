"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Pencil, Trash2 } from "lucide-react";

const initialFlags = [
  { name: "Court Ordered", color: "#22c55e" }, // green
];

const ClientFlags: React.FC = () => {
  const [flags, setFlags] = useState(initialFlags);
  const [modalOpen, setModalOpen] = useState(false);
  const [newFlag, setNewFlag] = useState("");
  const [flagColor, setFlagColor] = useState("#22c55e");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const openAddModal = () => {
    setNewFlag("");
    setFlagColor("#22c55e");
    setEditIndex(null);
    setModalOpen(true);
  };

  const openEditModal = (idx: number) => {
    setNewFlag(flags[idx].name);
    setFlagColor(flags[idx].color);
    setEditIndex(idx);
    setModalOpen(true);
  };

  const handleAddOrEditFlag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlag.trim()) return;
    if (editIndex !== null) {
      // Edit mode
      const updated = [...flags];
      updated[editIndex] = { name: newFlag, color: flagColor };
      setFlags(updated);
    } else {
      // Add mode
      setFlags([...flags, { name: newFlag, color: flagColor }]);
    }
    setNewFlag("");
    setFlagColor("#22c55e");
    setEditIndex(null);
    setModalOpen(false);
  };

  const handleDelete = (idx: number) => {
    setFlags(flags.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Clinic Flags</h2>
        <Button variant="secondary" onClick={openAddModal}>
          <span className="text-lg"></span>
          Add Flags
        </Button>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Flag Name</th>
              <th className="text-left px-6 py-3 font-medium">Flag Color</th>
              <th className="text-left px-6 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {flags.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400">No flags found.</td>
              </tr>
            ) : (
              flags.map((flag, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-6 py-4">{flag.name}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block w-8 h-8 rounded bg-gray-200 border" style={{ backgroundColor: flag.color }} />
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-gray-600 hover:text-blue-700"
                      onClick={() => openEditModal(idx)}
                    >
                      <Pencil size={18} />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(idx)}
                    >
                      <Trash2 size={18} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
          <div></div>
          <div className="text-gray-500 text-sm">1-{flags.length} of {flags.length} items</div>
        </div>
      </div>
      {/* Modal for adding/editing flag */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editIndex !== null ? "Edit Flag" : "Add Flag"}</h3>
              <button onClick={() => { setModalOpen(false); setEditIndex(null); }} className="text-2xl text-gray-500 hover:text-gray-700"><X /></button>
            </div>
            <form onSubmit={handleAddOrEditFlag}>
              <label className="block font-medium mb-2">Flag Name</label>
              <div className="flex items-center gap-2 mb-6">
                <Input
                  className="flex-1"
                  placeholder="Flag Name"
                  value={newFlag}
                  onChange={e => setNewFlag(e.target.value)}
                  autoFocus
                />
                <input
                  type="color"
                  value={flagColor}
                  onChange={e => setFlagColor(e.target.value)}
                  className="w-10 h-10 border rounded cursor-pointer"
                  style={{ background: flagColor }}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="submit" variant="secondary">{editIndex !== null ? "Save" : "Add"}</Button>
                <Button type="button" variant="outline" onClick={() => { setModalOpen(false); setEditIndex(null); }}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientFlags; 