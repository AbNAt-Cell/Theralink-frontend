import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import AdminClientProfile from '@/components/AdminClientProfile';

export default function DocumentsPage() {
  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <h2 className='text-xl font-semibold'>Documents</h2>

      <div className='flex flex-wrap gap-2'>
        <div className='relative'>
          <Badge
            variant='outline'
            className='pl-8 pr-3 py-2 rounded-full flex items-center gap-1'
          >
            <Calendar className='h-4 w-4 absolute left-2' />
            Date (DOCS) | 11/10/2023 - 11/30/2024
          </Badge>
        </div>
        <Badge
          variant='outline'
          className='px-3 py-2 rounded-full flex items-center gap-1'
        >
          <span className='h-2 w-2 rounded-full bg-gray-400'></span>
          Staff
        </Badge>
        <Badge
          variant='outline'
          className='px-3 py-2 rounded-full flex items-center gap-1'
        >
          <span className='h-2 w-2 rounded-full bg-gray-400'></span>
          Template
        </Badge>
        <div className='ml-auto'>
          <Button variant='ghost' size='sm'>
            Clear Filter
          </Button>
        </div>
      </div>

      <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]'>
        <img
          src='/placeholder.svg?height=200&width=200&text=No+Documents'
          alt='No documents'
          className='w-48 h-48 mb-4'
        />
        <p className='text-gray-500'>No Documents Available</p>
      </div>
    </div>
  );
}
