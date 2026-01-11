'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash, Loader } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientDiagnoses, addClientDiagnosis, deleteClientDiagnosis, ClientDiagnosis } from '@/hooks/admin/diagnosis';
import AddDiagnosisModal from '@/components/modals/AddDiagnosisModal';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function DiagnosisPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [diagnoses, setDiagnoses] = useState<ClientDiagnosis[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, diagnosesData] = await Promise.all([
        getClientById(params.id),
        getClientDiagnoses(params.id)
      ]);
      setClient(clientData);
      setDiagnoses(diagnosesData);
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

  const handleAddDiagnosis = async (data: {
    icd10Code: string;
    diagnosisName: string;
    diagnosisDate: string;
    isRuleOut: boolean;
    isHistorical: boolean;
    isImpression: boolean;
    isExternal: boolean;
  }) => {
    try {
      await addClientDiagnosis({
        clientId: params.id,
        ...data
      });
      toast({ title: 'Success', description: 'Diagnosis added successfully' });
      loadData();
    } catch (error) {
      console.error('Error adding diagnosis:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add diagnosis' });
    }
  };

  const handleDeleteDiagnosis = async (diagnosisId: string) => {
    if (!confirm('Are you sure you want to delete this diagnosis?')) return;

    setDeletingId(diagnosisId);
    try {
      await deleteClientDiagnosis(diagnosisId);
      toast({ title: 'Success', description: 'Diagnosis deleted successfully' });
      loadData();
    } catch (error) {
      console.error('Error deleting diagnosis:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete diagnosis' });
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
        <h2 className='text-xl font-semibold'>Diagnosis</h2>
        <Button
          className='bg-blue-900 hover:bg-blue-800'
          onClick={() => setIsModalOpen(true)}
        >
          Add Diagnosis
        </Button>
      </div>

      <div className='border rounded-md overflow-hidden'>
        <Table>
          <TableHeader className='bg-gray-100'>
            <TableRow>
              <TableHead className='w-12'></TableHead>
              <TableHead>DX Code</TableHead>
              <TableHead>Diagnosis</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {diagnoses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No diagnoses found. Click &quot;Add Diagnosis&quot; to add one.
                </TableCell>
              </TableRow>
            ) : (
              diagnoses.map((diagnosis, index) => (
                <TableRow key={diagnosis.id}>
                  <TableCell className='font-medium'>{index + 1}</TableCell>
                  <TableCell className="font-mono">{diagnosis.icd10Code}</TableCell>
                  <TableCell>{diagnosis.diagnosisName}</TableCell>
                  <TableCell>{new Date(diagnosis.diagnosisDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {diagnosis.isRuleOut && <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">R/O</span>}
                      {diagnosis.isHistorical && <span className="text-xs bg-gray-100 text-gray-800 px-1 rounded">Hist</span>}
                      {diagnosis.isImpression && <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Imp</span>}
                      {diagnosis.isExternal && <span className="text-xs bg-purple-100 text-purple-800 px-1 rounded">Ext</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='flex gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-red-600'
                        onClick={() => handleDeleteDiagnosis(diagnosis.id)}
                        disabled={deletingId === diagnosis.id}
                      >
                        {deletingId === diagnosis.id ? (
                          <Loader className='h-4 w-4 animate-spin' />
                        ) : (
                          <Trash className='h-4 w-4' />
                        )}
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-blue-600'
                      >
                        <Pencil className='h-4 w-4' />
                      </Button>
                    </div>
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
          {diagnoses.length === 0 ? '0 items' : `1-${diagnoses.length} of ${diagnoses.length} items`}
        </div>
      </div>

      <AddDiagnosisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddDiagnosis}
      />
    </div>
  );
}
