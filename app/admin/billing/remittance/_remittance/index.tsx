import React from 'react'

import { columns } from "./table-columns"
import type { BillingRemittance } from '@/types/billing';
import type { Filter } from '@/components/TableFilters';
import { DataTable } from '@/components/ui/data-table';

import { FileOutput } from 'lucide-react'
import { Button } from '@/components/ui/button'

const RemittanceView = () => {
  const billingRemittance: Partial<BillingRemittance>[] = [
    {
      controlNumber: "CN123456",
      batchId: "BID123",
      payerName: "Payer One",
      processDate: "2023-01-01",
      paymentDate: "2023-01-05",
      amountBilled: 1000,
      diff: 50,
      percentReceived: 95,
      paymentMethod: "Check",
      adjAmount: 50,
      adjCode: "ADJ01",
      numberOfCodes: 5,
      numberOfServiceLines: 10,
    },
    {
      controlNumber: "CN654321",
      batchId: "BID456",
      payerName: "Payer Two",
      processDate: "2023-02-01",
      paymentDate: "2023-02-05",
      amountBilled: 2000,
      diff: 100,
      percentReceived: 90,
      paymentMethod: "EFT",
      adjAmount: 100,
      adjCode: "ADJ02",
      numberOfCodes: 10,
      numberOfServiceLines: 20,
    }
  ]

  const filters: Filter[] = [
    { label: 'Date (DOS)', value: 'dos' },
    { label: 'Batch ID', value: 'batchId' },
    { label: 'Claims', value: 'claims' },
    { label: 'Payer', value: 'payer' },
    { label: 'Denial Reason', value: 'denialReason' },
    { label: 'Status', value: 'status' },
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
        <DataTable columns={columns} data={billingRemittance} filters={filters} />
      </div>
    </div>
  )
}

export default RemittanceView