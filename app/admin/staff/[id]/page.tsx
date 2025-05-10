'use client';

import { useState } from 'react';
import AdminStaffProfile from '@/components/AdminStaffProfile';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function StaffDashboard() {
  const [isExpiredOpen, setIsExpiredOpen] = useState(true);
  const [isSignatureOpen, setIsSignatureOpen] = useState(true);
  const [isBillingOpen, setIsBillingOpen] = useState(true);
  return (
    <div className='space-y-6'>
      <AdminStaffProfile />

      {/* Personal Information */}
      <div className='border rounded-md p-6 bg-white'>
        <h2 className='text-lg font-semibold mb-6'>Personal Information</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-y-8'>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Username</h3>
            <p>acsvidusuyi</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>Gender</h3>
            <p>Male</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>Date of Birth</h3>
            <p>2/28/1983 (41 years)</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>
              Gender at Birth
            </h3>
            <p>Male</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>
              Marital Status
            </h3>
            <p>Married</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>Credentials</h3>
            <p>OMH-P-CS</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>Pronouns</h3>
            <p>Male</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>Suffix</h3>
            <p>Male</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>SSN</h3>
            <p>Male</p>
          </div>
        </div>
      </div>

      {/* Collapsible Sections */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Expiring/Expired Certificates */}
        <Collapsible
          open={isExpiredOpen}
          onOpenChange={setIsExpiredOpen}
          className='border rounded-md bg-gray-100'
        >
          <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
            Expiring/Expired Certificates
            {isExpiredOpen ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4 bg-white border-t'>
            <p className='text-gray-500 text-sm'>No Record Found</p>
          </CollapsibleContent>
        </Collapsible>

        {/* Signature */}
        <Collapsible
          open={isSignatureOpen}
          onOpenChange={setIsSignatureOpen}
          className='border rounded-md bg-gray-100'
        >
          <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
            Signature
            {isSignatureOpen ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4 bg-white border-t'>
            <div className='flex items-center justify-center p-4'>
              <img
                src='/placeholder.svg?height=80&width=150&text=Signature'
                alt='Signature'
                className='max-w-full'
              />
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Billing Profile */}
        <Collapsible
          open={isBillingOpen}
          onOpenChange={setIsBillingOpen}
          className='border rounded-md bg-gray-100'
        >
          <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
            Billing Profile
            {isBillingOpen ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4 bg-white border-t'>
            <ul className='space-y-2 text-sm'>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>Rendering NPI</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>Rendering Taxonomy #</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-2'>•</span>
                <span>Rendering MPN</span>
              </li>
            </ul>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
