'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Button } from '@/components/ui/button';
import { ChevronDown, FileInput, UserPlus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { columns } from './table-columns';
import type { User } from '@/types/user';
import type { Filter } from '@/components/TableFilters';
import { DataTable } from '@/components/ui/data-table';
import { getClients } from '@/hooks/admin/client';

const AdminClientsPage = () => {
  const [showInactiveStaff, setShowInactiveStaff] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const [users, setUsers] = React.useState<User[]>([]);

  useEffect(() => {
    const fetchClient = async () => {
      setLoading(true);
      try {
        const response: { users: User[] | null } = await getClients();
        if (response.users) {
          setUsers(response.users);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, []);

  const filters: Filter[] = [
    { label: 'Select Date', value: 'date' },
    { label: 'Payer', value: 'payer' },
    { label: 'Site', value: 'site' },
    { label: 'Gender', value: 'gender' },
    { label: 'Flag', value: 'flag' },
    { label: 'Status', value: 'status' },
    { label: 'Staff Caseload', value: 'staff_caseload' },
    { label: 'Search by Dx Code', value: 'dx_code' },
    { label: 'Record #', value: 'record' },
    { label: 'Status', value: 'status' },
  ];

  const router = useRouter();
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <h1 className='text-2xl font-bold'>Clients</h1>
        <div className='flex flex-wrap gap-4'>
          <div className='flex items-center space-x-2'>
            <Switch
              id='show-inactive-staff'
              checked={showInactiveStaff}
              onCheckedChange={setShowInactiveStaff}
            />
            <Label htmlFor='show-inactive-staff'>Show Inactive Staff</Label>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant='outline'>
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

          <Button variant='outlineSecondary' onClick={() => {}}>
            <FileInput />
            Export to Excel
          </Button>
          <Button
            variant='secondary'
            onClick={() => router.push('/admin/clients/new')}
          >
            <UserPlus />
            Add New Client
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {loading ? (
          <span>Loading...</span>
        ) : (
          <DataTable columns={columns} data={users} filters={filters} />
        )}
      </div>
    </div>
  );
};

export default AdminClientsPage;
