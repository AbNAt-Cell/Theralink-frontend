import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function TodaysAppointments() {
  return (
    <Card className='col-span-2'>
      <CardHeader className='bg-slate-900 text-white py-3 mb-3 rounded-t-md'>
        <CardTitle>Today&apos;s Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[200px]'>
          <div className='space-y-4'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Appointment</TableHead>
                  <TableHead>Appt Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(2)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className='font-medium'>
                      {`Mr-${Math.floor(Math.random() * 1000)}`}
                    </TableCell>
                    <TableCell>
                      {`Mr-${Math.floor(Math.random() * 1000)}`}
                    </TableCell>
                    <TableCell>
                      {['9:00AM', '11:30AM'][Math.floor(Math.random() * 2)]}
                    </TableCell>
                    <TableCell className='text-right'>
                      {['Family', 'Personal'][Math.floor(Math.random() * 2)]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
