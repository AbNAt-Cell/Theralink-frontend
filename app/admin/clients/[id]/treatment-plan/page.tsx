'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Loader, Plus, Sparkles, Trash, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import {
  getTreatmentPlans,
  createTreatmentPlan,
  deleteTreatmentPlan,
  updateTreatmentPlanStatus,
  TreatmentPlan
} from '@/hooks/admin/treatment-plan';
import { generateAITreatmentPlan, GeneratedTreatmentPlan, AIGenerationConfig } from '@/hooks/admin/ai-treatment';
import GenerateAITreatmentModal from '@/components/modals/GenerateAITreatmentModal';
import ReviewAITreatmentPlanModal from '@/components/modals/ReviewAITreatmentPlanModal';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function TreatmentPlanPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [plans, setPlans] = useState<TreatmentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Config Modal state (step 1)
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Review Modal state (step 2)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedTreatmentPlan | null>(null);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, plansData] = await Promise.all([
        getClientById(params.id),
        getTreatmentPlans(params.id, showCompleted)
      ]);
      setClient(clientData);
      setPlans(plansData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  }, [params.id, showCompleted, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const togglePlan = (planId: string) => {
    setExpandedPlans(prev => ({ ...prev, [planId]: !prev[planId] }));
  };

  const toggleGoal = (goalId: string) => {
    setExpandedGoals(prev => ({ ...prev, [goalId]: !prev[goalId] }));
  };

  // Step 1: Open config modal when "Generate Treatment Plan" is clicked
  const handleGeneratePlanClick = () => {
    setIsConfigModalOpen(true);
  };

  // Step 2: Generate AI plan with user-specified config, then show review modal
  const handleGenerateWithConfig = async (config: AIGenerationConfig) => {
    setIsConfigModalOpen(false);
    setIsReviewModalOpen(true);
    setIsGenerating(true);
    setGeneratedPlan(null);

    try {
      const plan = await generateAITreatmentPlan(params.id, config);
      setGeneratedPlan(plan);
    } catch (error) {
      console.error('Error generating plan:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate treatment plan';
      toast({ variant: 'destructive', title: 'Error', description: errorMessage });
      setIsReviewModalOpen(false);
    } finally {
      setIsGenerating(false);
    }
  };

  // Accept generated plan
  const handleAcceptPlan = async () => {
    if (!generatedPlan) return;

    try {
      await createTreatmentPlan({
        clientId: params.id,
        title: generatedPlan.title,
        planDate: generatedPlan.planDate,
        status: 'active',
        isAiGenerated: true,
        clientStrengths: generatedPlan.clientStrengths,
        clientNeeds: generatedPlan.clientNeeds,
        clientAbilities: generatedPlan.clientAbilities,
        clientPreferences: generatedPlan.clientPreferences,
        crisisPlanning: generatedPlan.crisisPlanning,
        goals: generatedPlan.goals.map(g => ({
          goalText: g.goalText,
          targetDate: g.targetDate,
          objectives: g.objectives.map(o => ({
            objectiveText: o.objectiveText,
            frequency: o.frequency || undefined,
            responsibleParty: o.responsibleParty || undefined
          }))
        }))
      });

      toast({ title: 'Success', description: 'Treatment plan created successfully' });
      setIsReviewModalOpen(false);
      setGeneratedPlan(null);
      loadData();
    } catch (error) {
      console.error('Error creating plan:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to create treatment plan' });
    }
  };

  // Delete generated draft
  const handleDeleteDraft = () => {
    setGeneratedPlan(null);
    setIsReviewModalOpen(false);
  };

  // Delete existing plan
  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this treatment plan?')) return;

    setDeletingId(planId);
    try {
      await deleteTreatmentPlan(planId);
      toast({ title: 'Success', description: 'Treatment plan deleted' });
      loadData();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete plan' });
    } finally {
      setDeletingId(null);
    }
  };

  // Mark plan as completed
  const handleCompletePlan = async (planId: string) => {
    try {
      await updateTreatmentPlanStatus(planId, 'completed');
      toast({ title: 'Success', description: 'Treatment plan marked as completed' });
      loadData();
    } catch (error) {
      console.error('Error completing plan:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update plan' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <AdminClientProfile client={client} />

      <div className='flex justify-between items-center flex-wrap gap-4'>
        <h2 className='text-xl font-semibold'>Treatment Plans</h2>
        <div className='flex items-center gap-4 flex-wrap'>
          <div className='flex items-center gap-2'>
            <Switch
              id='show-closed'
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
            />
            <label htmlFor='show-closed' className='text-sm'>
              Show Closed/Completed Plans
            </label>
          </div>
          <Button
            variant='outline'
            className='border-blue-500 text-blue-500'
            onClick={handleGeneratePlanClick}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Treatment Plan
          </Button>
          <Button className='bg-blue-900 hover:bg-blue-800'>
            <Plus className="w-4 h-4 mr-2" />
            Add Plan
          </Button>
        </div>
      </div>

      {/* Treatment Plans List */}
      {plans.length === 0 ? (
        <div className='border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]'>
          <div className='relative w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full'>
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className='text-gray-500'>No Treatment Plans Available</p>
          <p className='text-sm text-gray-400 mt-2'>
            Click &quot;Generate Treatment Plan&quot; to create an AI-powered plan based on client diagnoses
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {plans.map(plan => (
            <div key={plan.id} className='border rounded-lg overflow-hidden bg-white'>
              {/* Plan Header */}
              <div
                className='flex items-center justify-between p-4 bg-gray-50 cursor-pointer'
                onClick={() => togglePlan(plan.id)}
              >
                <div className='flex items-center gap-3'>
                  <h3 className='font-medium text-gray-800'>{plan.title}</h3>
                  {plan.isAiGenerated && (
                    <span className='text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1'>
                      <Sparkles className="w-3 h-3" /> AI Generated
                    </span>
                  )}
                  <span className={`text-xs px-2 py-1 rounded ${plan.status === 'active' ? 'bg-green-100 text-green-700' :
                    plan.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      plan.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                    {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  {plan.status === 'active' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); handleCompletePlan(plan.id); }}
                    >
                      Mark Complete
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={(e) => { e.stopPropagation(); handleDeletePlan(plan.id); }}
                    disabled={deletingId === plan.id}
                  >
                    {deletingId === plan.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                  </Button>
                  {expandedPlans[plan.id] ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>

              {/* Plan Content */}
              {expandedPlans[plan.id] && (
                <div className='p-4 border-t'>
                  {/* Plan Metadata */}
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6'>
                    <p className='flex items-center gap-2'>
                      <Calendar className='w-4 h-4 text-orange-500' />
                      <b>Plan Date:</b> {new Date(plan.planDate).toLocaleDateString()}
                    </p>
                    {plan.planEndDate && (
                      <p><b>End Date:</b> {new Date(plan.planEndDate).toLocaleDateString()}</p>
                    )}
                    {plan.clientStrengths && <p><b>Strengths:</b> {plan.clientStrengths}</p>}
                    {plan.clientNeeds && <p><b>Needs:</b> {plan.clientNeeds}</p>}
                  </div>

                  {/* Goals */}
                  {plan.goals.length > 0 && (
                    <div>
                      <h4 className='text-lg font-medium text-gray-600 mb-3'>Goals ({plan.goals.length})</h4>
                      {plan.goals.map(goal => (
                        <div key={goal.id} className='border rounded-lg mb-2 overflow-hidden'>
                          <div
                            className='flex items-center justify-between p-3 bg-blue-50 cursor-pointer'
                            onClick={() => toggleGoal(goal.id)}
                          >
                            <div className='flex items-center gap-2 flex-wrap'>
                              <span className='font-medium'>{goal.goalNumber}. {goal.goalText}</span>
                              {goal.targetDate && (
                                <span className='text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded'>
                                  Target: {new Date(goal.targetDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            {expandedGoals[goal.id] ? (
                              <ChevronUp className='w-4 h-4 text-gray-500' />
                            ) : (
                              <ChevronDown className='w-4 h-4 text-gray-500' />
                            )}
                          </div>

                          {expandedGoals[goal.id] && goal.objectives.length > 0 && (
                            <div className='p-3 bg-white'>
                              <h5 className='text-sm font-medium text-gray-600 mb-2'>Objectives</h5>
                              {goal.objectives.map(obj => (
                                <div key={obj.id} className='p-2 bg-gray-50 rounded mb-2 text-sm'>
                                  <p>{obj.objectiveNumber}. {obj.objectiveText}</p>
                                  <div className='flex gap-4 mt-1 text-gray-500 text-xs'>
                                    {obj.frequency && <span>Frequency: {obj.frequency}</span>}
                                    {obj.responsibleParty && <span>Responsible: {obj.responsibleParty}</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Config Modal (Step 1) */}
      <GenerateAITreatmentModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onGenerate={handleGenerateWithConfig}
        isGenerating={isGenerating}
      />

      {/* AI Review Modal (Step 2) */}
      <ReviewAITreatmentPlanModal
        isOpen={isReviewModalOpen}
        plan={generatedPlan}
        isLoading={isGenerating}
        onClose={() => { setIsReviewModalOpen(false); setGeneratedPlan(null); }}
        onAccept={handleAcceptPlan}
        onDelete={handleDeleteDraft}
      />
    </div>
  );
}
