import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Activity } from 'lucide-react';
import AdminClientProfile from '@/components/AdminClientProfile';

export default function AuthorizationPage() {
  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Authorizations</h2>
        <Button className='bg-blue-900 hover:bg-blue-800'>
          Add Authorization
        </Button>
      </div>

      <div className='flex flex-wrap gap-2'>
        <div className='relative'>
          <Badge
            variant='outline'
            className='pl-8 pr-3 py-2 rounded-full flex items-center gap-1'
          >
            <Calendar className='h-4 w-4 absolute left-2' />
            Date | 11/10/2023 - 11/30/2024
          </Badge>
        </div>
        <Badge
          variant='outline'
          className='px-3 py-2 rounded-full flex items-center gap-1'
        >
          <Activity className='h-4 w-4 mr-1' />
          Remaining Unit
        </Badge>
        <div className='ml-auto'>
          <Button variant='ghost' size='sm'>
            Clear Filter
          </Button>
        </div>
      </div>

      <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]'>
        <img
          src='/placeholder.svg?height=200&width=200&text=No+Authorizations'
          alt='No authorizations'
          className='w-48 h-48 mb-4'
        />
        <p className='text-gray-500'>No Authorizations Available</p>
      </div>
    </div>
  );
}
