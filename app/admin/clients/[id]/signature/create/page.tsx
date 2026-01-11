'use client';
import React from 'react';
import UpdateClientSignatureForm from '@/components/forms/UpdateClientSignatureForm';
import { useRouter } from 'nextjs-toploader/app';
import AdminClientProfile from '@/components/AdminClientProfile';

interface PageProps {
    params: {
        id: string; // Client ID
    };
}

const CreateSignaturePage = ({ params }: PageProps) => {
    const router = useRouter();

    const handleSignatureUpdate = async (signature: string, pin: string) => {
        // Todo: Implement signature upload to Supabase storage and save URL/Pin to client_details
        console.log('Signature:', signature);
        console.log('PIN:', pin);

        // Simulate success for now
        router.push(`/admin/clients/${params.id}/signature`);
    };

    return (
        <div className='max-w-4xl mx-auto space-y-8'>
            <AdminClientProfile />

            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h2 className="text-xl font-semibold text-blue-900 mb-6">Draw Client Signature</h2>
                <UpdateClientSignatureForm
                    onSignatureUpdate={handleSignatureUpdate}
                    onCancel={() => router.back()}
                />
            </div>
        </div>
    );
};

export default CreateSignaturePage;
