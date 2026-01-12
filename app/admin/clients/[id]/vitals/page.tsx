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
import { Trash, Pencil, Loader, FileSpreadsheet, Plus } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientVitals, addClientVital, deleteClientVital, ClientVital } from '@/hooks/admin/vitals';
import AddVitalModal from '@/components/modals/AddVitalModal';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function VitalsPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [vitals, setVitals] = useState<ClientVital[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, vitalsData] = await Promise.all([
        getClientById(params.id),
        getClientVitals(params.id)
      ]);
      setClient(clientData);
      setVitals(vitalsData);
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

  const handleAddVital = async (data: {
    recordDate: string;
    bpSystolic?: number;
    bpDiastolic?: number;
    heartRate?: number;
    pulseRate?: number;
    respiration?: number;
    temperature?: number;
    weight?: number;
    height?: number;
  }) => {
    try {
      await addClientVital({
        clientId: params.id,
        ...data
      });
      toast({ title: 'Success', description: 'Vital record added successfully' });
      loadData();
    } catch (error) {
      console.error('Error adding vital:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add vital record' });
    }
  };

  const handleDeleteVital = async (vitalId: string) => {
    if (!confirm('Are you sure you want to delete this vital record?')) return;

    setDeletingId(vitalId);
    try {
      await deleteClientVital(vitalId);
      toast({ title: 'Success', description: 'Vital record deleted successfully' });
      loadData();
    } catch (error) {
      console.error('Error deleting vital:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete vital record' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleExportToExcel = () => {
    // Create CSV content
    const headers = ['Date Record', 'BP Sys', 'BP Dias', 'Heart Rate', 'Pulse Rate', 'Respiration', 'Temp.', 'Weight', 'Height', 'BMI'];
    const rows = vitals.map(v => [
      new Date(v.recordDate).toLocaleDateString(),
      v.bpSystolic || '',
      v.bpDiastolic || '',
      v.heartRate || '',
      v.pulseRate || '',
      v.respiration || '',
      v.temperature || '',
      v.weight || '',
      v.height || '',
      v.bmi || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vitals_${client?.firstName}_${client?.lastName}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
        <h2 className='text-xl font-semibold'>Vitals</h2>
        <div className='flex gap-2'>
          <Button
            className='bg-blue-900 hover:bg-blue-800'
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Vitals
          </Button>
          <Button
            variant='outline'
            onClick={handleExportToExcel}
            disabled={vitals.length === 0}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export to Excel
          </Button>
        </div>
      </div>

      <div className='border rounded-md overflow-hidden'>
        <Table>
          <TableHeader className='bg-gray-100'>
            <TableRow>
              <TableHead>Date Record</TableHead>
              <TableHead>BP Sys</TableHead>
              <TableHead>BP Dias</TableHead>
              <TableHead>Heart Rate</TableHead>
              <TableHead>Pulse Rate</TableHead>
              <TableHead>Respiration</TableHead>
              <TableHead>Temp.</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Height</TableHead>
              <TableHead>BMI</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vitals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                  No vital records found. Click &quot;Add Vitals&quot; to add one.
                </TableCell>
              </TableRow>
            ) : (
              vitals.map((vital) => (
                <TableRow key={vital.id}>
                  <TableCell>{new Date(vital.recordDate).toLocaleDateString()}</TableCell>
                  <TableCell>{vital.bpSystolic || '—'}</TableCell>
                  <TableCell>{vital.bpDiastolic || '—'}</TableCell>
                  <TableCell>{vital.heartRate || '—'}</TableCell>
                  <TableCell>{vital.pulseRate || '—'}</TableCell>
                  <TableCell>{vital.respiration || '—'}</TableCell>
                  <TableCell>{vital.temperature || '—'}</TableCell>
                  <TableCell>{vital.weight || '—'}</TableCell>
                  <TableCell>{vital.height || '—'}</TableCell>
                  <TableCell>{vital.bmi || '—'}</TableCell>
                  <TableCell>
                    <div className='flex gap-1'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-red-600 h-8 w-8'
                        onClick={() => handleDeleteVital(vital.id)}
                        disabled={deletingId === vital.id}
                      >
                        {deletingId === vital.id ? (
                          <Loader className='h-4 w-4 animate-spin' />
                        ) : (
                          <Trash className='h-4 w-4' />
                        )}
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='text-blue-600 h-8 w-8'
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
          <span className="text-sm text-gray-500">15 items per page</span>
        </div>
        <div className='text-sm text-gray-500'>
          {vitals.length === 0 ? '0 items' : `1-${vitals.length} of ${vitals.length} items`}
        </div>
      </div>

      <AddVitalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddVital}
      />
    </div>
  );
}
