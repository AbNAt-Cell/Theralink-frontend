import {
  Search,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminStaffProfile from '@/components/AdminStaffProfile';

export default function StaffTeamPage() {
  return (
    <div className='space-y-6'>
      <AdminStaffProfile />

      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Staff Team</h2>

        <div className='relative w-full md:w-64 mb-4'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
          <input
            type='search'
            placeholder='Search Available Templates'
            className='pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='border rounded-md p-4 bg-white'>
            <div className='p-2 border rounded-md text-sm'>
              Mfoniso Iboikette
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

          <div className='border rounded-md p-4 bg-white'>
            <h3 className='font-medium mb-2'>Assigned (0)</h3>
            <div className='min-h-[200px]'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
