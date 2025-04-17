"use client";

import React, { useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import ClientHeader from "@/components/ClientHeader";
import { isAuthenticated } from "@/hooks/auth";
import SocketContextProvider from "@/context/SocketContextProvider";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth/client/login");
    }
  }, [router]);

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
