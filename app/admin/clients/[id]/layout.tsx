import React from 'react';
import AdminUserProfileNavigation from '@/components/AdminUserProfileNavigation';

async function AdminClientProfilePage({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { id } = await params;

  return (
    <div className='flex flex-row gap-4'>
      <div className='w-1/4'>
        <AdminUserProfileNavigation id={id} />
      </div>
      <div className='w-3/4'>{children}</div>
    </div>
  );
}

export default AdminClientProfilePage;
