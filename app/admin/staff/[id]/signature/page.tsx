"use client";

import AdminStaffProfile from "@/components/AdminStaffProfile";
import { useStaffData } from "@/hooks/useStaffData";
import { Loader2, Plus, Trash2, RotateCcw, Download } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import { useSnackbar } from "notistack";
import Image from "next/image";

export default function SignaturePage() {
  const { staff, loading: staffLoading } = useStaffData();
  const [isOpen, setIsOpen] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const sigPad = useRef<SignatureCanvas | null>(null);
  const supabase = createClient();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (staff?.signature_url) {
      setSignatureUrl(staff.signature_url);
    }
  }, [staff]);

  const clear = () => {
    sigPad.current?.clear();
  };

  const uploadSignature = async (dataUrl: string) => {
    try {
      setSaving(true);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "signature.png", { type: "image/png" });

      const fileName = `${staff?.id}-${Date.now()}.png`;
      const { error } = await supabase.storage
        .from("signatures")
        .upload(fileName, file, {
          upsert: true,
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("signatures")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ signature_url: publicUrl })
        .eq("id", staff?.id);

      if (updateError) throw updateError;

      setSignatureUrl(publicUrl);
      setIsOpen(false);
      enqueueSnackbar("Signature saved successfully", { variant: "success" });
    } catch (error) {
      console.error("Error saving signature:", error);
      enqueueSnackbar("Failed to save signature", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const save = () => {
    if (sigPad.current && !sigPad.current.isEmpty()) {
      const data = sigPad.current.getTrimmedCanvas().toDataURL("image/png");
      uploadSignature(data);
    } else {
      enqueueSnackbar("Please sign before saving", { variant: "warning" });
    }
  };

  const downloadSignature = () => {
    if (signatureUrl) {
      const link = document.createElement("a");
      link.href = signatureUrl;
      link.download = `signature-${staff?.firstName}-${staff?.lastName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const removeSignature = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ signature_url: null })
        .eq('id', staff?.id);

      if (error) throw error;

      setSignatureUrl(null);
      enqueueSnackbar("Signature removed", { variant: "success" });
    } catch (error) {
      console.error("Error removing signature:", error);
      enqueueSnackbar("Failed to remove signature", { variant: "error" });
    }
  }


  if (staffLoading) {
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
        <h2 className="text-xl font-semibold text-gray-800">Signatures</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="text-blue-900 border-blue-900 hover:bg-blue-50">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset PIN
          </Button>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-900 hover:bg-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                Add New Signature
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Signature</DialogTitle>
                <DialogDescription>
                  Draw your signature below using your mouse or touch screen.
                </DialogDescription>
              </DialogHeader>
              <div className="border rounded-md p-2 bg-gray-50">
                <SignatureCanvas
                  ref={sigPad}
                  canvasProps={{
                    className: "w-full h-48 border bg-white rounded-md cursor-crosshair",
                  }}
                  backgroundColor="white"
                />
              </div>
              <DialogFooter className="flex justify-between sm:justify-between">
                <Button variant="outline" onClick={clear}>Clear</Button>
                <Button onClick={save} disabled={saving} className="bg-blue-900">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Save Signature
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border rounded-md p-6 bg-white min-h-[300px]">
        {!signatureUrl ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <p>No signatures found. Add one to get started.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-blue-900">Signature</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Default</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={downloadSignature} className="h-8">
                    <Download className="w-3 h-3 mr-1" /> Download
                  </Button>
                  <Button size="icon" variant="destructive" onClick={removeSignature} className="h-8 w-8 bg-red-50 hover:bg-red-100 text-red-600 border-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-center p-4">
                <Image
                  src={signatureUrl}
                  alt="Signature"
                  width={200}
                  height={100}
                  className="max-h-32 object-contain"
                  unoptimized // Signatures might be dynamic
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
