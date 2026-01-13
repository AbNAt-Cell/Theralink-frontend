'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Plus, Trash, Users, Star } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getAssignedStaff, deleteAssignedStaff, AssignedStaff } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function AssignedStaffPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [staff, setStaff] = useState<AssignedStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, staffData] = await Promise.all([
        getClientById(params.id),
        getAssignedStaff(params.id)
      ]);
      setClient(clientData);
      setStaff(staffData);
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
    if (!confirm('Are you sure you want to remove this staff assignment?')) return;

    setDeletingId(id);
    try {
      await deleteAssignedStaff(id);
      toast({ title: 'Success', description: 'Staff assignment removed' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove staff assignment' });
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
        <h2 className="text-xl font-semibold">Assigned Staff</h2>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Assign Staff
        </Button>
      </div>

      {staff.length === 0 ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <Users className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-500">No Staff Assigned</p>
          <p className="text-gray-400 text-sm mt-1">Click &quot;Assign Staff&quot; to add staff members</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s) => (
            <div key={s.id} className="border rounded-lg p-4 bg-white relative">
              {s.isPrimary && (
                <div className="absolute top-2 right-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                </div>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{s.staffName || 'Unknown Staff'}</p>
                  {s.role && (
                    <p className="text-sm text-gray-500 capitalize">{s.role}</p>
                  )}
                </div>
              </div>
              {s.staffEmail && (
                <p className="text-sm text-gray-600 mb-2">{s.staffEmail}</p>
              )}
              <div className="flex justify-between items-center mt-3 pt-3 border-t">
                <div className="text-xs text-gray-500">
                  {s.startDate && `Since ${new Date(s.startDate).toLocaleDateString()}`}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(s.id)}
                  disabled={deletingId === s.id}
                  className="text-red-500 hover:text-red-700"
                >
                  {deletingId === s.id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
