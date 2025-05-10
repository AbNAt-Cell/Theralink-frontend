import { Button } from '@/components/ui/button';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import AdminClientProfile from '@/components/AdminClientProfile';

export default function ServicesPage() {
  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Client Services</h2>
        <div className='flex items-center gap-2'>
          <span className='text-sm'>Select Service Set to Assign Service</span>
          <Select>
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='Select...' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='service1'>Service Set 1</SelectItem>
              <SelectItem value='service2'>Service Set 2</SelectItem>
            </SelectContent>
          </Select>
          <Button className='bg-blue-900 hover:bg-blue-800'>Assign Set</Button>
        </div>
      </div>

      <div className='relative w-full md:w-64 mb-4'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
        <input
          type='search'
          placeholder='Find Clients...'
          className='pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors'
        />
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='border rounded-md p-4 bg-white'>
          <h3 className='font-medium mb-4'>Available</h3>
          <div className='p-2 border rounded-md text-sm'>
            Auspicious Community Services (305 FM 517 Road E.)
          </div>
        </div>

        <div className='border rounded-md p-4 bg-white'>
          <h3 className='font-medium mb-4'>Assigned (0)</h3>
          <div className='min-h-[100px]'></div>
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
