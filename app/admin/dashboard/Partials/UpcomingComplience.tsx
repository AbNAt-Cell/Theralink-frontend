import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UpcomingComplience() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Compliance</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[200px]'>
          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <span>Within 30 Days</span>
              <span className='bg-blue-100 px-2 py-1 rounded'>0</span>
            </div>
            <div className='flex justify-between items-center'>
              <span>Within 60 Days</span>
              <span className='bg-blue-100 px-2 py-1 rounded'>0</span>
            </div>
            <div className='flex justify-between items-center'>
              <span>Within 90 Days</span>
              <span className='bg-blue-100 px-2 py-1 rounded'>0</span>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
