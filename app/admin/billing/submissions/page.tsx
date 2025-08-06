"use client";

import { useState } from "react";
import { Search, Filter, X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  total: number;
  status: "Paid" | "Unpaid" | "Overdue" | "Draft";
  customer: string;
}

interface FilterState {
  status: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
}

const sampleInvoices: Invoice[] = [
  {
    id: "29981",
    invoiceNumber: "INV-000022",
    date: "Tuesday, March 18th 2025",
    dueDate: "May 17th 2025",
    total: 25000,
    status: "Unpaid",
    customer: "New Customer",
  },
  {
    id: "29982",
    invoiceNumber: "INV-000023",
    date: "Monday, March 17th 2025",
    dueDate: "April 16th 2025",
    total: 42050,
    status: "Paid",
    customer: "ABC Corp",
  },
  {
    id: "29983",
    invoiceNumber: "INV-000024",
    date: "Sunday, March 16th 2025",
    dueDate: "March 30th 2025",
    total: 15000,
    status: "Overdue",
    customer: "XYZ Ltd",
  },
  {
    id: "29984",
    invoiceNumber: "INV-000025",
    date: "Saturday, March 15th 2025",
    dueDate: "April 14th 2025",
    total: 35000,
    status: "Draft",
    customer: "Tech Solutions Inc",
  },
  {
    id: "29985",
    invoiceNumber: "INV-000026",
    date: "Friday, March 14th 2025",
    dueDate: "May 13th 2025",
    total: 18500,
    status: "Paid",
    customer: "Design Studio",
  },
];

export default function InvoiceListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "",
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
    });
    setSearchQuery("");
    setShowFilters(false);
  };

  const filteredInvoices = sampleInvoices.filter((invoice) => {
    // Search filter
    const matchesSearch = invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) || invoice.customer.toLowerCase().includes(searchQuery.toLowerCase()) || invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    // Status filter
    const matchesStatus = !filters.status || invoice.status === filters.status;

    // Amount filter
    const matchesAmount = (!filters.amountMin || invoice.total >= Number.parseFloat(filters.amountMin)) && (!filters.amountMax || invoice.total <= Number.parseFloat(filters.amountMax));

    return matchesSearch && matchesStatus && matchesAmount;
  });

  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + itemsPerPage);

  const hasActiveFilters = Object.values(filters).some((value) => value !== "") || searchQuery !== "";

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Invoices</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Loyalty Points</div>
          <div className="text-2xl font-bold text-gray-900">36.26 Points</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">Total Balance</div>
          <div className="text-2xl font-bold text-gray-900">NGN 67,050.00</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-sm text-gray-600 mb-1">New Invoices</div>
          <div className="text-2xl font-bold text-gray-900">2</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input type="text" placeholder="Search invoices..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center space-x-3">
              <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center space-x-2 px-4 py-2 border rounded-md text-sm font-medium transition-colors ${showFilters || hasActiveFilters ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                <Filter className="w-4 h-4" />
                <span>Add Filter</span>
                {hasActiveFilters && <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">{Object.values(filters).filter((v) => v !== "").length + (searchQuery ? 1 : 0)}</span>}
              </button>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors">
                  <X className="w-4 h-4" />
                  <span>Clear Filter</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">All Statuses</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                  <input type="date" value={filters.dateFrom} onChange={(e) => handleFilterChange("dateFrom", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                  <input type="date" value={filters.dateTo} onChange={(e) => handleFilterChange("dateTo", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
                  <div className="flex space-x-2">
                    <input type="number" placeholder="Min" value={filters.amountMin} onChange={(e) => handleFilterChange("amountMin", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <input type="number" placeholder="Max" value={filters.amountMax} onChange={(e) => handleFilterChange("amountMax", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      {hasActiveFilters && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredInvoices.length} of {sampleInvoices.length} invoices
        </div>
      )}

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Invoice Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Due Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Total</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.dueDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.customer}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">NGN {invoice.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${invoice.status === "Paid" ? "bg-green-100 text-green-800" : invoice.status === "Unpaid" ? "bg-yellow-100 text-yellow-800" : invoice.status === "Overdue" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>{invoice.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No invoices found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredInvoices.length > 0 && (
          <div className="bg-white px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredInvoices.length)} of {filteredInvoices.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === page ? "bg-blue-600 text-white" : "border border-gray-300 text-gray-700 hover:bg-gray-50"}`}>
                      {page}
                    </button>
                  ))}
                </div>
                <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
