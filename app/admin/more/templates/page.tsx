"use client";
import { columns } from './table-column';
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";

export default function DocumentTemplatePage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-8">
         <Input type="text" placeholder="Search Template Name" className="w-full max-w-xs md:w-64" />
      </div>
      {/* Content for Document Templates will go here */}
      <div className='flex flex-col gap-4 text-center rounded-2xl overflow-hidden'>
        <DataTable columns={columns} data={[]} /> 
      </div>
    </div>
  )
}