import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function FilePage() {
  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>File</h2>
        <Button className='bg-blue-900 hover:bg-blue-800'>Upload File</Button>
      </div>

      <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]'>
        <div className='relative w-48 h-48 mb-4'>
          <Image
            src='/placeholder.svg?height=200&width=200&text=No+Files'
            alt='No files'
            fill
            className='object-contain'
          />
        </div>
        <p className='text-gray-500'>No Files Available</p>
      </div>
    </div>
  );
}
