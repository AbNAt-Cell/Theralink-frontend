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
import { useDashboardData } from '@/hooks/useDashboardData';
import { Loader2 } from 'lucide-react';

export default function DocumentsPendingReview() {
  const { pendingDocuments, loading } = useDashboardData();

  return (
    <Card className='col-span-1'>
      <CardHeader className='bg-slate-900 text-white py-3 mb-3 rounded-t-md'>
        <CardTitle>Documents Pending Review</CardTitle>
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
                  <TableHead>Staff</TableHead>
                  <TableHead>DOS</TableHead>
                  <TableHead>Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingDocuments.length > 0 ? (
                  pendingDocuments.map((doc: any) => (
                    <TableRow key={doc.id}>
                      <TableCell className='font-medium'>
                        {`${doc.client?.first_name} ${doc.client?.last_name}`}
                      </TableCell>
                      <TableCell>
                        {`${doc.staff?.first_name} ${doc.staff?.last_name}`}
                      </TableCell>
                      <TableCell>
                        {doc.date_of_service}
                      </TableCell>
                      <TableCell>
                        {doc.type}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-gray-500">
                      No documents pending review.
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
