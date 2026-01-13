'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Plus, Shield, CheckCircle, XCircle, Clock } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientEligibility, ClientEligibility } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function EligibilityPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [eligibility, setEligibility] = useState<ClientEligibility[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, eligData] = await Promise.all([
        getClientById(params.id),
        getClientEligibility(params.id)
      ]);
      setClient(clientData);
      setEligibility(eligData);
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

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'eligible': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'ineligible': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      default: return <Shield className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'eligible': return 'bg-green-100 text-green-700';
      case 'ineligible': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
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
        <h2 className="text-xl font-semibold">Eligibility Verification</h2>
        <Button className="bg-blue-900 hover:bg-blue-800">
          <Plus className="w-4 h-4 mr-2" />
          Check Eligibility
        </Button>
      </div>

      {eligibility.length === 0 ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <Shield className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-500">No Eligibility Records Available</p>
          <p className="text-gray-400 text-sm mt-1">Click &quot;Check Eligibility&quot; to verify insurance coverage</p>
        </div>
      ) : (
        <div className="space-y-4">
          {eligibility.map((elig) => (
            <div key={elig.id} className="border rounded-lg p-4 bg-white">
              <div className="flex items-start gap-4">
                {getStatusIcon(elig.eligibilityStatus)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{elig.payerName || 'Unknown Payer'}</span>
                    <span className={`text-xs px-2 py-1 rounded capitalize ${getStatusColor(elig.eligibilityStatus)}`}>
                      {elig.eligibilityStatus || 'Unknown'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {elig.policyNumber && (
                      <div>
                        <p className="text-gray-400 text-xs">Policy Number</p>
                        <p>{elig.policyNumber}</p>
                      </div>
                    )}
                    {elig.groupNumber && (
                      <div>
                        <p className="text-gray-400 text-xs">Group Number</p>
                        <p>{elig.groupNumber}</p>
                      </div>
                    )}
                    {elig.coverageStart && (
                      <div>
                        <p className="text-gray-400 text-xs">Coverage Start</p>
                        <p>{new Date(elig.coverageStart).toLocaleDateString()}</p>
                      </div>
                    )}
                    {elig.coverageEnd && (
                      <div>
                        <p className="text-gray-400 text-xs">Coverage End</p>
                        <p>{new Date(elig.coverageEnd).toLocaleDateString()}</p>
                      </div>
                    )}
                    {elig.copay !== undefined && (
                      <div>
                        <p className="text-gray-400 text-xs">Copay</p>
                        <p>${elig.copay.toFixed(2)}</p>
                      </div>
                    )}
                    {elig.deductible !== undefined && (
                      <div>
                        <p className="text-gray-400 text-xs">Deductible</p>
                        <p>${elig.deductible.toFixed(2)}</p>
                      </div>
                    )}
                    {elig.deductibleMet !== undefined && (
                      <div>
                        <p className="text-gray-400 text-xs">Deductible Met</p>
                        <p>${elig.deductibleMet.toFixed(2)}</p>
                      </div>
                    )}
                    {elig.verificationDate && (
                      <div>
                        <p className="text-gray-400 text-xs">Verified On</p>
                        <p>{new Date(elig.verificationDate).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
