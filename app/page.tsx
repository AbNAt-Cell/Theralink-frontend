"use client";

import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingPricingPreview from "@/components/landing/LandingPricingPreview";
import LandingFooter from "@/components/landing/LandingFooter";
import { ArrowRight, MessageSquareText, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary/20 selection:text-primary">
      {/* Navigation */}
      <LandingNavbar />

      <main>
        {/* Hero Section */}
        <LandingHero />

        {/* Features Section */}
        <LandingFeatures />

        {/* CTA Section - Ready to Modernize */}
        <section id="about" className="py-24 bg-primary overflow-hidden relative">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-widest mb-10 border border-white/20 backdrop-blur-sm">
                Join the Digital Clinical Revolution
             </div>
             <h2 className="text-4xl lg:text-7xl font-extrabold text-white mb-10 leading-[1.1] max-w-4xl mx-auto">
                Ready to Modernize Your <span className="text-secondary-foreground italic underline decoration-secondary tracking-tight">Practice?</span>
             </h2>
             <p className="text-xl text-white/80 leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
                Join over 2,500 clinics worldwide who trust TerraLink for their clinical workflows and patient engagement.
             </p>
             <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" asChild className="h-16 px-12 text-xl font-bold bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20 group">
                    <Link href="/pricing">
                        Start Free Trial <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-16 px-12 text-xl font-bold border-2 border-white/40 text-white hover:bg-white/10 backdrop-blur-sm">
                    <Link href="/contact">Book a Demo</Link>
                </Button>
             </div>
          </div>
        </section>

        {/* Social Proof / Stats Section */}
        <section className="py-20 bg-white border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-12 text-center">
                    <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl font-extrabold text-primary mb-3">250,000+</div>
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest italic">Patient Visits Managed</div>
                    </div>
                    <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl font-extrabold text-primary mb-3">99.9%</div>
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest italic">Uptime SLA</div>
                    </div>
                    <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl font-extrabold text-primary mb-3">#1</div>
                        <div className="text-sm font-bold text-gray-500 uppercase tracking-widest italic">Clinical Workflow Suite</div>
                    </div>
                </div>
            </div>
        </section>

        {/* Pricing Preview Section */}
        <LandingPricingPreview />
        
        {/* Support Section */}
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-8">
                            <MessageSquareText className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-8 leading-tight tracking-tight">
                            World-Class Support <br />Whenever You Need It
                        </h2>
                        <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-lg">
                            Can&apos;t find what you&apos;re looking for? Reach out to our dedicated support team for specialized assistance. We work around the clock to ensure your clinic never stops caring.
                        </p>
                        <div className="flex flex-col gap-6">
                            <div className="flex gap-4 p-6 rounded-xl border border-gray-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group">
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <ShieldAlert className="w-6 h-6" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900 mb-1 italic">HIPAA Compliance Center</h5>
                                    <p className="text-sm text-gray-500 uppercase tracking-tighter">Learn about our security protocols and data encryption standards.</p>
                                </div>
                            </div>
                            <Button size="lg" asChild className="h-14 font-bold text-lg px-10 w-fit shadow-xl shadow-primary/20">
                                <Link href="/contact">Contact Support</Link>
                            </Button>
                        </div>
                    </div>
                    
                    <div className="bg-gray-100 aspect-video rounded-3xl overflow-hidden border-8 border-white shadow-2xl relative group">
                        {/* Abstract design elements to look like a high-end UI */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20" />
                        <div className="absolute top-10 left-10 right-10 bottom-10 bg-white rounded-2xl shadow-inner border border-gray-100 flex flex-col p-8 backdrop-blur-3xl bg-white/80 scale-95 group-hover:scale-100 transition-transform duration-700 ease-out">
                             <div className="h-4 bg-gray-100 w-48 rounded-full mb-10" />
                             <div className="flex-1 space-y-6">
                                <div className="h-24 bg-primary/5 w-full rounded-xl" />
                                <div className="h-32 bg-secondary/5 w-full rounded-xl" />
                             </div>
                             <div className="h-10 bg-primary/10 w-32 rounded-lg mt-10 self-end" />
                        </div>
                        <div className="absolute bottom-6 left-6 px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-xl shadow-primary/40 backdrop-blur-md italic animate-pulse">
                            Secure Support Channel Active
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
