"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface SiteFormData {
  id?: string;
  site: string;
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
  clients?: number;
}

interface SiteModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SiteFormData) => void;
  initialData?: SiteFormData;
  isEdit?: boolean;
}

const defaultData: SiteFormData = {
  site: "",
  address: "",
  state: "",
  city: "",
  zip: "",
  fax: "",
  email: "",
  website: "",
  npi: "",
  firstDayOfWeek: "",
  phone: "",
  comment: "",
};

const SiteModal: React.FC<SiteModalProps> = ({ open, onClose, onSubmit, initialData, isEdit }) => {
  const [form, setForm] = useState<SiteFormData>(initialData || defaultData);

  React.useEffect(() => {
    if (open) setForm(initialData || defaultData);
  }, [open, initialData]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl p-8 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">{isEdit ? "Edit Site" : "Add New Siite"}</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700 absolute right-8 top-8"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-1 font-medium">Site Name</label>
              <Input name="site" value={form.site} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Address</label>
              <Input name="address" value={form.address} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">State</label>
              <Input name="state" value={form.state} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">City</label>
              <Input name="city" value={form.city} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Zip</label>
              <Input name="zip" value={form.zip} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Fax</label>
              <Input name="fax" value={form.fax} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <Input name="email" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Website URL</label>
              <Input name="website" value={form.website} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">NPI #</label>
              <Input name="npi" value={form.npi} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">First Day of week</label>
              <Input name="firstDayOfWeek" value={form.firstDayOfWeek} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <Input name="phone" value={form.phone} onChange={handleChange} />
            </div>
          </div>
          <div>
            <label className="block mb-1 font-medium">Comment</label>
            <Input name="comment" value={form.comment} onChange={handleChange} />
          </div>
          <div className="flex gap-2 justify-end mt-8">
            <Button type="submit" variant="secondary">Submit</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteModal; 