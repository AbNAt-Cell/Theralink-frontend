'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Check, X, Loader, Trash } from 'lucide-react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientPolicies, deleteClientPolicy, ClientPolicy } from '@/hooks/admin/insurance';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function InsurancePage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [policies, setPolicies] = useState<ClientPolicy[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, policiesData] = await Promise.all([
        getClientById(params.id),
        getClientPolicies(params.id)
      ]);
      setClient(clientData);
      setPolicies(policiesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeletePolicy = async (policyId: string) => {
    if (!confirm('Are you sure you want to delete this insurance policy?')) return;

    setDeletingId(policyId);
    try {
      await deleteClientPolicy(policyId);
      toast({ title: 'Success', description: 'Insurance policy deleted' });
      loadData();
    } catch (error) {
      console.error('Error deleting policy:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete policy' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <AdminClientProfile client={client} />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Insurance</h2>
        <Link href={`/admin/clients/${params.id}/insurance/new`}>
          <Button className='bg-blue-900 hover:bg-blue-800'>
            Add New Insurance
          </Button>
        </Link>
      </div>

      <div className='flex items-center gap-2 mb-4'>
        <Switch
          checked={client?.isPrivatePay || false}
          id='self-pay'
          disabled
        />
        <label htmlFor='self-pay' className='text-sm'>
          Private/Self Pay? (i.e. client is not covered by any policy or plan of
          insurance)
        </label>
      </div>

      <div className='border rounded-md overflow-hidden'>
        <Table>
          <TableHeader className='bg-gray-100'>
            <TableRow>
              <TableHead>Insurance</TableHead>
              <TableHead>Policy #</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Primary</TableHead>
              <TableHead>Insured is different?</TableHead>
              <TableHead>Co-Pay</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No insurance policies found. Click &quot;Add New Insurance&quot; to add one.
                </TableCell>
              </TableRow>
            ) : (
              policies.map((policy) => (
                <TableRow key={policy.id}>
                  <TableCell>
                    {policy.payer?.name || 'Unknown Payer'}
                  </TableCell>
                  <TableCell>{policy.policy_number}</TableCell>
                  <TableCell>
                    {policy.start_date ? new Date(policy.start_date).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    {policy.end_date ? new Date(policy.end_date).toLocaleDateString() : '—'}
                  </TableCell>
                  <TableCell>
                    {policy.is_primary ? (
                      <Check className='h-5 w-5 text-green-500' />
                    ) : (
                      <X className='h-5 w-5 text-gray-300' />
                    )}
                  </TableCell>
                  <TableCell>
                    {policy.insured_is_different ? (
                      <Check className='h-5 w-5 text-green-500' />
                    ) : (
                      <X className='h-5 w-5 text-red-500' />
                    )}
                  </TableCell>
                  <TableCell>
                    {policy.has_copay ? `$${policy.copay_amount || 0}` : '—'}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='text-red-600'
                      onClick={() => handleDeletePolicy(policy.id)}
                      disabled={deletingId === policy.id}
                    >
                      {deletingId === policy.id ? (
                        <Loader className='h-4 w-4 animate-spin' />
                      ) : (
                        <Trash className='h-4 w-4' />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='sm' className='h-8 w-8 p-0'>
            1
          </Button>
        </div>
        <div className='text-sm text-gray-500'>
          {policies.length === 0 ? '0 items' : `1-${policies.length} of ${policies.length} items`}
        </div>
      </div>
    </div>
  );
}
