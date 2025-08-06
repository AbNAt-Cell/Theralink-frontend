"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Templates</h1>
        </div>

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input type="text" placeholder="Search Template Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">POS</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Time Recording</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">File Template</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Can Apply Client Sig</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Show Client Progress</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Show Service</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  No record available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
