"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 md:py-20 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 md:col-span-1">
             <Link href="/" className="flex-shrink-0 mb-6 flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="TerraLink logo"
                width={150}
                height={32}
                priority
              />
            </Link>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed max-w-xs">
              Setting the standard for modern clinical management and patient engagement with end-to-end clinical workflow solutions.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer">
                <Mail className="w-4 h-4" /> support@terralink.com
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer">
                <Phone className="w-4 h-4" /> +1 (800) 123-4567
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors cursor-pointer">
                <MapPin className="w-4 h-4" /> 123 Tech Center Dr, Austin, TX 78701
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="/#features" className="text-sm text-gray-500 hover:text-primary transition-colors">Features</Link></li>
              <li><Link href="/#solutions" className="text-sm text-gray-500 hover:text-primary transition-colors">Solutions</Link></li>
              <li><Link href="/pricing" className="text-sm text-gray-500 hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/#integrations" className="text-sm text-gray-500 hover:text-primary transition-colors">Integrations</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Compliance</h4>
            <ul className="space-y-4">
              <li><Link href="/hipaa" className="text-sm text-gray-500 hover:text-primary transition-colors">HIPAA Policy</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/security" className="text-sm text-gray-500 hover:text-primary transition-colors">Security Standards</Link></li>
            </ul>
          </div>

          <div>
             <h4 className="font-semibold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/docs" className="text-sm text-gray-500 hover:text-primary transition-colors inline-flex items-center gap-1">Documentation <ExternalLink className="w-3 h-3" /></Link></li>
              <li><Link href="/api" className="text-sm text-gray-500 hover:text-primary transition-colors">API Status</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/help" className="text-sm text-gray-500 hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
            <div className="mt-8 flex gap-3">
              <a href="#" className="h-10 w-32 bg-gray-900 rounded-lg flex items-center justify-center text-white hover:bg-gray-800 transition">
                <span className="text-[10px] scale-90 -mr-1 flex flex-col items-start leading-none opacity-80">Download on the</span>
                <span className="font-semibold text-xs ml-1">App Store</span>
              </a>
              <a href="#" className="h-10 w-32 bg-gray-900 rounded-lg flex items-center justify-center text-white hover:bg-gray-800 transition">
                <span className="text-[10px] scale-90 -mr-1 flex flex-col items-start leading-none opacity-80">Get it on</span>
                <span className="font-semibold text-xs ml-1">Google Play</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">
            © 2024 TerraLink Systems Inc. Setting the standard for modern clinical management.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-gray-500 hover:text-primary cursor-pointer transition">Twitter</span>
            <span className="text-xs text-gray-500 hover:text-primary cursor-pointer transition">LinkedIn</span>
            <span className="text-xs text-gray-500 hover:text-primary cursor-pointer transition">Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
