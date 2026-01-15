'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader, Plus, Trash, Edit, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X, Check } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientImmunizations, deleteClientImmunization, addClientImmunization, ClientImmunization } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';
import AddImmunizationModal, { ImmunizationFormData } from '@/components/modals/AddImmunizationModal';

interface PageProps {
  params: { id: string };
}

export default function ImmunizationPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [immunizations, setImmunizations] = useState<ClientImmunization[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedImmunization, setSelectedImmunization] = useState<ClientImmunization | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  const handleAddImmunization = async (data: ImmunizationFormData) => {
    try {
      await addClientImmunization({
        clientId: params.id,
        vaccineName: data.immunization,
        administrationDate: data.dateAdministered || undefined,
        administeredBy: data.administrationedBy || undefined,
        expirationDate: data.dateExpiration || undefined,
        amountMl: data.amountAdministered || undefined,
        manufacturer: data.manufacturer || undefined,
        lotNumber: data.lotNumber || undefined,
        site: data.administrationSite || undefined,
        route: data.administrationRoute || undefined,
        isRejected: data.isRejected,
        rejectedReason: data.rejectedReason || undefined,
        notes: data.comments || undefined
      });
      toast({ title: 'Success', description: 'Immunization added' });
      loadData();
    } catch (error) {
      console.error('Error adding immunization:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add immunization' });
      throw error;
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(immunizations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedImmunizations = immunizations.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Detail View
  if (selectedImmunization) {
    return (
      <div className="space-y-6">
        <AdminClientProfile client={client} />

        <div className="border rounded-lg bg-white p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-blue-800">Immune Details</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setSelectedImmunization(null)}
              >
                Back
              </Button>
              <Button className="bg-blue-900 hover:bg-blue-800">
                Edit
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-16 gap-y-4">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="flex">
                <span className="text-amber-600 w-48">Immunization</span>
                <span className="font-medium">{selectedImmunization.vaccineName}</span>
              </div>
              <div className="flex">
                <span className="text-amber-600 w-48">Date Administered</span>
                <span>{selectedImmunization.administrationDate
                  ? new Date(selectedImmunization.administrationDate).toLocaleDateString()
                  : '-'}</span>
              </div>
              <div className="flex">
                <span className="text-amber-600 w-48">Administered By</span>
                <span>{selectedImmunization.administeredBy || '-'}</span>
              </div>
              <div className="flex">
                <span className="text-amber-600 w-48">Amount Administered</span>
                <span>{selectedImmunization.amountMl || '-'}</span>
              </div>
              <div className="flex">
                <span className="text-amber-600 w-48">Manufacturer</span>
                <span>{selectedImmunization.manufacturer || '-'}</span>
              </div>
              <div className="flex">
                <span className="text-amber-600 w-48">Date Expiration</span>
                <span>{selectedImmunization.expirationDate
                  ? new Date(selectedImmunization.expirationDate).toLocaleDateString()
                  : '-'}</span>
              </div>
              <div className="flex">
                <span className="text-amber-600 w-48">Lot Number</span>
                <span>{selectedImmunization.lotNumber || '-'}</span>
              </div>
              <div className="flex">
                <span className="text-amber-600 w-48">Administration Site</span>
                <span>{selectedImmunization.site || '-'}</span>
              </div>
              <div className="flex">
                <span className="text-amber-600 w-48">Administration Route</span>
                <span>{selectedImmunization.route || '-'}</span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="flex">
                <span className="text-amber-600 w-48">Rejected</span>
                <span>
                  {selectedImmunization.isRejected ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full">
                      <X className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full">
                      <Check className="w-4 h-4 text-gray-500" />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex">
                <span className="text-amber-600 w-48">Rejected Reason</span>
                <span>{selectedImmunization.rejectedReason || '-'}</span>
              </div>
              <div className="flex">
                <span className="text-amber-600 w-48">Comments</span>
                <span>{selectedImmunization.notes || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-6">
      <AdminClientProfile client={client} />

      <div className="border rounded-lg bg-white overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-blue-800">Immunization</h2>
          <Button
            className="bg-blue-900 hover:bg-blue-800"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Immunization
          </Button>
        </div>

        {immunizations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No immunization records found
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="text-left p-4 font-medium">Immunization</th>
                  <th className="text-left p-4 font-medium">Date Administered</th>
                  <th className="text-left p-4 font-medium">Amount Administered (mL)</th>
                  <th className="text-left p-4 font-medium">Administration Site</th>
                  <th className="text-left p-4 font-medium">Rejected</th>
                  <th className="text-center p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedImmunizations.map((imm) => (
                  <tr key={imm.id} className="border-b last:border-b-0 hover:bg-gray-50">
                    <td className="p-4">{imm.vaccineName}</td>
                    <td className="p-4">
                      {imm.administrationDate
                        ? new Date(imm.administrationDate).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="p-4">{imm.amountMl || '-'}</td>
                    <td className="p-4">{imm.site || '-'}</td>
                    <td className="p-4">
                      {imm.isRejected ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-red-500 text-white rounded-full">
                          <X className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full">
                          <Check className="w-4 h-4 text-gray-500" />
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(imm.id)}
                          disabled={deletingId === imm.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingId === imm.id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedImmunization(imm)}
                          className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-3 py-1 bg-blue-900 text-white rounded">{currentPage}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronsRight className="w-4 h-4" />
                </Button>
                <Select value={String(itemsPerPage)} onValueChange={(v) => {
                  setItemsPerPage(Number(v));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm text-gray-500">items per page</span>
              </div>
              <span className="text-sm text-gray-500">
                {startIndex + 1} - {Math.min(endIndex, immunizations.length)} of {immunizations.length} items
              </span>
            </div>
          </>
        )}
      </div>

      {/* Add Immunization Modal */}
      <AddImmunizationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddImmunization}
      />
    </div>
  );
}
