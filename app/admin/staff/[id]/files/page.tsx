"use client";

import AdminStaffProfile from "@/components/AdminStaffProfile";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useStaffData } from "@/hooks/useStaffData";
import { Loader2 } from "lucide-react";

export default function FilesPage() {
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Files</h2>
          <Button className="bg-blue-900 hover:bg-blue-800">Add Files</Button>
        </div>

        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="relative w-48 h-48 mb-4">
            <Image src="/placeholder.svg?height=200&width=200&text=No+Files" alt="No files" fill className="object-contain" />
          </div>
          <p className="text-gray-500">No files found</p>
        </div>
      </div>
    </div>
  )
}
