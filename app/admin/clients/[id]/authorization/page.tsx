'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Plus, Trash, Shield, Calendar } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientAuthorizations, deleteClientAuthorization, ClientAuthorization } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function AuthorizationPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [authorizations, setAuthorizations] = useState<ClientAuthorization[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, authData] = await Promise.all([
        getClientById(params.id),
        getClientAuthorizations(params.id)
      ]);
      setClient(clientData);
      setAuthorizations(authData);
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
    if (!confirm('Are you sure you want to delete this authorization?')) return;

    setDeletingId(id);
    try {
      await deleteClientAuthorization(id);
      toast({ title: 'Success', description: 'Authorization deleted' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete authorization' });
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
        <h2 className="text-xl font-semibold">Authorizations</h2>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Add Authorization
        </Button>
      </div>

      {authorizations.length === 0 ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <Shield className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-500">No Authorizations Available</p>
        </div>
      ) : (
        <div className="space-y-4">
          {authorizations.map((auth) => (
            <div key={auth.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{auth.authorizationNumber || 'N/A'}</span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(auth.status)}`}>
                      {auth.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    {auth.payerName && (
                      <div>
                        <p className="text-gray-400 text-xs">Payer</p>
                        <p>{auth.payerName}</p>
                      </div>
                    )}
                    {auth.serviceType && (
                      <div>
                        <p className="text-gray-400 text-xs">Service Type</p>
                        <p>{auth.serviceType}</p>
                      </div>
                    )}
                    {auth.startDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-orange-500" />
                        <div>
                          <p className="text-gray-400 text-xs">Start Date</p>
                          <p>{new Date(auth.startDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                    {auth.endDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-orange-500" />
                        <div>
                          <p className="text-gray-400 text-xs">End Date</p>
                          <p>{new Date(auth.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {auth.unitsAuthorized && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-sm">
                        <span>Units: {auth.unitsUsed || 0} / {auth.unitsAuthorized}</span>
                        <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(((auth.unitsUsed || 0) / auth.unitsAuthorized) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(auth.id)}
                  disabled={deletingId === auth.id}
                  className="text-red-500 hover:text-red-700"
                >
                  {deletingId === auth.id ? (
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
