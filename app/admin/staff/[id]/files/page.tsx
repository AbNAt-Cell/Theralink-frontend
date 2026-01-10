import AdminStaffProfile from "@/components/AdminStaffProfile";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useStaffData } from "@/hooks/useStaffData";
import { Loader2, Plus, Trash2, UploadCloud, X, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { getStaffFiles, addStaffFile, deleteStaffFile } from "@/hooks/admin/staff";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSnackbar } from "notistack";
import { createClient } from "@/utils/supabase/client";

export default function FilesPage() {
  const { staff, loading, id: staffId } = useStaffData();
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const supabase = createClient();

  // Form State
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (staffId) {
      fetchFiles();
    }
  }, [staffId]);

  const fetchFiles = async () => {
    try {
      setLoadingFiles(true);
      const data = await getStaffFiles(staffId);
      setFiles(data || []);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoadingFiles(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      enqueueSnackbar("File name is required", { variant: "error" });
      return;
    }
    if (!selectedFile) {
      enqueueSnackbar("Please select a file", { variant: "error" });
      return;
    }

    setIsSubmitting(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${staffId}/${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(fileName);

      await addStaffFile({
        staff_id: staffId,
        name,
        file_url: publicUrl
      });

      enqueueSnackbar("File added successfully", { variant: "success" });
      setOpen(false);
      resetForm();
      fetchFiles();
    } catch (error) {
      console.error("Error adding file:", error);
      enqueueSnackbar("Failed to add file", { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setName("");
    setSelectedFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      await deleteStaffFile(id);
      enqueueSnackbar("File deleted", { variant: "success" });
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      enqueueSnackbar("Failed to delete file", { variant: "error" });
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
          <h2 className="text-xl font-semibold">Files</h2>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                Add Files
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add File</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fileName">File Name</Label>
                  <Input
                    id="fileName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter file name"
                  />
                </div>

                <div className="grid gap-2">
                  <div className="border border-gray-200 rounded-md p-1 flex items-center justify-between">
                    <Button
                      type="button"
                      variant="ghost"
                      className="bg-blue-900 text-white hover:bg-blue-800 hover:text-white h-9 px-4 rounded"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Select files...
                    </Button>
                    <span className="text-gray-500 text-sm mr-2 truncate max-w-[200px]">
                      {selectedFile ? selectedFile.name : "Drop files here to upload"}
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blue-900 w-24">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)} className="w-24">Cancel</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loadingFiles ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : files.length === 0 ? (
          <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
            <div className="relative w-48 h-48 mb-4">
              <Image src="/placeholder.svg?height=200&width=200&text=No+Files" alt="No files" fill className="object-contain" />
            </div>
            <p className="text-gray-500">No files found</p>
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {files.map((file) => (
              <div key={file.id} className="bg-white p-4 rounded-lg border shadow-sm flex flex-col justify-between h-[150px]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded text-blue-600">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium truncate max-w-[150px]">{file.name}</h3>
                      <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">
                        View File
                      </a>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(file.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1 -mr-1">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-xs text-gray-400 mt-2">
                  Added {new Date(file.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
