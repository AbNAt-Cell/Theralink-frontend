"use client";

import { useState } from "react";
import { Search, Plus, FileText } from "lucide-react";
import ClientModal from "@/components/ClientPortalModal";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showClientModal, setShowClientModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Client Portal Parental Access</h1>
          <button onClick={() => setShowClientModal(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search clients..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <FileText className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No result found</h3>
            <p className="text-gray-500 mb-6">There are no clients in your portal yet. Add your first client to get started.</p>
          </div>
        </div>
      </div>

      {showClientModal && <ClientModal isOpen={showClientModal} onClose={() => setShowClientModal(false)} />}
    </div>
  );
}
