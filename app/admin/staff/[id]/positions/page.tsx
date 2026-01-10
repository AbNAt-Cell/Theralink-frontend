"use client";

import AdminStaffProfile from "@/components/AdminStaffProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useStaffData } from "@/hooks/useStaffData";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, PenSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { getStaffCredentials, addStaffCredential, deleteStaffCredential } from "@/hooks/admin/staff";
import { useSnackbar } from "notistack";
import { format } from "date-fns";

export default function PositionsPage() {
  interface Credential {
    id: string;
    name: string;
    effective_date?: string;
    expiration_date?: string;
  }

  const { staff, loading } = useStaffData();
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [newCredential, setNewCredential] = useState({
    name: "",
    effectiveDate: "",
    expirationDate: "",
  });
  const { enqueueSnackbar } = useSnackbar();
  const [adding, setAdding] = useState(false);

  const loadCredentials = async () => {
    try {
      if (!staff?.id) return;
      const data = await getStaffCredentials(staff.id);
      setCredentials(data || []);
    } catch (error) {
      console.error("Error loading credentials:", error);
    }
  };

  useEffect(() => {
    if (staff?.id) {
      loadCredentials();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staff?.id]);

  const handleAddCredential = async () => {
    if (!newCredential.name) {
      enqueueSnackbar("Please enter a credential name", { variant: "warning" });
      return;
    }
    try {
      setAdding(true);
      await addStaffCredential({
        staff_id: staff!.id,
        name: newCredential.name,
        effective_date: newCredential.effectiveDate || undefined,
        expiration_date: newCredential.expirationDate || undefined
      });
      setNewCredential({ name: "", effectiveDate: "", expirationDate: "" });
      await loadCredentials();
      enqueueSnackbar("Credential added successfully", { variant: "success" });
    } catch (error) {
      console.error("Error adding credential:", error);
      enqueueSnackbar("Failed to add credential", { variant: "error" });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCredential = async (id: string) => {
    if (!confirm("Are you sure you want to delete this credential?")) return;
    try {
      await deleteStaffCredential(id);
      setCredentials(prev => prev.filter(c => c.id !== id));
      enqueueSnackbar("Credential deleted", { variant: "success" });
    } catch (error) {
      console.error("Error deleting credential:", error);
      enqueueSnackbar("Failed to delete credential", { variant: "error" });
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

      <div className="bg-white rounded-lg border p-6">
        <Tabs defaultValue="position" className="w-full">
          <TabsList className="mb-6 bg-transparent border-b w-full justify-start rounded-none h-auto p-0">
            <TabsTrigger
              value="position"
              className="data-[state=active]:bg-transparent data-[state=active]:text-blue-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-900 rounded-none px-6 py-2"
            >
              Staff Position
            </TabsTrigger>
            <TabsTrigger
              value="credentials"
              className="data-[state=active]:bg-transparent data-[state=active]:text-blue-900 data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-900 rounded-none px-6 py-2"
            >
              Staff Credentials
            </TabsTrigger>
          </TabsList>

          <TabsContent value="position">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Add New Position</h2>
              <div className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <label htmlFor="position-name" className="text-sm font-medium">
                    Position Name
                  </label>
                  <Input id="position-name" className="w-full" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="effective-date" className="text-sm font-medium">
                    Effective Date
                  </label>
                  <div className="relative w-full">
                    <Input id="effective-date" type="date" className="w-full" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="end-date" className="text-sm font-medium">
                    End Date
                  </label>
                  <div className="relative w-full">
                    <Input id="end-date" type="date" className="w-full" />
                  </div>
                </div>

                <Button className="bg-blue-900 hover:bg-blue-800 mt-4">Add Position</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="credentials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* List */}
              <div>
                <h3 className="text-lg font-medium text-gray-600 mb-4">Credentials</h3>
                <div className="space-y-4">
                  {credentials.map((cred) => (
                    <div key={cred.id} className="flex items-start gap-3">
                      <div className="mt-1.5 w-3 h-3 rounded-full bg-green-600 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">{cred.name}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>
                            {cred.effective_date ? format(new Date(cred.effective_date), 'M/d/yyyy') : 'No Date'}
                            For ({cred.expiration_date ? format(new Date(cred.expiration_date), 'M/d/yyyy') : 'No Expiration'})
                          </span>
                          <div className="flex gap-1 ml-2">
                            <button onClick={() => handleDeleteCredential(cred.id)} className="text-red-500 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <PenSquare className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {credentials.length === 0 && <p className="text-gray-400 italic">No credentials found.</p>}
                </div>
              </div>

              {/* Form */}
              <div>
                <h3 className="text-lg font-medium text-gray-600 mb-4">Add New Credentials</h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Credentials</label>
                    <Input
                      value={newCredential.name}
                      onChange={(e) => setNewCredential({ ...newCredential, name: e.target.value })}
                      placeholder="Enter credential name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Effective Date</label>
                    <Input
                      type="date"
                      value={newCredential.effectiveDate}
                      onChange={(e) => setNewCredential({ ...newCredential, effectiveDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    <Input
                      type="date"
                      value={newCredential.expirationDate}
                      onChange={(e) => setNewCredential({ ...newCredential, expirationDate: e.target.value })}
                    />
                  </div>
                  <Button
                    onClick={handleAddCredential}
                    disabled={adding}
                    className="bg-blue-900 hover:bg-blue-800 w-auto"
                  >
                    {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Add Credentials
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
