"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function AddParentalAccessPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fileName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setForm({ fileName: '', lastName: '', email: '', phone: '' });
  };

  const handleCancel = () => {
    router.push('/admin/more/parental-access');
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-8">Add Parental Access</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">File Name</label>
          <Input name="fileName" value={form.fileName} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <Input name="lastName" value={form.lastName} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <Input name="phone" type="tel" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="col-span-2 flex gap-4 mt-4">
          <Button type="submit" variant="secondary">Submit</Button>
          <Button type="button" variant="outlineSecondary" onClick={handleCancel} className="border-blue-900 text-blue-900">Cancel</Button>
        </div>
      </form>
    </div>
  );
}
