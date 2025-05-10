import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';

export default function BackgroundPage() {
  return (
    <div className='space-y-10'>
      <AdminClientProfile />
      {/* Education Section */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Education</h2>
          <Button className='bg-blue-900 hover:bg-blue-800'>
            Add Education
          </Button>
        </div>

        <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]'>
          <img
            src='/placeholder.svg?height=150&width=150&text=No+Education'
            alt='No education'
            className='w-36 h-36 mb-4'
          />
          <p className='text-gray-500'>No Education Available</p>
        </div>
      </div>

      {/* Employment Section */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Employment</h2>
          <Button className='bg-blue-900 hover:bg-blue-800'>
            Add Employment
          </Button>
        </div>

        <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]'>
          <img
            src='/placeholder.svg?height=150&width=150&text=No+Employment'
            alt='No employment'
            className='w-36 h-36 mb-4'
          />
          <p className='text-gray-500'>No Employment Available</p>
        </div>
      </div>

      {/* Medical Issues Section */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Medical Issues</h2>
          <Button className='bg-blue-900 hover:bg-blue-800'>
            Add Medical Issues
          </Button>
        </div>

        <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]'>
          <img
            src='/placeholder.svg?height=150&width=150&text=No+Medical+Issues'
            alt='No medical issues'
            className='w-36 h-36 mb-4'
          />
          <p className='text-gray-500'>No Medical Issues Available</p>
        </div>
      </div>

      {/* Family Medical History Section */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Family Medical History</h2>
          <Button className='bg-blue-900 hover:bg-blue-800'>
            Add Family Medical History
          </Button>
        </div>

        <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]'>
          <img
            src='/placeholder.svg?height=150&width=150&text=No+Family+History'
            alt='No family medical history'
            className='w-36 h-36 mb-4'
          />
          <p className='text-gray-500'>No Family Medical History Available</p>
        </div>
      </div>

      {/* Social Determinants Section */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-semibold'>Social Determinants</h2>
          <div className='flex gap-2'>
            <Button variant='outline' className='border-blue-500 text-blue-500'>
              Social Risk Factors
            </Button>
            <Button className='bg-blue-900 hover:bg-blue-800'>
              Add Determinant
            </Button>
          </div>
        </div>

        <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]'>
          <img
            src='/placeholder.svg?height=150&width=150&text=No+Social+Determinants'
            alt='No social determinants'
            className='w-36 h-36 mb-4'
          />
          <p className='text-gray-500'>No Social Determinants Available</p>
        </div>
      </div>
    </div>
  );
}
