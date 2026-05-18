"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { Check, HelpCircle, ArrowRight, Zap, ShieldCheck, PhoneCall, ClipboardList, CreditCard } from "lucide-react";
import { Fragment } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const featuresList = [
  { 
    group: "Practice Management", 
    features: [
      "Custom Documentation & Intake Forms", 
      "Unlimited Client Records", 
      "Unlimited File Storage", 
      "Automated System Updates"
    ] 
  },
  { 
    group: "Billing & Insurance", 
    features: [
      "Unlimited Electronic Insurance Claims", 
      "Unlimited Eligibility Checks", 
      "Automated Reconciliation", 
      "Direct Billing & Digital Payments"
    ] 
  },
  { 
    group: "Clinical Tools", 
    features: [
      "Integrated One-to-One Telehealth", 
      "Digital Progress Notes & Assessments", 
      "Secure HIPAA-compliant Portal", 
      "Threaded Care Team Messaging"
    ] 
  },
  { 
    group: "Support & Security", 
    features: [
      "Live Chat & Ticketing Support", 
      "2 Hours Virtual Training Included", 
      "E2E Data Encryption", 
      "No Contract - Cancel Anytime"
    ] 
  },
];

const faqs = [
  {
    q: "Is there really no hidden fee?",
    a: "Yes. Our pricing is a simple, flat-rate of $55 per month per user. There are no per-claim fees, no storage limits, and no hidden setup costs.",
  },
  {
    q: "What does 'unlimited' really mean?",
    a: "It means exactly that. Unlimited clients, unlimited electronic insurance claims, unlimited 1:1 telehealth sessions, and unlimited document storage—all included in your $55/mo subscription.",
  },
  {
    q: "Can I try it before I commit?",
    a: "Absolutely. We offer a 14-day free trial with no credit card required. You get full access to all features so you can see how TerraLink fits your practice.",
  },
  {
    q: "Is TerraLink HIPAA compliant?",
    a: "Yes. TerraLink is built from the ground up to exceed HIPAA standards, with bank-grade encryption at rest and in transit.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      <main className="pt-32 pb-24">
        {/* Header Section */}
        <section className="text-center mb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
            Simple, All-Inclusive Pricing
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
             One Price. <span className="text-primary italic">Unlimited</span> Possibilities.
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed font-medium">
            No hidden fees. No per-claim charges. No storage limits. Just a $55/mo subscription that includes everything you need to run your practice efficiently and remain HIPAA compliant.
          </p>
        </section>

        {/* The Single Plan Card */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto mb-32">
          <div className="relative p-12 lg:p-16 rounded-[2.5rem] border-4 border-primary bg-white shadow-[0_32px_64px_-16px_rgba(13,51,242,0.15)] z-10 overflow-hidden ring-4 ring-primary/5">
             <div className="absolute top-0 right-0 -tr-10 -mr-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl opacity-50" />
             
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                   <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-wide">The Full Suite</h2>
                   <p className="text-gray-500 font-bold uppercase text-xs tracking-widest italic opacity-80">Everything always included</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1">
                        <span className="text-6xl font-black text-primary tracking-tighter">$55</span>
                        <span className="text-gray-400 font-bold uppercase text-[12px] tracking-widest">/ User / Month</span>
                    </div>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-x-12 gap-y-6 mb-16">
                {[
                  "Unlimited Intake & Notes",
                  "One-to-One Telehealth",
                  "Electronic Claims (No Fees)",
                  "Unlimited Eligibility Checks",
                  "Secure Client Portal",
                  "Unlimited Storage",
                  "HIPAA Security Pack",
                  "Live Chat Support"
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                     <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary transition-colors">
                        <Check className="w-3 h-3 text-primary group-hover:text-white transition-colors" />
                     </div>
                     <span className="text-gray-700 font-bold italic group-hover:text-gray-900 transition-colors">{feat}</span>
                  </div>
                ))}
             </div>

             <Button size="lg" asChild className="h-20 w-full text-2xl font-black bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/40 rounded-2xl group uppercase tracking-tight italic">
                <Link href="/admin/signup">
                    Start 14-Day Free Trial <ArrowRight className="ml-3 w-7 h-7 group-hover:translate-x-1 transition-transform" />
                </Link>
             </Button>
             
             <p className="mt-8 text-center text-gray-400 font-bold uppercase text-[10px] tracking-widest">No Credit Card Required • No Contracts • Cancel Anytime</p>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section id="features" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-32">
             <div className="text-center mb-20 max-w-2xl mx-auto">
                <h2 className="text-sm font-black text-primary uppercase tracking-[0.4em] mb-4">// Full System Audit</h2>
                <h3 className="text-4xl font-extrabold text-gray-900 mb-6 font-mono tracking-tighter">Everything Included, Standard</h3>
                <p className="text-lg text-gray-500 font-medium italic">We don&apos;t lock features behind upgrade walls. Every user gets the full TerraLink experience.</p>
             </div>
             
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                {featuresList.map((group, i) => (
                    <div key={i} className="p-10 rounded-[2rem] bg-gray-50 border border-gray-100 hover:bg-white hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 pb-4 border-b border-gray-200">{group.group}</h4>
                        <ul className="space-y-6">
                            {group.features.map((feat, j) => (
                                <li key={j} className="flex items-start gap-4">
                                    <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                    <span className="text-sm font-bold text-gray-700 leading-tight">{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
             </div>
        </section>

        {/* Quick Wins / Why TerraLink Section */}
        <section className="bg-gray-900 py-24 mb-32 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-3 gap-16">
                    <div className="text-center md:text-left">
                        <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-8 mx-auto md:mx-0">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Rapid Implementation</h4>
                        <p className="text-gray-400 font-medium leading-relaxed italic opacity-80">Transition from your legacy system in just 2 hours. Includes live virtual training so you can start care immediately.</p>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-8 mx-auto md:mx-0">
                            <ShieldCheck className="w-6 h-6 text-green-500" />
                        </div>
                        <h4 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Enterprise Compliance</h4>
                        <p className="text-gray-400 font-medium leading-relaxed italic opacity-80">Full HIPAA compliance with automatic system updates to ensure your practice remains up-to-date with current medical regulations.</p>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-8 mx-auto md:mx-0">
                            <PhoneCall className="w-6 h-6 text-blue-500" />
                        </div>
                        <h4 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">Dedicated Support</h4>
                        <p className="text-gray-400 font-medium leading-relaxed italic opacity-80">Live chat, ticketing, and customized on-site training for large organizations. We are your partner in practice clinical success.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* FAQ Section */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto mb-20 relative">
            <div className="text-center mb-20">
                <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Support & FAQ</h2>
                <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">Answers You Need</h3>
            </div>

            <div className="grid gap-8">
                {faqs.map((faq, i) => (
                    <div key={i} className="flex gap-8 p-10 rounded-[2rem] bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
                        <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0 text-primary group">
                            <HelpCircle className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div>
                            <h4 className="text-xl font-bold text-gray-900 mb-4 tracking-tight uppercase tracking-wider italic">{faq.q}</h4>
                            <p className="text-gray-500 leading-relaxed font-bold italic opacity-70">/ {faq.a}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
