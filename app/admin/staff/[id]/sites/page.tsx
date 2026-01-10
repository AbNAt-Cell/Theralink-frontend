"use client";

import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminStaffProfile from '@/components/AdminStaffProfile';
import { useStaffData } from "@/hooks/useStaffData";

export default function SitesPage() {
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
    <div className='space-y-6'>
      <AdminStaffProfile
        name={`${staff.firstName} ${staff.lastName}`}
        email={staff.email}
        phone={staff.phone}
        site={staff.site}
      />

      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Sites</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='border rounded-md p-4 bg-white'>
            <h3 className='font-medium mb-2'>Available</h3>
            <div className='min-h-[200px]'></div>
          </div>

          <div className='border rounded-md p-4 bg-white'>
            <h3 className='font-medium mb-2'>Assigned (0)</h3>
            <div className='min-h-[100px]'>
              <p className='text-sm'>
                Auspicious Community Services (305 FM 517 Road E.)
              </p>
            </div>

            <div className='flex justify-center gap-2 mt-4'>
              <Button variant='outline' size='icon'>
                <ChevronRight className='h-4 w-4' />
              </Button>
              <Button variant='outline' size='icon'>
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button variant='outline' size='icon'>
                <ChevronLast className='h-4 w-4' />
              </Button>
              <Button variant='outline' size='icon'>
                <ChevronFirst className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
