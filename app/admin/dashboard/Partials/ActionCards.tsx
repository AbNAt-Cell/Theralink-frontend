import React from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Building2, ChevronRight, Users2, User } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function ActionCards() {
  const router = useRouter();

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-3 mb-6'>
      <Card className='bg-secondary text-white p-4 cursor-pointer'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex flex-row justify-center items-center gap-4'>
            <div className='flex justify-center items-center rounded-full bg-[#E7EAF017] h-14 w-14'>
              <Building2 className='' />
            </div>
            <div>
              <p className='font-semibold text-lg uppercase'>Site</p>
              <p className='text-sm'>3</p>
            </div>
          </div>
          <ChevronRight />
        </div>
      </Card>
      <Card className='bg-secondary text-white p-4 cursor-pointer'>
        <div className='flex flex-row justify-between items-center'>
          <div className='flex flex-row justify-center items-center gap-4'>
            <div className='flex justify-center items-center rounded-full bg-[#E7EAF017] h-14 w-14'>
              <Users2 className='' />
            </div>
            <div>
              <p className='font-semibold text-lg uppercase'>Staff</p>
              <p className='text-sm'>100</p>
            </div>
          </div>
          <ChevronRight />
        </div>
      </Card>
      <Card
        className='bg-secondary text-white p-4 cursor-pointer'
        onClick={() => router.push('/admin/clients')}
      >
        <div className='flex flex-row justify-between items-center'>
          <div className='flex flex-row justify-center items-center gap-4'>
            <div className='flex justify-center items-center rounded-full bg-[#E7EAF017] h-14 w-14'>
              <User className='' />
            </div>
            <div>
              <p className='font-semibold text-lg uppercase'>Clients</p>
              <p className='text-sm'>100</p>
            </div>
          </div>
          <ChevronRight />
        </div>
      </Card>
    </div>
  );
}
