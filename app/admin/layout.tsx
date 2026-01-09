"use client";

import { useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import AdminHeader from "@/components/AdminHeader";
import { useUser } from "@/context/UserContext";
import SocketContextProvider from "@/context/SocketContextProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/admin/login");
      } else if (user.role === 'CLIENT') {
        router.push("/client/dashboard");
      }
    }
  }, [user, loading, router]);

  // const user = getStoredUser();
  // useSocket(user ? { userId: user.id } : { userId: null });

  return (
    <SocketContextProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <main className="container max-w-[1350px] mx-auto p-6 space-y-6">
          {children}
        </main>
      </div>
    </SocketContextProvider>
  );
}
