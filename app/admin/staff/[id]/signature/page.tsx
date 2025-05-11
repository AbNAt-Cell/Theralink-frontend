import AdminStaffProfile from '@/components/AdminStaffProfile';
import Image from 'next/image';

export default function SignaturePage() {
  return (
    <div className='space-y-6'>
      <AdminStaffProfile />

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
