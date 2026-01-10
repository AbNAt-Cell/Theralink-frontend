"use client";

import AdminStaffProfile from "@/components/AdminStaffProfile";
import Image from "next/image";
import { useStaffData } from "@/hooks/useStaffData";
import { Loader2 } from "lucide-react";

export default function SignaturePage() {
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

      <div className='border rounded-md p-4 bg-white'>
        <h2 className='text-xl font-semibold mb-4'>Signature</h2>

        <div className='border rounded-md p-8 flex items-center justify-center'>
          <div className='w-64 h-32 flex items-center justify-center'>
            <Image
              src='/placeholder.svg?height=100&width=200&text=Signature'
              alt='Signature'
              className='max-w-full max-h-full'
              width={200}
              height={100}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
