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
import { useDashboardData, DashboardAppointment } from '@/hooks/useDashboardData';
import { Loader2 } from 'lucide-react';

export default function TodaysAppointments() {
  const { appointments, loading } = useDashboardData();

  if (loading) {
    return (
      <Card className='col-span-2'>
        <CardHeader className='bg-slate-900 text-white py-3 mb-3 rounded-t-md'>
          <CardTitle>Today&apos;s Appointments</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-[200px]">
          <Loader2 className="animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

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
                {appointments.length > 0 ? (
                  appointments.map((appt: DashboardAppointment) => (
                    <TableRow key={appt.id}>
                      <TableCell className='font-medium'>
                        {`${appt.client?.first_name} ${appt.client?.last_name}`}
                      </TableCell>
                      <TableCell>
                        {`${appt.staff?.first_name} ${appt.staff?.last_name}`}
                      </TableCell>
                      <TableCell>
                        {appt.appointment_time}
                      </TableCell>
                      <TableCell className='text-right'>
                        {appt.appointment_type}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                      No appointments scheduled for today.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

