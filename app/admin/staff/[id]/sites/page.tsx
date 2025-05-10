import {
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminStaffProfile from '@/components/AdminStaffProfile';

export default function SitesPage() {
  return (
    <div className='space-y-6'>
      <AdminStaffProfile />

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
