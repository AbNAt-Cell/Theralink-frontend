'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Plus,
    Trash2,
    Calendar,
    Loader2,
    FileText
} from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/Partials/use-toast';
import { createAuthorization, getAuthorizationTemplates, AuthorizationTemplate, AuthorizationStatus } from '@/hooks/admin/authorizations';
import { getAvailableServices, Service } from '@/hooks/admin/services';
import Link from 'next/link';

interface Profile {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
}

interface ClientEntry {
    id: string;
    clientId: string;
    effectiveDate: string;
    endDate: string;
    authNumber: string;
}

interface ServiceEntry {
    id: string;
    serviceCode: string;
    serviceId: string;
    totalUnits: number;
    isRestrictive: boolean;
    unitsLimit: number;
    unitsPeriod: 'Day' | 'Week' | 'Month';
}

export default function AuthorizationsPage() {
    const { user } = useUser();
    const { toast } = useToast();
    const supabase = createClient();

    // Loading states
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    // Data
    const [clients, setClients] = useState<Profile[]>([]);
    const [staff, setStaff] = useState<Profile[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [templates, setTemplates] = useState<AuthorizationTemplate[]>([]);

    // Form state - Header
    const [requestDate, setRequestDate] = useState('');
    const [status, setStatus] = useState('PENDING');
    const [submittedBy, setSubmittedBy] = useState('');

    // Form state - Clients
    const [clientEntries, setClientEntries] = useState<ClientEntry[]>([
        { id: '1', clientId: '', effectiveDate: '', endDate: '', authNumber: '' }
    ]);

    // Form state - Services
    const [serviceEntries, setServiceEntries] = useState<ServiceEntry[]>([
        { id: '1', serviceCode: '', serviceId: '', totalUnits: 0, isRestrictive: false, unitsLimit: 0, unitsPeriod: 'Day' }
    ]);

    // Form state - Comments and options
    const [comments, setComments] = useState('');
    const [addToClientServices, setAddToClientServices] = useState(false);

    // Fetch initial data
    const fetchData = useCallback(async () => {
        if (!user?.clinicId) return;
        setLoadingData(true);

        try {
            // Fetch clients
            const { data: clientData } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, email, role')
                .eq('clinic_id', user.clinicId)
                .eq('role', 'CLIENT')
                .order('first_name');

            // Fetch staff
            const { data: staffData } = await supabase
                .from('profiles')
                .select('id, first_name, last_name, email, role')
                .eq('clinic_id', user.clinicId)
                .in('role', ['ADMIN', 'STAFF'])
                .order('first_name');

            // Fetch services
            const servicesData = await getAvailableServices();

            // Fetch templates
            const templatesData = await getAuthorizationTemplates(user.clinicId);

            setClients(clientData || []);
            setStaff(staffData || []);
            setServices(servicesData);
            setTemplates(templatesData);

            // Set default submitter
            if (user?.id && staffData?.some(s => s.id === user.id)) {
                setSubmittedBy(user.id);
            }

            // Set default date to today
            setRequestDate(new Date().toISOString().split('T')[0]);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to load data. Please refresh the page.',
            });
        } finally {
            setLoadingData(false);
        }
    }, [user?.clinicId, user?.id, supabase, toast]);

    useEffect(() => {
        if (user?.clinicId) {
            fetchData();
        }
    }, [user?.clinicId, fetchData]);

    // Get unique service codes
    const serviceCodes = useMemo(() => {
        const codes = new Set(services.map(s => s.code));
        return Array.from(codes).sort();
    }, [services]);

    // Get services for a given code
    const getServicesForCode = (code: string) => {
        return services.filter(s => s.code === code);
    };

    // Add client entry
    const addClientEntry = () => {
        setClientEntries(prev => [
            ...prev,
            { id: Date.now().toString(), clientId: '', effectiveDate: '', endDate: '', authNumber: '' }
        ]);
    };

    // Remove client entry
    const removeClientEntry = (id: string) => {
        if (clientEntries.length > 1) {
            setClientEntries(prev => prev.filter(c => c.id !== id));
        }
    };

    // Update client entry
    const updateClientEntry = (id: string, field: keyof ClientEntry, value: string) => {
        setClientEntries(prev => prev.map(c =>
            c.id === id ? { ...c, [field]: value } : c
        ));
    };

    // Add service entry
    const addServiceEntry = () => {
        setServiceEntries(prev => [
            ...prev,
            { id: Date.now().toString(), serviceCode: '', serviceId: '', totalUnits: 0, isRestrictive: false, unitsLimit: 0, unitsPeriod: 'Day' }
        ]);
    };

    // Remove service entry
    const removeServiceEntry = (id: string) => {
        if (serviceEntries.length > 1) {
            setServiceEntries(prev => prev.filter(s => s.id !== id));
        }
    };

    // Update service entry
    const updateServiceEntry = (id: string, field: keyof ServiceEntry, value: string | number | boolean) => {
        setServiceEntries(prev => prev.map(s =>
            s.id === id ? { ...s, [field]: value } : s
        ));
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!requestDate || !status || !submittedBy) {
            toast({
                variant: 'destructive',
                title: 'Missing Fields',
                description: 'Please fill in all required header fields.',
            });
            return;
        }

        const validClients = clientEntries.filter(c => c.clientId && c.effectiveDate && c.endDate);
        if (validClients.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Missing Client',
                description: 'Please add at least one client with dates.',
            });
            return;
        }

        const validServices = serviceEntries.filter(s => s.serviceId);
        if (validServices.length === 0) {
            toast({
                variant: 'destructive',
                title: 'Missing Service',
                description: 'Please add at least one service.',
            });
            return;
        }

        setLoading(true);

        try {
            await createAuthorization({
                clinicId: user!.clinicId!,
                submittedBy,
                requestDate,
                status: status as AuthorizationStatus,
                comments,
                clients: validClients.map(c => ({
                    clientId: c.clientId,
                    effectiveDate: c.effectiveDate,
                    endDate: c.endDate,
                    authNumber: c.authNumber || undefined
                })),
                services: validServices.map(s => ({
                    serviceId: s.serviceId,
                    serviceCode: s.serviceCode,
                    totalUnits: s.totalUnits,
                    isRestrictive: s.isRestrictive,
                    unitsLimit: s.isRestrictive ? s.unitsLimit : undefined,
                    unitsPeriod: s.isRestrictive ? s.unitsPeriod : undefined
                })),
                addToClientServices
            });

            toast({
                title: 'Authorization Created!',
                description: 'The authorization has been submitted successfully.',
            });

            // Reset form
            setClientEntries([{ id: '1', clientId: '', effectiveDate: '', endDate: '', authNumber: '' }]);
            setServiceEntries([{ id: '1', serviceCode: '', serviceId: '', totalUnits: 0, isRestrictive: false, unitsLimit: 0, unitsPeriod: 'Day' }]);
            setComments('');
            setAddToClientServices(false);
        } catch (error) {
            console.error('Error creating authorization:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to create authorization. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset form
        setClientEntries([{ id: '1', clientId: '', effectiveDate: '', endDate: '', authNumber: '' }]);
        setServiceEntries([{ id: '1', serviceCode: '', serviceId: '', totalUnits: 0, isRestrictive: false, unitsLimit: 0, unitsPeriod: 'Day' }]);
        setComments('');
        setAddToClientServices(false);
    };

    if (loadingData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-2xl font-semibold text-slate-800 mb-6">Authorization</h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Header Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label className="text-blue-700 font-medium">Date of Request Submission</Label>
                        <div className="relative">
                            <Input
                                type="date"
                                value={requestDate}
                                onChange={(e) => setRequestDate(e.target.value)}
                                className="border-gray-300"
                                placeholder="Date of Request Submission"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Auth Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="APPROVED">Approved</SelectItem>
                                <SelectItem value="DENIED">Denied</SelectItem>
                                <SelectItem value="EXPIRED">Expired</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-700 font-medium">Submitted By</Label>
                        <Select value={submittedBy} onValueChange={setSubmittedBy}>
                            <SelectTrigger className="border-gray-300">
                                <SelectValue placeholder="Select staff member" />
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
                </div>

                {/* Add Clients Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800">Add Clients</h2>

                    {clientEntries.map((entry, index) => (
                        <div key={entry.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                            <div className="space-y-2">
                                {index === 0 && <Label className="text-slate-700">*Select Client</Label>}
                                <Select
                                    value={entry.clientId}
                                    onValueChange={(v) => updateClientEntry(entry.id, 'clientId', v)}
                                >
                                    <SelectTrigger className="border-gray-300">
                                        <SelectValue placeholder="Client" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {clients.map((c) => (
                                            <SelectItem key={c.id} value={c.id}>
                                                {c.last_name}, {c.first_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                {index === 0 && <Label className="text-slate-700">Effective Date</Label>}
                                <Input
                                    type="date"
                                    value={entry.effectiveDate}
                                    onChange={(e) => updateClientEntry(entry.id, 'effectiveDate', e.target.value)}
                                    className="border-gray-300"
                                    placeholder="Effective Date"
                                />
                            </div>

                            <div className="space-y-2">
                                {index === 0 && <Label className="text-slate-700">End Date</Label>}
                                <Input
                                    type="date"
                                    value={entry.endDate}
                                    onChange={(e) => updateClientEntry(entry.id, 'endDate', e.target.value)}
                                    className="border-gray-300"
                                    placeholder="End Date"
                                />
                            </div>

                            <div className="space-y-2">
                                {index === 0 && <Label className="text-slate-700">Auth ID</Label>}
                                <Input
                                    value={entry.authNumber}
                                    onChange={(e) => updateClientEntry(entry.id, 'authNumber', e.target.value)}
                                    className="border-gray-300"
                                    placeholder="Auth ID"
                                />
                            </div>

                            <div>
                                {clientEntries.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeClientEntry(entry.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addClientEntry}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Another Client
                    </Button>
                </div>

                {/* Add Services Section */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-800">Add Services</h2>

                    {/* Template Notice */}
                    <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <span className="text-orange-700 font-medium flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            {templates.length === 0
                                ? 'No Authorization Template Available'
                                : `${templates.length} Template(s) Available`}
                        </span>
                        <Link href="/admin/more/authorizations/templates">
                            <Button type="button" size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                                <Plus className="w-4 h-4 mr-1" /> Create New Authorization Template
                            </Button>
                        </Link>
                    </div>

                    {serviceEntries.map((entry, index) => (
                        <div key={entry.id} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                <div className="space-y-2">
                                    {index === 0 && <Label className="text-slate-700">*Select Service Codes</Label>}
                                    <Select
                                        value={entry.serviceCode}
                                        onValueChange={(v) => {
                                            updateServiceEntry(entry.id, 'serviceCode', v);
                                            updateServiceEntry(entry.id, 'serviceId', ''); // Reset service when code changes
                                        }}
                                    >
                                        <SelectTrigger className="border-gray-300 bg-white">
                                            <SelectValue placeholder="Select code" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {serviceCodes.map((code) => (
                                                <SelectItem key={code} value={code}>
                                                    {code}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    {index === 0 && <Label className="text-slate-700">*Select Services</Label>}
                                    <Select
                                        value={entry.serviceId}
                                        onValueChange={(v) => updateServiceEntry(entry.id, 'serviceId', v)}
                                        disabled={!entry.serviceCode}
                                    >
                                        <SelectTrigger className="border-gray-300 bg-white">
                                            <SelectValue placeholder={entry.serviceCode ? "Select service" : "*Select Service Codes First*"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {getServicesForCode(entry.serviceCode).map((service) => (
                                                <SelectItem key={service.id} value={service.id}>
                                                    {service.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    {index === 0 && <Label className="text-slate-700">Total Units</Label>}
                                    <Input
                                        type="number"
                                        min="0"
                                        value={entry.totalUnits}
                                        onChange={(e) => updateServiceEntry(entry.id, 'totalUnits', parseInt(e.target.value) || 0)}
                                        className="border-gray-300 bg-white"
                                    />
                                </div>

                                <div>
                                    {serviceEntries.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeServiceEntry(entry.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Restrictive toggle */}
                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={entry.isRestrictive}
                                        onCheckedChange={(checked) => updateServiceEntry(entry.id, 'isRestrictive', checked)}
                                    />
                                    <Label className="text-slate-600">Restrictive?</Label>
                                </div>

                                {entry.isRestrictive && (
                                    <>
                                        <span className="text-sm text-slate-500">If yes, Client is limited to</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={entry.unitsLimit}
                                            onChange={(e) => updateServiceEntry(entry.id, 'unitsLimit', parseInt(e.target.value) || 0)}
                                            className="w-20 border-gray-300"
                                        />
                                        <span className="text-sm text-slate-500">units per</span>
                                        <Select
                                            value={entry.unitsPeriod}
                                            onValueChange={(v) => updateServiceEntry(entry.id, 'unitsPeriod', v)}
                                        >
                                            <SelectTrigger className="w-24 border-gray-300">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Day">Day</SelectItem>
                                                <SelectItem value="Week">Week</SelectItem>
                                                <SelectItem value="Month">Month</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addServiceEntry}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Another Service
                    </Button>
                </div>

                {/* Comments */}
                <div className="space-y-2">
                    <Label className="text-red-600 font-medium">Comments</Label>
                    <Textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        className="border-gray-300 min-h-[100px]"
                        placeholder="Add any comments..."
                    />
                </div>

                {/* Options */}
                <div className="flex items-center gap-2">
                    <Checkbox
                        id="addToServices"
                        checked={addToClientServices}
                        onCheckedChange={(checked) => setAddToClientServices(checked as boolean)}
                    />
                    <Label htmlFor="addToServices" className="text-slate-600 cursor-pointer">
                        Add selected services to clients assigned services
                    </Label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            'Submit'
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className="border-slate-600 text-slate-600"
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
