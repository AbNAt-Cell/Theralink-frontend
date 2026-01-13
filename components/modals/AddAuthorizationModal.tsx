'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Loader, Plus, Trash } from 'lucide-react';
import { getAvailableServices, Service } from '@/hooks/admin/services';

interface AddAuthorizationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: AuthorizationFormData) => Promise<void>;
}

export interface AuthorizationFormData {
    requestDate: string;
    status: string;
    submittedBy: string;
    effectiveDate: string;
    endDate: string;
    authorizationNumber: string;
    services: AuthorizationService[];
    comments: string;
    addToAssignedServices: boolean;
}

interface AuthorizationService {
    serviceId: string;
    serviceName: string;
    totalUnits: number;
    isRestrictive: boolean;
    restrictedUnits?: number;
    restrictedPeriod?: string;
}

export default function AddAuthorizationModal({
    isOpen,
    onClose,
    onSave
}: AddAuthorizationModalProps) {
    const [loading, setLoading] = useState(false);
    const [availableServices, setAvailableServices] = useState<Service[]>([]);

    // Form state
    const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState('pending');
    const [submittedBy, setSubmittedBy] = useState('');
    const [effectiveDate, setEffectiveDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [authorizationNumber, setAuthorizationNumber] = useState('');
    const [comments, setComments] = useState('');
    const [addToAssignedServices, setAddToAssignedServices] = useState(false);

    // Services
    const [services, setServices] = useState<AuthorizationService[]>([{
        serviceId: '',
        serviceName: '',
        totalUnits: 0,
        isRestrictive: false,
        restrictedUnits: 0,
        restrictedPeriod: 'day'
    }]);

    // Load available services
    useEffect(() => {
        const loadServices = async () => {
            try {
                const data = await getAvailableServices();
                setAvailableServices(data);
            } catch (error) {
                console.error('Error loading services:', error);
            }
        };
        if (isOpen) {
            loadServices();
        }
    }, [isOpen]);

    const handleAddService = () => {
        setServices([...services, {
            serviceId: '',
            serviceName: '',
            totalUnits: 0,
            isRestrictive: false,
            restrictedUnits: 0,
            restrictedPeriod: 'day'
        }]);
    };

    const handleRemoveService = (index: number) => {
        if (services.length > 1) {
            setServices(services.filter((_, i) => i !== index));
        }
    };

    const handleServiceChange = (index: number, field: keyof AuthorizationService, value: string | number | boolean) => {
        const updated = [...services];
        if (field === 'serviceId') {
            const selectedService = availableServices.find(s => s.id === value);
            updated[index] = {
                ...updated[index],
                serviceId: value as string,
                serviceName: selectedService?.name || ''
            };
        } else {
            updated[index] = { ...updated[index], [field]: value };
        }
        setServices(updated);
    };

    const handleSubmit = async () => {
        if (!effectiveDate || !endDate) {
            alert('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            await onSave({
                requestDate,
                status,
                submittedBy,
                effectiveDate,
                endDate,
                authorizationNumber,
                services: services.filter(s => s.serviceId),
                comments,
                addToAssignedServices
            });
            // Reset form
            setRequestDate(new Date().toISOString().split('T')[0]);
            setStatus('pending');
            setSubmittedBy('');
            setEffectiveDate('');
            setEndDate('');
            setAuthorizationNumber('');
            setComments('');
            setServices([{ serviceId: '', serviceName: '', totalUnits: 0, isRestrictive: false, restrictedUnits: 0, restrictedPeriod: 'day' }]);
            setAddToAssignedServices(false);
            onClose();
        } catch (error) {
            console.error('Error saving authorization:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add Authorization</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Header Section */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Date of Request Submission</Label>
                            <Input
                                type="date"
                                value={requestDate}
                                onChange={(e) => setRequestDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="denied">Denied</SelectItem>
                                    <SelectItem value="expired">Expired</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Submitted By</Label>
                            <Input
                                value={submittedBy}
                                onChange={(e) => setSubmittedBy(e.target.value)}
                                placeholder="Staff name"
                            />
                        </div>
                    </div>

                    {/* Client Details Section */}
                    <div className="border-t pt-4">
                        <h3 className="font-medium mb-4">Authorization Details</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label>Effective Date *</Label>
                                <Input
                                    type="date"
                                    value={effectiveDate}
                                    onChange={(e) => setEffectiveDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label>End Date *</Label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label>Auth ID</Label>
                                <Input
                                    value={authorizationNumber}
                                    onChange={(e) => setAuthorizationNumber(e.target.value)}
                                    placeholder="Authorization number"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Services Section */}
                    <div className="border-t pt-4">
                        <h3 className="font-medium mb-4">Services</h3>
                        {services.map((service, index) => (
                            <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-sm font-medium text-gray-500">Service {index + 1}</span>
                                    {services.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRemoveService(index)}
                                            className="text-red-500"
                                        >
                                            <Trash className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <Label>Select Service *</Label>
                                        <Select
                                            value={service.serviceId}
                                            onValueChange={(value) => handleServiceChange(index, 'serviceId', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select service" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableServices.map(s => (
                                                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Total Units</Label>
                                        <Input
                                            type="number"
                                            value={service.totalUnits}
                                            onChange={(e) => handleServiceChange(index, 'totalUnits', parseInt(e.target.value) || 0)}
                                            min={0}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={service.isRestrictive}
                                                onCheckedChange={(checked) => handleServiceChange(index, 'isRestrictive', checked)}
                                            />
                                            <Label>Restrictive?</Label>
                                        </div>
                                    </div>
                                </div>

                                {service.isRestrictive && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <span>Client is limited to</span>
                                        <Input
                                            type="number"
                                            className="w-20"
                                            value={service.restrictedUnits}
                                            onChange={(e) => handleServiceChange(index, 'restrictedUnits', parseInt(e.target.value) || 0)}
                                            min={0}
                                        />
                                        <span>units per</span>
                                        <Select
                                            value={service.restrictedPeriod}
                                            onValueChange={(value) => handleServiceChange(index, 'restrictedPeriod', value)}
                                        >
                                            <SelectTrigger className="w-32">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="day">Day</SelectItem>
                                                <SelectItem value="week">Week</SelectItem>
                                                <SelectItem value="month">Month</SelectItem>
                                                <SelectItem value="authorization">Authorization</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddService}
                            className="text-blue-600 border-blue-600"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Another Service
                        </Button>
                    </div>

                    {/* Comments */}
                    <div>
                        <Label>Comments</Label>
                        <Textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Additional notes or comments..."
                            rows={4}
                        />
                    </div>

                    {/* Options */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="addToAssigned"
                            checked={addToAssignedServices}
                            onChange={(e) => setAddToAssignedServices(e.target.checked)}
                            className="rounded"
                        />
                        <label htmlFor="addToAssigned" className="text-sm">
                            Add selected services to client&apos;s assigned services
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button onClick={handleSubmit} disabled={loading} className="bg-blue-900 hover:bg-blue-800">
                            {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
                            Submit
                        </Button>
                        <Button variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
