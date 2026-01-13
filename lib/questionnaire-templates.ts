// Questionnaire Templates for Clinical Assessments
// These are pre-defined templates commonly used in behavioral health

export interface QuestionnaireQuestion {
    id: string;
    text: string;
    type: 'scale' | 'text' | 'yesno' | 'multiselect';
    options?: string[];
}

export interface QuestionnaireTemplate {
    id: string;
    name: string;
    shortName: string;
    description: string;
    instructions: string;
    questions: QuestionnaireQuestion[];
    scoringInfo?: string;
}

// 5-point frequency scale used by many assessments
const frequencyScale = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'];

export const questionnaireTemplates: QuestionnaireTemplate[] = [
    {
        id: 'phq9',
        name: 'Patient Health Questionnaire-9',
        shortName: 'PHQ-9',
        description: 'A 9-item depression screening tool',
        instructions: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
        scoringInfo: 'Score: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-19 Moderately Severe, 20-27 Severe',
        questions: [
            { id: 'phq9_1', text: 'Little interest or pleasure in doing things', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'phq9_2', text: 'Feeling down, depressed, or hopeless', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'phq9_3', text: 'Trouble falling or staying asleep, or sleeping too much', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'phq9_4', text: 'Feeling tired or having little energy', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'phq9_5', text: 'Poor appetite or overeating', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'phq9_6', text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'phq9_7', text: 'Trouble concentrating on things, such as reading the newspaper or watching television', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'phq9_8', text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'phq9_9', text: 'Thoughts that you would be better off dead or of hurting yourself in some way', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
        ]
    },
    {
        id: 'gad7',
        name: 'Generalized Anxiety Disorder-7',
        shortName: 'GAD-7',
        description: 'A 7-item anxiety screening tool',
        instructions: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
        scoringInfo: 'Score: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-21 Severe',
        questions: [
            { id: 'gad7_1', text: 'Feeling nervous, anxious, or on edge', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'gad7_2', text: 'Not being able to stop or control worrying', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'gad7_3', text: 'Worrying too much about different things', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'gad7_4', text: 'Trouble relaxing', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'gad7_5', text: 'Being so restless that it is hard to sit still', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'gad7_6', text: 'Becoming easily annoyed or irritable', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
            { id: 'gad7_7', text: 'Feeling afraid as if something awful might happen', type: 'scale', options: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'] },
        ]
    },
    {
        id: 'asrs',
        name: 'Adult ADHD Self-Report Scale',
        shortName: 'ASRS-SC',
        description: 'An 18-item ADHD symptom checklist for adults',
        instructions: 'Please answer all questions based on how you have felt and conducted yourself over the past 6 months.',
        questions: [
            { id: 'asrs_1', text: 'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?', type: 'scale', options: frequencyScale },
            { id: 'asrs_2', text: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?', type: 'scale', options: frequencyScale },
            { id: 'asrs_3', text: 'How often do you have problems remembering appointments or obligations?', type: 'scale', options: frequencyScale },
            { id: 'asrs_4', text: 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?', type: 'scale', options: frequencyScale },
            { id: 'asrs_5', text: 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?', type: 'scale', options: frequencyScale },
            { id: 'asrs_6', text: 'How often do you feel overly active and compelled to do things, like you were driven by a motor?', type: 'scale', options: frequencyScale },
        ]
    },
    {
        id: 'ace',
        name: 'Adverse Childhood Experience Questionnaire',
        shortName: 'ACE',
        description: 'Measures adverse childhood experiences',
        instructions: 'Prior to your 18th birthday, please indicate whether the following experiences occurred.',
        questions: [
            { id: 'ace_1', text: 'Did a parent or other adult in the household often swear at you, insult you, put you down, or humiliate you?', type: 'yesno' },
            { id: 'ace_2', text: 'Did a parent or other adult in the household often push, grab, slap, or throw something at you?', type: 'yesno' },
            { id: 'ace_3', text: 'Did an adult or person at least 5 years older ever touch or fondle you in a sexual way?', type: 'yesno' },
            { id: 'ace_4', text: 'Did you often feel that no one in your family loved you or thought you were important or special?', type: 'yesno' },
            { id: 'ace_5', text: 'Did you often feel that you didn\'t have enough to eat, had to wear dirty clothes, and had no one to protect you?', type: 'yesno' },
        ]
    },
    {
        id: 'custom',
        name: 'Custom Questionnaire',
        shortName: 'Custom',
        description: 'Create your own questionnaire with custom questions',
        instructions: 'Please answer the following questions.',
        questions: []
    }
];

export const getTemplateById = (id: string): QuestionnaireTemplate | undefined => {
    return questionnaireTemplates.find(t => t.id === id);
};
