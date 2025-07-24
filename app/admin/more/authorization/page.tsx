"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { FileInput } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TableFilters, { Filter } from '@/components/TableFilters';

export default function AuthorizationsPage() {

  const router = useRouter();

  const filters: Filter[] = [
  { label: "Date | 11/10/2023 - 11/10/2024", value: "date" },
  { label: "Clients", value: "clients" },
  { label: "Staffcaseload", value: "staffcaseload" },
  { label: "Remaining Unit", value: "remaining_unit" },
  { label: "Site", value: "site" },
  { label: "Status", value: "status" },
  { label: "Payer", value: "payer" },
];

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});

  const handleClear = () => setSelectedFilters({});
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen sm:px-6 lg:px-0">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full ">
          <div className="flex items-center mb-8">
            <h1 className="text-2xl font-bold text-black flex ">Authorizations</h1>
          </div>
          {/* Filters and Table (empty state) */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <Input type="text" placeholder="Search" className="w-64 md:w-64" />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button variant='outlineSecondary' className="" onClick={() => {}}>
                View Authorization template
              </Button>
              <Button variant='outlineSecondary' className="space-x-2" onClick={() => {}}>
                <FileInput />
                Export to Excel
              </Button>
              <Button variant='secondary' onClick={() => router.push('/admin/more/authorization/new')} className="text-white">Add New Auth</Button>   
            </div>
          </div>

          <TableFilters className="flex" filters={filters} table={{ getColumn: () => ({ getFilterValue: () => "", setFilterValue: () => {} }) }} /> 
          
          <div className="flex flex-col items-center mt-8 justify-center h-96 border rounded-lg bg-white/80">
            <img src="/images/notfound.png" alt="No Authorizations" className="w-sm h-64 mb-4 object-contain" />
            <p className="text-lg text-gray-600">No Authorizations Available</p>
          </div>
        </div>
      </main>
    </div>
  );
} 