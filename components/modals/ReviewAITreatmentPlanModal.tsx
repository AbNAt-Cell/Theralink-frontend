'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronUp, Pencil, Calendar, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GeneratedTreatmentPlan } from '@/hooks/admin/ai-treatment';

interface ReviewAITreatmentPlanModalProps {
    isOpen: boolean;
    plan: GeneratedTreatmentPlan | null;
    isLoading: boolean;
    onClose: () => void;
    onAccept: () => void;
    onDelete: () => void;
}

export default function ReviewAITreatmentPlanModal({
    isOpen,
    plan,
    isLoading,
    onClose,
    onAccept,
    onDelete
}: ReviewAITreatmentPlanModalProps) {
    const [isPlanExpanded, setIsPlanExpanded] = useState(true);
    const [expandedGoals, setExpandedGoals] = useState<Record<number, boolean>>({});

    const toggleGoal = (index: number) => {
        setExpandedGoals(prev => ({ ...prev, [index]: !prev[index] }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                    <h2 className="text-lg font-semibold">Review AI Generated Treatment Plan</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <Loader className="w-12 h-12 animate-spin text-blue-600 mb-4" />
                            <p className="text-gray-600">Generating AI Treatment Plan...</p>
                            <p className="text-sm text-gray-400 mt-2">Analyzing client diagnoses and creating personalized goals</p>
                        </div>
                    ) : plan ? (
                        <>
                            <div className="mb-4">
                                <h6 className="text-sm font-semibold text-gray-600 mb-2">AI Generated Treatment Plan</h6>
                            </div>
                            <hr className="mb-4" />

                            {/* Main Expandable Section */}
                            <div className="border rounded-lg overflow-hidden mb-4">
                                {/* Plan Header */}
                                <div
                                    className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer"
                                    onClick={() => setIsPlanExpanded(!isPlanExpanded)}
                                >
                                    <h3 className="font-medium text-gray-800">{plan.title}</h3>
                                    {isPlanExpanded ? (
                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    )}
                                </div>

                                {/* Plan Content */}
                                {isPlanExpanded && (
                                    <div className="p-4 border-t">
                                        {/* Edit Button */}
                                        <div className="flex justify-end mb-3">
                                            <Button variant="ghost" size="sm" className="text-blue-600">
                                                <Pencil className="w-4 h-4 mr-2" />
                                                Edit Plan
                                            </Button>
                                        </div>

                                        {/* Plan Metadata */}
                                        <div className="space-y-2 text-sm mb-6">
                                            <p className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-orange-500" />
                                                <b>Plan Date:</b> {new Date(plan.planDate).toLocaleDateString()}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-orange-500" />
                                                <b>Plan End Date:</b> -/-/-
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-orange-500" />
                                                <b>Discharge/Transition Date:</b> -/-
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-orange-500" />
                                                <b>Start Time:</b> -/-
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-orange-500" />
                                                <b>End Time:</b> -/-
                                            </p>
                                            <p><b>Service:</b> </p>
                                            <p><b>Place Of Service:</b> </p>
                                            <p className="mt-3">
                                                <b>Individual/Family was an active participant in the development of the service plan and identified the goals?:</b> No
                                            </p>
                                            <p><b>Transition Discharge Plan:</b></p>
                                            <p><b>Maintenance Recommendation:</b></p>
                                            <p><b>Client Strengths:</b> {plan.clientStrengths}</p>
                                            <p><b>Client Needs:</b> {plan.clientNeeds}</p>
                                            <p><b>Client Abilities:</b> {plan.clientAbilities}</p>
                                            <p><b>Client Preferences:</b> {plan.clientPreferences}</p>
                                            <p><b>Crisis Planning:</b> {plan.crisisPlanning}</p>
                                            <p><b>Step Down Services:</b></p>
                                            <p><b>Discharge Planning:</b></p>
                                            <p><b>Other agencies and/or providers working with this client:</b></p>
                                        </div>

                                        {/* Goals Section */}
                                        <div className="mt-6">
                                            <h4 className="text-lg font-medium text-gray-600 mb-4">Goals</h4>

                                            {plan.goals.map((goal, index) => (
                                                <div key={index} className="border rounded-lg mb-3 overflow-hidden">
                                                    {/* Goal Header */}
                                                    <div
                                                        className="flex items-center justify-between p-3 bg-blue-50 cursor-pointer"
                                                        onClick={() => toggleGoal(index)}
                                                    >
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="font-medium text-gray-800">{goal.goalText}</span>
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                                Start Date:
                                                            </span>
                                                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                                Target Date: {new Date(goal.targetDate).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        {expandedGoals[index] ? (
                                                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                                                        )}
                                                    </div>

                                                    {/* Goal Objectives */}
                                                    {expandedGoals[index] && (
                                                        <div className="p-4 bg-white">
                                                            <h5 className="text-sm font-medium text-gray-600 mb-3">Objectives/Interventions</h5>
                                                            <div className="space-y-2">
                                                                {goal.objectives.map((obj, objIndex) => (
                                                                    <div key={objIndex} className="p-3 bg-gray-50 rounded-lg text-sm">
                                                                        <p className="font-medium">{objIndex + 1}. {obj.objectiveText}</p>
                                                                        <div className="flex gap-4 mt-2 text-gray-600">
                                                                            <span><b>Frequency:</b> {obj.frequency}</span>
                                                                            <span><b>Responsible:</b> {obj.responsibleParty}</span>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <p>No treatment plan generated yet</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t p-4 bg-gray-50">
                    <div className="flex gap-2">
                        <Button
                            onClick={onAccept}
                            disabled={isLoading || !plan}
                            className="bg-blue-900 hover:bg-blue-800"
                        >
                            Accept Treatment Plan
                        </Button>
                        <Button
                            onClick={onDelete}
                            disabled={isLoading || !plan}
                            variant="destructive"
                        >
                            Delete Draft
                        </Button>
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
