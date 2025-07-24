"use client";

import { useState, useEffect } from "react";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Search, Pencil, Trash2 } from 'lucide-react';

interface Compliance {
  name: string;
  complianceStartDate: string;
  useClientStartDate: boolean;
  daysAfterClientStartDate: string;
  isRestrictive: string;
  recurring: boolean;
  documentTemplate: string;
  serviceCode: string;
  site: string;
  payer: string;
  contingent: string;
  clientAge: string;
  description: string;
}

const initialCompliance: Compliance[] = [];

// Dropdown options
const serviceCodes = [
  "H0034 Med Management",
  "H2011 - Crisis Response",
  "H2014 Skills Training child & Adol",
  "H2014 Skills Training child & Adol telehealth",
  "Intensive T1017 case Management Telehealth wrapar",
  "Intensive T1017 case Management wrapar",
];
const clientAges = ["All", "Under 18", "Above 18"];
const isRestrictiveOptions = [
  "Not Restrictive",
  "Restrictive (If past Due)",
  "Restrictive (Always)",
];
const documentTemplates = [
  "(TXGeneral) ANSA",
  "(TXGeneral) CANS Child 3-5",
  "(TXGeneral) CANS Child 6-17",
  "B.I.R.P",
  "Biopsychosocial - Adult",
  "Biopsychosocial - Child",
];
const sites = [
  "Auspicious Community Service (17300 El Camino Real Ste 107 B)",
];
const contingentOptions = ["No Data Found"];

