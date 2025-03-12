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
import TableFilters from '@/components/TableFilters';

const ClientPage = () => {
  const [showInactiveStaff, setShowInactiveStaff] = React.useState(true);
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
    </div>
  )
}

export default ClientPage