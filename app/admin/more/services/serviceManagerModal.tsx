"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export interface ServiceFormData {
  service: string;
  serviceCode: string;
  modifier1: string;
  modifier2: string;
  modifier3: string;
  modifier4: string;
  serviceRate: string;
  rateEffectiveDate: string;
  rateEndDate: string;
  billingUnit: string;
  billable: boolean;
  addOn: boolean;
  allowOverlapping: boolean;
  authRequired: boolean;
  effectiveDate: string;
  endDate: string;
  revenueCode: string;
  minTime: string;
  maxTime: string;
  allowedPlaces: string;
}

const billingUnitOptions = [
  "15 Minutes",
  "1 Event",
  "1 Diem",
  "1 Hour",
  "45 Minutes",
  "75 Minutes",
  "20 Minutes",
];

interface ServiceManagerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ServiceFormData) => void;
  initialData?: Partial<ServiceFormData>;
}

const ServiceManagerModal: React.FC<ServiceManagerModalProps> = ({ open, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState<ServiceFormData>({
    service: initialData?.service || "",
    serviceCode: initialData?.serviceCode || "",
    modifier1: initialData?.modifier1 || "",
    modifier2: initialData?.modifier2 || "",
    modifier3: initialData?.modifier3 || "",
    modifier4: initialData?.modifier4 || "",
    serviceRate: initialData?.serviceRate || "",
    rateEffectiveDate: initialData?.rateEffectiveDate || "",
    rateEndDate: initialData?.rateEndDate || "",
    billingUnit: initialData?.billingUnit || "",
    billable: initialData?.billable || false,
    addOn: initialData?.addOn || false,
    allowOverlapping: initialData?.allowOverlapping || false,
    authRequired: initialData?.authRequired || false,
    effectiveDate: initialData?.effectiveDate || "",
    endDate: initialData?.endDate || "",
    revenueCode: initialData?.revenueCode || "",
    minTime: initialData?.minTime || "",
    maxTime: initialData?.maxTime || "",
    allowedPlaces: initialData?.allowedPlaces || "",
  });

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSwitch = (name: keyof ServiceFormData, value: boolean) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-2">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-5xl p-6 md:p-10 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-semibold">Service Manager</h2>
          <button onClick={onClose} className="text-4xl font-thin text-black hover:text-gray-600 absolute right-6 top-6 md:static">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Service Manager */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service</label>
                <Input name="service" value={form.service} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Service Code</label>
                <Input name="serviceCode" value={form.serviceCode} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Modifiers */}
          <div>
            <h3 className="font-semibold mb-4">Modifiers</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block mb-1 text-left">I</label>
                <Input name="modifier1" value={form.modifier1} onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 text-left">II</label>
                <Input name="modifier2" value={form.modifier2} onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1 text-left">III</label>
                <Input name="modifier3" value={form.modifier3} onChange={handleChange} />
              </div>
              <div>
                <label className="block mb-1  text-left">IV</label>
                <Input name="modifier4" value={form.modifier4} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Rate */}
          <div>
            <h3 className="font-semibold mb-4">Rate</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Rate</label>
                <Input name="serviceRate" value={form.serviceRate} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rate Effective Date</label>
                <Input name="rateEffectiveDate" type="date" value={form.rateEffectiveDate} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rate End Date</label>
                <Input name="rateEndDate" type="date" value={form.rateEndDate} onChange={handleChange} />
              </div>
            </div>
            <div className="mt-4 max-w-xs">
              <label className="block text-sm font-medium mb-1">Billing Unit</label>
              <Select value={form.billingUnit} onValueChange={v => setForm(f => ({ ...f, billingUnit: v }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select billing unit" />
                </SelectTrigger>
                <SelectContent>
                  {billingUnitOptions.map(opt => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Settings */}
          <div>
            <h3 className="font-semibold mb-4">Settings</h3>
            <div className="flex flex-wrap gap-8 mb-8">
              <div className="flex items-center gap-2">
                <Switch checked={form.billable} onCheckedChange={v => handleSwitch("billable", v)} />
                <span>Billable</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.addOn} onCheckedChange={v => handleSwitch("addOn", v)} />
                <span>Add On</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.allowOverlapping} onCheckedChange={v => handleSwitch("allowOverlapping", v)} />
                <span>Allow Overlapping</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.authRequired} onCheckedChange={v => handleSwitch("authRequired", v)} />
                <span>Auth Required</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Effective Date</label>
                <Input name="effectiveDate" type="date" value={form.effectiveDate} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <Input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Revenue Code</label>
                <Input name="revenueCode" value={form.revenueCode} onChange={handleChange} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div>
                <label className="block text-sm font-medium mb-1">Min Time (in minutes)</label>
                <Input name="minTime" value={form.minTime} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Time (in minutes)</label>
                <Input name="maxTime" value={form.maxTime} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Allowed Places of services</label>
                <Input name="allowedPlaces" value={form.allowedPlaces} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="secondary">Add Service</Button>
            <Button type="button" variant="outlineSecondary" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceManagerModal;
