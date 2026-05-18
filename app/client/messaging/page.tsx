import dynamic from 'next/dynamic';

const ChatDashboard = dynamic(() => import('./ChatDashboard'), { ssr: false });

export default function MessagingPage() {
  return <ChatDashboard />;
}
