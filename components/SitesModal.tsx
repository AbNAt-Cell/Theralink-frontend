"use client";

import type React from "react";

import { useState } from "react";
import { X } from "lucide-react";

interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SiteForm {
  name: string;
  address: string;
  state: string;
  city: string;
  zip: string;
  fax: string;
  email: string;
  website: string;
  npi: string;
  firstDayOfWeek: string;
  phone: string;
  comment: string;
}

export default function SiteModal({ isOpen, onClose }: SiteModalProps) {
  const [siteForm, setSiteForm] = useState<SiteForm>({
    name: "",
    address: "",
    state: "",
    city: "",
    zip: "",
    fax: "",
    email: "",
    website: "",
    npi: "",
    firstDayOfWeek: "Monday",
    phone: "",
    comment: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Site submitted:", siteForm);
    // Here you would typically send the data to your backend
    onClose();
    setSiteForm({
      name: "",
      address: "",
      state: "",
      city: "",
      zip: "",
      fax: "",
      email: "",
      website: "",
      npi: "",
      firstDayOfWeek: "Monday",
      phone: "",
      comment: "",
    });
  };

  const handleInputChange = (field: keyof SiteForm, value: string) => {
    setSiteForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Add New Site</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input type="text" required value={siteForm.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input type="tel" required value={siteForm.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input type="text" required value={siteForm.address} onChange={(e) => handleInputChange("address", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input type="text" required value={siteForm.city} onChange={(e) => handleInputChange("city", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input type="text" required value={siteForm.state} onChange={(e) => handleInputChange("state", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Zip</label>
              <input type="text" required value={siteForm.zip} onChange={(e) => handleInputChange("zip", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fax</label>
              <input type="tel" value={siteForm.fax} onChange={(e) => handleInputChange("fax", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" value={siteForm.email} onChange={(e) => handleInputChange("email", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input type="url" value={siteForm.website} onChange={(e) => handleInputChange("website", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">NPI #</label>
              <input type="text" value={siteForm.npi} onChange={(e) => handleInputChange("npi", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Day of Week</label>
            <select value={siteForm.firstDayOfWeek} onChange={(e) => handleInputChange("firstDayOfWeek", e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="Monday">Monday</option>
              <option value="Sunday">Sunday</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment/Note</label>
            <textarea value={siteForm.comment} onChange={(e) => handleInputChange("comment", e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <div className="flex space-x-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
