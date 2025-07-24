"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { X } from "lucide-react";

export interface ClinicFormData {
  address: string;
  state1: string;
  state2: string;
  zip: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  npi: string;
  taxonomy: string;
  taxId: string;
  firstDayOfWeek: string;
  roundUp: boolean;
  logo?: File | null;
}

interface ClinicModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ClinicFormData) => void;
  initialData: ClinicFormData;
}

const ClinicModal: React.FC<ClinicModalProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState<ClinicFormData>(initialData);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === "file" && files) {
      setLogoFile(files[0]);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, logo: logoFile });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-8 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Edit Clinic</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-gray-700 absolute right-8 top-8"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block mb-1 font-medium">Address</label>
              <Input name="address" value={form.address} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">State (NY, NC)</label>
              <Input name="state1" value={form.state1} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">State (NY, NC)</label>
              <Input name="state2" value={form.state2} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Zip</label>
              <Input name="zip" value={form.zip} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <Input name="phone" value={form.phone} onChange={handleChange} />
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
              <label className="block mb-1 font-medium">Taxonomy</label>
              <Input name="taxonomy" value={form.taxonomy} onChange={handleChange} />
            </div>
            <div>
              <label className="block mb-1 font-medium">Tax ID</label>
              <Input name="taxId" value={form.taxId} onChange={handleChange} />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Switch checked={form.roundUp} onCheckedChange={v => setForm(prev => ({ ...prev, roundUp: v }))} name="roundUp" />
            <span>Round up service unit</span>
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

export default ClinicModal; 