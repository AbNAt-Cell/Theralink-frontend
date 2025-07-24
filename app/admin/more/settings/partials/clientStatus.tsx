"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Trash2 } from "lucide-react";

const initialStatuses = [
  { name: "Admitted" },
];

const ClientStatus: React.FC = () => {
  const [statuses, setStatuses] = useState(initialStatuses);
  const [modalOpen, setModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const handleAddStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStatus.trim()) {
      setStatuses([...statuses, { name: newStatus }]);
      setNewStatus("");
      setModalOpen(false);
    }
  };

  const handleDelete = (idx: number) => {
    setStatuses(statuses.filter((_, i) => i !== idx));
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Client Status</h2>
        <Button variant="secondary" onClick={() => setModalOpen(true)}>
          <span className="text-lg"></span>
          Add Client Status
        </Button>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Status Name</th>
              <th className="text-left px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {statuses.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-8 text-gray-400">No statuses found.</td>
              </tr>
            ) : (
              statuses.map((status, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-6 py-4">{status.name}</td>
                  <td className="px-6 py-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(idx)}
                    >
                      <Trash2 size={22} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
          <div></div>
          <div className="text-gray-500 text-sm">1-{statuses.length} of {statuses.length} items</div>
        </div>
      </div>
      {/* Modal for adding status */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Client Status</h3>
              <button onClick={() => setModalOpen(false)} className="text-2xl text-gray-500 hover:text-gray-700"><X /></button>
            </div>
            <form onSubmit={handleAddStatus}>
              <label className="block font-medium mb-2">Status Name</label>
              <Input
                className="mb-6"
                placeholder="Status Name"
                value={newStatus}
                onChange={e => setNewStatus(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button type="submit" variant="secondary">Add</Button>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientStatus; 