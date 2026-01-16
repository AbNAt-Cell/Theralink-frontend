'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, FileText, Calendar, Search, User, X, AlertCircle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/Partials/use-toast';
import { getTemplateDefinition } from '@/lib/templateDefinitions';
import TemplateFormRenderer from '@/components/TemplateFormRenderer';

interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    date_of_birth?: string;
    gender?: string;
    status?: string;
}

interface AddDocumentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const DOCUMENT_TEMPLATES = [
    { id: 'ansa', name: '(TxGeneral) ANSA', category: 'Assessment' },
    { id: 'cans-3-5', name: '(TxGeneral) CANS Child 3-5', category: 'Assessment' },
    { id: 'cans-6-17', name: '(TxGeneral) CANS Child 6-17', category: 'Assessment' },
    { id: 'birp', name: 'B.I.R.P.', category: 'Progress Note' },
    { id: 'biopsychosocial-adult', name: 'Biopsychosocial - Adult', category: 'Assessment' },
    { id: 'biopsychosocial-child', name: 'Biopsychosocial - Child', category: 'Assessment' },
    { id: 'columbia', name: 'COLUMBIA-SUICIDE SEVERITY RATING SCALE', category: 'Assessment' },
    { id: 'consent-treatment', name: 'Consent for Treatment', category: 'Consent' },
    { id: 'consent-telehealth', name: 'Consent to Tele Mental Health', category: 'Consent' },
    { id: 'diagnostic-assessment', name: 'Diagnostic Assessment', category: 'Assessment' },
    { id: 'informed-consent-medication', name: 'Informed Consent FOR Medication', category: 'Consent' },
    { id: 'medication-consent-child', name: 'Medication Consent Child', category: 'Consent' },
    { id: 'medication-informed-consent', name: 'Medication Informed Consent Form', category: 'Consent' },
    { id: 'monthly-staff-form', name: 'Monthly Staff Form', category: 'Staff' },
    { id: 'pie', name: 'P.I.E.', category: 'Progress Note' },
    { id: 'psychiatric-assessment', name: 'Psychiatric Assessment', category: 'Assessment' },
    { id: 'referral-intake', name: 'Referral and Intake', category: 'Intake' },
    { id: 'treatment-plan-consent', name: 'Treatment Plan Consent', category: 'Consent' },
];

