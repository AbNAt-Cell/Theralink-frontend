"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Service, getColumns } from "./table-columns";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import ServiceManagerModal, { ServiceFormData } from "./serviceManagerModal";

export default function servicePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [services, setServices] = useState<Partial<Service>[]>([]);

  // Maps ServiceFormData to Service table row
  const handleAddService = (data: ServiceFormData) => {
    // Ensures that rate is always formatted with a $ sign
    let formattedRate = data.serviceRate.trim();
    if (formattedRate && !formattedRate.startsWith("$")) {
      formattedRate = "$" + formattedRate;
    }
    setServices(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        serviceCode: data.serviceCode,
        serviceName: data.service,
        unit: data.billingUnit,
        rate: formattedRate,
        dateEffective: data.rateEffectiveDate,
        rules: '',
      }
    ]);
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen sm:px-6 lg:px-0">
      <ServiceManagerModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleAddService} />
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full ">
          <div className="flex items-center mb-8 justify-between">
            <h1 className="text-2xl font-bold text-black flex ">Services</h1>
            <Button variant='secondary' className="text-white font-bold" onClick={() => setModalOpen(true)}>Add</Button>   
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <Input type="text" placeholder="Search" className="w-64 md:w-64" />  
          </div>

          <div className='flex flex-col gap-4 text-center rounded-2xl overflow-hidden'>        
            <DataTable columns={getColumns(handleDelete)} data={services} />      
          </div>
          
        </div>
      </main>
    </div>
  );
}