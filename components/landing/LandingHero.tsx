"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingHero() {
  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-white to-white" />
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-8">
              <Zap className="w-3 h-3" /> Now Trusted by 2,500+ Clinics
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-8">
              The Ultimate Clinical <span className="text-primary italic">Management</span> Solution
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-xl">
              From administrative friction to patient engagement, TerraLink provides an end-to-end HIPAA-compliant workflow designed for the modern healthcare era.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/20 group">
                <Link href="/pricing">
                  Get Started Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-2 hover:bg-gray-50">
                <Link href="#solutions">See Solutions</Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-10">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <ShieldCheck className="w-5 h-5 text-green-500" /> HIPAA Compliant
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                <BarChart3 className="w-5 h-5 text-blue-500" /> Scalable Analytics
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10 rounded-2xl border-4 border-white shadow-2xl overflow-hidden aspect-[4/3] transform hover:scale-[1.02] transition-transform duration-500 ease-out">
              <Image 
                src="/images/hero-bg.png"
                alt="TerraLink Dashboard Visualization"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/20 rounded-2xl blur-xl -z-10" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary/10 rounded-full blur-2xl -z-10" />
            
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl flex items-center gap-4 border border-gray-100 max-w-xs animate-bounce-slow">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-none mb-1">E2E Secured</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-tighter">End-to-end Encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
