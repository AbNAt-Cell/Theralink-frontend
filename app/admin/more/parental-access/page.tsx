"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { FileInput } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TableFilters, { Filter } from '@/components/TableFilters';

export default function AuthorizationsPage() {

  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen sm:px-6 lg:px-0">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full ">
          <div className="flex items-center mb-8 justify-between">
            <h1 className="text-2xl font-bold text-black flex ">Client Portal Parental Access</h1>
            <Button variant='secondary' onClick={() => router.push('/admin/more/parental-access/new')} className="text-white font-bold"><span className="text-4xl font-thin">+</span>Add</Button>   
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <Input type="text" placeholder="Search" className="w-64 md:w-64" />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">  
            </div>
          </div>
          
          <div className="flex flex-col items-center mt-8 justify-center h-96 border rounded-lg bg-white/80">
            <img src="/images/notfound.png" alt="No Authorizations" className="w-sm h-64 mb-4 object-contain" />
            <p className="text-lg text-gray-600">No Authorizations Available</p>
          </div>
        </div>
      </main>
    </div>
  );
} 