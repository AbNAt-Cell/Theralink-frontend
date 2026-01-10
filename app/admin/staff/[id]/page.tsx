'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AdminStaffProfile from '@/components/AdminStaffProfile';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { getStaffById } from '@/hooks/admin/staff';

interface StaffDetail {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: string;
  username?: string;
  gender?: string;
  date_of_birth?: string;
  position?: string;
  race?: string;
  position_effective_date?: string;
  site?: string;
}

export default function StaffDashboard() {
  const params = useParams();
  const id = params.id as string;
  const [staff, setStaff] = useState<StaffDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [isExpiredOpen, setIsExpiredOpen] = useState(true);
  const [isSignatureOpen, setIsSignatureOpen] = useState(true);
  const [isBillingOpen, setIsBillingOpen] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getStaffById(id);
        setStaff(data);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
        <span className="ml-3 text-lg font-medium text-gray-500">Loading staff data...</span>
      </div>
    );
  }

  if (!staff) {
    return <div>Staff member not found.</div>;
  }

  const name = `${staff.firstName} ${staff.lastName}`;

  return (
    <div className='space-y-6'>
      <AdminStaffProfile
        name={name}
        email={staff.email}
        phone={staff.phone}
        site={staff.site}
      />

      {/* Personal Information */}
      <div className='border rounded-md p-6 bg-white'>
        <h2 className='text-lg font-semibold mb-6'>Personal Information</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-y-8'>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Username</h3>
            <p>{staff.username || 'N/A'}</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>Gender</h3>
            <p>{staff.gender || 'N/A'}</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>Date of Birth</h3>
            <p>{staff.date_of_birth || 'N/A'}</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>
              Position
            </h3>
            <p>{staff.position || 'N/A'}</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>
              Role
            </h3>
            <p>{staff.role || 'N/A'}</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>Race</h3>
            <p>{staff.race || 'N/A'}</p>
          </div>

          <div>
            <h3 className='text-sm font-medium text-gray-500'>Position Effective Date</h3>
            <p>{staff.position_effective_date || 'N/A'}</p>
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
            <div className='flex items-center justify-center p-4 h-20 w-full bg-gray-50 border border-dashed rounded italic text-gray-400'>
              No Signature Captured
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
