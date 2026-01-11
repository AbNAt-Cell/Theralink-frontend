import { User } from 'lucide-react';
import { ClientProfile } from '@/hooks/admin/client';

interface AdminClientProfileProps {
  client?: ClientProfile | null;
}

export default function AdminClientProfile({ client }: AdminClientProfileProps) {
  // If client is intentionally null/undefined (e.g. from pages that don't fetch it yet),
  // we can show a placeholder or loading state.
  // For now, we'll try to extract what we can or fall back safely.

  const clientData = {
    name: client ? `${client.firstName} ${client.lastName}` : 'Loading...',
    dob: client?.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : '—',
    email: client?.email || '—',
    phone: client?.phone || '—',
    insurance: client?.insurance?.insuranceType
      ? `${client.insurance.insuranceType} (${client.insurance.policyNumber})`
      : '—',
    recordNumber: client?.id?.split('-')[0] || '—',
  };

  return (
    <div className='border-b p-4 bg-white flex flex-col md:flex-row gap-4 items-start md:items-center'>
      <div className='flex-shrink-0'>
        <div className='w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden relative'>
          <User className="w-10 h-10 text-slate-500" />
        </div>
      </div>

      <div className='flex-grow'>
        <h1 className='text-xl font-bold'>{clientData.name}</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600'>
          <div>
            <p>
              <span className='font-medium'>DOB:</span> {clientData.dob}
            </p>
            <p>
              <span className='font-medium'>Email:</span> {clientData.email}
            </p>
            <p>
              <span className='font-medium'>Record #:</span>{' '}
              {clientData.recordNumber}
            </p>
          </div>
          <div>
            <p>
              <span className='font-medium'>Phone:</span> {clientData.phone}
            </p>
            <p>
              <span className='font-medium'>Insurance:</span>{' '}
              {clientData.insurance}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
