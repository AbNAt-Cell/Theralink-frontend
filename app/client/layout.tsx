'use client';

import ClientHeader from '@/components/ClientHeader'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

const ClientLayout = ({children}: {children: React.ReactNode}) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/client/login');
    }
  }, [router]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <ClientHeader />
      {children}
    </div>
  )
}

export default ClientLayout