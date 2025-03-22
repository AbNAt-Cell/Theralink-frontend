import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ClientsBySite() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients by Site</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[200px]'>
          {/* Add logged in staff items here */}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
