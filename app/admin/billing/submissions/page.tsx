import React from 'react'

const AdminBillingSubmissionsPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Billing Submission</h1>
        <div className='flex flex-row gap-4 justify-between'>
          <div className='py-2 px-3 w-1/4 border-2 border-primary rounded-lg'>
            <p className='text-lg text-primary font-bold'>Batches</p>
            <div className='mt-2'>
              <p>Submitted: <span className='font-bold'>0</span></p>
              <p>Accepted: <span className='font-bold text-green-800'>0</span></p>
              <p>Rejected: <span className='font-bold text-destructive'>0</span></p>
            </div>
          </div>
          <div className='py-2 px-3 w-1/4 border-2 border-primary rounded-lg'>
            <p className='text-lg text-primary font-bold'>Claims</p>
            <div className='mt-2'>
              <p>Submitted: <span className='font-bold'>0</span></p>
              <p>Accepted: <span className='font-bold text-green-800'>0</span></p>
              <p>Rejected: <span className='font-bold text-destructive'>0</span></p>
            </div>
          </div>
          <div className='py-2 px-3 w-1/4 border-2 border-primary rounded-lg'>
            <p className='text-lg text-primary font-bold'>Amount Billed</p>
            <div className='mt-2'>
              <p>Submitted: <span className='font-bold'>0</span></p>
              <p>Accepted: <span className='font-bold text-green-800'>0</span></p>
              <p>Rejected: <span className='font-bold text-destructive'>0</span></p>
            </div>
          </div>
          <div className='py-2 px-3 w-1/4 border-2 border-primary rounded-lg'>
            <p className='text-lg text-primary font-bold'>Service Lines</p>
            <div className='mt-2'>
              <p>Submitted: <span className='font-bold'>0</span></p>
              <p>Accepted: <span className='font-bold text-green-800'>0</span></p>
              <p>Rejected: <span className='font-bold text-destructive'>0</span></p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {/* <DataTable columns={columns} data={billings} filters={filters} /> */}
      </div>
    </div>
  )
}

export default AdminBillingSubmissionsPage