import { Search } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import AdminClientProfile from '@/components/AdminClientProfile';

export default function CompliancePage() {
  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <h2 className='text-xl font-semibold'>Compliance</h2>

      <div className='relative w-full md:w-64 mb-4'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
        <input
          type='search'
          placeholder='Search'
          className='pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors'
        />
      </div>

      <div className='border rounded-md overflow-hidden'>
        <Table>
          <TableHeader className='bg-gray-100'>
            <TableRow>
              <TableHead>Compliance</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Last Completed Date</TableHead>
              <TableHead>Linked Documents</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Completed?</TableHead>
              <TableHead>History</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={9} className='text-center py-6 text-gray-500'>
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
