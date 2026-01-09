import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function SignaturePage() {
  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <div>
        <h2 className='text-xl font-semibold mb-4'>Signature</h2>

        <div className='flex justify-end gap-2 mb-4'>
          <Button variant='outline' className='border-blue-500 text-blue-500'>
            + Add Client Signature
          </Button>
          <Button variant='outline' className='border-blue-500 text-blue-500'>
            + Add Parents Signature
          </Button>
        </div>

        <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]'>
          <div className='relative w-48 h-48 mb-4'>
            <Image
              src='/placeholder.svg?height=200&width=200&text=No+Signature'
              alt='No signature'
              fill
              className='object-contain'
            />
          </div>
          <p className='text-gray-500'>No Signature Available</p>
        </div>
      </div>
    </div>
  );
}
