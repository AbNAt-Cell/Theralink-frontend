'use client';

import React from 'react'

import { columns } from "./table-columns"
import type { NewBilling } from '@/types/billing';
import type { Filter } from '@/components/TableFilters';
import { DataTable } from '@/components/ui/data-table';

const AdminNewBillingPage = () => {
  const billings: Partial<NewBilling>[] = [
    {
      id: '1',
      client: { id: 'c1', name: 'John Doe' },
      dos: '2023-01-01',
      clientDob: '1990-01-01',
      insurance: 'Insurance A',
      template: 'Template 1',
      staff: 'Staff A',
      staffNpi: '1234567890',
      site: 'Site 1',
      serviceCode: 'SC001',
      units: 10,
      rate: 100,
      toBill: true,
      status: 'Pending',
    },
    {
      id: '2',
      client: { id: 'c2', name: 'Jane Smith' },
      dos: '2023-02-01',
      clientDob: '1985-02-01',
      insurance: 'Insurance B',
      template: 'Template 2',
      staff: 'Staff B',
      staffNpi: '0987654321',
      site: 'Site 2',
      serviceCode: 'SC002',
      units: 5,
      rate: 200,
      toBill: false,
      status: 'Completed',
    },
  ]
  const filters: Filter[] = [
    { label: 'Date (DOS)', value: 'dos' },
    { label: 'clients', value: 'client.name' },
    { label: 'Staff', value: 'staff' },
    { label: 'Bill Status', value: 'status' },
    { label: 'Payer', value: 'payer' },
    { label: 'Template', value: 'template' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">New Billing Submission</h1>
      </div>
      <div className='flex flex-col gap-4'>
        <DataTable columns={columns} data={billings} filters={filters} />
      </div>
    </div>
  )
}

export default AdminNewBillingPage