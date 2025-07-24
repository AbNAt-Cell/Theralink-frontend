"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ChevronDown } from "lucide-react";

const roleOptions = [
  "Super Admin",
  "Administrator",
  "User/Clinician",
  "QA Manager",
  "Custom Role",
];

const modules = [
  {
    label: "STAFF",
    permissions: [
      "Add Staff",
      "Deactivate/Reactivate staff",
      "Edit Demographic",
      "Edit Staff Profile",
      "View Staff Profile",
      "Manage Certifications",
      "Mange Staff Caseload",
    ],
  },
  {
    label: "CLIENT",
    permissions: [
      "Add Clients",
      "Deactivate/Reactivate Client",
      "Edit client profile",
      "Manage Client Profile",
      "Manage Client Files",
      "Manage Contact Note",
      "Mange Treatment Plan",
    ],
  },
  {
    label: "CALENDAR",
    permissions: [
      "Can see all Event other than caseload",
      "Create Events for other staff",
      "Create Events for other staff",
      "Manage Calendar Settings",
    ],
  },
  {
    label: "DOCUMENTS",
    permissions: [
      "Can Edit My Own Documents",
      "Can Edit other Staff Documents",
      "Can Lock/Unlock My own Documents",
      "Can Lock/Unlock other staff Documents",
      "View History",
    ],
  },
  {
    label: "MISCELLANEOUS",
    permissions: [
      "Manage Authorizations",
      "Manage Client Compliance",
      "Show Clinic Files",
    ],
  },
];

const rolesList = [
  "Super Admin",
  "Administrator",
  "User/Clinician",
  "QA Manager",
  "Custom Role",
];

export default function AccessLevelSettingsPage() {
  const [role, setRole] = useState(roleOptions[2]);
  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [openPanels, setOpenPanels] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(modules.map((m) => [m.label, true]))
  );

  const handleCheck = (perm: string) => {
    setChecked((prev) => ({ ...prev, [perm]: !prev[perm] }));
  };

  const handlePanelToggle = (label: string) => {
    setOpenPanels((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] flex flex-col md:flex-row">
      <div className="flex-1 max-w-screen">
        <h1 className="text-xl md:text-2xl font-bold mb-6">Access Level Settings</h1>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Role</label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-8">
          <div className="text-lg font-semibold mb-4">Modules</div>
          <div className="flex flex-col gap-6">
            {modules.map((mod) => (
              <div key={mod.label} className="bg-[#F6F6F6] border border-gray-200 rounded-2xl mb-6">
                {/* Panel Header */}
                <div className="flex justify-between items-center bg-[#F5F5F5] rounded-t-2xl px-6 py-4">
                  <span className="font-semibold text-lg text-gray-900">{mod.label}</span>
                  <button
                    type="button"
                    className="text-gray-500 text-xl focus:outline-none"
                    onClick={() => handlePanelToggle(mod.label)}
                  >
                    {/* <span className={`transform transition-transform ${openPanels[mod.label] ? 'rotate-180' : ''}`}>⌄</span> */}
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${openPanels[mod.label] ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                {/* Panel Body */}
                {openPanels[mod.label] && (
                  <div className="bg-white rounded-b-2xl px-6 py-4">
                    {mod.permissions.map((perm) => (
                      <div key={perm} className="flex items-center gap-2 py-2">
                        <input
                          type="checkbox"
                          checked={!!checked[perm]}
                          onChange={() => handleCheck(perm)}
                          className="accent-blue-900 w-4 h-4"
                        />
                        <span className="text-gray-800 font-medium">{perm}</span>
                        <span className="ml-1 flex items-center justify-center w-3 h-3 rounded-full bg-[#0A2240] text-white text-[10px] font-bold cursor-pointer">
                          i
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <Button variant="secondary">Update</Button>
      </div>
    </div>
  );
}
