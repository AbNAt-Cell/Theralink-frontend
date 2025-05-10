import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, FileSpreadsheet } from 'lucide-react';

export default function ClientLedgerPage() {
  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Client Ledger</h2>
        <div className='flex gap-2'>
          <Button variant='outline' className='flex items-center gap-2'>
            <FileSpreadsheet className='h-4 w-4' />
            Export to Excel
          </Button>
          <Button className='bg-blue-900 hover:bg-blue-800'>Add Ledger</Button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 items-end'>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>From</label>
          <div className='relative'>
            <input
              type='text'
              className='pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors'
              defaultValue='11/1/2024'
            />
            <Button
              variant='ghost'
              size='icon'
              className='absolute left-0 top-0 h-9 w-9'
            >
              <Calendar className='h-4 w-4' />
            </Button>
          </div>
        </div>
        <div className='space-y-2'>
          <label className='text-sm font-medium'>To</label>
          <div className='relative'>
            <input
              type='text'
              className='pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors'
              defaultValue='11/30/2024'
            />
            <Button
              variant='ghost'
              size='icon'
              className='absolute left-0 top-0 h-9 w-9'
            >
              <Calendar className='h-4 w-4' />
            </Button>
          </div>
        </div>
        <div className='text-right'>
          <p className='text-sm font-medium'>
            Current Balance: <span className='font-bold'>$0.00</span>
          </p>
        </div>
      </div>

      <div className='border rounded-md overflow-hidden'>
        <Table>
          <TableHeader className='bg-gray-100'>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={5} className='text-center py-6 text-gray-500'>
                No record available
              </TableCell>
            </TableRow>
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
