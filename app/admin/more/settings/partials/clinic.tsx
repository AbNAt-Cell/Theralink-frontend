"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import ClinicModal, { ClinicFormData } from "./clinicModal";

const initialClinic: ClinicFormData & { name: string; logoUrl: string } = {
  name: "Auspicious Community Service, LLC",
  address: "305 FM 517 Road E.",
  phone: "(832) 774-7144",
  email: "Veidusuyi@AuspiciousCS.com",
  fax: "(281) 863-9461",
  npi: "1841993334",
  taxId: "923089818",
  taxonomy: "251B00000X",
  website: "",
  roundUp: false,
  state1: "TX",
  state2: "TX",
  zip: "77539",
  firstDayOfWeek: "Sunday",
  logoUrl: "/images/logo.png",
};

const ClinicDetails: React.FC = () => {
  const [clinic, setClinic] = useState(initialClinic);
  const [modalOpen, setModalOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(clinic.logoUrl);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleEdit = () => setModalOpen(true);

  const handleModalSubmit = (data: ClinicFormData) => {
    setClinic(prev => ({ ...prev, ...data }));
    setModalOpen(false);
  };

  // Logo upload handler
  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
      setClinic(prev => ({ ...prev, logoUrl: url }));
      // Update header logo if needed
      if (typeof window !== "undefined") {
        const event = new CustomEvent("update-header-logo", { detail: url });
        window.dispatchEvent(event);
      }
    }
  };

  React.useEffect(() => {
    // Listen for logo updates from this page and update header if needed
    const updateHeaderLogo = (e: any) => {
      const logoUrl = e.detail;
      const headerLogo = document.getElementById("header-logo-img");
      if (headerLogo && logoUrl) {
        (headerLogo as HTMLImageElement).src = logoUrl;
      }
    };
    window.addEventListener("update-header-logo", updateHeaderLogo);
    return () => window.removeEventListener("update-header-logo", updateHeaderLogo);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">
      {/* Main Details */}
      <div className="flex-1 flex flex-col gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-semibold">Details</h2>
            <Button className="bg-blue-900 text-white font-medium px-5 py-2 rounded-md flex items-center gap-2" onClick={handleEdit}>
              <span className="text-lg"><i className="fa fa-edit" /></span>
              Edit Info
            </Button>
          </div>
          <div className="bg-white rounded-xl border p-8 mb-6">
            <h3 className="text-2xl font-semibold mb-2">{clinic.name}</h3>
            <div className="text-lg text-gray-700 mb-1">{clinic.address}</div>
            <div className="text-lg text-gray-700 mb-1">{clinic.phone}</div>
            <div className="text-lg text-gray-700 mb-1">{clinic.email}</div>
          </div>
          <div className="bg-white rounded-xl border p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="font-semibold text-lg mb-1">Fax</div>
              <div className="text-gray-700 mb-4">{clinic.fax}</div>
              <div className="font-semibold text-lg mb-1">Start of Week</div>
              <div className="text-gray-700 mb-4">{clinic.firstDayOfWeek}</div>
              <div className="font-semibold text-lg mb-1">Website URL</div>
              <div className="text-gray-700 mb-4">{clinic.website || '-'}</div>
            </div>
            <div>
              <div className="font-semibold text-lg mb-1">NPI #</div>
              <div className="text-gray-700 mb-4">{clinic.npi}</div>
              <div className="font-semibold text-lg mb-1">Taxnomy #</div>
              <div className="text-gray-700 mb-4">{clinic.taxonomy}</div>
            </div>
            <div>
              <div className="font-semibold text-lg mb-1">Tax ID</div>
              <div className="text-gray-700 mb-4">{clinic.taxId}</div>
              <div className="font-semibold text-lg mb-1">Round Up Billing Units</div>
              <div className="text-gray-700 mb-4">{clinic.roundUp ? "YES" : "NO"}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Logo Section */}
      <div className="flex flex-col items-center justify-start min-w-[260px] cursor-pointer" onClick={handleLogoClick}>
        <img src={logoPreview} alt="Clinic Logo" className="w-40 h-40 object-contain mb-2" id="settings-logo-img" />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleLogoChange}
        />
        <div className="flex flex-col items-center">
          <Upload className="text-blue-700 mb-1" />
          <span className="text-gray-600 text-sm">(Add New or Update Logo)</span>
        </div>
      </div>
      <ClinicModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={clinic}
      />
    </div>
  );
};

export default ClinicDetails;
