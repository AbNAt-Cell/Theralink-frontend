'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Plus, Trash, Pill, ChevronDown, ChevronUp } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientMedications, deleteClientMedication, ClientMedication } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface PageProps {
  params: { id: string };
}

export default function MedicationManagementPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [activeMeds, setActiveMeds] = useState<ClientMedication[]>([]);
  const [historicMeds, setHistoricMeds] = useState<ClientMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notesOpen, setNotesOpen] = useState(false);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, allMeds] = await Promise.all([
        getClientById(params.id),
        getClientMedications(params.id)
      ]);
      setClient(clientData);
      setActiveMeds(allMeds.filter(m => m.status === 'active'));
      setHistoricMeds(allMeds.filter(m => m.status !== 'active'));
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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this medication?')) return;

    setDeletingId(id);
    try {
      await deleteClientMedication(id);
      toast({ title: 'Success', description: 'Medication deleted' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete medication' });
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const MedicationCard = ({ med }: { med: ClientMedication }) => (
    <div className="border rounded-lg p-4 bg-white flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Pill className="w-4 h-4 text-blue-500" />
          <span className="font-medium">{med.medicationName}</span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          {med.dosage && <p><strong>Dosage:</strong> {med.dosage}</p>}
          {med.frequency && <p><strong>Frequency:</strong> {med.frequency}</p>}
          {med.route && <p><strong>Route:</strong> {med.route}</p>}
          {med.prescriber && <p><strong>Prescriber:</strong> {med.prescriber}</p>}
          {med.startDate && <p><strong>Start Date:</strong> {new Date(med.startDate).toLocaleDateString()}</p>}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDelete(med.id)}
        disabled={deletingId === med.id}
        className="text-red-500 hover:text-red-700"
      >
        {deletingId === med.id ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Trash className="w-4 h-4" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="space-y-8">
      <AdminClientProfile client={client} />

      {/* Current Medications Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Current Medications</h2>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Current Medication
        </Button>
      </div>

      {activeMeds.length === 0 ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <Pill className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500">No Current Medications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeMeds.map(med => <MedicationCard key={med.id} med={med} />)}
        </div>
      )}

      {/* Medication Notes Section */}
      <Collapsible open={notesOpen} onOpenChange={setNotesOpen} className="border rounded-md bg-gray-100">
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left font-medium">
          Medication Notes
          {notesOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 bg-white border-t">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="text-blue-500 border-blue-500">
              Edit
            </Button>
          </div>
          <p className="text-gray-500 text-sm mt-2">No medication notes available.</p>
        </CollapsibleContent>
      </Collapsible>

      {/* Historic Medications Section */}
      <h2 className="text-xl font-semibold">Other/Historic Medications</h2>

      {historicMeds.length === 0 ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-16 h-16 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <Pill className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500">No Other/Historic Medications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {historicMeds.map(med => <MedicationCard key={med.id} med={med} />)}
        </div>
      )}
    </div>
  );
}