export default function ClientCompliancePage() {
  // const [complianceList, setComplianceList] = useState(initialCompliance);
  const [complianceList, setComplianceList] = useState<Compliance[]>(initialCompliance);
  const [showModal, setShowModal] = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const handleAddCompliance = (newCompliance: Compliance) => {
    setComplianceList((prev) => [...prev, newCompliance]);
    setShowModal(false);
  };

  const handleEditCompliance = (updatedCompliance: Compliance) => {
    if (editIdx !== null) {
      setComplianceList((prev) => prev.map((item, idx) => idx === editIdx ? updatedCompliance : item));
      setEditIdx(null);
      setShowModal(false);
    }
  };

  const handleOpenEdit = (idx: number) => {
    setEditIdx(idx);
    setShowModal(true);
  };

  const handleDelete = (idx: number) => {
    setComplianceList((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Client Compliance</h1>
        <div className="flex gap-4">
          <Button variant="outlineSecondary" className="">View Compliance Report</Button>
          <Button className="" variant="secondary" onClick={() => setShowModal(true)}>Add Compliance</Button>
        </div>
      </div>
      <div className="flex items-center mb-4">
        <div className="relative w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="w-5 h-5" />
          </span>
          <Input
            className="pl-10 rounded-md border border-gray-300"
            placeholder="Search"
            type="text"
          />
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full mt-6">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm rounded-t-xl">
              <th className="px-4 py-3 font-semibold text-left">Name</th>
              <th className="px-4 py-3 font-semibold text-left">Compliance Start Date</th>
              <th className="px-4 py-3 font-semibold text-left">Use Client Start Date</th>
              <th className="px-4 py-3 font-semibold text-left">#Days After Client Start Date</th>
              <th className="px-4 py-3 font-semibold text-left">Restrictive</th>
              <th className="px-4 py-3 font-semibold text-left">Recurring?</th>
              <th className="px-4 py-3 font-semibold text-left">Template</th>
              <th className="px-4 py-3 font-semibold text-left">Service Code</th>
              <th className="px-4 py-3 font-semibold text-left">Site</th>
              <th className="px-4 py-3 font-semibold text-left">Payer</th>
              <th className="px-4 py-3 font-semibold text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {complianceList.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-8 bg-blue-50 text-lg font-semibold text-gray-700 rounded-b-xl">
                  No records available
                </td>
              </tr>
            ) : (
              complianceList.map((item, idx) => (
                <tr key={idx} className="border-b">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.complianceStartDate}</td>
                  <td className="px-4 py-2">{item.useClientStartDate ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">{item.daysAfterClientStartDate}</td>
                  <td className="px-4 py-2">{item.isRestrictive}</td>
                  <td className="px-4 py-2">{item.recurring ? "Yes" : "No"}</td>
                  <td className="px-4 py-2">{item.documentTemplate}</td>
                  <td className="px-4 py-2">{item.serviceCode}</td>
                  <td className="px-4 py-2">{item.site}</td>
                  <td className="px-4 py-2">{item.payer}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button type="button" title="Edit" onClick={() => handleOpenEdit(idx)}><Pencil className="w-5 h-5 text-green-600 hover:text-green-800" /></button>
                    <button type="button" title="Delete" onClick={() => handleDelete(idx)}><Trash2 className="w-5 h-5 text-red-600 hover:text-red-800" /></button>
                </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-2 border-t text-sm rounded-b-xl">
          <div className="flex items-center gap-2">
            <button className="px-2 py-1 rounded border bg-gray-100 text-gray-400" disabled>{'<<'}</button>
            <button className="px-2 py-1 rounded border bg-gray-100 text-gray-400" disabled>{'<'}</button>
            <span className="px-3 py-1 rounded border bg-blue-900 text-white">1</span>
            <button className="px-2 py-1 rounded border bg-gray-100 text-gray-400" disabled>{'>'}</button>
            <button className="px-2 py-1 rounded border bg-gray-100 text-gray-400" disabled>{'>>'}</button>
            <select className="ml-4 border rounded px-2 py-1 text-gray-600 bg-gray-50">
              <option>100</option>
              <option>200</option>
              <option>300</option>
            </select>
            <span className="ml-2">items per page</span>
          </div>
          <div className="text-gray-600">{complianceList.length === 0 ? '1-1 of 1 items' : `1-${complianceList.length} of ${complianceList.length} items`}</div>
        </div>
      </div>
      {showModal && (
          <ComplianceModal
          onClose={() => { setShowModal(false); setEditIdx(null); }}
          onSubmit={editIdx === null ? handleAddCompliance : handleEditCompliance}
          initialData={editIdx !== null ? complianceList[editIdx] : undefined}
          isEdit={editIdx !== null}
        />
      )}
    </div>
  );
}

  interface ComplianceModalProps {
    onClose: () => void;
    onSubmit: (data: Compliance) => void;
    initialData?: Compliance;
    isEdit?: boolean;
  }

  function ComplianceModal({ onClose, onSubmit, initialData, isEdit }: ComplianceModalProps) {
  const [form, setForm] = useState<Compliance>(
    initialData || {
      name: '',
      complianceStartDate: '',
      useClientStartDate: false,
      daysAfterClientStartDate: '',
      isRestrictive: '',
      recurring: false,
      documentTemplate: '',
      serviceCode: '',
      site: '',
      payer: '',
      contingent: '',
      clientAge: '',
      description: '',
    }
  );

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
     const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      fieldValue = e.target.checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleSwitch = (checked: boolean) => {
    setForm((prev) => ({ ...prev, useClientStartDate: checked }));
  };

  const handleRecurringSwitch = (checked: boolean) => {
    setForm((prev) => ({ ...prev, recurring: checked }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow w-full max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          {/* <h2 className="text-2xl font-semibold">Add Compliance</h2> */}
          <h2 className="text-2xl font-semibold">{isEdit ? 'Edit Compliance' : 'Add Compliance'}</h2>
          <button onClick={onClose} className="text-4xl font-thin hover:text-gray-600">×</button>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Compliance Effective Date</label>
            <Input name="complianceStartDate" type="date" value={form.complianceStartDate} onChange={handleChange} required />
          </div>
          <div className="flex items-center gap-3 col-span-1">
            <Switch checked={form.useClientStartDate} onCheckedChange={handleSwitch} id="useClientStartDate" />
            <label htmlFor="useClientStartDate" className="text-sm">Use Client Start Date</label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Complete within # of days after start date</label>
            <Input name="daysAfterClientStartDate" type="number" value={form.daysAfterClientStartDate} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Document Template</label>
            <Select value={form.documentTemplate} onValueChange={v => setForm(f => ({ ...f, documentTemplate: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {documentTemplates.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contingent Upon Compliance</label>
            <Select value={form.contingent} onValueChange={v => setForm(f => ({ ...f, contingent: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select contingent" />
              </SelectTrigger>
              <SelectContent>
                {contingentOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Service code</label>
            <Select value={form.serviceCode} onValueChange={v => setForm(f => ({ ...f, serviceCode: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select service code" />
              </SelectTrigger>
              <SelectContent>
                {serviceCodes.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Client Age</label>
            <Select value={form.clientAge} onValueChange={v => setForm(f => ({ ...f, clientAge: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select client age" />
              </SelectTrigger>
              <SelectContent>
                {clientAges.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Is Restrictive</label>
            <Select value={form.isRestrictive} onValueChange={v => setForm(f => ({ ...f, isRestrictive: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                {isRestrictiveOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Site</label>
            <Select value={form.site} onValueChange={v => setForm(f => ({ ...f, site: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select site" />
              </SelectTrigger>
              <SelectContent>
                {sites.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Payer</label>
            <Input name="payer" value={form.payer} onChange={handleChange} />
          </div>
          <div className="flex items-center gap-3 col-span-1">
            <Switch checked={form.recurring} onCheckedChange={handleRecurringSwitch} id="recurring" />
            <label htmlFor="recurring" className="text-sm">Recurring?</label>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea name="description" value={form.description} onChange={handleChange} />
          </div>
          <div className="col-span-2 flex justify-end gap-2 mt-4">
            <Button type="button" variant="outlineSecondary" onClick={onClose} >Cancel</Button>
            <Button type="submit" variant='secondary'>{isEdit ? 'Update' : 'Submit'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
