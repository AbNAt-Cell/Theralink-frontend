import React from 'react';
import AdminStaffProfileNavigation from '@/components/AdminStaffProfileNavigation';

async function AdminStaffProfilePage({
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
        <AdminStaffProfileNavigation id={id} />
      </div>
      <div className='w-3/4'>{children}</div>
    </div>
  );
}

export default AdminStaffProfilePage;
