'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin } from '@/lib/auth';

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
      <main className="container mx-auto">
        {children}
      </main>
    </div>
  );
}
