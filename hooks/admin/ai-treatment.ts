import { getClientDiagnoses, ClientDiagnosis } from './diagnosis';

// AI-generated treatment plan structure
export interface GeneratedTreatmentPlan {
    title: string;
    planDate: string;
    clientStrengths: string;
    clientNeeds: string;
    clientAbilities: string;
    clientPreferences: string;
    crisisPlanning: string;
    goals: Array<{
        goalText: string;
        targetDate: string;
        objectives: Array<{
            objectiveText: string;
            frequency: string;
            responsibleParty: string;
        }>;
    }>;
}

// Gemini API configuration
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSyDCKbigg3VlaVhEnW11t_bcQVrUJiWbJac';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Generate treatment plan using Gemini AI
export const generateAITreatmentPlan = async (clientId: string): Promise<GeneratedTreatmentPlan> => {
    // 1. Fetch client diagnoses
    const diagnoses = await getClientDiagnoses(clientId);

    if (diagnoses.length === 0) {
        throw new Error('No diagnoses found for this client. Please add diagnoses before generating a treatment plan.');
    }

    // 2. Build the prompt for Gemini
    const diagnosisList = diagnoses.map(d => `${d.icd10Code} - ${d.diagnosisName}`).join('\n');

    const prompt = `You are an expert mental health treatment planner. Generate a comprehensive treatment plan for a client with the following diagnoses:

${diagnosisList}

Generate a JSON response with the following structure (respond ONLY with valid JSON, no markdown):
{
  "title": "A descriptive title for the treatment plan based on the diagnoses",
  "clientStrengths": "List of potential client strengths to leverage in treatment",
  "clientNeeds": "List of client needs based on diagnoses",
  "clientAbilities": "Assessment of client abilities",
  "clientPreferences": "Common client preferences to explore",
  "crisisPlanning": "Crisis planning recommendations",
  "goals": [
    {
      "goalText": "Specific, measurable treatment goal",
      "objectives": [
        {
          "objectiveText": "Specific intervention or objective",
          "frequency": "How often (e.g., Weekly, Daily, Bi-weekly)",
          "responsibleParty": "Who is responsible (e.g., Therapist/Client, Client, Therapist)"
        }
      ]
    }
  ]
}

Requirements:
- Generate 2-4 treatment goals based on the diagnoses
- Each goal should have 2-4 specific objectives/interventions
- Goals should be SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- Include evidence-based interventions appropriate for the diagnoses
- Be specific and clinically appropriate`;

    try {
        // 3. Call Gemini API
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 2048,
                }
            })
        });

        if (!response.ok) {
            console.error('Gemini API error:', await response.text());
            throw new Error('Failed to generate treatment plan from AI');
        }

        const data = await response.json();

        // 4. Parse the response
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            throw new Error('No response from AI');
        }

        // Clean up the response (remove any markdown code blocks if present)
        let cleanedText = generatedText.trim();
        if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.slice(7);
        }
        if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.slice(3);
        }
        if (cleanedText.endsWith('```')) {
            cleanedText = cleanedText.slice(0, -3);
        }
        cleanedText = cleanedText.trim();

        const parsedPlan = JSON.parse(cleanedText);

        // 5. Calculate target date (3 months from now)
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + 3);
        const targetDateStr = targetDate.toISOString().split('T')[0];

        // 6. Return the formatted plan
        return {
            title: parsedPlan.title || `Treatment Plan for ${diagnoses[0].diagnosisName}`,
            planDate: new Date().toISOString().split('T')[0],
            clientStrengths: parsedPlan.clientStrengths || '',
            clientNeeds: parsedPlan.clientNeeds || '',
            clientAbilities: parsedPlan.clientAbilities || '',
            clientPreferences: parsedPlan.clientPreferences || '',
            crisisPlanning: parsedPlan.crisisPlanning || 'If client experiences crisis, contact emergency services (911) or crisis hotline.',
            goals: (parsedPlan.goals || []).map((g: { goalText: string; objectives?: Array<{ objectiveText: string; frequency?: string; responsibleParty?: string }> }) => ({
                goalText: g.goalText,
                targetDate: targetDateStr,
                objectives: (g.objectives || []).map((o: { objectiveText: string; frequency?: string; responsibleParty?: string }) => ({
                    objectiveText: o.objectiveText,
                    frequency: o.frequency || 'Weekly',
                    responsibleParty: o.responsibleParty || 'Therapist/Client'
                }))
            }))
        };
    } catch (error) {
        console.error('Error generating AI treatment plan:', error);
        // Fallback to template-based generation if AI fails
        return generateFallbackPlan(diagnoses);
    }
};

// Fallback template-based generation if Gemini API fails
const generateFallbackPlan = (diagnoses: ClientDiagnosis[]): GeneratedTreatmentPlan => {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + 3);
    const targetDateStr = targetDate.toISOString().split('T')[0];

    const diagnosisNames = diagnoses.map(d => d.diagnosisName).slice(0, 2);

    return {
        title: `Management and Treatment for ${diagnosisNames.join(' and ')}`,
        planDate: new Date().toISOString().split('T')[0],
        clientStrengths: 'Seeking help, Self-awareness, Motivation for change',
        clientNeeds: 'Skills development, Support, Consistency',
        clientAbilities: 'To be assessed during treatment',
        clientPreferences: 'To be discussed with client',
        crisisPlanning: 'If client experiences crisis, contact emergency services (911) or crisis hotline. Safety plan to be developed with client.',
        goals: [
            {
                goalText: 'Improve Overall Mental Health and Well-being',
                targetDate: targetDateStr,
                objectives: [
                    { objectiveText: 'Client will identify personal mental health goals', frequency: 'Monthly', responsibleParty: 'Therapist/Client' },
                    { objectiveText: 'Client will learn and practice stress management techniques', frequency: 'Weekly', responsibleParty: 'Therapist/Client' },
                    { objectiveText: 'Client will maintain consistent self-care routines', frequency: 'Daily', responsibleParty: 'Client' }
                ]
            },
            {
                goalText: 'Develop Effective Coping Skills',
                targetDate: targetDateStr,
                objectives: [
                    { objectiveText: 'Client will identify triggers and warning signs', frequency: 'Weekly', responsibleParty: 'Therapist/Client' },
                    { objectiveText: 'Client will build a personal coping skills toolkit', frequency: 'Monthly', responsibleParty: 'Therapist/Client' },
                    { objectiveText: 'Client will practice new coping skills in real-life situations', frequency: 'Ongoing', responsibleParty: 'Client' }
                ]
            }
        ]
    };
};

// Export diagnoses for use in UI
export const getClientDiagnosesForPlan = async (clientId: string): Promise<ClientDiagnosis[]> => {
    return getClientDiagnoses(clientId);
};
