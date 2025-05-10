import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';

export default function VitalsPage() {
  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Vitals</h2>
        <Button className='bg-blue-900 hover:bg-blue-800'>Add Vitals</Button>
      </div>

      <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]'>
        <img
          src='/placeholder.svg?height=200&width=200&text=No+Vitals'
          alt='No vitals'
          className='w-48 h-48 mb-4'
        />
        <p className='text-gray-500'>No Documents Available</p>
      </div>
    </div>
  );
}
