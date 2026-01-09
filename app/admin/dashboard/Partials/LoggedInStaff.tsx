import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Loader2, User } from 'lucide-react';

export default function LoggedInStaff() {
  const { loggedInStaff, loading } = useDashboardData();

  return (
    <Card>
      <CardHeader className='bg-slate-900 text-white py-3 mb-3 rounded-t-md'>
        <CardTitle>Logged in Staff</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[200px]'>
          {loading ? (
            <div className="flex justify-center items-center h-[120px]">
              <Loader2 className="animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="space-y-3">
              {loggedInStaff.length > 0 ? (
                loggedInStaff.map((staff: any) => (
                  <div key={staff.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-md transition-colors">
                    <div className="bg-slate-100 p-1.5 rounded-full">
                      <User className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {`${staff.first_name} ${staff.last_name}`}
                      </p>
                      <p className="text-xs text-slate-500 uppercase">
                        {staff.role}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <span className="flex h-2 w-2 rounded-full bg-green-500" />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-gray-500 text-sm">
                  No staff members currently online.
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

