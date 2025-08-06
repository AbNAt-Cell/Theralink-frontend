"use client";

import { useState } from "react";
import { Search, Plus, Building } from "lucide-react";
import SiteModal from "@/components/SitesModal";

interface Site {
  id: string;
  name: string;
  address: string;
  phone: string;
  clientCount: number;
  active: boolean;
}

const sampleSites: Site[] = [
  {
    id: "1",
    name: "Downtown Therapy Center",
    address: "123 Main St, Downtown",
    phone: "(555) 123-4567",
    clientCount: 45,
    active: true,
  },
  {
    id: "2",
    name: "Westside Wellness",
    address: "456 Oak Ave, Westside",
    phone: "(555) 987-6543",
    clientCount: 32,
    active: true,
  },
  {
    id: "3",
    name: "Northside Clinic",
    address: "789 Pine St, Northside",
    phone: "(555) 456-7890",
    clientCount: 0,
    active: false,
  },
];

export default function SitesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showInactiveSites, setShowInactiveSites] = useState(false);
  const [showSiteModal, setShowSiteModal] = useState(false);

  const filteredSites = sampleSites.filter((site) => showInactiveSites || site.active).filter((site) => site.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Sites</h1>
          <button onClick={() => setShowSiteModal(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add New Site</span>
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search sites..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input type="checkbox" checked={showInactiveSites} onChange={(e) => setShowInactiveSites(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span>Show Inactive Sites</span>
          </label>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Site</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Address</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700"># of Clients</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSites.length > 0 ? (
                filteredSites.map((site) => (
                  <tr key={site.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{site.name}</span>
                          {!site.active && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{site.address}</td>
                    <td className="px-6 py-4 text-gray-600">{site.phone}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{site.clientCount}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No sites found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showSiteModal && <SiteModal isOpen={showSiteModal} onClose={() => setShowSiteModal(false)} />}
    </div>
  );
}
