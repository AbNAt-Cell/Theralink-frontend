'use client';
import React, { useState } from 'react';
import UpdateClientSignatureForm from '@/components/forms/UpdateClientSignatureForm';
import { useRouter } from 'nextjs-toploader/app';
import AdminClientProfile from '@/components/AdminClientProfile';
import { createClient } from '@/utils/supabase/client';
import { useToast } from '@/hooks/Partials/use-toast';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

interface PageProps {
    params: {
        id: string;
    };
}

const CreateSignaturePage = ({ params }: PageProps) => {
    const router = useRouter();
    const supabase = createClient();
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [client, setClient] = useState<ClientProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const data = await getClientById(params.id);
                setClient(data);
            } catch (error) {
                console.error('Error fetching client:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, [params.id]);

    const handleSignatureUpdate = async (signatureDataUrl: string, pin: string) => {
        try {
            setSaving(true);

            // 1. Convert base64 data URL to a File
            const res = await fetch(signatureDataUrl);
            const blob = await res.blob();
            const file = new File([blob], 'signature.png', { type: 'image/png' });

            // 2. Upload to Supabase Storage (signatures bucket)
            const fileName = `${params.id}-${Date.now()}.png`;
            const { error: uploadError } = await supabase.storage
                .from('signatures')
                .upload(fileName, file, { upsert: true });

            if (uploadError) throw uploadError;

            // 3. Get the public URL
            const { data: publicUrlData } = supabase.storage
                .from('signatures')
                .getPublicUrl(fileName);

            const publicUrl = publicUrlData.publicUrl;

            // 4. Update the profiles table with the signature URL
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ signature_url: publicUrl })
                .eq('id', params.id);

            if (profileError) throw profileError;

            // 5. Save the client PIN to client_details
            const { error: pinError } = await supabase
                .from('client_details')
                .update({ client_pin: pin })
                .eq('profile_id', params.id);

            if (pinError) throw pinError;

            toast({
                title: 'Success',
                description: 'Signature saved successfully.',
            });

            router.push(`/admin/clients/${params.id}/signature`);
        } catch (error) {
            console.error('Error saving signature:', error);
            toast({
                title: 'Error',
                description: 'Failed to save signature. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader className="animate-spin h-8 w-8" />
            </div>
        );
    }

    return (
        <div className='max-w-4xl mx-auto space-y-8'>
            <AdminClientProfile client={client} />

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-blue-900 mb-6">Draw Client Signature</h2>
                <UpdateClientSignatureForm
                    onSignatureUpdate={handleSignatureUpdate}
                    onCancel={() => router.back()}
                    saving={saving}
                />
            </div>
        </div>
    );
};

export default CreateSignaturePage;
