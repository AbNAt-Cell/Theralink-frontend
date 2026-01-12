'use client';

import { useState } from 'react';
import { X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddVitalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: {
        recordDate: string;
        bpSystolic?: number;
        bpDiastolic?: number;
        heartRate?: number;
        pulseRate?: number;
        respiration?: number;
        temperature?: number;
        weight?: number;
        height?: number;
    }) => Promise<void>;
}

export default function AddVitalModal({ isOpen, onClose, onAdd }: AddVitalModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        recordDate: new Date().toISOString().split('T')[0],
        bpSystolic: '',
        bpDiastolic: '',
        heartRate: '',
        pulseRate: '',
        respiration: '',
        temperature: '',
        weight: '',
        height: ''
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onAdd({
                recordDate: formData.recordDate,
                bpSystolic: formData.bpSystolic ? Number(formData.bpSystolic) : undefined,
                bpDiastolic: formData.bpDiastolic ? Number(formData.bpDiastolic) : undefined,
                heartRate: formData.heartRate ? Number(formData.heartRate) : undefined,
                pulseRate: formData.pulseRate ? Number(formData.pulseRate) : undefined,
                respiration: formData.respiration ? Number(formData.respiration) : undefined,
                temperature: formData.temperature ? Number(formData.temperature) : undefined,
                weight: formData.weight ? Number(formData.weight) : undefined,
                height: formData.height ? Number(formData.height) : undefined
            });

            // Reset form
            setFormData({
                recordDate: new Date().toISOString().split('T')[0],
                bpSystolic: '',
                bpDiastolic: '',
                heartRate: '',
                pulseRate: '',
                respiration: '',
                temperature: '',
                weight: '',
                height: ''
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            recordDate: new Date().toISOString().split('T')[0],
            bpSystolic: '',
            bpDiastolic: '',
            heartRate: '',
            pulseRate: '',
            respiration: '',
            temperature: '',
            weight: '',
            height: ''
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Add Vital</h2>
                    <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Row 1: Record Date, BP Sys, BP Dias */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="recordDate" className="text-gray-700 font-medium">Record Date</Label>
                            <Input
                                id="recordDate"
                                type="date"
                                value={formData.recordDate}
                                onChange={(e) => handleChange('recordDate', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="bpSystolic" className="text-gray-700 font-medium">Bp Sys</Label>
                            <Input
                                id="bpSystolic"
                                type="number"
                                placeholder="Bp Sys"
                                value={formData.bpSystolic}
                                onChange={(e) => handleChange('bpSystolic', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="bpDiastolic" className="text-gray-700 font-medium">Bp Dias</Label>
                            <Input
                                id="bpDiastolic"
                                type="number"
                                placeholder="Bp Dias"
                                value={formData.bpDiastolic}
                                onChange={(e) => handleChange('bpDiastolic', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* Row 2: Temperature, Heart Rate, Respiration */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="temperature" className="text-gray-700 font-medium">Temperature</Label>
                            <Input
                                id="temperature"
                                type="number"
                                step="0.1"
                                placeholder="Temperature"
                                value={formData.temperature}
                                onChange={(e) => handleChange('temperature', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="heartRate" className="text-gray-700 font-medium">Heart Rate</Label>
                            <Input
                                id="heartRate"
                                type="number"
                                placeholder="Heart Rate"
                                value={formData.heartRate}
                                onChange={(e) => handleChange('heartRate', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="respiration" className="text-gray-700 font-medium">Respiration</Label>
                            <Input
                                id="respiration"
                                type="number"
                                placeholder="Respiration"
                                value={formData.respiration}
                                onChange={(e) => handleChange('respiration', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    {/* Row 3: Pulse Rate, Weight, Height */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="pulseRate" className="text-gray-700 font-medium">Pulse Rate</Label>
                            <Input
                                id="pulseRate"
                                type="number"
                                placeholder="Pulse Rate"
                                value={formData.pulseRate}
                                onChange={(e) => handleChange('pulseRate', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="weight" className="text-gray-700 font-medium">Weight (in lbs.)</Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                placeholder="Weight"
                                value={formData.weight}
                                onChange={(e) => handleChange('weight', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="height" className="text-gray-700 font-medium">Height (in cms.)</Label>
                            <Input
                                id="height"
                                type="number"
                                step="0.1"
                                placeholder="Height"
                                value={formData.height}
                                onChange={(e) => handleChange('height', e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 p-4 border-t">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !formData.recordDate}
                        className="bg-blue-900 hover:bg-blue-800"
                    >
                        {loading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                        Add Vital
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
