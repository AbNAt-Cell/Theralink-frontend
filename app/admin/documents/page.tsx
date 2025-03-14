'use client';

import React from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { Button } from '@/components/ui/button';
import { FileInput, FileOutput, FileTerminal, Plus } from 'lucide-react';
import { columns } from "./table-columns"
import type { Document } from '@/types/document';
import type { Filter } from '@/components/TableFilters';
import { DataTable } from '@/components/ui/data-table';

const AdminDocumentsPage = () => {
  const documents: Partial<Document>[] = [
    {
      id: '1',
      dos: '2025-03-01',
      template: 'Template A',
      client: {
        id: 'c1',
        name: 'John Doe',
      },
      dob: '1990-01-01',
      service: 'Service A',
      duration: '30 mins',
      placeOfService: 'Office',
      staff: 'Staff A',
      dx: 'Dx A',
      status: 'Active',
      payer: 'Payer A',
      unit: '1',
      serviceRate: '100',
      totalBill: '100',
      datePaid: '2025-03-05',
      lastBill: '2025-03-05',
      payStatus: 'Paid',
    },
    {
      id: '2',
      dos: '2025-03-02',
      template: 'Template B',
      client: {
        id: 'c2',
        name: 'Jane Smith',
      },
      dob: '1985-05-15',
      service: 'Service B',
      duration: '45 mins',
      placeOfService: 'Home',
      staff: 'Staff B',
      dx: 'Dx B',
      status: 'Inactive',
      payer: 'Payer B',
      unit: '2',
      serviceRate: '150',
      totalBill: '300',
      datePaid: '2025-03-06',
      lastBill: '2025-03-06',
      payStatus: 'Unpaid',
    },

  ]
  const filters: Filter[] = [
    { label: 'Date (DOS)', value: 'date' },
    { label: 'Clients', value: 'client' },
    { label: 'Staff', value: 'staff' },
    { label: 'Service', value: 'service' },
    { label: 'Site', value: 'site' },
  ]

  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Documents</h1>
        <div className="flex flex-wrap gap-4">
          <Button variant="outlineSecondary" onClick={() => { }}>
            <FileTerminal />
            Staff Service Report
          </Button>
          <Button variant="outlineSecondary" onClick={() => { }}>
            <FileOutput />
            Draft (1)
          </Button>
          <Button variant="outlineSecondary" onClick={() => { }}>
            <FileInput />
            Export to Excel
          </Button>
          <Button variant="secondary" onClick={() => router.push('/admin/clients/new')}>
            <Plus />
            Add Document
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <DataTable columns={columns} data={documents} filters={filters} />
      </div>
    </div>
  )
}

export default AdminDocumentsPage