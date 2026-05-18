"use client";

import { Check, ArrowRight, Zap, ShieldCheck, Mail, Video } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const includedFeatures = [
    "Unlimited Intake & Notes",
    "One-to-One Telehealth",
    "Electronic Claims (No Fees)",
    "Unlimited Eligibility Checks",
    "Secure Client Portal",
    "Unlimited Records & Storage",
    "HIPAA Compliance Active",
    "Live Chat Support"
];

export default function LandingPricingPreview() {
  return (
    <div id="pricing" className="py-24 bg-gray-50/50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -z-10 opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-24 max-w-2xl mx-auto px-4 sm:px-0">
          <h2 className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4">// One Fixed Cost</h2>
          <h3 className="text-4xl lg:text-6xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
            Transparent, Simple, <br /><span className="text-primary italic">Unlimited</span>.
          </h3>
          <p className="text-lg text-gray-500 font-bold leading-relaxed italic opacity-85">
            Transparent, flat-rate pricing. No contracts, no hidden fees, no per-claim charges. One subscription, the full system.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
            <div className="relative p-12 lg:p-16 rounded-[2.5rem] border-4 border-primary bg-white shadow-3xl shadow-primary/10 group overflow-hidden">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-10 py-1.5 rounded-full bg-primary text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-xl shadow-primary/40 z-20 italic">
                    All-Inclusive Plan
                </div>
                
                <div className="grid lg:grid-cols-2 gap-16 relative z-10">
                    <div>
                        <div className="flex items-baseline gap-2 mb-10">
                            <span className="text-7xl font-black text-gray-900 tracking-tighter">$55</span>
                            <div className="flex flex-col">
                                <span className="text-gray-400 font-bold uppercase text-[12px] tracking-widest leading-none mb-1">/ User / Month</span>
                                <span className="text-primary font-black uppercase text-[10px] tracking-widest leading-none italic animate-pulse">Save 20% Annually</span>
                            </div>
                        </div>
                        
                        <p className="text-gray-500 font-bold text-sm leading-relaxed italic mb-10 max-w-xs">
                          Designed for everything from solo practitioners to large multi-site healthcare agencies.
                        </p>
                        
                        <div className="space-y-4">
                             <Button size="lg" asChild className="h-20 w-full text-2xl font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/30 rounded-2xl group uppercase tracking-tight italic transition-all duration-300">
                                <Link href="/admin/signup">
                                    Start Free Trial <ArrowRight className="ml-3 w-7 h-7 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>
                            <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-widest">/ 14-Day Full Access Trial</p>
                        </div>
                    </div>
                    
                    <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100/50">
                        <div className="grid gap-x-6 gap-y-4">
                            {includedFeatures.map((feat, i) => (
                                <div key={i} className="flex items-center gap-4 group/item">
                                    <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover/item:bg-primary transition-colors">
                                        <Check className="w-2.5 h-2.5 text-primary group-hover/item:text-white transition-colors" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 italic group-hover/item:text-gray-900 transition-colors uppercase tracking-tight">{feat}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-wrap gap-4 items-center justify-center grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
                             <ShieldCheck className="w-6 h-6" />
                             <Zap className="w-6 h-6" />
                             <Mail className="w-6 h-6" />
                             <Video className="w-6 h-6" />
                             <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">EHR Certified</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-16 bg-white p-8 rounded-2xl border border-gray-100 text-center shadow-xl shadow-gray-100/30">
                <Link href="/pricing" className="inline-flex items-center gap-2 text-[12px] font-black text-primary uppercase tracking-[0.2em] group decoration-primary/30 hover:underline decoration-2 underline-offset-8 transition-all italic">
                    See Full System Audit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
      </div>
    </div>
  );
}