export default function AddDocumentModal({ isOpen, onClose, onSuccess }: AddDocumentModalProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const supabase = createClient();

    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<Profile[]>([]);
    const [staff, setStaff] = useState<Profile[]>([]);
    const [loadingProfiles, setLoadingProfiles] = useState(true);

    // Form data
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [templateSearch, setTemplateSearch] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [selectedClient, setSelectedClient] = useState<Profile | null>(null);
    const [clientSearch, setClientSearch] = useState('');
    const [showClientSearch, setShowClientSearch] = useState(false);
    const [dateOfService, setDateOfService] = useState('');
    const [templateFormData, setTemplateFormData] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isOpen && user?.clinicId) {
            fetchProfiles();
        }
    }, [isOpen, user?.clinicId]);

    const fetchProfiles = async () => {
        if (!user?.clinicId) return;
        setLoadingProfiles(true);

        try {
            const { data: clientData } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, email, role, date_of_birth, gender, status')
                .eq('clinic_id', user.clinicId)
                .eq('role', 'CLIENT')
                .order('first_name');

            const { data: staffData } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, email, role')
                .eq('clinic_id', user.clinicId)
                .in('role', ['ADMIN', 'STAFF'])
                .order('first_name');

            setClients(clientData || []);
            setStaff(staffData || []);

            if (user?.id && staffData?.some(s => s.id === user.id)) {
                setAuthorId(user.id);
            }
        } catch (error) {
            console.error('Error fetching profiles:', error);
        } finally {
            setLoadingProfiles(false);
        }
    };

    // Filter templates by search
    const filteredTemplates = useMemo(() => {
        if (!templateSearch) return DOCUMENT_TEMPLATES;
        return DOCUMENT_TEMPLATES.filter(t =>
            t.name.toLowerCase().includes(templateSearch.toLowerCase())
        );
    }, [templateSearch]);

    // Filter clients by search
    const filteredClients = useMemo(() => {
        if (!clientSearch) return clients;
        const search = clientSearch.toLowerCase();
        return clients.filter(c =>
            c.first_name.toLowerCase().includes(search) ||
            c.last_name.toLowerCase().includes(search)
        );
    }, [clientSearch, clients]);

    // Calculate age from DOB
    const calculateAge = (dob?: string) => {
        if (!dob) return null;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        return age;
    };

    // Check if client is eligible
    const isClientEligible = (client: Profile) => {
        return client.status !== 'INACTIVE';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedTemplate || !authorId || !selectedClient || !dateOfService) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please fill in all required fields.',
            });
            return;
        }

        if (!isClientEligible(selectedClient)) {
            toast({
                variant: 'destructive',
                title: 'Client Ineligible',
                description: 'This client is inactive and cannot have documentation submitted.',
            });
            return;
        }

        setLoading(true);

        try {
            const template = DOCUMENT_TEMPLATES.find(t => t.id === selectedTemplate);

            const { error } = await supabase
                .from('documents')
                .insert({
                    clinic_id: user?.clinicId,
                    client_id: selectedClient.id,
                    staff_id: authorId,
                    type: template?.name || selectedTemplate,
                    date_of_service: dateOfService,
                    status: 'PENDING',
                });

            if (error) throw error;

            toast({
                title: 'Document Created!',
                description: `${template?.name} has been created successfully.`,
            });

            // Reset form
            setSelectedTemplate('');
            setTemplateSearch('');
            setSelectedClient(null);
            setClientSearch('');
            setDateOfService('');

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

    const handleSelectClient = (client: Profile) => {
        setSelectedClient(client);
        setShowClientSearch(false);
        setClientSearch('');
    };

    const clearClient = () => {
        setSelectedClient(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
                <DialogHeader className="flex flex-row items-center justify-between flex-shrink-0">
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-slate-800">
                        <FileText className="w-5 h-5" />
                        Add Document
                    </DialogTitle>
                    <Button
                        type="button"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => {
                            toast({ title: 'Draft saved', description: 'Document saved as draft.' });
                        }}
                    >
                        Save as Draft
                    </Button>
                </DialogHeader>

                {loadingProfiles ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : (
                    <div className="flex gap-6 overflow-y-auto flex-1 pr-2">
                        {/* Main Form */}
                        <form onSubmit={handleSubmit} className="flex-1 space-y-5">
                            {/* Select Template - Searchable */}
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-medium">Select Template</Label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Filter..."
                                        value={templateSearch}
                                        onChange={(e) => setTemplateSearch(e.target.value)}
                                        className="pl-9 border-gray-300"
                                    />
                                </div>
                                <ScrollArea className="h-[120px] border rounded-md">
                                    <div className="p-2">
                                        {filteredTemplates.map((template) => (
                                            <div
                                                key={template.id}
                                                className={`px-3 py-2 cursor-pointer rounded-md text-sm ${selectedTemplate === template.id
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'hover:bg-gray-100'
                                                    }`}
                                                onClick={() => setSelectedTemplate(template.id)}
                                            >
                                                {template.name}
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>

                            {/* Choose Author */}
                            <div className="space-y-2">
                                <Label className="text-amber-700 font-medium">Choose Author</Label>
                                <Select value={authorId} onValueChange={setAuthorId}>
                                    <SelectTrigger className="border-gray-300">
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

                            {/* Select Client - Searchable with Table */}
                            <div className="space-y-2">
                                {selectedClient ? (
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="flex-1">
                                            {selectedClient.last_name}, {selectedClient.first_name} | Auspicious Community Service
                                        </span>
                                        <button type="button" onClick={clearClient}>
                                            <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <Input
                                            placeholder="Select Client"
                                            value={clientSearch}
                                            onChange={(e) => {
                                                setClientSearch(e.target.value);
                                                setShowClientSearch(true);
                                            }}
                                            onFocus={() => setShowClientSearch(true)}
                                            className="border-gray-300"
                                        />
                                    </div>
                                )}

                                {/* Client Eligibility Warning */}
                                {selectedClient && !isClientEligible(selectedClient) && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>Client&apos;s eligibility check came back Inactive, unable to submit documentation.</span>
                                    </div>
                                )}

                                {/* Client Search Results Table */}
                                {showClientSearch && !selectedClient && (
                                    <div className="border rounded-md overflow-hidden">
                                        <table className="w-full text-sm">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-600">Name</th>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-600">DOB/Age/Gender</th>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-600">Payer</th>
                                                    <th className="px-3 py-2 text-left font-medium text-gray-600">ID</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredClients.slice(0, 5).map((client) => (
                                                    <tr
                                                        key={client.id}
                                                        className="hover:bg-blue-50 cursor-pointer border-t"
                                                        onClick={() => handleSelectClient(client)}
                                                    >
                                                        <td className="px-3 py-2">
                                                            {client.last_name}, {client.first_name}
                                                        </td>
                                                        <td className="px-3 py-2 text-gray-600">
                                                            {client.date_of_birth || 'N/A'}
                                                            {calculateAge(client.date_of_birth) && ` (${calculateAge(client.date_of_birth)})`}
                                                            {client.gender && ` ${client.gender.charAt(0)}`}
                                                        </td>
                                                        <td className="px-3 py-2 text-gray-600">-</td>
                                                        <td className="px-3 py-2 text-gray-600 font-mono text-xs">
                                                            {client.id.slice(0, 8)}...
                                                        </td>
                                                    </tr>
                                                ))}
                                                {filteredClients.length === 0 && (
                                                    <tr>
                                                        <td colSpan={4} className="px-3 py-4 text-center text-gray-500">
                                                            No clients found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Date of Service */}
                            <div className="space-y-2">
                                <Label className="text-amber-700 font-medium">Date of Service</Label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        placeholder="Select Date of Service"
                                        value={dateOfService}
                                        onChange={(e) => setDateOfService(e.target.value)}
                                        className="border-gray-300"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Dynamic Template Form Sections */}
                            {selectedTemplate && getTemplateDefinition(selectedTemplate) && (
                                <TemplateFormRenderer
                                    template={getTemplateDefinition(selectedTemplate)!}
                                    formData={templateFormData}
                                    onChange={(fieldId, value) => {
                                        setTemplateFormData(prev => ({ ...prev, [fieldId]: value }));
                                    }}
                                />
                            )}

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

                        {/* Client Info Sidebar */}
                        {selectedClient && (
                            <div className="w-48 bg-gray-50 rounded-lg p-4 text-sm">
                                <div className="font-semibold text-slate-800 mb-2">
                                    {selectedClient.last_name}, {selectedClient.first_name}
                                </div>
                                <div className="space-y-1 text-gray-600">
                                    <div>{selectedClient.date_of_birth || 'DOB: N/A'}</div>
                                    {calculateAge(selectedClient.date_of_birth) && (
                                        <div>Age: {calculateAge(selectedClient.date_of_birth)}</div>
                                    )}
                                    {selectedClient.gender && <div>Gender: {selectedClient.gender}</div>}
                                    <div className="pt-2 border-t mt-2">
                                        <div className="font-medium">Auspicious</div>
                                        <div className="text-xs">Community Service</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
