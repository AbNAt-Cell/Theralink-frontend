'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import AdminClientProfile from '@/components/AdminClientProfile';

export default function InsurancePage() {
  const [selfPay, setSelfPay] = useState(false);

  const insuranceData = [
    {
      insurance: '68519 - SUPERIOR HEALTHPLAN',
      policyNumber: '727333179',
      startDate: '6/1/2024',
      endDate: '12/31/2024',
      isPrimary: true,
      isDifferent: false,
      coPay: '12/31/2024',
      infoDate: '12/31/2024',
    },
  ];

  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Insurance</h2>
        <Button className='bg-blue-900 hover:bg-blue-800'>
          Add New Insurance
        </Button>
      </div>

      <div className='flex items-center gap-2 mb-4'>
        <Switch checked={selfPay} onCheckedChange={setSelfPay} id='self-pay' />
        <label htmlFor='self-pay' className='text-sm'>
          Private/Self Pay? (i.e. client is not covered by any policy or plan of
          insurance)
        </label>
      </div>

      <div className='border rounded-md overflow-hidden'>
        <Table>
          <TableHeader className='bg-gray-100'>
            <TableRow>
              <TableHead>Insurance</TableHead>
              <TableHead>Policy #</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Primary</TableHead>
              <TableHead>Insured is different?</TableHead>
              <TableHead>Co-Pay</TableHead>
              <TableHead>Insured Info/Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {insuranceData.map((insurance, index) => (
              <TableRow key={index}>
                <TableCell>{insurance.insurance}</TableCell>
                <TableCell>{insurance.policyNumber}</TableCell>
                <TableCell>{insurance.startDate}</TableCell>
                <TableCell>{insurance.endDate}</TableCell>
                <TableCell>
                  {insurance.isPrimary ? (
                    <Check className='h-5 w-5 text-green-500' />
                  ) : null}
                </TableCell>
                <TableCell>
                  {insurance.isDifferent ? (
                    <Check className='h-5 w-5 text-green-500' />
                  ) : (
                    <X className='h-5 w-5 text-red-500' />
                  )}
                </TableCell>
                <TableCell>{insurance.coPay}</TableCell>
                <TableCell>{insurance.infoDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='h-8 w-8 p-0'>
            1
          </Button>
        </div>
        <div className='text-sm text-gray-500'>1-1 of 1 items</div>
      </div>
    </div>
  );
}
