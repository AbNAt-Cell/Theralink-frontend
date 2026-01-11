'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Pencil, Camera, Loader } from 'lucide-react';
import { ClientProfile } from '@/hooks/admin/client';
import { Button } from '@/components/ui/button';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/Partials/use-toast';

interface AdminClientProfileProps {
  client?: ClientProfile | null;
  onAvatarUpdate?: (newUrl: string) => void;
}

export default function AdminClientProfile({ client, onAvatarUpdate }: AdminClientProfileProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const supabase = createClient();

  const clientData = {
    name: client ? `${client.firstName} ${client.lastName}` : 'Loading...',
    dob: client?.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : '—',
    email: client?.email || '—',
    phone: client?.phone || '—',
    insurance: client?.insurance?.insuranceType
      ? `${client.insurance.insuranceType} (${client.insurance.policyNumber || 'No policy #'})`
      : '—',
    recordNumber: client?.id?.split('-')[0] || '—',
    avatarUrl: client?.avatarUrl || null,
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !client?.id) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select an image file' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ variant: 'destructive', title: 'Error', description: 'Image must be less than 5MB' });
      return;
    }

    setUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${client.id}-${Date.now()}.${fileExt}`;
      const filePath = `clients/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', client.id);

      if (updateError) throw updateError;

      toast({ title: 'Success', description: 'Profile picture updated' });

      // Notify parent to refresh
      if (onAvatarUpdate) {
        onAvatarUpdate(publicUrl);
      } else {
        // Force page reload if no callback
        window.location.reload();
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error uploading avatar:', error);
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='border-b p-4 bg-white flex flex-col md:flex-row gap-4 items-start md:items-center'>
      {/* Avatar with upload overlay */}
      <div className='flex-shrink-0 relative group'>
        <div
          className='w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden relative cursor-pointer'
          onClick={handleAvatarClick}
        >
          {clientData.avatarUrl ? (
            <Image
              src={clientData.avatarUrl}
              alt={clientData.name}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <User className="w-10 h-10 text-slate-500" />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            {uploading ? (
              <Loader className="w-6 h-6 text-white animate-spin" />
            ) : (
              <Camera className="w-6 h-6 text-white" />
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Client info */}
      <div className='flex-grow'>
        <h1 className='text-xl font-bold'>{clientData.name}</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-600'>
          <div>
            <p>
              <span className='font-medium'>DOB:</span> {clientData.dob}
            </p>
            <p>
              <span className='font-medium'>Email:</span> {clientData.email}
            </p>
            <p>
              <span className='font-medium'>Record #:</span>{' '}
              {clientData.recordNumber}
            </p>
          </div>
          <div>
            <p>
              <span className='font-medium'>Phone:</span> {clientData.phone}
            </p>
            <p>
              <span className='font-medium'>Insurance:</span>{' '}
              {clientData.insurance}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      {client?.id && (
        <div className='flex-shrink-0'>
          <Link href={`/admin/clients/${client.id}/edit`}>
            <Button variant="outline" className="flex items-center gap-2">
              <Pencil className="w-4 h-4" />
              Edit
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
