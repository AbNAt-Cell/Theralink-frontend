"use client";

import React, { useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";
import ClientHeader from "@/components/ClientHeader";
import { useUser } from "@/context/UserContext";
import PresenceProvider from "@/context/PresenceProvider";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/client/login");
    }
  }, [user, loading, router]);

  return (
    <PresenceProvider>
      <ClientHeader />
      <main className="container max-w-[1350px] mx-auto p-6 space-y-6">{children}</main>
    </PresenceProvider>
  );
};

export default ClientLayout;
