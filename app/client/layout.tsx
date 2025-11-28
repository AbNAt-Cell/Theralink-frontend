"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import ClientHeader from "@/components/ClientHeader";
import { isAuthenticated, getStoredUser, User } from "@/hooks/auth";
import SocketContextProvider from "@/context/SocketContextProvider";
import { SnackbarProvider } from "notistack";
import { PeerProvider } from "@/context/CallProvider";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  }, []);

  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     router.push("/client/login");
  //   }
  // }, [router]);

  return (
    <SocketContextProvider>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }} autoHideDuration={4000}>
        <PeerProvider loggedInUser={user}>
          <div className="min-h-screen bg-gray-50">
            <ClientHeader user={user} />
            {children}
          </div>
        </PeerProvider>
      </SnackbarProvider>
    </SocketContextProvider>
  );
};

export default ClientLayout;
