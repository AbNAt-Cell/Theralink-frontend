'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Edit, LogOut, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientDischarge, ClientDischarge } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function DischargePage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [discharge, setDischarge] = useState<ClientDischarge | null>(null);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, dischargeData] = await Promise.all([
        getClientById(params.id),
        getClientDischarge(params.id)
      ]);
      setClient(clientData);
      setDischarge(dischargeData);
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

  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'planned': return 'bg-green-100 text-green-700';
      case 'unplanned': return 'bg-yellow-100 text-yellow-700';
      case 'against advice': return 'bg-red-100 text-red-700';
      case 'transferred': return 'bg-blue-100 text-blue-700';
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
        <h2 className="text-xl font-semibold">Discharge Planning</h2>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Edit className="w-4 h-4 mr-2" />
          {discharge ? 'Edit Discharge' : 'Create Discharge Plan'}
        </Button>
      </div>

      {!discharge ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <LogOut className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-500">No Discharge Information</p>
          <p className="text-gray-400 text-sm mt-1">Click &quot;Create Discharge Plan&quot; to set up discharge planning</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Card */}
          <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <LogOut className="w-5 h-5 text-blue-500" />
                <span className="font-medium text-lg">Discharge Status</span>
              </div>
              <span className={`text-sm px-3 py-1 rounded capitalize ${discharge.status === 'discharged' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {discharge.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {discharge.dischargeDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-400">Discharge Date</p>
                    <p className="font-medium">{new Date(discharge.dischargeDate).toLocaleDateString()}</p>
                  </div>
                </div>
              )}
              {discharge.dischargeType && (
                <div>
                  <p className="text-xs text-gray-400">Discharge Type</p>
                  <span className={`text-sm px-2 py-1 rounded capitalize ${getTypeColor(discharge.dischargeType)}`}>
                    {discharge.dischargeType}
                  </span>
                </div>
              )}
              {discharge.dischargeReason && (
                <div>
                  <p className="text-xs text-gray-400">Reason</p>
                  <p className="font-medium">{discharge.dischargeReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          {discharge.dischargeSummary && (
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Discharge Summary</span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{discharge.dischargeSummary}</p>
            </div>
          )}

          {/* Follow-up Plan */}
          {discharge.followUpPlan && (
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                <span className="font-medium">Follow-up Plan</span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{discharge.followUpPlan}</p>
            </div>
          )}

          {/* Referrals */}
          {discharge.referrals && (
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-5 h-5 text-green-500" />
                <span className="font-medium">Referrals</span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{discharge.referrals}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
