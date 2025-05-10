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
import { Pencil, Trash } from 'lucide-react';

export default function DiagnosisPage() {
  const diagnosisData = [
    {
      code: 'F90.9',
      diagnosis: 'Attention-deficit hyperactivity disorder, unspecified type',
      date: 'Diagnosis Date',
    },
  ];

  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Diagnosis</h2>
        <Button className='bg-blue-900 hover:bg-blue-800'>Add Diagnosis</Button>
      </div>

      <div className='border rounded-md overflow-hidden'>
        <Table>
          <TableHeader className='bg-gray-100'>
            <TableRow>
              <TableHead className='w-12'></TableHead>
              <TableHead>DX Code</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Diagnosis Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diagnosisData.map((item, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>=</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.diagnosis}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-red-600'
                    >
                      <Trash className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-blue-600'
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                  </div>
                </TableCell>
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
