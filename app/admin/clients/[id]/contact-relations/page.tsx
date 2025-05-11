import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';

export default function ContactRelationsPage() {
  return (
    <div className='space-y-10'>
      <AdminClientProfile />
      {/* Parent/Guardian Section */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Parent/Guardian</h2>
          <Button className='bg-blue-900 hover:bg-blue-800'>
            Add Guardian Info
          </Button>
        </div>

        <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]'>
          <img
            src='/placeholder.svg?height=150&width=150&text=No+Guardian'
            alt='No parent/guardian'
            className='w-36 h-36 mb-4'
          />
          <p className='text-gray-500'>No Parent/Guardian Available</p>
        </div>
      </div>

      {/* Collateral Contact Section */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Collateral Contact</h2>
          <Button className='bg-blue-900 hover:bg-blue-800'>
            Add Collateral Contact
          </Button>
        </div>

        <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]'>
          <img
            src='/placeholder.svg?height=150&width=150&text=No+Contact'
            alt='No collateral contact'
            className='w-36 h-36 mb-4'
          />
          <p className='text-gray-500'>No Collateral Contact Available</p>
        </div>
      </div>
    </div>
  );
}
