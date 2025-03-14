'use client';

import React from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { columns } from "./table-columns"
import type { Site } from '@/types/site';
import type { Filter } from '@/components/TableFilters';
import { DataTable } from '@/components/ui/data-table';

const AdminSitesPage = () => {
  const [showInactiveSite, setShowInactiveSite] = React.useState(true);
  const sites: Partial<Site>[] = [
    {
      id: "1",
      name: "Downtown Medical Center",
      address: "123 Main Street",
      state: "CA",
      numberOfClients: 150,
      city: "Los Angeles",
      zip: "90012",
      fax: "213-555-0123",
      email: "info@downtownmedical.com",
      website: "www.downtownmedical.com",
      npiNumber: "1234567890",
      firstDayOfWeek: "Monday",
      phone: "213-555-0100",
      comments: "Primary location"
    },
    {
      id: "2",
      name: "Westside Healthcare",
      address: "456 Ocean Avenue",
      state: "CA",
      numberOfClients: 200,
      city: "Santa Monica",
      zip: "90401",
      fax: "310-555-0123",
      email: "contact@westsidehealth.com",
      website: "www.westsidehealth.com",
      npiNumber: "0987654321",
      firstDayOfWeek: "Sunday",
      phone: "310-555-0200",
      comments: "Satellite facility"
    }

  ]
  const filters: Filter[] = [
  ]

  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Sites</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="show-inactive-staff" checked={showInactiveSite} onCheckedChange={setShowInactiveSite} />
            <Label htmlFor="show-inactive-staff">Show Inactive Site</Label>
          </div>

          <Button variant="secondary" onClick={() => router.push('/admin/sites/new')}>
            <PlusCircle />
            Add New Site
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        <DataTable columns={columns} data={sites} filters={filters} />
      </div>
    </div>
  )
}

export default AdminSitesPage