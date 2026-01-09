import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { useDashboardData, DashboardClient } from '@/hooks/useDashboardData';
import { Loader2 } from 'lucide-react';

export default function ClientsByStatusTable() {
  const { clientsByStatus, loading } = useDashboardData();

  return (
    <Card className='col-span-2'>
      <CardHeader className='bg-slate-900 text-white py-3 mb-3 rounded-t-md'>
        <CardTitle>Clients by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[200px]'>
          {loading ? (
            <div className="flex justify-center items-center h-[120px]">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Assigned Staff</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientsByStatus.length > 0 ? (
                  clientsByStatus.map((client: DashboardClient, index: number) => (
                    <TableRow key={index}>
                      <TableCell className='font-medium'>
                        {client.last_name /* Simplified display */}
                      </TableCell>
                      <TableCell>
                        Assigned Staff
                      </TableCell>
                      <TableCell>
                        {client.role}
                      </TableCell>
                      <TableCell className='text-right'>
                        <span className="text-primary hover:underline cursor-pointer">View</span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                      No client data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

