'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Button } from '@/components/ui/button';
import { FileInput, UserPlus, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { columns } from './table-columns';
import type { Staff } from '@/types/staff';
import type { Filter } from '@/components/TableFilters';
import { DataTable } from '@/components/ui/data-table';
import { getStaffs } from '@/hooks/admin/staff';
import { useUser } from '@/context/UserContext';

const AdminStaffPage = () => {
  const { user } = useUser();
  const [showInactiveStaff, setShowInactiveStaff] = React.useState(true);
  useEffect(() => {
    const fetchStaffs = async () => {
      if (!user) return; // Wait for user context to load
      if (!user.clinicId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response: { users: Staff[] | null } = await getStaffs(user.clinicId);
        if (response.users) {
          setUsers(response.users);
        }
      } catch (error) {
        console.error('fetch error', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaffs();
  }, [user?.clinicId]);

  const filters: Filter[] = [
    { label: 'Select Date', value: 'date' },
    { label: 'Site', value: 'site' },
    { label: 'Role', value: 'role' },
    { label: 'Gender', value: 'gender' },
    { label: 'Race', value: 'race' },
  ];

  const router = useRouter();
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <h1 className='text-2xl font-bold'>Staff</h1>
        <div className='flex flex-wrap gap-4'>
          <div className='flex items-center space-x-2'>
            <Switch
              id='show-inactive-staff'
              checked={showInactiveStaff}
              onCheckedChange={setShowInactiveStaff}
            />
            <Label htmlFor='show-inactive-staff'>Show Inactive Staff</Label>
          </div>

          <Button variant='outlineSecondary' onClick={() => { }}>
            <FileInput />
            Export to Excel
          </Button>
          <Button
            variant='secondary'
            onClick={() => router.push('/admin/staff/new')}
          >
            <UserPlus />
            Add Staff
          </Button>
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
            <span className="ml-3 text-lg font-medium text-gray-500">Loading staff members...</span>
          </div>
        ) : (
          <DataTable columns={columns} data={users} filters={filters} />
        )}
      </div>
    </div>
  );
};

export default AdminStaffPage;

