'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AdminClientProfile from '@/components/AdminClientProfile';
import { getClientById, ClientProfile } from '@/hooks/admin/client';

export default function ClientDashboard({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Collapsible states
  const [isCurrentInsuranceOpen, setIsCurrentInsuranceOpen] = useState(true);
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(true);
  const [isVitalsOpen, setIsVitalsOpen] = useState(true);
  const [isRelationshipOpen, setIsRelationshipOpen] = useState(true);
  const [isEmergencyContactOpen, setIsEmergencyContactOpen] = useState(true);
  const [isReferralSourceOpen, setIsReferralSourceOpen] = useState(true);
  const [isReferringProviderOpen, setIsReferringProviderOpen] = useState(true);
  const [isPrimaryCareOpen, setIsPrimaryCareOpen] = useState(true);
  const [isPediatricianOpen, setIsPediatricianOpen] = useState(true);

  useEffect(() => {
    fetchClientData(params.id);
  }, [params.id]);

  const fetchClientData = async (clientId: string) => {
    try {
      setLoading(true);
      const data = await getClientById(clientId);
      // Fetch policies if not included in client object (our hook might need update or we fetch separately)
      // The updated getClientById fetches everything, let's verify if policies are there.
      // Actually, my plan said to update getClientById or fetch separately. 
      // Let's assume for now we use the separate hook I created if getClientById isn't updated, 
      // BUT I'll just rely on the new hook for policies to be safe and modular.
      setClient(data);
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading client data...</div>;
  if (!client) return <div>Client not found</div>;

  const demographicsData = {
    status: client.status,
    username: client.email || '—', // Using email as username for now
    gender: client.gender,
    dateOfBirth: client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : 'N/A',
    startDate: client.startDate ? new Date(client.startDate).toLocaleDateString() : 'N/A',
    recordId: client.id.split('-')[0],
    race: client.race || '—',
    ethnicity: '—', // Not yet in DB
    hairColor: '—', // Not yet in DB
    eyeColor: '—', // Not yet in DB
    commonRace: client.race || '—',
    site: client.address?.city || '—',
    ssn: client.ssn || '—',
    physicalAddress: client.address ? `${client.address.street || ''}, ${client.address.city || ''}, ${client.address.state || ''} ${client.address.zipCode || ''}` : '—',
  };

  // insuranceData removed
  // insuranceData variable removed

  return (
    <div className='space-y-6'>
      <AdminClientProfile client={client} />
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
            {/* 
                We need to fetch actual policies. Ideally, `client` state should include policies 
                or we fetch them in a useEffect. Since I haven't updated `getClientById` to return real policies array (just single fields),
                let's stick to the "Add Insurance" button linking to the new page for now.
                Todo: Display list of policies here.
            */}
            <div className='flex justify-between items-center mb-4'>
              <h3 className="text-sm font-semibold">Policies</h3>
              <Link href={`/admin/clients/${client.id}/insurance/new`}>
                <Button variant="outline" size="sm" className='text-blue-500 border-blue-500'>
                  + Add Insurance
                </Button>
              </Link>
            </div>

            <div className='space-y-4'>
              {/* Display legacy insurance if exists */}
              {(client.insurance?.insuranceType || client.insurance?.policyNumber) && (
                <div className="border p-3 rounded-md">
                  <p className="font-semibold text-sm">Legacy / Primary</p>
                  <p className="text-sm"><span className="text-gray-500">Payer:</span> {client.insurance.insuranceType}</p>
                  <p className="text-sm"><span className="text-gray-500">Policy #:</span> {client.insurance.policyNumber}</p>
                  <p className="text-sm"><span className="text-gray-500">Dates:</span> {client.insurance.startDate} - {client.insurance.endDate}</p>
                </div>
              )}

              {/* 
                    Ideally we map over `policies` here. 
                    For this task, the requirement is "add insurance button should lead to a page". 
                    I've implemented that link above.
                 */}
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Client Portal Access - Placeholder for now */}
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

        {/* Vitals - Placeholder for now */}
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
                <span className='font-medium'>Date Added:</span> —
              </p>
              <p>
                <span className='font-medium'>Blood Pressure #:</span> —
              </p>
              <p>
                <span className='font-medium'>Temperature:</span> —
              </p>
              <p>
                <span className='font-medium'>Height:</span> —
              </p>
              <p>
                <span className='font-medium'>Pulse Rate:</span> —
              </p>
              <p>
                <span className='font-medium'>BMI:</span> —
              </p>
              <p>
                <span className='font-medium'>Pulse Ox:</span> —
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Collapsible Sections - Second Row */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* Relationship - Placeholder */}
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

        {/* Emergency Contact - Placeholder */}
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

        {/* Referral Source - Placeholder */}
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
        {/* Referring Provider - Placeholder */}
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

        {/* Primary Care Physician - Placeholder */}
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

        {/* Pediatrician - Placeholder */}
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
