"use client";

import { Users, FileCheck, Settings, Workflow, Blocks, UserCheck, CalendarDays, ClipboardList, Lock, MessageSquare } from "lucide-react";

const staffFeatures = [
    {
        title: "User Management",
        description: "Granular role-based access control. Assign permissions to physicians, nurses, and administrative staff with ease.",
        icon: Users,
        color: "blue"
    },
    {
        title: "Secure Messaging",
        description: "Threaded clinical conversations and integrated WebRTC calls for real-time collaboration between care teams.",
        icon: MessageSquare,
        color: "indigo"
    },
    {
        title: "Staff Certifications",
        description: "Automated tracking for professional credentials and compliance documents. Get notified before renewals.",
        icon: FileCheck,
        color: "teal"
    },
    {
        title: "Authorizations",
        description: "Digital workflow for procedure authorizations and insurance verification tracking.",
        icon: Workflow,
        color: "purple"
    },
    {
        title: "Site-wide Settings",
        description: "Unified configuration for multi-location practices. Standardize clinical workflows across all branches.",
        icon: Settings,
        color: "slate"
    },
    {
        title: "Custom Modules",
        description: "Need something specific for your specialty? We build custom extensions to suit your practice.",
        icon: Blocks,
        color: "orange"
    }
];

const clientFeatures = [
    {
        title: "Secure Portal",
        description: "24/7 access for patients to view health updates and interact with providers safely.",
        icon: UserCheck
    },
    {
        title: "Real-time Booking",
        description: "Instant appointment confirmation with automated reminders to reduce no-shows.",
        icon: CalendarDays
    },
    {
        title: "Record Access",
        description: "Securely view labs, imaging results, and visit summaries from any device.",
        icon: ClipboardList
    },
    {
        title: "HIPAA Compliance",
        description: "Encryption-at-rest and end-to-end security for all sensitive health tracking data.",
        icon: Lock
    }
];

export default function LandingFeatures() {
  return (
    <div id="features" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-4">Operations & Experience</h2>
          <h3 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Comprehensive tools to eliminate administrative friction
          </h3>
          <p className="text-lg text-gray-500">
            Powered by modern clinical intelligence and HIPAA-compliant data security, TerraLink empowers your team and your patients.
          </p>
        </div>

        <div id="solutions" className="mb-24">
            <div className="flex items-center gap-4 mb-12">
                <div className="h-px bg-gray-100 flex-1" />
                <h4 className="text-xl font-bold text-gray-900">Admin & Staff Efficiency</h4>
                <div className="h-px bg-gray-100 flex-1" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {staffFeatures.map((feature, i) => (
                    <div key={i} className="group p-8 rounded-2xl border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-${feature.color}-50 text-${feature.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                            <feature.icon className="w-7 h-7" />
                        </div>
                        <h5 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h5>
                        <p className="text-gray-500 leading-relaxed text-sm">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>

        <div>
            <div className="flex items-center gap-4 mb-12">
                <div className="h-px bg-gray-100 flex-1" />
                <h4 className="text-xl font-bold text-gray-900">Patient Digital Engagement</h4>
                <div className="h-px bg-gray-100 flex-1" />
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {clientFeatures.map((feature, i) => (
                    <div key={i} className="flex flex-col items-center text-center p-6 rounded-2xl bg-gray-50/50 hover:bg-white border border-transparent hover:border-primary/10 transition-all duration-300">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-white border border-gray-100 shadow-sm text-primary">
                            <feature.icon className="w-5 h-5" />
                        </div>
                        <h5 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h5>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
