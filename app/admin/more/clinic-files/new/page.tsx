"use client";

import React, { useRef, useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'nextjs-toploader/app';

export default function AddFilePage() {
  const router = useRouter();
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.FormEvent) => {
  e.preventDefault();
  if (!file || !fileName) return;
  const fileData = {
    id: Date.now().toString(),
    fileName,
    fileTags: "", // Add tags if you have them
    uploadedBy: "Current User", // Replace with actual user
    files: file.name,
    dateUploaded: new Date().toLocaleDateString(),
  };
  // Get existing files from localStorage
  const existing = JSON.parse(localStorage.getItem("clinicFiles") || "[]");
  localStorage.setItem("clinicFiles", JSON.stringify([...existing, fileData]));
  // Redirect
  router.push('/admin/more/clinic-files');
};

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleSelectFiles = () => {
    fileInputRef.current?.click();
  };

  // const handleUpload = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!file || !fileName) return;
  //   // Simulate upload (replace with API call)
  //   console.log("Uploading:", { fileName, file });
  //   alert(`File '${fileName}' uploaded!`);
  //   setFile(null);
  //   setFileName("");
  // };

  const handleCancel = () => {
    setFile(null);
    setFileName("");
    router.push('/admin/more/clinic-files');                
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-6">Add File</h1>
      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">File Name</label>
          <Input
            type="text"
            value={fileName}
            onChange={e => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="mb-2"
            required
          />
        </div>
        <div
          className={`flex items-center gap-2 border rounded-md p-2 bg-white ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Button type="button" variant="outlineSecondary" onClick={handleSelectFiles} className="border-blue-900 text-blue-900">Select Files</Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <span className="text-gray-500">Drop files here to upload</span>
          {file && <span className="ml-2 text-blue-900 font-medium">{file.name}</span>}
        </div>
        <div className="flex gap-4 mt-4">
          <Button type="submit" variant="secondary" className="">Upload</Button>
          <Button type="button" variant="outlineSecondary" onClick={handleCancel} className="border-blue-900 text-blue-900">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
