'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Loader, Search, ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft, FileText, CheckCircle } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import {
  getAssignedStaff,
  getAvailableStaff,
  assignStaffToClient,
  removeAssignedStaff,
  AssignedStaff,
  AvailableStaff
} from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function AssignedStaffPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [availableStaff, setAvailableStaff] = useState<AvailableStaff[]>([]);
  const [assignedStaff, setAssignedStaff] = useState<AssignedStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Filters and selections
  const [searchQuery, setSearchQuery] = useState('');
  const [showAcceptingOnly, setShowAcceptingOnly] = useState(false);
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [selectedAssigned, setSelectedAssigned] = useState<string[]>([]);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, availableData, assignedData] = await Promise.all([
        getClientById(params.id),
        getAvailableStaff(),
        getAssignedStaff(params.id)
      ]);
      setClient(clientData);
      setAvailableStaff(availableData);
      setAssignedStaff(assignedData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load staff data' });
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter available staff (exclude already assigned)
  const filteredAvailable = useMemo(() => {
    const assignedIds = new Set(assignedStaff.map(s => s.staffId));

    return availableStaff
      .filter(staff => !assignedIds.has(staff.id))
      .filter(staff => {
        if (showAcceptingOnly && !staff.isAcceptingNewClients) return false;
        if (!searchQuery) return true;

        const fullName = `${staff.firstName || ''} ${staff.lastName || ''}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      });
  }, [availableStaff, assignedStaff, searchQuery, showAcceptingOnly]);

  const handleAssignSelected = async () => {
    if (selectedAvailable.length === 0) return;

    setProcessing(true);
    try {
      for (const staffId of selectedAvailable) {
        await assignStaffToClient(params.id, staffId);
      }
      toast({ title: 'Success', description: `${selectedAvailable.length} staff member(s) assigned` });
      setSelectedAvailable([]);
      await loadData();
    } catch (error) {
      console.error('Error assigning staff:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to assign staff' });
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedAssigned.length === 0) return;

    setProcessing(true);
    try {
      for (const staffId of selectedAssigned) {
        await removeAssignedStaff(params.id, staffId);
      }
      toast({ title: 'Success', description: `${selectedAssigned.length} staff member(s) removed` });
      setSelectedAssigned([]);
      await loadData();
    } catch (error) {
      console.error('Error removing staff:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove staff' });
    } finally {
      setProcessing(false);
    }
  };

  const handleAssignAll = async () => {
    if (filteredAvailable.length === 0) return;

    setProcessing(true);
    try {
      for (const staff of filteredAvailable) {
        await assignStaffToClient(params.id, staff.id);
      }
      toast({ title: 'Success', description: `${filteredAvailable.length} staff member(s) assigned` });
      setSelectedAvailable([]);
      await loadData();
    } catch (error) {
      console.error('Error assigning staff:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to assign staff' });
    } finally {
      setProcessing(false);
    }
  };

  const handleRemoveAll = async () => {
    if (assignedStaff.length === 0) return;

    setProcessing(true);
    try {
      for (const staff of assignedStaff) {
        await removeAssignedStaff(params.id, staff.staffId);
      }
      toast({ title: 'Success', description: `${assignedStaff.length} staff member(s) removed` });
      setSelectedAssigned([]);
      await loadData();
    } catch (error) {
      console.error('Error removing staff:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove staff' });
    } finally {
      setProcessing(false);
    }
  };

  const toggleAvailableSelection = (staffId: string) => {
    setSelectedAvailable(prev =>
      prev.includes(staffId) ? prev.filter(id => id !== staffId) : [...prev, staffId]
    );
  };

  const toggleAssignedSelection = (staffId: string) => {
    setSelectedAssigned(prev =>
      prev.includes(staffId) ? prev.filter(id => id !== staffId) : [...prev, staffId]
    );
  };

  const formatCaseload = (current?: number, max?: number) => {
    if (current === undefined) return '';
    return `(${current}/${max ?? 'Unlimited'})`;
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
        <h2 className="text-xl font-semibold">Clients Staff</h2>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Caseload History
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search Available Staff"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={showAcceptingOnly}
            onCheckedChange={setShowAcceptingOnly}
          />
          <span className="text-sm">Show staff accepting new clients</span>
        </div>
      </div>

      {/* Dual Listbox */}
      <div className="flex gap-4 items-stretch">
        {/* Available Staff List */}
        <div className="flex-1 border rounded-lg bg-white overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b font-medium">
            Available Staff
          </div>
          <div className="h-[400px] overflow-y-auto p-2">
            {filteredAvailable.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No available staff</p>
            ) : (
              filteredAvailable.map(staff => (
                <div
                  key={staff.id}
                  onClick={() => toggleAvailableSelection(staff.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors ${selectedAvailable.includes(staff.id) ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                >
                  {staff.isAcceptingNewClients && (
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                  <span className="flex-1">
                    {staff.lastName}, {staff.firstName} ({staff.role || 'NA'}) {formatCaseload(staff.caseloadCurrent, staff.caseloadMax)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Transfer Buttons */}
        <div className="flex flex-col justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAssignSelected}
            disabled={processing || selectedAvailable.length === 0}
            className="px-3"
          >
            {processing ? <Loader className="w-4 h-4 animate-spin" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveSelected}
            disabled={processing || selectedAssigned.length === 0}
            className="px-3"
          >
            {processing ? <Loader className="w-4 h-4 animate-spin" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAssignAll}
            disabled={processing || filteredAvailable.length === 0}
            className="px-3"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveAll}
            disabled={processing || assignedStaff.length === 0}
            className="px-3"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
        </div>

        {/* Assigned Staff List */}
        <div className="flex-1 border rounded-lg bg-white overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b font-medium">
            Assigned Staff
          </div>
          <div className="h-[400px] overflow-y-auto p-2">
            {assignedStaff.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No staff assigned</p>
            ) : (
              assignedStaff.map(staff => (
                <div
                  key={staff.id}
                  onClick={() => toggleAssignedSelection(staff.staffId)}
                  className={`flex items-center gap-2 px-3 py-2 rounded cursor-pointer transition-colors ${selectedAssigned.includes(staff.staffId) ? 'bg-blue-100' : 'hover:bg-gray-100'
                    }`}
                >
                  {staff.isPrimary && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Primary</span>
                  )}
                  <span className="flex-1">
                    {staff.staffName || 'Unknown'} ({staff.role || 'NA'})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
