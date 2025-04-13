'use client';

import { useEffect } from 'react';
import { useSocket } from '@/lib/socket';
import { useRouter } from 'nextjs-toploader/app';
import AdminHeader from '@/components/AdminHeader';
import { isAuthenticated, isAdmin, getStoredUser } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login');
    } else if (!isAdmin()) {
      router.push('/client/dashboard');
    }
  }, [router]);

  const user = getStoredUser();
  useSocket(user ? { userId: user.id } : { userId: null });


  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container max-w-[1350px] mx-auto p-6 space-y-6">
        {children}
      </main>
    </div>
  );
}
