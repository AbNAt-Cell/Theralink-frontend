"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { logout } from "@/hooks/auth";
import { useRouter } from "nextjs-toploader/app";
import { Menu, X } from "lucide-react";
``;

interface HeaderProps {
  user: any;
}

const ClientHeader = ({ user }: HeaderProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // useEffect(() => {
  //   if (loggedInUser) {
  //     const user = Cookies.get("user");
  //     if (user) {
  //       try {
  //         const parsedUser = JSON.parse(user);
  //         setLoggedInUser(parsedUser);
  //       } catch (err) {
  //         console.error("Failed to parse user cookie", err);
  //       }
  //     }
  //   }
  // }, [loggedInUser]);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      logout(loggedInUser?.token);
      localStorage.removeItem("token");
      // Redirect to login pag
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="bg-white border-b">
      <div className="border-b">
        <div className="mx-auto max-w-[1350px]">
          <div className="flex items-center justify-between h-[80px] px-6 py-3">
            <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center space-x-4">
              <Image src="/images/logo.png" alt="Next.js logo" width={150} height={32} priority />
            </div>
            <div className="flex items-center space-x-9">
              <div className="hidden md:block space-x-4">
                <Link className={`hover:text-primary ${isActive("/client/dashboard") ? "text-primary" : ""}`} href="/client/dashboard">
                  Home
                </Link>
                <Link className={`hover:text-primary ${isActive("/client/diagnosis") ? "text-primary" : ""}`} href="/client/diagnosis">
                  Diagnosis
                </Link>
                <Link className={`hover:text-primary ${isActive("/client/care-plan") ? "text-primary" : ""}`} href="/client/care-plan">
                  Care Plan
                </Link>
                <Link className={`hover:text-primary ${isActive("/client/appointments") ? "text-primary" : ""}`} href="/client/appointments">
                  Appointments
                </Link>
                <Link className={`hover:text-primary ${isActive("/client/messaging") ? "text-primary" : ""}`} href="/client/messaging">
                  Messaging
                </Link>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full bg-secondary hover:bg-secondary text-white hover:text-white">
                    {user?.username?.charAt(0)}
                    {/* {user?.lastName?.charAt(0)} */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={"/client/dashboard"}>Profile</Link>
                  </DropdownMenuItem>
                  {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleLogout()}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {mobileOpen && (
            <nav className="md:hidden bg-white border-t flex flex-col space-y-2 px-6 py-4">
              <Link className={`hover:text-primary ${isActive("/client/dashboard") ? "text-primary" : ""}`} href="/client/dashboard">
                Home
              </Link>
              <Link className={`hover:text-primary ${isActive("/client/diagnosis") ? "text-primary" : ""}`} href="/client/diagnosis">
                Diagnosis
              </Link>
              <Link className={`hover:text-primary ${isActive("/client/care-plan") ? "text-primary" : ""}`} href="/client/care-plan">
                Care Plan
              </Link>
              <Link className={`hover:text-primary ${isActive("/client/appointments") ? "text-primary" : ""}`} href="/client/appointments">
                Appointments
              </Link>
              <Link className={`hover:text-primary ${isActive("/client/messaging") ? "text-primary" : ""}`} href="/client/messaging">
                Messaging
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
