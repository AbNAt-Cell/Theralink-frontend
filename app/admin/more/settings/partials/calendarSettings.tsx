"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

const defaultCategories = [
  { name: "Assessor (Default)", created: "11/5/2024 10:00 PM", isDefault: true },
];

const CalendarSettings: React.FC = () => {
  const [categories, setCategories] = useState(defaultCategories);
  const [showDefault, setShowDefault] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim()) {
      setCategories([
        ...categories,
        {
          name: newCategory,
          created: new Date().toLocaleString("en-US", { month: "numeric", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true }),
          isDefault: false,
        },
      ]);
      setNewCategory("");
      setModalOpen(false);
    }
  };

  const filteredCategories = showDefault ? categories : categories.filter(cat => !cat.isDefault);

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Calendar Settings</h2>
        <Button variant="secondary" onClick={() => setModalOpen(true)}>
          <span className="text-lg"></span>
          Add New Category
        </Button>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <Switch checked={!showDefault} onCheckedChange={v => setShowDefault(!v)} />
        <span className="text-lg">Do not show Default Calendar Categories</span>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-medium">Category Name</th>
              <th className="text-left px-6 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={2} className="text-center py-8 text-gray-400">No categories found.</td>
              </tr>
            ) : (
              filteredCategories.map((cat, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-6 py-4">{cat.name}</td>
                  <td className="px-6 py-4">{cat.created}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-6 py-3 bg-white border-t">
          <div></div>
          <div className="text-gray-500 text-sm">1-{filteredCategories.length} of {filteredCategories.length} items</div>
        </div>
      </div>
      {/* Modal for adding category */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Calendar Category</h3>
              <button onClick={() => setModalOpen(false)} className="text-2xl text-gray-500 hover:text-gray-700"><X /></button>
            </div>
            <form onSubmit={handleAddCategory}>
              <label className="block font-medium mb-2">Category Name</label>
              <Input
                className="mb-6"
                placeholder="Category Name"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button type="submit" className="bg-blue-900 text-white font-semibold">Add</Button>
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarSettings; 