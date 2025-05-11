import AdminClientProfile from '@/components/AdminClientProfile';

export default function ElectronicPrescriptionPage() {
  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <h2 className='text-xl font-semibold'>Electronic Prescription</h2>

      <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]'>
        <p className='text-gray-500'>
          You dont have eRx subscription, please contact the administration.
        </p>
      </div>
    </div>
  );
}
