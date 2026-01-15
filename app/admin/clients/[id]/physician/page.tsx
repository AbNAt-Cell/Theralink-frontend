'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Plus, Trash, Stethoscope, Phone, Mail, Star, Edit } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientPhysicians, deleteClientPhysician, addClientPhysician, ClientPhysician } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';
import AddPhysicianModal, { PhysicianFormData } from '@/components/modals/AddPhysicianModal';

interface PageProps {
  params: { id: string };
}

export default function PhysicianPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [physicians, setPhysicians] = useState<ClientPhysician[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, physData] = await Promise.all([
        getClientById(params.id),
        getClientPhysicians(params.id)
      ]);
      setClient(clientData);
      setPhysicians(physData);
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
    if (!confirm('Are you sure you want to remove this physician?')) return;

    setDeletingId(id);
    try {
      await deleteClientPhysician(id);
      toast({ title: 'Success', description: 'Physician removed' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove physician' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddPhysician = async (data: PhysicianFormData) => {
    try {
      await addClientPhysician({
        clientId: params.id,
        physicianName: `${data.firstName} ${data.lastName}`,
        phone: data.phone,
        address: data.address,
        notes: data.comment,
        isPrimary: physicians.length === 0 // First physician is primary
      });
      toast({ title: 'Success', description: 'Physician added' });
      loadData();
    } catch (error) {
      console.error('Error adding physician:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add physician' });
      throw error;
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
        <h2 className="text-xl font-semibold">Physicians</h2>
        <Button
          className="bg-blue-900 hover:bg-blue-800"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Physician
        </Button>
      </div>

      {physicians.length === 0 ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <Stethoscope className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-500">No Physicians Added</p>
          <p className="text-gray-400 text-sm mt-1">Click &quot;Add Physician&quot; to add a physician</p>
        </div>
      ) : (
        <div className="space-y-4">
          {physicians.map((phys) => (
            <div key={phys.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{phys.physicianName}</span>
                      {phys.isPrimary && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    {phys.specialty && (
                      <p className="text-sm text-gray-500">{phys.specialty}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      {phys.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {phys.phone}
                        </div>
                      )}
                      {phys.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {phys.email}
                        </div>
                      )}
                    </div>
                    {phys.address && (
                      <p className="text-sm text-gray-500 mt-2">{phys.address}</p>
                    )}
                    {phys.notes && (
                      <p className="text-sm text-gray-400 mt-1 italic">{phys.notes}</p>
                    )}
                    {phys.npi && (
                      <p className="text-xs text-gray-400 mt-1">NPI: {phys.npi}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(phys.id)}
                    disabled={deletingId === phys.id}
                    className="text-red-500 hover:text-red-700"
                  >
                    {deletingId === phys.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Physician Modal */}
      <AddPhysicianModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPhysician}
      />
    </div>
  );
}
