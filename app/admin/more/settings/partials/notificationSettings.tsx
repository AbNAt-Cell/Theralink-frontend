"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type TabKey = "authorization" | "certification" | "goals" | "insurance";

const tabList = [
  { label: "Authorization Alert", value: "authorization" },
  { label: "Certification Alert", value: "certification" },
  { label: "Goals Alert", value: "goals" },
  { label: "Insurance Alert", value: "insurance" },
] as const;

const NotificationSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>(tabList[0].value);
  const [days, setDays] = useState<Record<TabKey, string>>({
    authorization: "3",
    certification: "3",
    goals: "3",
    insurance: "3",
  });
  const [emailSwitch, setEmailSwitch] = useState<Record<TabKey, boolean>>({
    authorization: false,
    certification: false,
    goals: false,
    insurance: false,
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    // handle update logic here
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Clinic Notification</h2>
      <div className="bg-white rounded-xl border p-6">
        <div className="flex gap-2 mb-6">
          {tabList.map(tab => (
            <button
              key={tab.value}
              className={`px-6 py-2 rounded-t-lg border-b-2 font-semibold text-lg transition-colors ${activeTab === tab.value ? "border-blue-900 text-blue-900 bg-white" : "border-transparent text-gray-600 bg-gray-100"}`}
              style={{ outline: "none" }}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <form onSubmit={handleUpdate} className="flex flex-col items-start gap-6">
          <div className="flex items-center gap-8">
            <Input
              type="number"
              min={1}
              className="w-12 h-9 text-2xl text-center border-gray-300"
              value={days[activeTab]}
              onChange={e => setDays({ ...days, [activeTab]: e.target.value })}
            />
            <span className="text-lg">Select how often you'd like to receive alerts, measured in days.</span>
          </div>
          <div className="flex items-center gap-4">
            <Switch
              checked={emailSwitch[activeTab]}
              onCheckedChange={v => setEmailSwitch({ ...emailSwitch, [activeTab]: v })}
            />
            <span className="text-lg">Send certification alerts to my email</span>
          </div>
          <Button type="submit" variant="outline" className="mt-4 flex items-center gap-2 text-blue-900 font-semibold">  
            Update
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NotificationSettings; 