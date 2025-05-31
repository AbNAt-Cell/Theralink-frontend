'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import type { User } from '@/types/user';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const columns: ColumnDef<Partial<User>>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className='mx-3'
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => {
      return (
        <Button
          className='font-bold'
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Balance
          <ArrowUpDown />
        </Button>
      );
    },
    enableSorting: true,
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <Link
        href={`/admin/clients/${row.original.id}`}
        className='text-primary hover:underline'
      >
        {row.original.firstName} {row.original.lastName}
      </Link>
    ),
  },
  {
    accessorKey: 'dob',
    header: 'DOB',
  },
  {
    accessorKey: 'assignedStaff',
    header: 'Assigned Staff',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'primaryInsurance',
    header: 'Primary Insurance',
  },
  {
    accessorKey: 'startDate',
    header: 'Start Date',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt ?? '');
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
  },
  {
    accessorKey: 'lastSeenDate',
    header: 'Last Seen Date',
    cell: ({ row }) => {
      const date = new Date(row.original.updatedAt ?? '');
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    },
  },
  {
    accessorKey: 'nextAppointment',
    header: 'Next Appointment',
  },
  {
    accessorKey: 'site',
    header: 'Site',
  },
  {
    accessorKey: 'lastEligibilityCheck.date',
    header: 'Last Eligibility Check',
  },
];
