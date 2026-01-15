'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Edit, LogOut, Calendar, FileText, AlertTriangle, Plus, Printer } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientDischarge, upsertClientDischarge, ClientDischarge } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';
import AddDischargeModal, { DischargeFormData } from '@/components/modals/AddDischargeModal';

interface PageProps {
  params: { id: string };
}

export default function DischargePage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [discharge, setDischarge] = useState<ClientDischarge | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

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

  const handleAddDischarge = async (data: DischargeFormData) => {
    try {
      await upsertClientDischarge({
        clientId: params.id,
        dischargeDate: data.dischargeDate || undefined,
        dischargeType: data.clientStatus || undefined,
        dischargeReason: data.reasonOfDischarge || undefined,
        dischargeSummary: data.dischargeSummary || undefined,
        referrals: data.linkDocument || undefined,
        status: data.deactivateClient ? 'discharged' : 'planned'
      });
      toast({ title: 'Success', description: 'Discharge information saved' });
      loadData();
    } catch (error) {
      console.error('Error saving discharge:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save discharge' });
      throw error;
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Discharge Summary - ${client?.firstName} ${client?.lastName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e3a5f; border-bottom: 2px solid #1e3a5f; padding-bottom: 10px; }
            h2 { color: #1e3a5f; margin-top: 20px; }
            .client-info { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .label { color: #666; font-size: 12px; }
            .value { font-weight: bold; margin-top: 5px; }
            .status { display: inline-block; padding: 5px 15px; border-radius: 4px; }
            .status-discharged { background: #fee2e2; color: #dc2626; }
            .status-planned { background: #dcfce7; color: #16a34a; }
            @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          <h1>Discharge Summary</h1>
          <div class="client-info">
            <strong>Client:</strong> ${client?.firstName} ${client?.lastName}<br/>
            <strong>Date of Birth:</strong> ${client?.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : 'N/A'}<br/>
            <strong>Client ID:</strong> ${params.id}
          </div>
          ${discharge ? `
            <div class="section">
              <h2>Discharge Status</h2>
              <span class="status ${discharge.status === 'discharged' ? 'status-discharged' : 'status-planned'}">${discharge.status}</span>
              ${discharge.dischargeDate ? `<p><span class="label">Discharge Date:</span><br/><span class="value">${new Date(discharge.dischargeDate).toLocaleDateString()}</span></p>` : ''}
              ${discharge.dischargeType ? `<p><span class="label">Discharge Type:</span><br/><span class="value">${discharge.dischargeType}</span></p>` : ''}
              ${discharge.dischargeReason ? `<p><span class="label">Reason:</span><br/><span class="value">${discharge.dischargeReason}</span></p>` : ''}
            </div>
            ${discharge.dischargeSummary ? `
              <div class="section">
                <h2>Discharge Summary</h2>
                <p>${discharge.dischargeSummary}</p>
              </div>
            ` : ''}
            ${discharge.followUpPlan ? `
              <div class="section">
                <h2>Follow-up Plan</h2>
                <p>${discharge.followUpPlan}</p>
              </div>
            ` : ''}
            ${discharge.referrals ? `
              <div class="section">
                <h2>Referrals</h2>
                <p>${discharge.referrals}</p>
              </div>
            ` : ''}
          ` : '<p>No discharge information available.</p>'}
          <p style="margin-top: 40px; color: #666; font-size: 12px;">
            Printed on: ${new Date().toLocaleString()}
          </p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

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
        <div className="flex gap-2">
          {discharge && (
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          )}
          <Button
            className="bg-blue-900 hover:bg-blue-800"
            onClick={() => setIsAddModalOpen(true)}
          >
            {discharge ? (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit Discharge
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Create Discharge Plan
              </>
            )}
          </Button>
        </div>
      </div>

      <div ref={printRef}>
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
                  <span className="font-medium">Referrals / Linked Documents</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{discharge.referrals}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Discharge Modal */}
      <AddDischargeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddDischarge}
      />
    </div>
  );
}
