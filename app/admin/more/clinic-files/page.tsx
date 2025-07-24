"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { columns as baseColumns, FileTableRow } from "@/app/admin/more/clinic-files/table-columns";

export default function ClinicFilePage() {
  const router = useRouter();
  const [files, setFiles] = useState<FileTableRow[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("clinicFiles");
    if (stored) {
      setFiles(JSON.parse(stored));
    }
  }, []);

  // In your ClinicFilePage
  const handleDelete = (id: string) => {
    const updated = files.filter(f => f.id !== id);
    setFiles(updated);
    localStorage.setItem("clinicFiles", JSON.stringify(updated));
  };

  const handleEdit = (file: FileTableRow) => {
    localStorage.setItem("editFile", JSON.stringify(file));
    router.push(`/admin/more/clinic-files/new?edit=${file.id}`);
  };

  const tableData = files.map(f => ({
    ...f,
    onDelete: handleDelete,
    onEdit: handleEdit,
  }));

  return (
    <div className="flex flex-col min-h-screen sm:px-2 lg:px-0">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-7xl">
          <div className="flex items-center mb-8">
            <h1 className="text-2xl font-bold text-black flex ">Clinic Files</h1>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <Input type="text" placeholder="Search" className="w-full max-w-xs md:w-64" />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button variant='secondary' onClick={() => router.push('/admin/more/clinic-files/new')} className="text-white">Add File</Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <DataTable columns={baseColumns} data={tableData} />
          </div>
        </div>
      </main>
    </div>
  );
}
