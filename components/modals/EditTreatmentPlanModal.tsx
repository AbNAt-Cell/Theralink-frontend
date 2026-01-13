'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface EditTreatmentPlanModalProps {
    isOpen: boolean;
    plan: {
        id?: string;
        title: string;
        planDate: string;
        planEndDate?: string;
        dischargeDate?: string;
        startTime?: string;
        endTime?: string;
        service?: string;
        placeOfService?: string;
        isClientParticipant?: boolean;
        transitionDischargePlan?: string;
        maintenanceRecommendation?: string;
        clientStrengths?: string;
        clientNeeds?: string;
        clientAbilities?: string;
        clientPreferences?: string;
        crisisPlanning?: string;
        stepDownServices?: string;
        dischargePlanning?: string;
        otherProviders?: string;
    } | null;
    onClose: () => void;
    onSave: (data: EditTreatmentPlanModalProps['plan']) => void;
}

export default function EditTreatmentPlanModal({
    isOpen,
    plan,
    onClose,
    onSave
}: EditTreatmentPlanModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        planDate: '',
        planEndDate: '',
        dischargeDate: '',
        startTime: '',
        endTime: '',
        service: '',
        placeOfService: '',
        isClientParticipant: false,
        transitionDischargePlan: '',
        maintenanceRecommendation: '',
        clientStrengths: '',
        clientNeeds: '',
        clientAbilities: '',
        clientPreferences: '',
        crisisPlanning: '',
        stepDownServices: '',
        dischargePlanning: '',
        otherProviders: ''
    });

    useEffect(() => {
        if (plan) {
            setFormData({
                title: plan.title || '',
                planDate: plan.planDate || '',
                planEndDate: plan.planEndDate || '',
                dischargeDate: plan.dischargeDate || '',
                startTime: plan.startTime || '',
                endTime: plan.endTime || '',
                service: plan.service || '',
                placeOfService: plan.placeOfService || '',
                isClientParticipant: plan.isClientParticipant || false,
                transitionDischargePlan: plan.transitionDischargePlan || '',
                maintenanceRecommendation: plan.maintenanceRecommendation || '',
                clientStrengths: plan.clientStrengths || '',
                clientNeeds: plan.clientNeeds || '',
                clientAbilities: plan.clientAbilities || '',
                clientPreferences: plan.clientPreferences || '',
                crisisPlanning: plan.crisisPlanning || '',
                stepDownServices: plan.stepDownServices || '',
                dischargePlanning: plan.dischargePlanning || '',
                otherProviders: plan.otherProviders || ''
            });
        }
    }, [plan]);

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSave({
            id: plan?.id,
            ...formData
        });
    };

    if (!isOpen || !plan) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <h2 className="text-lg font-semibold">Edit Treatment Plan</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                        {/* Plan Name */}
                        <div>
                            <Label htmlFor="planName">Plan Name</Label>
                            <Input
                                id="planName"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="mt-1"
                                required
                            />
                        </div>

                        {/* Row: Plan Date, Projected Date of Discharge */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="planDate">Plan Date</Label>
                                <Input
                                    id="planDate"
                                    type="date"
                                    value={formData.planDate}
                                    onChange={(e) => handleChange('planDate', e.target.value)}
                                    className="mt-1"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="dischargeDate">Projected Date of Discharge/Transition</Label>
                                <Input
                                    id="dischargeDate"
                                    type="date"
                                    value={formData.dischargeDate}
                                    onChange={(e) => handleChange('dischargeDate', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        {/* Row: Start Time, Plan End Date */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    id="startTime"
                                    type="time"
                                    value={formData.startTime}
                                    onChange={(e) => handleChange('startTime', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label htmlFor="planEndDate">Plan End Date</Label>
                                <Input
                                    id="planEndDate"
                                    type="date"
                                    value={formData.planEndDate}
                                    onChange={(e) => handleChange('planEndDate', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        </div>

                        {/* Row: End Time, Service */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={formData.endTime}
                                    onChange={(e) => handleChange('endTime', e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Label>Service</Label>
                                <Select value={formData.service} onValueChange={(v) => handleChange('service', v)}>
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select service..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="individual">Individual Therapy</SelectItem>
                                        <SelectItem value="group">Group Therapy</SelectItem>
                                        <SelectItem value="family">Family Therapy</SelectItem>
                                        <SelectItem value="case-management">Case Management</SelectItem>
                                        <SelectItem value="skills-training">Skills Training</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Place of Service */}
                        <div>
                            <Label>Place Of Service</Label>
                            <Select value={formData.placeOfService} onValueChange={(v) => handleChange('placeOfService', v)}>
                                <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select place of service..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="office">Office</SelectItem>
                                    <SelectItem value="home">Home</SelectItem>
                                    <SelectItem value="school">School</SelectItem>
                                    <SelectItem value="telehealth">Telehealth</SelectItem>
                                    <SelectItem value="community">Community</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Client Participant Toggle */}
                        <div className="flex items-center gap-3">
                            <Label htmlFor="isClientParticipant" className="flex-1">
                                Individual/Family was an active participant in the development of the service plan and identified the goals?
                            </Label>
                            <Switch
                                id="isClientParticipant"
                                checked={formData.isClientParticipant}
                                onCheckedChange={(v) => handleChange('isClientParticipant', v)}
                            />
                            <span className="text-sm text-gray-600">{formData.isClientParticipant ? 'Yes' : 'No'}</span>
                        </div>

                        {/* Transition Discharge Plan */}
                        <div>
                            <Label htmlFor="transitionDischargePlan">Transition Discharge Plan</Label>
                            <Textarea
                                id="transitionDischargePlan"
                                value={formData.transitionDischargePlan}
                                onChange={(e) => handleChange('transitionDischargePlan', e.target.value)}
                                className="mt-1"
                                rows={3}
                            />
                        </div>

                        {/* Maintenance Recommendation */}
                        <div>
                            <Label htmlFor="maintenanceRecommendation">Maintenance Recommendation</Label>
                            <Textarea
                                id="maintenanceRecommendation"
                                value={formData.maintenanceRecommendation}
                                onChange={(e) => handleChange('maintenanceRecommendation', e.target.value)}
                                className="mt-1"
                                rows={3}
                            />
                        </div>

                        {/* Client Strengths */}
                        <div>
                            <Label htmlFor="clientStrengths">Client Strengths</Label>
                            <Textarea
                                id="clientStrengths"
                                value={formData.clientStrengths}
                                onChange={(e) => handleChange('clientStrengths', e.target.value)}
                                className="mt-1"
                                rows={3}
                            />
                        </div>

                        {/* Client Needs */}
                        <div>
                            <Label htmlFor="clientNeeds">Client Needs</Label>
                            <Textarea
                                id="clientNeeds"
                                value={formData.clientNeeds}
                                onChange={(e) => handleChange('clientNeeds', e.target.value)}
                                className="mt-1"
                                rows={3}
                            />
                        </div>

                        {/* Client Abilities */}
                        <div>
                            <Label htmlFor="clientAbilities">Client Abilities</Label>
                            <Textarea
                                id="clientAbilities"
                                value={formData.clientAbilities}
                                onChange={(e) => handleChange('clientAbilities', e.target.value)}
                                className="mt-1"
                                rows={3}
                            />
                        </div>

                        {/* Client Preferences */}
                        <div>
                            <Label htmlFor="clientPreferences">Client Preferences</Label>
                            <Textarea
                                id="clientPreferences"
                                value={formData.clientPreferences}
                                onChange={(e) => handleChange('clientPreferences', e.target.value)}
                                className="mt-1"
                                rows={3}
                            />
                        </div>

                        {/* Crisis Planning */}
                        <div>
                            <Label htmlFor="crisisPlanning">Crisis Planning</Label>
                            <Textarea
                                id="crisisPlanning"
                                value={formData.crisisPlanning}
                                onChange={(e) => handleChange('crisisPlanning', e.target.value)}
                                className="mt-1"
                                rows={3}
                            />
                        </div>

                        {/* Step Down Services */}
                        <div>
                            <Label htmlFor="stepDownServices">Step Down Services</Label>
                            <Input
                                id="stepDownServices"
                                value={formData.stepDownServices}
                                onChange={(e) => handleChange('stepDownServices', e.target.value)}
                                className="mt-1"
                            />
                        </div>

                        {/* Discharge Planning */}
                        <div>
                            <Label htmlFor="dischargePlanning">Discharge Planning</Label>
                            <Textarea
                                id="dischargePlanning"
                                value={formData.dischargePlanning}
                                onChange={(e) => handleChange('dischargePlanning', e.target.value)}
                                className="mt-1"
                                rows={3}
                            />
                        </div>

                        {/* Other Agencies */}
                        <div>
                            <Label htmlFor="otherProviders">Other agencies and/or providers working with this client</Label>
                            <Textarea
                                id="otherProviders"
                                value={formData.otherProviders}
                                onChange={(e) => handleChange('otherProviders', e.target.value)}
                                className="mt-1"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-gray-50">
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} className="bg-blue-900 hover:bg-blue-800">
                            Submit
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
