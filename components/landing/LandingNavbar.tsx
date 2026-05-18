"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logo.png"
                alt="TerraLink logo"
                width={150}
                height={32}
                priority
              />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/#features" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="/#solutions" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                Solutions
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                Pricing
              </Link>
              <Link href="/#about" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                About
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href="/client/login">Client Login</Link>
            </Button>
            <Button asChild className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
              <Link href="/admin/login">Admin/Staff Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
