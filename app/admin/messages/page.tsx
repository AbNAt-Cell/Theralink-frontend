import dynamic from 'next/dynamic';

const AdminChatDashboard = dynamic(() => import('./ChatDashboard'), { ssr: false });

export default function AdminMessagesPage() {
  return <AdminChatDashboard />;
}
