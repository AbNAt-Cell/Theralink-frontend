'use client';
import React, { useState } from 'react';
import UpdateClientSignatureForm from '@/components/forms/UpdateClientSignatureForm';
import { useRouter } from 'nextjs-toploader/app';
import AdminClientProfile from '@/components/AdminClientProfile';
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

            const res = await fetch('/api/upload-signature', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: params.id,
                    signature: signatureDataUrl,
                    pin,
                    type: 'client',
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || 'Failed to upload signature');
            }

            toast({
                title: 'Success',
                description: 'Signature saved successfully.',
            });

            router.push(`/admin/clients/${params.id}/signature`);
        } catch (error) {
            console.error('Error saving signature:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to save signature. Please try again.',
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
