import React from 'react'

import { columns } from "./table-columns";
import type { BillingClaim } from '@/types/billing';
import type { Filter } from '@/components/TableFilters';
import { DataTable } from '@/components/ui/data-table';

import { FileOutput } from 'lucide-react'
import { Button } from '@/components/ui/button'

const RemittanceView = () => {
  const billingClaims: Partial<BillingClaim>[] = [
    {
      claimControlNumber: "123456",
      controlNumber: "78910",
      memberName: "John Doe",
      paymentDate: "2023-01-01",
      serviceDate: "2023-01-01",
      payerControlNumber: "111213",
      payerName: "Insurance Co.",
      policyNumber: "POL123456",
      amountBilled: 1000,
      amountPaid: 800,
      patientResponsibility: 200,
      diff: 0,
      numberOfServiceLines: 1,
      status: "Paid",
      worked: true,
    },
    {
      claimControlNumber: "654321",
      controlNumber: "101112",
      memberName: "Jane Smith",
      paymentDate: "2023-02-01",
      serviceDate: "2023-02-01",
      payerControlNumber: "141516",
      payerName: "Health Insurance",
      policyNumber: "POL654321",
      amountBilled: 1500,
      amountPaid: 1200,
      patientResponsibility: 300,
      diff: 0,
      numberOfServiceLines: 2,
      status: "Paid",
      worked: false,
    }
  ]

  const filters: Filter[] = [
    { label: 'Date (DOS)', value: 'dos' },
    { label: 'Claim #', value: 'claimControlNumber' },
    { label: 'Member Name', value: 'memberName' },
    { label: 'Payer', value: 'payer' },
    { label: 'Denial Reason', value: 'denialReason' },
    { label: 'Status', value: 'status' },
    { label: 'Claim Status', value: 'claimStatus' },
  ]
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className='flex flex-col md:flex-row justify-end'>
          <div className='flex flex-row flex-wrap gap-4'>
            <Button variant="secondary">
              <FileOutput /> Export to Excel
            </Button>
          </div>
        </div>
        <div className='flex flex-col md:flex-row gap-4 justify-between'>
          <div className='py-2 px-3 w-full md:w-1/3 border-2 border-primary rounded-lg'>
            <p className='text-lg text-primary font-bold'>Billing Totals</p>
            <div className='mt-2'>
              <p>Total Billed: <span className='font-bold'>0</span></p>
              <p>Total Paid: <span className='font-bold text-green-800'>0</span></p>
              <p>Total Denied: <span className='font-bold text-primary'>0</span></p>
            </div>
          </div>
          <div className='py-2 px-3 w-full md:w-1/3 border-2 border-primary rounded-lg'>
            <p className='text-lg text-primary font-bold'>Info</p>
            <div className='mt-2'>
              <p>% Received: <span className='font-bold'>0</span></p>
              <p>Total Claims: <span className='font-bold text-green-800'>0</span></p>
              <p>Total Service Lines: <span className='font-bold text-primary'>0</span></p>
            </div>
          </div>
          <div className='py-2 px-3 w-full md:w-1/3 border-2 border-primary rounded-lg'>
            <p className='text-lg text-primary font-bold'>Payments</p>
            <div className='mt-2'>
              <p><span className='font-bold'>0</span></p>

            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <DataTable columns={columns} data={billingClaims} filters={filters} />
      </div>
    </div>
  )
}

export default RemittanceView