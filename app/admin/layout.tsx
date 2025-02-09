'use client';

import { useEffect } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { isAuthenticated, isAdmin } from '@/lib/auth';
import AdminHeader from '@/components/AdminHeader';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="container max-w-[1350px] mx-auto p-6 space-y-6">
        {children}
      </main>
    </div>
  );
}
