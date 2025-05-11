import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from 'lucide-react';

export default function AssignedStaffPage() {
  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <h2 className='text-xl font-semibold'>Clients Staff</h2>

      <div className='relative w-full md:w-64 mb-4'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
        <input
          type='search'
          placeholder='Search Available staff'
          className='pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='border rounded-md p-4 bg-white'>
          <h3 className='font-medium mb-4'>Available Staff</h3>
          <div className='p-2 border rounded-md text-sm'>Mfoniso Iboikette</div>
        </div>

        <div className='border rounded-md p-4 bg-white'>
          <h3 className='font-medium mb-4'>Assigned staff</h3>
          <div className='p-2 border rounded-md text-sm'>Lovette Olson</div>
        </div>
      </div>

      <div className='flex justify-center gap-2'>
        <Button variant='outline' size='icon'>
          <ChevronRight className='h-4 w-4' />
        </Button>
        <Button variant='outline' size='icon'>
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <Button variant='outline' size='icon'>
          <ChevronsRight className='h-4 w-4' />
        </Button>
        <Button variant='outline' size='icon'>
          <ChevronsLeft className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
}
