'use client';

import React from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { Button } from '@/components/ui/button';
import { ChevronDown, FileInput, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { columns } from "./table-columns"
import type { User } from '@/types/user';
import TableFilters from '@/components/TableFilters';
import { DataTable } from '@/components/ui/data-table';

const ClientPage = () => {
  const [showInactiveStaff, setShowInactiveStaff] = React.useState(true);
  const users: Partial<User>[] = [
    {
      id: "29981",
      status: "Inactive",
      balance: 0.00,
      name: "Mfoniso Ibokette",
      dob: "6/27/2018",
      assignedStaff: ["Lovette, Andrea", "Washington, Stacy"],
      gender: "F",
      primaryInsurance: "Private Pay",
      startDate: "11/5/2024",
      lastSeenDate: "11/5/2024",
      nextAppointment: "11/6/2024",
      site: "Auspicious Community Service",
      lastEligibilityCheck: {
        status: "Request Error",
        date: "9/18/2024",
      },
    },
    {
      id: "29982",
      status: "Active",
      balance: 150.50,
      name: "John Smith",
      dob: "3/15/2015",
      assignedStaff: ["Jones, Michael", "Brown, Sarah"],
      gender: "M",
      primaryInsurance: "Medicaid",
      startDate: "10/1/2024",
      lastSeenDate: "11/4/2024",
      nextAppointment: "11/12/2024",
      site: "Main Street Clinic",
      lastEligibilityCheck: {
        status: "Eligible",
        date: "11/1/2024",
      },
    }

  ]

  const router = useRouter();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="show-inactive-staff" checked={showInactiveStaff} onCheckedChange={setShowInactiveStaff} />
            <Label htmlFor="show-inactive-staff">Show Inactive Staff</Label>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline">
                Client Action
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Assign Flags</DropdownMenuItem>
              <DropdownMenuItem>Change Client Status</DropdownMenuItem>
              <DropdownMenuItem>Check Client Eligibility</DropdownMenuItem>
              <DropdownMenuItem>Move Client Site</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outlineSecondary" onClick={() => { }}>
            <FileInput />
            Export to Excel
          </Button>
          <Button variant="secondary" onClick={() => router.push('/admin/clients/new')}>
            <UserPlus />
            Add New Client
          </Button>
        </div>
      </div>
      <div>
        <TableFilters />
      </div>
      <div>
        <DataTable columns={columns} data={users} />
      </div>
    </div>
  )
}

export default ClientPage