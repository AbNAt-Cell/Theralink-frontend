'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileText, Calendar } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/Partials/use-toast';

interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

interface AddDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const DOCUMENT_TEMPLATES = [
    'Progress Note',
    'Initial Assessment',
    'Treatment Plan',
    'Discharge Summary',
    'Session Notes',
    'Intake Form',
    'Consent Form',
    'Authorization Request',
    'Clinical Summary',
    'Safety Plan',
    'Crisis Assessment',
    'Group Note',
    'Family Session Note',
    'Other'
];

export default function AddDocumentModal({ isOpen, onClose, onSuccess }: AddDocumentModalProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Profile[]>([]);
    const [staff, setStaff] = useState<Profile[]>([]);
    const [loadingProfiles, setLoadingProfiles] = useState(true);

    const [formData, setFormData] = useState({
        template: '',
        authorId: '',
        clientId: '',
        dateOfService: '',
    });

    useEffect(() => {
        if (isOpen && user?.clinicId) {
            fetchProfiles();
        }
    }, [isOpen, user?.clinicId]);

    const fetchProfiles = async () => {
        if (!user?.clinicId) return;
        setLoadingProfiles(true);

        try {
            // Fetch clients
            const { data: clientData } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, email, role')
                .eq('clinic_id', user.clinicId)
                .eq('role', 'CLIENT')
                .order('first_name');

            // Fetch staff/authors
            const { data: staffData } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, email, role')
                .eq('clinic_id', user.clinicId)
                .in('role', ['ADMIN', 'STAFF'])
                .order('first_name');

            setClients(clientData || []);
            setStaff(staffData || []);

            // Default author to current user if they're staff
            if (user?.id && staffData?.some(s => s.id === user.id)) {
                setFormData(prev => ({ ...prev, authorId: user.id }));
            }
        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoadingProfiles(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.template || !formData.authorId || !formData.clientId || !formData.dateOfService) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please fill in all required fields.',
            });
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase
                .from('documents')
                .insert({
                    clinic_id: user?.clinicId,
                    client_id: formData.clientId,
                    staff_id: formData.authorId,
                    type: formData.template,
                    date_of_service: formData.dateOfService,
                    status: 'PENDING',
                });

            if (error) throw error;

            toast({
                title: 'Document Created!',
                description: `${formData.template} has been created successfully.`,
            });

            // Reset form
            setFormData({
                template: '',
                authorId: user?.id || '',
                clientId: '',
                dateOfService: '',
            });

            onSuccess?.();
            onClose();
        } catch (error) {
            console.error('Error creating document:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create document. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800">
                        <FileText className="w-5 h-5" />
                        Add Document
                    </DialogTitle>
                </DialogHeader>

                {loadingProfiles ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 pt-2">
                        {/* Select Template */}
                        <div className="space-y-2">
                            <Label htmlFor="template" className="text-slate-700 font-medium">
                                Select Template
                            </Label>
                            <Select
                                value={formData.template}
                                onValueChange={(value) => setFormData({ ...formData, template: value })}
                            >
                                <SelectTrigger className="w-full border-gray-300">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DOCUMENT_TEMPLATES.map((template) => (
                                        <SelectItem key={template} value={template}>
                                            {template}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Choose Author */}
                        <div className="space-y-2">
                            <Label htmlFor="author" className="text-amber-700 font-medium">
                                Choose Author
                            </Label>
                            <Select
                                value={formData.authorId}
                                onValueChange={(value) => setFormData({ ...formData, authorId: value })}
                            >
                                <SelectTrigger className="w-full border-gray-300">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    {staff.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.last_name}, {s.first_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Select Client */}
                        <div className="space-y-2">
                            <Input
                                placeholder="Select Client"
                                value={formData.clientId ? clients.find(c => c.id === formData.clientId)?.first_name + ' ' + clients.find(c => c.id === formData.clientId)?.last_name : ''}
                                readOnly
                                className="border-gray-300 cursor-pointer"
                                onClick={() => {
                                    // For simplicity, using a select - could be improved with searchable dropdown
                                }}
                            />
                            <Select
                                value={formData.clientId}
                                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                            >
                                <SelectTrigger className="w-full border-gray-300">
                                    <SelectValue placeholder="Select Client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.id}>
                                            {client.first_name} {client.last_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date of Service */}
                        <div className="space-y-2">
                            <Label htmlFor="dateOfService" className="text-amber-700 font-medium">
                                Date of Service
                            </Label>
                            <div className="relative">
                                <Input
                                    id="dateOfService"
                                    type="date"
                                    placeholder="Select Date of Service"
                                    value={formData.dateOfService}
                                    onChange={(e) => setFormData({ ...formData, dateOfService: e.target.value })}
                                    className="border-gray-300"
                                />
                                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <hr className="border-gray-200" />

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-slate-800 hover:bg-slate-700 text-white"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                                className="border-slate-800 text-slate-800"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
