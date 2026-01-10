"use client";

import AdminStaffProfile from "@/components/AdminStaffProfile";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useStaffData } from "@/hooks/useStaffData";
import { Loader2, Plus, Trash2, CalendarIcon, UploadCloud, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getStaffCertifications, addStaffCertification, deleteStaffCertification } from "@/hooks/admin/staff";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useSnackbar } from "notistack";
import { createClient } from "@/utils/supabase/client";

export default function CertificationsPage() {
  interface Certification {
    id: string;
    name: string;
    issue_date?: string;
    expiration_date?: string;
    never_expires?: boolean;
    completed?: boolean;
    file_url?: string;
  }

  const { staff, loading, id: staffId } = useStaffData();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const supabase = createClient();

  // Form State
  const [name, setName] = useState("");
  const [issueDate, setIssueDate] = useState<Date | undefined>(undefined);
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined);
  const [completed, setCompleted] = useState(false);
  const [neverExpires, setNeverExpires] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCertifications = async () => {
    try {
      setLoadingCerts(true);
      const data = await getStaffCertifications(staffId);
      setCertifications(data || []);
    } catch (error) {
      console.error("Error fetching certifications:", error);
    } finally {
      setLoadingCerts(false);
    }
  };

  useEffect(() => {
    if (staffId) {
      fetchCertifications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      enqueueSnackbar("Certification name is required", { variant: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      let fileUrl = null;

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${staffId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('certifications')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('certifications')
          .getPublicUrl(fileName);

        fileUrl = publicUrl;
      }

      await addStaffCertification({
        staff_id: staffId,
        name,
        issue_date: issueDate ? format(issueDate, 'yyyy-MM-dd') : undefined,
        expiration_date: expirationDate ? format(expirationDate, 'yyyy-MM-dd') : undefined,
        never_expires: neverExpires,
        completed,
        file_url: fileUrl || undefined
      });

      enqueueSnackbar("Certification added successfully", { variant: "success" });
      setOpen(false);
      resetForm();
      fetchCertifications();
    } catch (error) {
      console.error("Error adding certification:", error);
      enqueueSnackbar("Failed to add certification", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setIssueDate(undefined);
    setExpirationDate(undefined);
    setCompleted(false);
    setNeverExpires(false);
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      await deleteStaffCertification(id);
      enqueueSnackbar("Certification deleted", { variant: "success" });
      fetchCertifications();
    } catch (error) {
      console.error("Error deleting certification:", error);
      enqueueSnackbar("Failed to delete certification", { variant: "error" });
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Certifications</h2>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Certification</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Certification</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter certification name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Issue Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !issueDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {issueDate ? format(issueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={issueDate}
                          onSelect={setIssueDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="grid gap-2">
                    <Label>Expiration Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !expirationDate && "text-muted-foreground"
                          )}
                          disabled={neverExpires}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {expirationDate ? format(expirationDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={expirationDate}
                          onSelect={setExpirationDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="completed"
                      checked={completed}
                      onCheckedChange={(checked) => setCompleted(checked as boolean)}
                    />
                    <Label htmlFor="completed">Completed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="neverExpires"
                      checked={neverExpires}
                      onCheckedChange={(checked) => {
                        setNeverExpires(checked as boolean);
                        if (checked) setExpirationDate(undefined);
                      }}
                    />
                    <Label htmlFor="neverExpires">Never Expires</Label>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Add File</Label>
                  <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative">
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      accept=".pdf,.png,.jpg,.jpeg"
                    />
                    {selectedFile ? (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <span className="font-medium">{selectedFile.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedFile(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <UploadCloud className="h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Drop files here to upload or <span className="text-blue-600 font-medium">Select files...</span></p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-900">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Certification
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loadingCerts ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : certifications.length === 0 ? (
          <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
            <div className="relative w-48 h-48 mb-4">
              <Image
                src="/placeholder.svg?height=200&width=200&text=No+Certifications"
                alt="No certifications"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-gray-500">No certifications found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="bg-white p-4 rounded-lg border shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-lg">{cert.name}</h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    {cert.issue_date && <p>Issued: {format(new Date(cert.issue_date), 'PPP')}</p>}
                    {cert.never_expires ? (
                      <p className="text-green-600">Never Expires</p>
                    ) : (
                      cert.expiration_date && <p>Expires: {format(new Date(cert.expiration_date), 'PPP')}</p>
                    )}
                    {cert.completed ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    )}
                    {cert.file_url && (
                      <a href={cert.file_url} target="_blank" rel="noopener noreferrer" className="block text-blue-600 hover:underline mt-1">
                        View Certificate
                      </a>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(cert.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
