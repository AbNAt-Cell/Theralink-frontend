'use client';

import React, { useEffect } from 'react'
import { useSocket } from '@/lib/socket'
import { useRouter } from 'nextjs-toploader/app'
import ClientHeader from '@/components/ClientHeader'
import { isAuthenticated, getStoredUser } from '@/lib/auth'

const ClientLayout = ({children}: {children: React.ReactNode}) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/client/login');
    }
  }, [router]);

  const user = getStoredUser();
  useSocket(user ? { userId: user.id } : { userId: null });

  return (
    <div className='min-h-screen bg-gray-50'>
      <ClientHeader />
      {children}
    </div>
  )
}

export default ClientLayout