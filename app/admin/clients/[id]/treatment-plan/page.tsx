import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

export default function TreatmentPlanPage() {
  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Client Services</h2>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Switch id='show-closed' />
            <label htmlFor='show-closed' className='text-sm'>
              Show Closed/Completed Plan
            </label>
          </div>
          <Button variant='outline' className='border-blue-500 text-blue-500'>
            Generate Treatment Plan
          </Button>
          <Button className='bg-blue-900 hover:bg-blue-800'>Add Plan</Button>
        </div>
      </div>

      <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]'>
        <img
          src='/placeholder.svg?height=200&width=200&text=No+Treatment'
          alt='No treatment'
          className='w-48 h-48 mb-4'
        />
        <p className='text-gray-500'>No Treatment Available</p>
      </div>
    </div>
  );
}
