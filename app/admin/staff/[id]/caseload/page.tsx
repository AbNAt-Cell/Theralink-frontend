"use client";

import { Search, Loader2, ArrowRight, ArrowLeft, Pencil, FileText } from "lucide-react";
import AdminStaffProfile from "@/components/AdminStaffProfile";
import { useStaffData } from "@/hooks/useStaffData";
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getAssignedClients,
  getAvailableClients,
  assignClientToStaff,
  unassignClientFromStaff,
  updateStaffCaseloadSettings
} from "@/hooks/admin/staff";
import { useSnackbar } from "notistack";

export default function CaseloadPage() {
  const { staff, loading, id: staffId } = useStaffData();
  const [assignedClients, setAssignedClients] = useState<any[]>([]);
  const [availableClients, setAvailableClients] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  // Settings State
  const [maxCapacity, setMaxCapacity] = useState<number | null>(null);
  const [acceptingNewClients, setAcceptingNewClients] = useState(true);
  const [isEditingCapacity, setIsEditingCapacity] = useState(false);
  const [editCapacityValue, setEditCapacityValue] = useState("");

  useEffect(() => {
    if (staffId && staff) {
      fetchData();
      setMaxCapacity(staff.max_capacity ?? null);
      setAcceptingNewClients(staff.accepting_new_clients ?? true);
      setEditCapacityValue(staff.max_capacity?.toString() || "");
    }
  }, [staffId, staff]);

  const fetchData = async () => {
    try {
      const [assigned, available] = await Promise.all([
        getAssignedClients(staffId),
        getAvailableClients()
      ]);
      setAssignedClients(assigned || []);
      setAvailableClients(available || []);
    } catch (error) {
      console.error("Error fetching caseload data:", error);
      enqueueSnackbar("Failed to fetch caseload data", { variant: "error" });
    } finally {
      setLoadingData(false);
    }
  };

  const filteredAvailableClients = availableClients.filter(c =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAssign = async (clientId: string) => {
    if (maxCapacity !== null && assignedClients.length >= maxCapacity) {
      enqueueSnackbar("Maximum capacity reached!", { variant: "warning" });
      return;
    }
    try {
      await assignClientToStaff(clientId, staffId);
      // Optimistic update
      const clientToMove = availableClients.find(c => c.id === clientId);
      if (clientToMove) {
        setAvailableClients(prev => prev.filter(c => c.id !== clientId));
        setAssignedClients(prev => [...prev, clientToMove]);
      }
      enqueueSnackbar("Client assigned successfully", { variant: "success" });
    } catch (error) {
      console.error("Error assigning client:", error);
      enqueueSnackbar("Failed to assign client", { variant: "error" });
      fetchData(); // Revert on error
    }
  };

  const handleUnassign = async (clientId: string) => {
    try {
      await unassignClientFromStaff(clientId);
      // Optimistic update
      const clientToMove = assignedClients.find(c => c.id === clientId);
      if (clientToMove) {
        setAssignedClients(prev => prev.filter(c => c.id !== clientId));
        setAvailableClients(prev => [...prev, clientToMove]);
      }
      enqueueSnackbar("Client unassigned successfully", { variant: "success" });
    } catch (error) {
      console.error("Error unassigning client:", error);
      enqueueSnackbar("Failed to unassign client", { variant: "error" });
      fetchData();
    }
  };

  const handleCapacityUpdate = async () => {
    try {
      const newCapacity = editCapacityValue === "" ? null : parseInt(editCapacityValue);
      await updateStaffCaseloadSettings(staffId, { max_capacity: newCapacity });
      setMaxCapacity(newCapacity);
      setIsEditingCapacity(false);
      enqueueSnackbar("Max capacity updated", { variant: "success" });
    } catch (error) {
      console.error("Error updating capacity:", error);
      enqueueSnackbar("Failed to update capacity", { variant: "error" });
    }
  };

  const handleToggleAccepting = async (checked: boolean) => {
    try {
      setAcceptingNewClients(checked); // Optimistic toggling
      await updateStaffCaseloadSettings(staffId, { accepting_new_clients: checked });
      enqueueSnackbar(`Staff is now ${checked ? 'accepting' : 'not accepting'} new clients`, { variant: "success" });
    } catch (error) {
      console.error("Error updating status:", error);
      setAcceptingNewClients(!checked); // Revert
      enqueueSnackbar("Failed to update status", { variant: "error" });
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-3 text-lg font-medium text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!staff) {
    return <div>Staff member not found.</div>;
  }

  return (
    <div className="space-y-6">
      <AdminStaffProfile
        name={`${staff.firstName} ${staff.lastName}`}
        email={staff.email}
        phone={staff.phone}
        site={staff.site}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Caseload</h2>
        <Button variant="outline" size="icon">
          <FileText className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-sky-50 border border-sky-100 rounded-md p-4 text-sm text-sky-900">
        Caseload capacity limits the maximum number of clients that can be assigned to a staff member, helping to manage workload distribution and prevent over-assignment. Staff can also be marked as not accepting new clients to temporarily prevent new assignments.
      </div>

      <div className="grid gap-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-medium">Max Capacity:</span>
          <span>{maxCapacity === null ? "Unlimited" : maxCapacity}</span>

          <Dialog open={isEditingCapacity} onOpenChange={setIsEditingCapacity}>
            <DialogTrigger asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <Pencil className="w-3 h-3" />
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Max Capacity</DialogTitle>
                <DialogDescription>
                  Set the maximum number of clients this staff member can handle. Leave blank for unlimited.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  type="number"
                  placeholder="Unlimited"
                  value={editCapacityValue}
                  onChange={(e) => setEditCapacityValue(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button onClick={handleCapacityUpdate}>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">Open for New Clients:</span>
          <Switch
            checked={acceptingNewClients}
            onCheckedChange={handleToggleAccepting}
          />
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="font-medium">Current Caseload:</span>
          <span className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded">
            {assignedClients.length}/{maxCapacity === null ? "Unlimited Capacity" : maxCapacity}
          </span>
        </div>
      </div>


      <div className="space-y-4 pt-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search Available Clients"
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start">
          {/* Available Clients */}
          <div className="border rounded-md shadow-sm bg-white overflow-hidden flex flex-col h-[400px]">
            <div className="p-3 bg-blue-600 text-white font-medium">Available</div>
            <div className="p-2 overflow-y-auto flex-1 space-y-1">
              {loadingData ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : filteredAvailableClients.length === 0 ? (
                <div className="text-gray-400 text-center p-4 text-sm">No available clients found.</div>
              ) : (
                filteredAvailableClients.map(client => (
                  <div key={client.id}
                    className="group flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 text-sm cursor-pointer"
                    onClick={() => handleAssign(client.id)}
                  >
                    <span className="truncate">{client.first_name} {client.last_name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex md:flex-col gap-2 justify-center pt-20">
            <div className="p-2 border rounded bg-white text-gray-400 cursor-default">
              <ArrowRight className="w-5 h-5 text-green-600" />
            </div>
            <div className="p-2 border rounded bg-white text-gray-400 cursor-default">
              <ArrowLeft className="w-5 h-5 text-red-500" />
            </div>
          </div>

          {/* Assigned Clients */}
          <div className="border rounded-md shadow-sm bg-white overflow-hidden flex flex-col h-[400px]">
            <div className="p-3 bg-blue-600 text-white font-medium">Assigned ({assignedClients.length})</div>
            <div className="p-2 overflow-y-auto flex-1 space-y-1">
              {loadingData ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : assignedClients.length === 0 ? (
                <div className="text-gray-400 text-center p-4 text-sm">No clients assigned.</div>
              ) : (
                assignedClients.map(client => (
                  <div key={client.id} className="group flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 text-sm">
                    <span className="truncate">{client.first_name} {client.last_name}</span>
                    <button
                      onClick={() => handleUnassign(client.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-red-500 rounded"
                      title="Unassign"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
