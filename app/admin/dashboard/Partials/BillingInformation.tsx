import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Loader2 } from 'lucide-react';

export default function BillingInformation() {
  const { billingInfo, loading } = useDashboardData();

  const info = billingInfo || {
    total_amount_collected: 0,
    submissions_count: 0,
    claims_count: 0,
    documents_billed_count: 0,
  };

  return (
    <Card>
      <CardHeader className='bg-slate-900 text-white py-3 mb-3 rounded-t-md'>
        <CardTitle>Billing Information</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[120px]">
            <Loader2 className="animate-spin text-gray-400" />
          </div>
        ) : (
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <span>Total Amount Collected:</span>
              <span className='bg-slate-50 py-0.5 px-1 rounded-md text-slate-900 font-medium'>
                ${Number(info.total_amount_collected).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className='flex justify-between'>
              <span># of Billing Submissions:</span>
              <span className='bg-slate-50 py-0.5 px-1 rounded-md text-slate-900 font-medium'>
                {info.submissions_count}
              </span>
            </div>
            <div className='flex justify-between'>
              <span># of Claims Created:</span>
              <span className='bg-slate-50 py-0.5 px-1 rounded-md text-slate-900 font-medium'>
                {info.claims_count}
              </span>
            </div>
            <div className='flex justify-between'>
              <span># of Documents Billed:</span>
              <span className='bg-slate-50 py-0.5 px-1 rounded-md text-slate-900 font-medium'>
                {info.documents_billed_count}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

