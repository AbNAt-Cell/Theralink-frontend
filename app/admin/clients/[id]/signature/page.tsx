'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Loader } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function SignaturePage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const clientData = await getClientById(params.id);
      setClient(clientData);
    } catch (error) {
      console.error('Error loading client:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load client data' });
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  // Get signature URL from profiles table
  const signatureUrl = client?.signatureUrl;

  return (
    <div className='space-y-6'>
      <AdminClientProfile client={client} />
      <div>
        <h2 className='text-xl font-semibold mb-4'>Signature</h2>

        <div className='flex justify-end gap-2 mb-4'>
          <Link href={`/admin/clients/${params.id}/signature/create`}>
            <Button variant='outline' className='border-blue-500 text-blue-500'>
              + Add Client Signature
            </Button>
          </Link>
        </div>

        <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]'>
          {signatureUrl ? (
            <>
              <div className='relative w-full max-w-md h-48 mb-4'>
                <Image
                  src={signatureUrl}
                  alt='Client Signature'
                  fill
                  unoptimized
                  className='object-contain'
                />
              </div>
              <p className='text-gray-600'>Client Signature</p>
              <p className='text-sm text-gray-400 mt-2'>
                Signed by: {client?.firstName} {client?.lastName}
              </p>
            </>
          ) : (
            <>
              <div className='relative w-48 h-48 mb-4 flex items-center justify-center bg-gray-100 rounded'>
                <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <p className='text-gray-500'>No Signature Available</p>
              <p className='text-sm text-gray-400 mt-2'>
                Click &quot;Add Client Signature&quot; to request or capture a signature
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
