import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AdminClientProfile from '@/components/AdminClientProfile';

export default function MedicationManagementPage() {
  return (
    <div className='space-y-8'>
      <AdminClientProfile />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Medication Administrations</h2>
        <Button className='bg-blue-900 hover:bg-blue-800'>
          Add Medication Administration
        </Button>
      </div>

      <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]'>
        <img
          src='/placeholder.svg?height=150&width=150&text=No+Medications'
          alt='No medications'
          className='w-36 h-36 mb-4'
        />
        <p className='text-gray-500'>No Medication Administrations</p>
      </div>

      <Collapsible className='border rounded-md bg-gray-100'>
        <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
          Medication Notes
          <ChevronUp className='h-4 w-4' />
        </CollapsibleTrigger>
        <CollapsibleContent className='p-4 bg-white border-t'>
          <div className='flex justify-end'>
            <Button
              variant='outline'
              size='sm'
              className='text-blue-500 border-blue-500'
            >
              Edit
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Medication Administrations</h2>
        <Button className='bg-blue-900 hover:bg-blue-800'>
          Add Current Medication
        </Button>
      </div>

      <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]'>
        <img
          src='/placeholder.svg?height=150&width=150&text=No+Medications'
          alt='No medications'
          className='w-36 h-36 mb-4'
        />
        <p className='text-gray-500'>No Current Medications</p>
      </div>

      <h2 className='text-xl font-semibold'>Medication Administrations</h2>

      <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]'>
        <img
          src='/placeholder.svg?height=150&width=150&text=No+Medications'
          alt='No medications'
          className='w-36 h-36 mb-4'
        />
        <p className='text-gray-500'>No Other/Historic Medications</p>
      </div>
    </div>
  );
}
