'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Plus, Trash, Syringe, Calendar } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientImmunizations, deleteClientImmunization, ClientImmunization } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function ImmunizationPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [immunizations, setImmunizations] = useState<ClientImmunization[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, immData] = await Promise.all([
        getClientById(params.id),
        getClientImmunizations(params.id)
      ]);
      setClient(clientData);
      setImmunizations(immData);
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
    if (!confirm('Are you sure you want to delete this immunization record?')) return;

    setDeletingId(id);
    try {
      await deleteClientImmunization(id);
      toast({ title: 'Success', description: 'Immunization deleted' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete immunization' });
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

  return (
    <div className="space-y-6">
      <AdminClientProfile client={client} />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Immunizations</h2>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Immunization
        </Button>
      </div>

      {immunizations.length === 0 ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <Syringe className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-500">No Immunization Records</p>
          <p className="text-gray-400 text-sm mt-1">Click &quot;Add Immunization&quot; to record a vaccination</p>
        </div>
      ) : (
        <div className="border rounded-lg bg-white overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Vaccine</th>
                <th className="text-left p-4 font-medium text-gray-600">Date Given</th>
                <th className="text-left p-4 font-medium text-gray-600">Site</th>
                <th className="text-left p-4 font-medium text-gray-600">Lot Number</th>
                <th className="text-left p-4 font-medium text-gray-600">Next Due</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {immunizations.map((imm) => (
                <tr key={imm.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Syringe className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{imm.vaccineName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {imm.administrationDate ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(imm.administrationDate).toLocaleDateString()}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-4 text-gray-600">{imm.site || '-'}</td>
                  <td className="p-4 text-gray-600">{imm.lotNumber || '-'}</td>
                  <td className="p-4">
                    {imm.nextDueDate ? (
                      <span className={`flex items-center gap-1 ${new Date(imm.nextDueDate) < new Date() ? 'text-red-500' : 'text-gray-600'}`}>
                        <Calendar className="w-4 h-4" />
                        {new Date(imm.nextDueDate).toLocaleDateString()}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(imm.id)}
                        disabled={deletingId === imm.id}
                        className="text-red-500 hover:text-red-700"
                      >
                        {deletingId === imm.id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
