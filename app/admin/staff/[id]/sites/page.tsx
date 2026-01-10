"use client";

import {
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import AdminStaffProfile from '@/components/AdminStaffProfile';
import { useStaffData } from "@/hooks/useStaffData";
import { useState, useEffect } from "react";
import { getAllClinics, getStaffSites, assignSiteToStaff, unassignSiteFromStaff } from "@/hooks/admin/staff";
import { useSnackbar } from "notistack";
import { Skeleton } from "@/components/ui/skeleton";

export default function SitesPage() {
  interface Site {
    id: string;
    name: string;
  }

  const { staff, loading, id: staffId } = useStaffData();
  const [assignedSites, setAssignedSites] = useState<Site[]>([]);
  const [availableSites, setAvailableSites] = useState<Site[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    try {
      const [assigned, all] = await Promise.all([
        getStaffSites(staffId),
        getAllClinics()
      ]);

      setAssignedSites(assigned || []);

      // Available = All - Assigned
      const assignedIds = new Set((assigned || []).map((s: Site) => s.id));
      setAvailableSites((all || []).filter((s: Site) => !assignedIds.has(s.id)));

    } catch (error) {
      console.error("Error fetching sites data:", error);
      enqueueSnackbar("Failed to fetch sites data", { variant: "error" });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (staffId && staff) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId, staff]);

  const handleAssign = async (siteId: string) => {
    try {
      await assignSiteToStaff(staffId, siteId);
      // Optimistic update
      const siteToMove = availableSites.find(s => s.id === siteId);
      if (siteToMove) {
        setAvailableSites(prev => prev.filter(s => s.id !== siteId));
        setAssignedSites(prev => [...prev, siteToMove]);
      }
      enqueueSnackbar("Site assigned successfully", { variant: "success" });
    } catch (error) {
      console.error("Error assigning site:", error);
      enqueueSnackbar("Failed to assign site", { variant: "error" });
      fetchData(); // Revert
    }
  };

  const handleUnassign = async (siteId: string) => {
    try {
      await unassignSiteFromStaff(staffId, siteId);
      // Optimistic update
      const siteToMove = assignedSites.find(s => s.id === siteId);
      if (siteToMove) {
        setAssignedSites(prev => prev.filter(s => s.id !== siteId));
        setAvailableSites(prev => [...prev, siteToMove]);
      }
      enqueueSnackbar("Site unassigned successfully", { variant: "success" });
    } catch (error) {
      console.error("Error unassigning site:", error);
      enqueueSnackbar("Failed to unassign site", { variant: "error" });
      fetchData();
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
    <div className='space-y-6'>
      <AdminStaffProfile
        name={`${staff.firstName} ${staff.lastName}`}
        email={staff.email}
        phone={staff.phone}
        site={staff.site}
      />

      <div className='space-y-4'>
        <h2 className='text-xl font-semibold'>Sites</h2>

        <div className='grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-start'>
          {/* Available Sites */}
          <div className='border rounded-md shadow-sm bg-white overflow-hidden flex flex-col h-[400px]'>
            <div className='p-3 bg-blue-600 text-white font-medium'>Available</div>
            <div className='p-2 overflow-y-auto flex-1 space-y-1'>
              {loadingData ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : availableSites.length === 0 ? (
                <div className="text-gray-400 text-center p-4 text-sm">No other sites available.</div>
              ) : (
                availableSites.map(site => (
                  <div key={site.id}
                    className="group flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 text-sm cursor-pointer"
                    onClick={() => handleAssign(site.id)}
                  >
                    <span className="truncate">{site.name}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex md:flex-col gap-2 justify-center pt-20">
            <div className="p-2 border rounded bg-white text-gray-400 cursor-default">
              <ChevronRight className="w-5 h-5 text-green-600" />
            </div>
            <div className="p-2 border rounded bg-white text-gray-400 cursor-default">
              <ChevronLeft className="w-5 h-5 text-red-500" />
            </div>
          </div>

          {/* Assigned Sites */}
          <div className='border rounded-md shadow-sm bg-white overflow-hidden flex flex-col h-[400px]'>
            <div className='p-3 bg-blue-600 text-white font-medium'>Assigned ({assignedSites.length})</div>
            <div className='p-2 overflow-y-auto flex-1 space-y-1'>
              {loadingData ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : assignedSites.length === 0 ? (
                <div className="text-gray-400 text-center p-4 text-sm">No sites assigned.</div>
              ) : (
                assignedSites.map(site => (
                  <div key={site.id} className="group flex justify-between items-center p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 text-sm">
                    <span className="truncate">{site.name}</span>
                    <button
                      onClick={() => handleUnassign(site.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 text-red-500 rounded"
                      title="Unassign"
                    >
                      <ChevronLeft className="w-4 h-4" />
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
