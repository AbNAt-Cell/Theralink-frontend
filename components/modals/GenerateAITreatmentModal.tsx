'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface GenerateAITreatmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (config: { numGoals: number; numObjectives: number; numInterventions: number }) => void;
    isGenerating: boolean;
}

export default function GenerateAITreatmentModal({
    isOpen,
    onClose,
    onGenerate,
    isGenerating
}: GenerateAITreatmentModalProps) {
    const [numGoals, setNumGoals] = useState<string>('2');
    const [numObjectives, setNumObjectives] = useState<string>('3');
    const [numInterventions, setNumInterventions] = useState<string>('2');

    const handleGenerate = () => {
        onGenerate({
            numGoals: parseInt(numGoals) || 2,
            numObjectives: parseInt(numObjectives) || 3,
            numInterventions: parseInt(numInterventions) || 2
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Generate AI Treatment Plan</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <p className="text-sm text-gray-600">
                        Please enter the number of Goals, Objectives and Interventions you want to generate by AI.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="numGoals">Number Of Goals</Label>
                            <Input
                                id="numGoals"
                                type="number"
                                min="1"
                                max="10"
                                placeholder="Number Of Goals"
                                value={numGoals}
                                onChange={(e) => setNumGoals(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="numObjectives">Number Of Objectives</Label>
                            <Input
                                id="numObjectives"
                                type="number"
                                min="1"
                                max="10"
                                placeholder="Number Of Objectives"
                                value={numObjectives}
                                onChange={(e) => setNumObjectives(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="numInterventions">Number Of Intervention</Label>
                        <Input
                            id="numInterventions"
                            type="number"
                            min="1"
                            max="10"
                            placeholder="Number Of Intervention"
                            value={numInterventions}
                            onChange={(e) => setNumInterventions(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-2 p-4 border-t">
                    <Button variant="outline" onClick={onClose} disabled={isGenerating}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="bg-blue-900 hover:bg-blue-800"
                    >
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
