"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const AppointmentReminders: React.FC = () => {
  const [textReminders, setTextReminders] = useState(false);
  const [customNumber, setCustomNumber] = useState("no");
  const [reminderNumber, setReminderNumber] = useState("");
  const [location, setLocation] = useState("");
  const [clientInfo, setClientInfo] = useState("initials");
  const [staffAlert, setStaffAlert] = useState("enabled");

  return (
    <div className="max-w-4xl w-full mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Appointment Reminders</h2>
      <div className="bg-blue-100 text-blue-900 rounded-lg px-6 py-4 mb-8 text-center text-base">
        Please note: This feature is currently available only for beta requesters. If you'd like to be added to the list of clinics testing this feature, please reach out to us at <a href="mailto:po@notenetic.com" className="underline">po@notenetic.com</a>.
      </div>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left column */}
        <div className="flex flex-col gap-8">
          <div>
            <label className="block text-xl font-semibold mb-4">Activate reminder types</label>
            <div className="flex items-center gap-4">
              <Switch checked={textReminders} onCheckedChange={setTextReminders} />
              <span className="text-lg">Text Reminders</span>
            </div>
          </div>
          <div>
            <label className="block text-xl font-semibold mb-4">Custom Reminder Number?</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-lg">
                <input type="radio" name="customNumber" value="no" checked={customNumber === "no"} onChange={() => setCustomNumber("no")}/>
                No
              </label>
              <label className="flex items-center gap-2 text-lg">
                <input type="radio" name="customNumber" value="yes" checked={customNumber === "yes"} onChange={() => setCustomNumber("yes")}/>
                Yes
              </label>
              <Input
                className="mt-2 max-w-md"
                placeholder="+122344566777"
                value={reminderNumber}
                onChange={e => setReminderNumber(e.target.value)}
                // disabled={customNumber !== "yes"}
              />
            </div>
          </div>
          <div>
            <label className="block text-xl font-semibold mb-4">Location Information</label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="location1">Location 1</SelectItem>
                <SelectItem value="location2">Location 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-blue-900 text-white font-semibold mt-4 max-w-md">Save Reminder Settings</Button>
        </div>
        {/* Right column */}
        <div className="flex flex-col gap-10">
          <div>
            <label className="block text-xl font-semibold mb-4">Client Info in Staff Text Reminders</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-lg">
                <input type="radio" name="clientInfo" value="initials" checked={clientInfo === "initials"} onChange={() => setClientInfo("initials")}/>
                Client Initials
              </label>
              <label className="flex items-center gap-2 text-lg">
                <input type="radio" name="clientInfo" value="id" checked={clientInfo === "id"} onChange={() => setClientInfo("id")}/>
                Client ID
              </label>
              <label className="flex items-center gap-2 text-lg">
                <input type="radio" name="clientInfo" value="none" checked={clientInfo === "none"} onChange={() => setClientInfo("none")}/>
                No Client Data
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xl font-semibold mb-4">Staff Text Alerts for Non-Standard Response</label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 text-lg">
                <input type="radio" name="staffAlert" value="enabled" checked={staffAlert === "enabled"} onChange={() => setStaffAlert("enabled")}/>
                Enabled
              </label>
              <label className="flex items-center gap-2 text-lg">
                <input type="radio" name="staffAlert" value="disabled" checked={staffAlert === "disabled"} onChange={() => setStaffAlert("disabled")}/>
                Disabled Data
              </label>
              <label className="flex items-center gap-2 text-lg">
                <input type="radio" name="staffAlert" value="none" checked={staffAlert === "none"} onChange={() => setStaffAlert("none")}/>
                No Client Data
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AppointmentReminders;
