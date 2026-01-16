'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TemplateDefinition, TemplateSection, TemplateField } from '@/lib/templateDefinitions';

interface TemplateFormRendererProps {
    template: TemplateDefinition;
    formData: Record<string, string>;
    onChange: (fieldId: string, value: string) => void;
}

export default function TemplateFormRenderer({ template, formData, onChange }: TemplateFormRendererProps) {
    const [openSections, setOpenSections] = React.useState<Record<string, boolean>>(() => {
        // All sections open by default
        const initial: Record<string, boolean> = {};
        template.sections.forEach(s => { initial[s.id] = true; });
        return initial;
    });

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    const renderField = (field: TemplateField) => {
        const value = formData[field.id] || '';

        switch (field.type) {
            case 'text':
                return (
                    <Input
                        id={field.id}
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        className="border-gray-300"
                    />
                );

            case 'textarea':
                return (
                    <Textarea
                        id={field.id}
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        className="border-gray-300 min-h-[100px]"
                        rows={4}
                    />
                );

            case 'select':
                return (
                    <Select value={value} onValueChange={(val) => onChange(field.id, val)}>
                        <SelectTrigger className="border-gray-300">
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );

            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {field.options?.map((opt) => (
                            <div key={opt.value} className="flex items-center gap-2">
                                <Checkbox
                                    id={`${field.id}-${opt.value}`}
                                    checked={value === opt.value || value.includes(opt.value)}
                                    onCheckedChange={(checked) => onChange(field.id, checked ? opt.value : '')}
                                />
                                <label htmlFor={`${field.id}-${opt.value}`} className="text-sm text-gray-700">
                                    {opt.label}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            case 'radio':
                return (
                    <div className="flex items-center gap-4 flex-wrap">
                        {field.options?.map((opt) => (
                            <label
                                key={opt.value}
                                className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-md border transition-colors ${value === opt.value
                                        ? 'bg-blue-100 border-blue-400 text-blue-800'
                                        : 'bg-white border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={opt.value}
                                    checked={value === opt.value}
                                    onChange={() => onChange(field.id, opt.value)}
                                    className="sr-only"
                                />
                                <span className="text-sm font-medium">{opt.label}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'date':
                return (
                    <Input
                        id={field.id}
                        type="date"
                        value={value}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        className="border-gray-300"
                    />
                );

            case 'number':
                return (
                    <Input
                        id={field.id}
                        type="number"
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        className="border-gray-300"
                    />
                );

            default:
                return (
                    <Input
                        id={field.id}
                        placeholder={field.placeholder}
                        value={value}
                        onChange={(e) => onChange(field.id, e.target.value)}
                        className="border-gray-300"
                    />
                );
        }
    };

    const renderSection = (section: TemplateSection) => {
        const isOpen = openSections[section.id];

        return (
            <Collapsible key={section.id} open={isOpen} onOpenChange={() => toggleSection(section.id)}>
                <div className="border rounded-lg overflow-hidden bg-white">
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-slate-100 hover:bg-slate-200 transition-colors">
                        <div className="text-left">
                            <h3 className="font-semibold text-slate-800">{section.title}</h3>
                            {section.description && (
                                <p className="text-sm text-gray-500">{section.description}</p>
                            )}
                        </div>
                        {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-slate-600" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-slate-600" />
                        )}
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <div className="p-4 space-y-4">
                            {section.fields.map((field) => (
                                <div key={field.id} className="space-y-2">
                                    <Label htmlFor={field.id} className="text-gray-700">
                                        {field.label}
                                        {field.required && <span className="text-red-500 ml-1">*</span>}
                                    </Label>
                                    {renderField(field)}
                                </div>
                            ))}
                        </div>
                    </CollapsibleContent>
                </div>
            </Collapsible>
        );
    };

    return (
        <div className="space-y-4 mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                📋 {template.name} - Form Fields
            </h2>
            <div className="space-y-3">
                {template.sections.map(renderSection)}
            </div>
        </div>
    );
}
