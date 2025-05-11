'use client';

import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AdminClientProfile from '@/components/AdminClientProfile';

export default function ClientDashboard() {
  const [isCurrentInsuranceOpen, setIsCurrentInsuranceOpen] = useState(true);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(true);
  const [isVitalsOpen, setIsVitalsOpen] = useState(true);
  const [isRelationshipOpen, setIsRelationshipOpen] = useState(true);
  const [isEmergencyContactOpen, setIsEmergencyContactOpen] = useState(true);
  const [isReferralSourceOpen, setIsReferralSourceOpen] = useState(true);
  const [isReferringProviderOpen, setIsReferringProviderOpen] = useState(true);
  const [isPrimaryCareOpen, setIsPrimaryCareOpen] = useState(true);
  const [isPediatricianOpen, setIsPediatricianOpen] = useState(true);

  const demographicsData = {
    status: '',
    username: 'jaleighbolton',
    gender: 'Female',
    dateOfBirth: '6/27/2018 (6 years, 4 months)',
    startDate: '8/9/2024',
    recordId: '',
    race: 'Black or African American',
    ethnicity: 'NH',
    hairColor: 'Black',
    eyeColor: 'Black',
    commonRace: 'Black or African American',
    site: 'Auspicious Community Services',
    ssn: 'NI',
    physicalAddress: '1211 S Main St Apt 122, Dickinson, TX 77539',
  };

  const insuranceData = {
    name: '68519 - SUPERIOR HEALTHPLAN',
    policyNumber: '727333176',
    startDate: '8/1/2024',
    endDate: '8/1/2024',
  };

  return (
    <div className='space-y-6'>
      <AdminClientProfile />
      {/* Demographics */}
      <div className='border rounded-md p-6 bg-white'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold'>Demographics</h2>
          <Button
            variant='outline'
            className='bg-green-600 text-white hover:bg-green-700'
          >
            Manage
          </Button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-y-6'>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Status</h3>
            <p>{demographicsData.status || '—'}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Username</h3>
            <p>{demographicsData.username}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Gender</h3>
            <p>{demographicsData.gender}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Date of Birth</h3>
            <p>{demographicsData.dateOfBirth}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Start Date</h3>
            <p>{demographicsData.startDate}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Record#</h3>
            <p>{demographicsData.recordId || '—'}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Race</h3>
            <p>{demographicsData.race}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Ethnicity</h3>
            <p>{demographicsData.ethnicity}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Gender</h3>
            <p>{demographicsData.gender}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Hair Color</h3>
            <p>{demographicsData.hairColor}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Eye Color</h3>
            <p>{demographicsData.eyeColor}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>SSN</h3>
            <p>{demographicsData.ssn}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Comm. Race</h3>
            <p>{demographicsData.commonRace}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Site</h3>
            <p>{demographicsData.site}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>
              Physical Address
            </h3>
            <p>{demographicsData.physicalAddress}</p>
          </div>
        </div>
      </div>

      {/* Collapsible Sections - First Row */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Current Insurance */}
        <Collapsible
          open={isCurrentInsuranceOpen}
          onOpenChange={setIsCurrentInsuranceOpen}
          className='border rounded-md bg-gray-100'
        >
          <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
            Current Insurance
            {isCurrentInsuranceOpen ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4 bg-white border-t'>
            <div className='space-y-2'>
              <p>
                <span className='font-medium'>Insurance:</span>{' '}
                {insuranceData.name}
              </p>
              <p>
                <span className='font-medium'>Policy #:</span>{' '}
                {insuranceData.policyNumber}
              </p>
              <p>
                <span className='font-medium'>Start Date:</span>{' '}
                {insuranceData.startDate}
              </p>
              <p>
                <span className='font-medium'>End Date:</span>{' '}
                {insuranceData.endDate}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Client Portal Access */}
        <Collapsible
          open={isClientPortalOpen}
          onOpenChange={setIsClientPortalOpen}
          className='border rounded-md bg-gray-100'
        >
          <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
            Client Portal Access
            {isClientPortalOpen ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4 bg-white border-t'>
            <div className='space-y-2 flex flex-col items-center'>
              <Button
                variant='outline'
                className='w-full border-blue-500 text-blue-500'
              >
                Send Login Credentials
              </Button>
              <Button
                variant='outline'
                className='w-full border-blue-500 text-blue-500'
              >
                Manage Portal Access
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Vitals */}
        <Collapsible
          open={isVitalsOpen}
          onOpenChange={setIsVitalsOpen}
          className='border rounded-md bg-gray-100'
        >
          <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
            Vitals
            {isVitalsOpen ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4 bg-white border-t'>
            <div className='space-y-2'>
              <p>
                <span className='font-medium'>Date Added:</span>
              </p>
              <p>
                <span className='font-medium'>Blood Pressure #:</span>
              </p>
              <p>
                <span className='font-medium'>Temperature:</span>
              </p>
              <p>
                <span className='font-medium'>Height:</span>
              </p>
              <p>
                <span className='font-medium'>Pulse Rate:</span>
              </p>
              <p>
                <span className='font-medium'>BMI:</span>
              </p>
              <p>
                <span className='font-medium'>Pulse Ox:</span>
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Collapsible Sections - Second Row */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Relationship */}
        <Collapsible
          open={isRelationshipOpen}
          onOpenChange={setIsRelationshipOpen}
          className='border rounded-md bg-gray-100'
        >
          <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
            Relationship
            {isRelationshipOpen ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4 bg-white border-t'>
            <div className='flex justify-end'>
              <Button
                variant='outline'
                size='sm'
                className='text-blue-500 border-blue-500'
              >
                Add Relationship
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Emergency Contact */}
        <Collapsible
          open={isEmergencyContactOpen}
          onOpenChange={setIsEmergencyContactOpen}
          className='border rounded-md bg-gray-100'
        >
          <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
            Emergency Contact
            {isEmergencyContactOpen ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4 bg-white border-t'>
            <div className='flex justify-end'>
              <Button
                variant='outline'
                size='sm'
                className='text-blue-500 border-blue-500'
              >
                Add
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Referral Source */}
        <Collapsible
          open={isReferralSourceOpen}
          onOpenChange={setIsReferralSourceOpen}
          className='border rounded-md bg-gray-100'
        >
          <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
            Referral Source
            {isReferralSourceOpen ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4 bg-white border-t'>
            <div className='space-y-2'>
              <p>
                <span className='font-medium'>Referral Source:</span>
              </p>
              <p>
                <span className='font-medium'>Referral Date:</span>
              </p>
              <p>
                <span className='font-medium'>Reason for Referral:</span>
              </p>
              <div className='flex justify-end'>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-blue-500 border-blue-500'
                >
                  Edit
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Collapsible Sections - Third Row */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Referring Provider */}
        <Collapsible
          open={isReferringProviderOpen}
          onOpenChange={setIsReferringProviderOpen}
          className='border rounded-md bg-gray-100'
        >
          <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
            Referring Provider
            {isReferringProviderOpen ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4 bg-white border-t'>
            <div className='space-y-2'>
              <p>
                <span className='font-medium'>Referring Provider:</span>
              </p>
              <p>
                <span className='font-medium'>NPI:</span>
              </p>
              <p>
                <span className='font-medium'>Referral Date:</span>
              </p>
              <p>
                <span className='font-medium'>Reason for Referral:</span>
              </p>
              <div className='flex justify-end'>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-blue-500 border-blue-500'
                >
                  Edit
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Primary Care Physician */}
        <Collapsible
          open={isPrimaryCareOpen}
          onOpenChange={setIsPrimaryCareOpen}
          className='border rounded-md bg-gray-100'
        >
          <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
            Primary Care Physician
            {isPrimaryCareOpen ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4 bg-white border-t'>
            <div className='space-y-2'>
              <p>
                <span className='font-medium'>Primary Physician:</span>
              </p>
              <p>
                <span className='font-medium'>Address:</span>
              </p>
              <p>
                <span className='font-medium'>Phone:</span>
              </p>
              <div className='flex justify-end'>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-blue-500 border-blue-500'
                >
                  Edit
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Pediatrician */}
        <Collapsible
          open={isPediatricianOpen}
          onOpenChange={setIsPediatricianOpen}
          className='border rounded-md bg-gray-100'
        >
          <CollapsibleTrigger className='flex items-center justify-between w-full p-4 text-left font-medium'>
            Pediatrician
            {isPediatricianOpen ? (
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className='p-4 bg-white border-t'>
            <div className='space-y-2'>
              <p>
                <span className='font-medium'>Pediatrician:</span>
              </p>
              <p>
                <span className='font-medium'>Address:</span>
              </p>
              <p>
                <span className='font-medium'>Phone:</span>
              </p>
              <div className='flex justify-end'>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-blue-500 border-blue-500'
                >
                  Edit
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
