// Template form definitions with field sections for each document type

export interface TemplateField {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'number' | 'date' | 'rating';
    options?: { value: string; label: string }[];
    placeholder?: string;
    required?: boolean;
}

export interface TemplateSection {
    id: string;
    title: string;
    description?: string;
    fields: TemplateField[];
    collapsible?: boolean;
}

export interface TemplateDefinition {
    id: string;
    name: string;
    sections: TemplateSection[];
}

// Rating options for ANSA/CANS scales
const RATING_0_3 = [
    { value: '0', label: '0 - No evidence' },
    { value: '1', label: '1 - History/mild' },
    { value: '2', label: '2 - Moderate' },
    { value: '3', label: '3 - Severe' },
];

export const TEMPLATE_DEFINITIONS: Record<string, TemplateDefinition> = {
    'ansa': {
        id: 'ansa',
        name: '(TxGeneral) ANSA',
        sections: [
            {
                id: 'risk-behaviors',
                title: 'RISK BEHAVIORS',
                fields: [
                    { id: 'suicide-risk', label: 'Suicide Risk', type: 'select', options: RATING_0_3 },
                    { id: 'self-harm', label: 'Non-Suicidal Self-Injury', type: 'select', options: RATING_0_3 },
                    { id: 'danger-others', label: 'Danger to Others', type: 'select', options: RATING_0_3 },
                    { id: 'elopement', label: 'Elopement', type: 'select', options: RATING_0_3 },
                    { id: 'sexually-reactive', label: 'Sexually Reactive Behaviors', type: 'select', options: RATING_0_3 },
                    { id: 'criminal-behavior', label: 'Criminal Behavior', type: 'select', options: RATING_0_3 },
                ],
            },
            {
                id: 'life-domain',
                title: 'LIFE DOMAIN FUNCTIONING',
                fields: [
                    { id: 'family', label: 'Family Functioning', type: 'select', options: RATING_0_3 },
                    { id: 'living-situation', label: 'Living Situation', type: 'select', options: RATING_0_3 },
                    { id: 'social-functioning', label: 'Social Functioning', type: 'select', options: RATING_0_3 },
                    { id: 'recreational', label: 'Recreational Activities', type: 'select', options: RATING_0_3 },
                    { id: 'employment', label: 'Employment', type: 'select', options: RATING_0_3 },
                    { id: 'legal', label: 'Legal Involvement', type: 'select', options: RATING_0_3 },
                ],
            },
            {
                id: 'strengths',
                title: 'STRENGTHS',
                fields: [
                    { id: 'family-strengths', label: 'Family Strengths', type: 'select', options: RATING_0_3 },
                    { id: 'interpersonal', label: 'Interpersonal Skills', type: 'select', options: RATING_0_3 },
                    { id: 'optimism', label: 'Optimism', type: 'select', options: RATING_0_3 },
                    { id: 'talents', label: 'Talents/Interests', type: 'select', options: RATING_0_3 },
                    { id: 'spiritual', label: 'Spiritual/Religious', type: 'select', options: RATING_0_3 },
                    { id: 'community', label: 'Community Life', type: 'select', options: RATING_0_3 },
                ],
            },
        ],
    },

    'birp': {
        id: 'birp',
        name: 'B.I.R.P.',
        sections: [
            {
                id: 'behavior',
                title: 'BEHAVIOR',
                description: 'Observable client behaviors during session',
                fields: [
                    { id: 'behavior-observed', label: 'Behavior Observed', type: 'textarea', placeholder: 'Describe client behaviors, appearance, mood, affect...' },
                ],
            },
            {
                id: 'intervention',
                title: 'INTERVENTION',
                description: 'Clinical interventions used during session',
                fields: [
                    { id: 'interventions-used', label: 'Interventions Used', type: 'textarea', placeholder: 'Describe therapeutic techniques, strategies, and interventions applied...' },
                ],
            },
            {
                id: 'response',
                title: 'RESPONSE',
                description: "Client's response to interventions",
                fields: [
                    { id: 'client-response', label: 'Client Response', type: 'textarea', placeholder: "Describe client's response to interventions, progress, insights..." },
                ],
            },
            {
                id: 'plan',
                title: 'PLAN',
                description: 'Plan for next session and ongoing treatment',
                fields: [
                    { id: 'treatment-plan', label: 'Plan', type: 'textarea', placeholder: 'Describe plan for next session, homework, referrals, follow-up...' },
                ],
            },
        ],
    },

    'pie': {
        id: 'pie',
        name: 'P.I.E.',
        sections: [
            {
                id: 'problem',
                title: 'PROBLEM',
                fields: [
                    { id: 'problem-identified', label: 'Problem Identified', type: 'textarea', placeholder: 'Describe the presenting problem or concern addressed in this session...' },
                ],
            },
            {
                id: 'intervention-pie',
                title: 'INTERVENTION',
                fields: [
                    { id: 'intervention-provided', label: 'Intervention Provided', type: 'textarea', placeholder: 'Describe the clinical interventions and techniques used...' },
                ],
            },
            {
                id: 'evaluation',
                title: 'EVALUATION',
                fields: [
                    { id: 'evaluation-outcome', label: 'Evaluation/Outcome', type: 'textarea', placeholder: "Evaluate the effectiveness of the intervention and client's progress..." },
                ],
            },
        ],
    },

    'biopsychosocial-adult': {
        id: 'biopsychosocial-adult',
        name: 'Biopsychosocial - Adult',
        sections: [
            {
                id: 'identifying-info',
                title: 'IDENTIFYING INFORMATION',
                fields: [
                    { id: 'referral-source', label: 'Referral Source', type: 'text', placeholder: 'Who referred the client?' },
                    { id: 'reason-referral', label: 'Reason for Referral', type: 'textarea', placeholder: 'Primary reason for seeking services...' },
                ],
            },
            {
                id: 'presenting-problem',
                title: 'PRESENTING PROBLEM',
                fields: [
                    { id: 'chief-complaint', label: 'Chief Complaint', type: 'textarea', placeholder: "Client's main concerns in their own words..." },
                    { id: 'symptom-history', label: 'History of Present Illness', type: 'textarea', placeholder: 'Onset, duration, frequency, severity of symptoms...' },
                ],
            },
            {
                id: 'psychiatric-history',
                title: 'PSYCHIATRIC HISTORY',
                fields: [
                    { id: 'previous-treatment', label: 'Previous Treatment', type: 'textarea', placeholder: 'Prior psychiatric treatment, hospitalizations, medications...' },
                    { id: 'suicide-history', label: 'Suicide/Self-Harm History', type: 'textarea', placeholder: 'Any history of attempts, ideation, self-harm behaviors...' },
                ],
            },
            {
                id: 'substance-use',
                title: 'SUBSTANCE USE HISTORY',
                fields: [
                    { id: 'substances', label: 'Substance Use', type: 'textarea', placeholder: 'Current and past substance use, frequency, last use...' },
                ],
            },
            {
                id: 'medical-history',
                title: 'MEDICAL HISTORY',
                fields: [
                    { id: 'medical-conditions', label: 'Medical Conditions', type: 'textarea', placeholder: 'Current medical diagnosis, medications, allergies...' },
                ],
            },
            {
                id: 'family-history',
                title: 'FAMILY HISTORY',
                fields: [
                    { id: 'family-psychiatric', label: 'Family Psychiatric History', type: 'textarea', placeholder: 'Mental health conditions in family members...' },
                ],
            },
            {
                id: 'social-history',
                title: 'SOCIAL HISTORY',
                fields: [
                    { id: 'education', label: 'Education', type: 'text', placeholder: 'Highest level of education...' },
                    { id: 'employment-status', label: 'Employment', type: 'text', placeholder: 'Current employment status...' },
                    { id: 'living-arrangements', label: 'Living Arrangements', type: 'textarea', placeholder: 'Current living situation, who lives in home...' },
                    { id: 'relationships', label: 'Relationships', type: 'textarea', placeholder: 'Marital status, significant relationships...' },
                ],
            },
            {
                id: 'mental-status',
                title: 'MENTAL STATUS EXAM',
                fields: [
                    { id: 'appearance', label: 'Appearance', type: 'text', placeholder: 'Grooming, hygiene, attire...' },
                    { id: 'behavior', label: 'Behavior', type: 'text', placeholder: 'Cooperative, guarded, agitated...' },
                    { id: 'mood-affect', label: 'Mood/Affect', type: 'text', placeholder: 'Mood (subjective), affect (objective)...' },
                    { id: 'thought-process', label: 'Thought Process', type: 'text', placeholder: 'Linear, tangential, circumstantial...' },
                    { id: 'thought-content', label: 'Thought Content', type: 'text', placeholder: 'Suicidal/homicidal ideation, delusions...' },
                    { id: 'cognition', label: 'Cognition', type: 'text', placeholder: 'Orientation, memory, concentration...' },
                    { id: 'insight-judgment', label: 'Insight/Judgment', type: 'text', placeholder: 'Level of insight and judgment...' },
                ],
            },
            {
                id: 'diagnostic-impression',
                title: 'DIAGNOSTIC IMPRESSION',
                fields: [
                    { id: 'diagnosis', label: 'Diagnosis', type: 'textarea', placeholder: 'DSM-5 diagnostic impression...' },
                ],
            },
            {
                id: 'treatment-recommendations',
                title: 'TREATMENT RECOMMENDATIONS',
                fields: [
                    { id: 'recommendations', label: 'Recommendations', type: 'textarea', placeholder: 'Recommended level of care, treatment modalities, frequency...' },
                ],
            },
        ],
    },

    'psychiatric-assessment': {
        id: 'psychiatric-assessment',
        name: 'Psychiatric Assessment',
        sections: [
            {
                id: 'chief-complaint',
                title: 'CHIEF COMPLAINT',
                fields: [
                    { id: 'presenting-concerns', label: 'Presenting Concerns', type: 'textarea', placeholder: 'Primary reason for psychiatric evaluation...' },
                ],
            },
            {
                id: 'history-present-illness',
                title: 'HISTORY OF PRESENT ILLNESS',
                fields: [
                    { id: 'hpi', label: 'HPI', type: 'textarea', placeholder: 'Detailed history of current symptoms...' },
                ],
            },
            {
                id: 'psychiatric-history-pa',
                title: 'PAST PSYCHIATRIC HISTORY',
                fields: [
                    { id: 'past-diagnoses', label: 'Past Diagnoses', type: 'textarea', placeholder: 'Previous psychiatric diagnoses...' },
                    { id: 'hospitalizations', label: 'Hospitalizations', type: 'textarea', placeholder: 'Psychiatric hospitalizations...' },
                    { id: 'medications-tried', label: 'Medications Tried', type: 'textarea', placeholder: 'Previous psychiatric medications and response...' },
                ],
            },
            {
                id: 'mse-pa',
                title: 'MENTAL STATUS EXAMINATION',
                fields: [
                    { id: 'mse-notes', label: 'MSE', type: 'textarea', placeholder: 'Appearance, behavior, speech, mood, affect, thought process, thought content, perceptions, cognition, insight, judgment...' },
                ],
            },
            {
                id: 'assessment-diagnosis',
                title: 'ASSESSMENT & DIAGNOSIS',
                fields: [
                    { id: 'assessment', label: 'Clinical Assessment', type: 'textarea', placeholder: 'Clinical formulation and diagnosis...' },
                ],
            },
            {
                id: 'plan-pa',
                title: 'PLAN',
                fields: [
                    { id: 'treatment-plan-pa', label: 'Treatment Plan', type: 'textarea', placeholder: 'Medication recommendations, therapy, follow-up...' },
                ],
            },
        ],
    },

    'diagnostic-assessment': {
        id: 'diagnostic-assessment',
        name: 'Diagnostic Assessment',
        sections: [
            {
                id: 'reason-assessment',
                title: 'REASON FOR ASSESSMENT',
                fields: [
                    { id: 'reason', label: 'Reason for Assessment', type: 'textarea', placeholder: 'Why is the client being assessed...' },
                ],
            },
            {
                id: 'clinical-interview',
                title: 'CLINICAL INTERVIEW',
                fields: [
                    { id: 'interview-notes', label: 'Interview Notes', type: 'textarea', placeholder: 'Summary of clinical interview...' },
                ],
            },
            {
                id: 'diagnostic-findings',
                title: 'DIAGNOSTIC FINDINGS',
                fields: [
                    { id: 'findings', label: 'Findings', type: 'textarea', placeholder: 'Diagnostic conclusions based on assessment...' },
                ],
            },
            {
                id: 'recommendations-da',
                title: 'RECOMMENDATIONS',
                fields: [
                    { id: 'recs', label: 'Recommendations', type: 'textarea', placeholder: 'Treatment recommendations...' },
                ],
            },
        ],
    },

    'consent-treatment': {
        id: 'consent-treatment',
        name: 'Consent for Treatment',
        sections: [
            {
                id: 'consent-acknowledgment',
                title: 'CONSENT ACKNOWLEDGMENT',
                fields: [
                    { id: 'services-explained', label: 'Services Explained', type: 'checkbox', options: [{ value: 'yes', label: 'I acknowledge that the nature of services has been explained to me' }] },
                    { id: 'risks-benefits', label: 'Risks and Benefits', type: 'checkbox', options: [{ value: 'yes', label: 'I understand the potential risks and benefits of treatment' }] },
                    { id: 'confidentiality', label: 'Confidentiality', type: 'checkbox', options: [{ value: 'yes', label: 'I understand the limits of confidentiality' }] },
                    { id: 'voluntary', label: 'Voluntary Participation', type: 'checkbox', options: [{ value: 'yes', label: 'I understand my participation is voluntary' }] },
                ],
            },
            {
                id: 'signature-section',
                title: 'SIGNATURES',
                fields: [
                    { id: 'client-signature-date', label: 'Signature Date', type: 'date' },
                ],
            },
        ],
    },

    'referral-intake': {
        id: 'referral-intake',
        name: 'Referral and Intake',
        sections: [
            {
                id: 'referral-info',
                title: 'REFERRAL INFORMATION',
                fields: [
                    { id: 'referral-source', label: 'Referral Source', type: 'text', placeholder: 'Name/Organization making referral' },
                    { id: 'referral-reason', label: 'Reason for Referral', type: 'textarea', placeholder: 'Why is client being referred...' },
                    { id: 'referral-date', label: 'Referral Date', type: 'date' },
                ],
            },
            {
                id: 'intake-info',
                title: 'INTAKE INFORMATION',
                fields: [
                    { id: 'presenting-problems', label: 'Presenting Problems', type: 'textarea', placeholder: 'Client-reported concerns...' },
                    { id: 'goals', label: 'Treatment Goals', type: 'textarea', placeholder: 'Client goals for treatment...' },
                ],
            },
            {
                id: 'eligibility-intake',
                title: 'ELIGIBILITY',
                fields: [
                    { id: 'insurance', label: 'Insurance Information', type: 'text', placeholder: 'Insurance provider and ID...' },
                    { id: 'eligibility-verified', label: 'Eligibility Verified', type: 'checkbox', options: [{ value: 'yes', label: 'Eligibility has been verified' }] },
                ],
            },
        ],
    },
};

export const getTemplateDefinition = (templateId: string): TemplateDefinition | null => {
    return TEMPLATE_DEFINITIONS[templateId] || null;
};
