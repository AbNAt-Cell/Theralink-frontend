"use client";

import AdminStaffProfile from "@/components/AdminStaffProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Loader2 } from "lucide-react";
import { useStaffData } from "@/hooks/useStaffData";

export default function PositionsPage() {
  const { staff, loading } = useStaffData();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-3 text-lg font-medium text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!staff) {
    return <div>Staff member not found.</div>;
  }

  return (
    <div className="space-y-6">
      <AdminStaffProfile
        name={`${staff.firstName} ${staff.lastName}`}
        email={staff.email}
        phone={staff.phone}
        site={staff.site}
      />

      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Add New Position</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="position-name" className="text-sm font-medium">
              Position Name
            </label>
            <Input id="position-name" className="max-w-md" />
          </div>

          <div className="space-y-2">
            <label htmlFor="effective-date" className="text-sm font-medium">
              Effective Date
            </label>
            <div className="relative max-w-md">
              <Input id="effective-date" placeholder="Position End Date" />
              <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="end-date" className="text-sm font-medium">
              End Date
            </label>
            <div className="relative max-w-md">
              <Input id="end-date" placeholder="Position End Date" />
              <Button variant="ghost" size="icon" className="absolute right-0 top-0">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button className="bg-blue-900 hover:bg-blue-800 mt-4">Add Position</Button>
        </div>
      </div>
    </div>
  )
}
