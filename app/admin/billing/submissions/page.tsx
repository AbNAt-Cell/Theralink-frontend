import React from 'react'

import { columns } from "./table-columns"
import type { BillingSubmission } from '@/types/billing';
import type { Filter } from '@/components/TableFilters';
import { DataTable } from '@/components/ui/data-table';
const AdminBillingSubmissionsPage = () => {
  const billingSubmissions: Partial<BillingSubmission>[] = [
    {
      id: "B123",
      claims: 10,
      lines: 20,
      totalBilled: 5000,
      subDate: "2023-10-01",
      payer: "Insurance A",
      site: "Site 1",
      status: "Submitted",
      res: "Pending",
    },
    {
      id: "B124",
      claims: 5,
      lines: 10,
      totalBilled: 2500,
      subDate: "2023-10-02",
      payer: "Insurance B",
      site: "Site 2",
      status: "Accepted",
      res: "Approved",
    }
  ]
  const filters: Filter[] = [
    { label: 'Date (DOS)', value: 'dos' },
    { label: 'Clients', value: 'client.name' },
    { label: 'Batch ID', value: 'batchId' },
    { label: 'Claims', value: 'claims' },
    { label: 'Site', value: 'site' },
    { label: 'Payer', value: 'payer' },
    { label: 'Status', value: 'status' },
  ]
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
        <DataTable columns={columns} data={billingSubmissions} filters={filters} />
      </div>
    </div>
  )
}

export default AdminBillingSubmissionsPage