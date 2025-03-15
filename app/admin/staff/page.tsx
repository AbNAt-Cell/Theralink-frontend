'use client';

import React from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { Button } from '@/components/ui/button';
import { FileInput, UserPlus } from 'lucide-react';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { columns } from "./table-columns"
import type { Staff } from '@/types/staff';
import type { Filter } from '@/components/TableFilters';
import { DataTable } from '@/components/ui/data-table';

const AdminStaffPage = () => {
  const [showInactiveStaff, setShowInactiveStaff] = React.useState(true);

  const staff: Partial<Staff>[] = [
    {
      id: '1234',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Super Admin',
      site: 'Main Clinic',
      gender: 'M',
      race: 'White',
      phone: '123-456-7890',
      lastLogin: '2024-11-05',
      numberOfCases: 5,
      lastDocument: 'document.pdf',
      credentials: 'QMHP-CS'

    },
    {
      id: '1235',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'Administrator',
      site: 'East Branch',
      gender: 'F',
      race: 'Asian',
      phone: '123-456-7890',
      lastLogin: '2024-11-05',
      numberOfCases: 15,
      lastDocument: 'document.pdf',
      credentials: 'QMHP-CS'

    },
    {
      id: '1236',
      name: 'Robert Johnson',
      email: 'robert.j@example.com',
      role: 'Counselor',
      site: 'West Branch',
      gender: 'M',
      race: 'Black',
      phone: '123-456-7890',
      lastLogin: '2024-11-05',
      numberOfCases: 1,
      lastDocument: 'document.pdf',
      credentials: 'QMHP-CS'
    }
  ]
  const filters: Filter[] = [
    { label: 'Select Date', value: 'date' },
    { label: 'Site', value: 'site' },
    { label: 'Role', value: 'role' },
    { label: 'Gender', value: 'gender' },
    { label: 'Race', value: 'race' },

  ]

  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Staff</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="show-inactive-staff" checked={showInactiveStaff} onCheckedChange={setShowInactiveStaff} />
            <Label htmlFor="show-inactive-staff">Show Inactive Staff</Label>
          </div>

          <Button variant="outlineSecondary" onClick={() => { }}>
            <FileInput />
            Export to Excel
          </Button>
          <Button variant="secondary" onClick={() => router.push('/admin/staff/new')}>
            <UserPlus />
            Add Staff
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <DataTable columns={columns} data={staff} filters={filters} />
      </div>
    </div>
  )
}

export default AdminStaffPage