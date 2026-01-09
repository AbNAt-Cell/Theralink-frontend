"use client";

import React, { useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import ClientHeader from "@/components/ClientHeader";
import { useUser } from "@/context/UserContext";
import SocketContextProvider from "@/context/SocketContextProvider";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/client/login");
    }
  }, [user, loading, router]);

  return (
    <SocketContextProvider>
      <div className="min-h-screen bg-gray-50">
        <ClientHeader />
        {children}
      </div>
    </SocketContextProvider>
  );
};

export default ClientLayout;
