'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Search, Loader, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { searchICD10Codes, ICD10Code } from '@/hooks/admin/diagnosis';

interface AddDiagnosisModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (data: {
        icd10Code: string;
        diagnosisName: string;
        diagnosisDate: string;
        isRuleOut: boolean;
        isHistorical: boolean;
        isImpression: boolean;
        isExternal: boolean;
    }) => void;
}

export default function AddDiagnosisModal({ isOpen, onClose, onAdd }: AddDiagnosisModalProps) {
    const [diagnosisDate, setDiagnosisDate] = useState(new Date().toISOString().split('T')[0]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<ICD10Code[]>([]);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<ICD10Code | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    // Checkboxes
    const [isRuleOut, setIsRuleOut] = useState(false);
    const [isHistorical, setIsHistorical] = useState(false);
    const [isImpression, setIsImpression] = useState(false);
    const [isExternal, setIsExternal] = useState(false);

    // Debounced search
    const performSearch = useCallback(async (query: string) => {
        if (query.length < 3) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        setIsSearching(true);
        try {
            const results = await searchICD10Codes(query);
            setSearchResults(results);
            setShowDropdown(true);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setIsSearching(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 3 && !selectedDiagnosis) {
                performSearch(searchQuery);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedDiagnosis, performSearch]);

    const handleSelectDiagnosis = (diagnosis: ICD10Code) => {
        setSelectedDiagnosis(diagnosis);
        setSearchQuery(`${diagnosis.code} - ${diagnosis.name}`);
        setShowDropdown(false);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setSelectedDiagnosis(null);
    };

    const handleSubmit = () => {
        if (!selectedDiagnosis) return;

        onAdd({
            icd10Code: selectedDiagnosis.code,
            diagnosisName: selectedDiagnosis.name,
            diagnosisDate,
            isRuleOut,
            isHistorical,
            isImpression,
            isExternal
        });

        // Reset form
        setSearchQuery('');
        setSelectedDiagnosis(null);
        setIsRuleOut(false);
        setIsHistorical(false);
        setIsImpression(false);
        setIsExternal(false);
        onClose();
    };

    const handleCancel = () => {
        setSearchQuery('');
        setSelectedDiagnosis(null);
        setIsRuleOut(false);
        setIsHistorical(false);
        setIsImpression(false);
        setIsExternal(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Add Diagnosis</h2>
                    <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-4">
                    {/* Date Diagnosis */}
                    <div>
                        <Label htmlFor="diagnosisDate">Date Diagnosis</Label>
                        <Input
                            id="diagnosisDate"
                            type="date"
                            value={diagnosisDate}
                            onChange={(e) => setDiagnosisDate(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    {/* Diagnosis Search */}
                    <div className="relative">
                        <Label>Diagnosis (Type min 3 chars to search)</Label>
                        <div className="relative mt-1">
                            <Input
                                placeholder="Search by code or name..."
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="pr-10"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {isSearching ? (
                                    <Loader className="w-4 h-4 animate-spin text-gray-400" />
                                ) : (
                                    <Search className="w-4 h-4 text-gray-400" />
                                )}
                            </div>
                        </div>

                        {/* Search Results Dropdown */}
                        {showDropdown && searchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                <div className="p-2 border-b">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            className="pl-8 text-sm"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                {searchResults.map((result, index) => (
                                    <div
                                        key={index}
                                        className={`px-3 py-2 cursor-pointer hover:bg-blue-600 hover:text-white ${selectedDiagnosis?.code === result.code ? 'bg-blue-600 text-white' : ''
                                            }`}
                                        onClick={() => handleSelectDiagnosis(result)}
                                    >
                                        {result.code} - {result.name}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="ruleOut"
                                checked={isRuleOut}
                                onCheckedChange={(checked) => setIsRuleOut(checked === true)}
                            />
                            <Label htmlFor="ruleOut" className="cursor-pointer">Rule Out Dx</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="historical"
                                checked={isHistorical}
                                onCheckedChange={(checked) => setIsHistorical(checked === true)}
                            />
                            <Label htmlFor="historical" className="cursor-pointer">Historical Dx?</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="impression"
                                checked={isImpression}
                                onCheckedChange={(checked) => setIsImpression(checked === true)}
                            />
                            <Label htmlFor="impression" className="cursor-pointer">
                                Impression <Info className="inline w-3 h-3 text-gray-400" />
                            </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="external"
                                checked={isExternal}
                                onCheckedChange={(checked) => setIsExternal(checked === true)}
                            />
                            <Label htmlFor="external" className="cursor-pointer">
                                External <Info className="inline w-3 h-3 text-gray-400" />
                            </Label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t">
                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedDiagnosis}
                        className="bg-blue-900 hover:bg-blue-800"
                    >
                        Add
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
