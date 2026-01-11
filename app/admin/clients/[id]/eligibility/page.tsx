'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import AdminClientProfile from '@/components/AdminClientProfile';
import { CheckEligibilityModal } from '@/components/modals/CheckEligibilityModal';
import { getEligibilityChecks, addEligibilityCheck, EligibilityCheck } from '@/hooks/admin/eligibility';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { useToast } from '@/hooks/Partials/use-toast';
import { Loader } from 'lucide-react';

interface PageProps {
  params: {
    id: string;
  };
}

export default function EligibilityPage({ params }: PageProps) {
  const [loading, setLoading] = useState(true);
  const [eligibilityData, setEligibilityData] = useState<EligibilityCheck[]>([]);
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const checks = await getEligibilityChecks(params.id);
      const clientData = await getClientById(params.id);
      setEligibilityData(checks);
      setClient(clientData);
    } catch (error) {
      console.error("Error loading eligibility data", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleRunCheck = async (formData: any) => {
    // This is where valid API integration would go. 
    // For now, we simulate a check.
    try {
      const mockResponse = {
        status: Math.random() > 0.2 ? 'Active' : 'Inactive', // 80% chance of active for demo
        details: {
          copay: 20,
          deductible: 1000,
          deductibleRemaining: 450,
          coinsurance: '20%',
          message: 'Eligibility verified successfully (Mock)'
        }
      };

      await addEligibilityCheck({
        client_id: params.id,
        payer_id: formData.payerId,
        payer_name: formData.payerId, // Ideally look up name from ID or pass it
        service_date_from: formData.fromDate,
        service_date_to: formData.toDate,
        status: mockResponse.status,
        response_details: mockResponse.details
      });

      toast({ title: "Eligibility Checked", description: `Status: ${mockResponse.status}` });
      setIsModalOpen(false);
      loadData(); // Refresh table
    } catch (error) {
      console.error("Error running check", error);
      toast({ title: "Error", description: "Failed to run eligibility check", variant: "destructive" });
    }
  };


  return (
    <div className='space-y-6'>
      <AdminClientProfile client={client || undefined} />
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Eligibility</h2>
        <Button
          className='bg-blue-900 hover:bg-blue-800'
          onClick={() => setIsModalOpen(true)}
        >
          Check Eligibility
        </Button>
      </div>

      <div className='border rounded-md overflow-hidden'>
        <Table>
          <TableHeader className='bg-gray-100'>
            <TableRow>
              <TableHead>Date Checked</TableHead>
              <TableHead>Service From</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  <Loader className="animate-spin w-6 h-6 mx-auto" />
                </TableCell>
              </TableRow>
            ) : eligibilityData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                  No eligibility checks found.
                </TableCell>
              </TableRow>
            ) : (
              eligibilityData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{new Date(item.check_date).toLocaleString()}</TableCell>
                  <TableCell>{item.service_date_from || 'N/A'}</TableCell>
                  <TableCell className={item.status === 'Active' ? 'text-green-600 font-medium' : 'text-red-600'}>
                    {item.status}
                  </TableCell>
                  <TableCell>{item.payer_name || 'N/A'}</TableCell>
                  <TableCell>
                    {item.response_details?.copay ? `Copay: $${item.response_details.copay}` : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CheckEligibilityModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCheck={handleRunCheck}
        initialData={client}
      />
    </div>
  );
}
