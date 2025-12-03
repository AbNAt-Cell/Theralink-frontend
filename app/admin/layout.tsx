"use client";

import { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import AdminHeader from "@/components/AdminHeader";
import { isAuthenticated, isAdmin, getStoredUser, User } from "@/hooks/auth";
import SocketContextProvider from "@/context/SocketContextProvider";
import { PeerProvider } from "@/context/CallProvider";
import { SnackbarProvider } from "notistack";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  }, []);
  // useEffect(() => {
  //   if (!isAuthenticated()) {
  //     router.push("/admin/login");
  //   } else if (!isAdmin()) {
  //     router.push("/client/dashboard");
  //   }
  // }, [router]);

  // const user = getStoredUser();
  // useSocket(user ? { userId: user.id } : { userId: null });

  return (
    <SocketContextProvider>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "top", horizontal: "right" }} autoHideDuration={4000}>
        <PeerProvider loggedInUser={user}>
          <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <main className="container max-w-[1350px] mx-auto p-6 space-y-6">{children}</main>
          </div>
        </PeerProvider>
      </SnackbarProvider>
    </SocketContextProvider>
  );
}
