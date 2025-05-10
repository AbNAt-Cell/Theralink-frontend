import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AdminClientProfile from '@/components/AdminClientProfile';

export default function EligibilityPage() {
  const eligibilityData = [
    {
      date: '11/13/2024 05:14 AM',
      memberStatus: 'NI',
      memberId: '727333179',
      payer: '68519 - CENTENE CORPORATION',
      subscriberName: 'BOLTON, JALEIGH',
      requestStatus: 'WAITING',
    },
  ];

  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Eligibility</h2>
        <Button className='bg-blue-900 hover:bg-blue-800'>
          Check Eligibility
        </Button>
      </div>

      <div className='border rounded-md overflow-hidden'>
        <Table>
          <TableHeader className='bg-gray-100'>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Member Status</TableHead>
              <TableHead>Member ID</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Subscriber Name</TableHead>
              <TableHead>Request Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {eligibilityData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.memberStatus}</TableCell>
                <TableCell>{item.memberId}</TableCell>
                <TableCell>{item.payer}</TableCell>
                <TableCell>{item.subscriberName}</TableCell>
                <TableCell className='text-red-500'>
                  {item.requestStatus}
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
