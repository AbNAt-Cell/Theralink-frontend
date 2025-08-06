"use client";

import { useState } from "react";
import { Calendar, Plus, Bold, Italic, Underline, List, Link, Trash2, User, Save } from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

export default function AdminNewBillingPage() {
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "Web Development Services",
      quantity: 1,
      price: 25000,
      amount: 25000,
    },
  ]);
  const [invoiceNumber, setInvoiceNumber] = useState("INV-000022");
  const [invoiceDate, setInvoiceDate] = useState("2025-03-18");
  const [dueDate, setDueDate] = useState("2025-05-17");
  const [bodyText, setBodyText] = useState("");
  const [customerName, setCustomerName] = useState("New Customer");
  const [customerEmail, setCustomerEmail] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const addNewItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      price: 0,
      amount: 0,
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoiceItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "price") {
            updated.amount = updated.quantity * updated.price;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setInvoiceItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  const discount = 0;
  const tax = 0;
  const total = subtotal - discount + tax;

  const handleSaveInvoice = () => {
    // Here you would typically save the invoice to your backend
    alert("Invoice saved successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Invoice</h1>
        <button onClick={handleSaveInvoice} className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1">
          <Save className="w-5 h-5" />
          <span>Save Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{customerName}</h3>
                  <p className="text-sm text-gray-500">{customerEmail || "Click to add customer details"}</p>
                </div>
              </div>
              <button onClick={() => setShowCustomerForm(!showCustomerForm)} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                {showCustomerForm ? "Cancel" : "Edit"}
              </button>
            </div>

            {showCustomerForm && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                    <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Invoice Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Date</label>
                <div className="relative">
                  <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <div className="relative">
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
                <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Item Description</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Quantity</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((item) => (
                      <tr key={item.id} className="border-t border-gray-200">
                        <td className="px-4 py-3">
                          <input type="text" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Enter item description" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value) || 0)} className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </td>
                        <td className="px-4 py-3">
                          <input type="number" value={item.price} onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value) || 0)} className="w-24 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500" />
                        </td>
                        <td className="px-4 py-3 text-gray-900 font-medium">NGN {item.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={addNewItem} className="mt-4 flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium">
                <Plus className="w-4 h-4" />
                <span>Add New Item</span>
              </button>
            </div>

            {/* Body Text Editor */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Body Text</h3>
              <div className="border border-gray-300 rounded-lg">
                <div className="flex items-center space-x-2 p-3 border-b border-gray-200 bg-gray-50">
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Bold className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Italic className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Underline className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <List className="w-4 h-4" />
                  </button>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <Link className="w-4 h-4" />
                  </button>
                </div>
                <textarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} className="w-full p-4 min-h-[120px] resize-none focus:outline-none" placeholder="Enter invoice notes or terms..." />
              </div>
              <button className="mt-2 text-blue-600 hover:text-blue-800 font-medium text-sm">Insert Fields</button>
            </div>

            {/* Template Selection */}
            <div>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">Select Template</button>
            </div>
          </div>
        </div>

        {/* Totals Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Sub Total</span>
                <span className="font-medium">NGN {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium">NGN {discount.toLocaleString()}</span>
              </div>
              <button className="w-full text-left text-blue-600 hover:text-blue-800 font-medium text-sm">+ Add Tax</button>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-medium text-gray-900">Total Amount</span>
                  <span className="text-lg font-bold text-gray-900">NGN {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
