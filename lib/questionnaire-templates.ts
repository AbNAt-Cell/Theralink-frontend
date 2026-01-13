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

// Common scales used by assessments
const frequencyScale = ['Never', 'Rarely', 'Sometimes', 'Often', 'Very Often'];
const severityScale = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];

export const questionnaireTemplates: QuestionnaireTemplate[] = [
    // A
    {
        id: 'asrs',
        name: 'Adult ADHD Self-Report Scale (ASRS-v1.1) Symptom Checklist',
        shortName: 'AASRS-SC',
        description: 'Adult ADHD symptom checklist',
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
        name: 'Adverse Childhood Experience Questionnaire for Adults',
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
        id: 'ades2',
        name: 'Adolescent Dissociative Experiences Scale II',
        shortName: 'ADES-II',
        description: 'Measures dissociative experiences in adolescents',
        instructions: 'Please indicate how often you have had each of the following experiences.',
        questions: [
            { id: 'ades_1', text: 'I get so wrapped up in watching TV, reading, or playing a game that I don\'t know what\'s going on around me.', type: 'scale', options: frequencyScale },
            { id: 'ades_2', text: 'I get so wrapped up in my daydreams that I forget what\'s going on around me.', type: 'scale', options: frequencyScale },
            { id: 'ades_3', text: 'People tell me that I do or say things that I don\'t remember doing or saying.', type: 'scale', options: frequencyScale },
        ]
    },
    {
        id: 'aims',
        name: 'Abnormal Involuntary Movement Scale',
        shortName: 'AIMS',
        description: 'Assesses abnormal involuntary movements',
        instructions: 'Rate the following movements.',
        questions: [
            { id: 'aims_1', text: 'Muscles of facial expression (e.g., movements of forehead, eyebrows, periorbital area, cheeks)', type: 'scale', options: ['None', 'Minimal', 'Mild', 'Moderate', 'Severe'] },
            { id: 'aims_2', text: 'Lips and perioral area (e.g., puckering, pouting, smacking)', type: 'scale', options: ['None', 'Minimal', 'Mild', 'Moderate', 'Severe'] },
            { id: 'aims_3', text: 'Jaw (e.g., biting, clenching, chewing, mouth opening, lateral movement)', type: 'scale', options: ['None', 'Minimal', 'Mild', 'Moderate', 'Severe'] },
        ]
    },
    {
        id: 'asq',
        name: 'Ask Suicide-Screening - Questions',
        shortName: 'ASQ',
        description: 'Brief suicide screening tool',
        instructions: 'Please answer honestly.',
        questions: [
            { id: 'asq_1', text: 'In the past few weeks, have you wished you were dead?', type: 'yesno' },
            { id: 'asq_2', text: 'In the past few weeks, have you felt that you or your family would be better off if you were dead?', type: 'yesno' },
            { id: 'asq_3', text: 'In the past week, have you been having thoughts about killing yourself?', type: 'yesno' },
            { id: 'asq_4', text: 'Have you ever tried to kill yourself?', type: 'yesno' },
        ]
    },
    // B
    {
        id: 'bdrs',
        name: 'Beck\'s Depression Rating Scale',
        shortName: 'BDRS',
        description: 'Depression rating scale',
        instructions: 'Please read each group of statements carefully. Pick out the one statement that best describes the way you have been feeling during the past two weeks.',
        questions: [
            { id: 'bdrs_1', text: 'Sadness', type: 'scale', options: ['I do not feel sad', 'I feel sad much of the time', 'I am sad all the time', 'I am so sad or unhappy that I can\'t stand it'] },
            { id: 'bdrs_2', text: 'Pessimism', type: 'scale', options: ['I am not discouraged about my future', 'I feel more discouraged about my future than I used to', 'I do not expect things to work out for me', 'I feel my future is hopeless'] },
        ]
    },
    {
        id: 'bdss',
        name: 'Brief Bipolar Disorder Symptom Scale',
        shortName: 'BDSS',
        description: 'Brief assessment for bipolar symptoms',
        instructions: 'Rate each symptom over the past 7 days.',
        questions: [
            { id: 'bdss_1', text: 'Elevated/expansive mood', type: 'scale', options: ['Not present', 'Mild', 'Moderate', 'Severe'] },
            { id: 'bdss_2', text: 'Decreased need for sleep', type: 'scale', options: ['Not present', 'Mild', 'Moderate', 'Severe'] },
        ]
    },
    {
        id: 'bims',
        name: 'Brief Interview for Mental Status',
        shortName: 'BIMS',
        description: 'Brief cognitive assessment',
        instructions: 'Ask the resident the following questions.',
        questions: [
            { id: 'bims_1', text: 'Ask resident: "Please tell me what year it is right now."', type: 'scale', options: ['Correct', 'Missed by 1 year', 'Missed by 2-5 years', 'Missed by more than 5 years'] },
            { id: 'bims_2', text: 'Ask resident: "What month are we in right now?"', type: 'scale', options: ['Correct', 'Missed by 1 month', 'Missed by 2-3 months', 'Missed by more than 3 months'] },
        ]
    },
    {
        id: 'bsds',
        name: 'The Bipolar Spectrum Diagnostic Scale',
        shortName: 'BSDS',
        description: 'Screening for bipolar spectrum disorders',
        instructions: 'Read the paragraphs below and check the appropriate box.',
        questions: [
            { id: 'bsds_1', text: 'Some of my moods and feelings are hard to control', type: 'yesno' },
            { id: 'bsds_2', text: 'At times I am more talkative than usual', type: 'yesno' },
        ]
    },
    {
        id: 'bsl23',
        name: 'Borderline Symptom List 23',
        shortName: 'BSL23',
        description: 'Borderline personality symptom assessment',
        instructions: 'Please indicate how much you have experienced the following sensations and behaviors in the last week.',
        questions: [
            { id: 'bsl_1', text: 'I thought of hurting myself', type: 'scale', options: frequencyScale },
            { id: 'bsl_2', text: 'I didn\'t trust other people', type: 'scale', options: frequencyScale },
        ]
    },
    {
        id: 'cage',
        name: 'Substance Abuse Screening Tool',
        shortName: 'CAGE',
        description: 'Brief alcohol screening',
        instructions: 'Please answer the following questions honestly.',
        questions: [
            { id: 'cage_1', text: 'Have you ever felt you should Cut down on your drinking?', type: 'yesno' },
            { id: 'cage_2', text: 'Have people Annoyed you by criticizing your drinking?', type: 'yesno' },
            { id: 'cage_3', text: 'Have you ever felt bad or Guilty about your drinking?', type: 'yesno' },
            { id: 'cage_4', text: 'Have you ever had a drink first thing in the morning (Eye-opener)?', type: 'yesno' },
        ]
    },
    // C
    {
        id: 'cars',
        name: 'Connor\'s Abbreviated Rating Scale',
        shortName: 'CARS',
        description: 'ADHD symptoms rating scale',
        instructions: 'Please rate each behavior.',
        questions: [
            { id: 'cars_1', text: 'Restless or overactive', type: 'scale', options: ['Not at all', 'Just a little', 'Pretty much', 'Very much'] },
            { id: 'cars_2', text: 'Excitable, impulsive', type: 'scale', options: ['Not at all', 'Just a little', 'Pretty much', 'Very much'] },
        ]
    },
    {
        id: 'cats',
        name: 'Child & Adolescent Trauma Screen',
        shortName: 'CATS',
        description: 'Trauma screening for children and adolescents',
        instructions: 'Please indicate if the following happened to you.',
        questions: [
            { id: 'cats_1', text: 'I have been in a serious accident, like a car or bike accident', type: 'yesno' },
            { id: 'cats_2', text: 'I have been in a natural disaster, like a flood, fire, or earthquake', type: 'yesno' },
        ]
    },
    {
        id: 'cbca',
        name: 'Child Behavior Checklist ages 6-18',
        shortName: 'CBCA',
        description: 'Child behavior assessment',
        instructions: 'Rate each item as it describes the child now or within the past 6 months.',
        questions: [
            { id: 'cbca_1', text: 'Acts too young for his/her age', type: 'scale', options: ['Not true', 'Somewhat true', 'Very true'] },
            { id: 'cbca_2', text: 'Drinks alcohol without parents\' approval', type: 'scale', options: ['Not true', 'Somewhat true', 'Very true'] },
        ]
    },
    {
        id: 'ciwa',
        name: 'Clinical Institute Withdrawal Assessment of Alcohol Scale, Revised',
        shortName: 'CIWA-Ar',
        description: 'Alcohol withdrawal assessment',
        instructions: 'Rate each symptom.',
        questions: [
            { id: 'ciwa_1', text: 'Nausea and vomiting', type: 'scale', options: ['No nausea', 'Mild nausea', 'Intermittent nausea', 'Frequent nausea', 'Constant nausea'] },
            { id: 'ciwa_2', text: 'Tremor', type: 'scale', options: ['No tremor', 'Not visible but felt', 'Moderate', 'Severe'] },
        ]
    },
    {
        id: 'cows',
        name: 'Clinical Opiate Withdrawal Scale',
        shortName: 'COWS',
        description: 'Opioid withdrawal assessment',
        instructions: 'For each item, circle the number that best describes the patient\'s signs or symptoms.',
        questions: [
            { id: 'cows_1', text: 'Resting pulse rate', type: 'scale', options: ['≤80', '81-100', '101-120', '>120'] },
            { id: 'cows_2', text: 'GI upset over last half hour', type: 'scale', options: ['No GI symptoms', 'Stomach cramps', 'Nausea or loose stool', 'Vomiting or diarrhea'] },
        ]
    },
    {
        id: 'cssrs',
        name: 'Columbia Suicide Severity Rating Scale',
        shortName: 'CSSRS',
        description: 'Suicide risk assessment',
        instructions: 'Ask the following questions.',
        questions: [
            { id: 'cssrs_1', text: 'Have you wished you were dead or wished you could go to sleep and not wake up?', type: 'yesno' },
            { id: 'cssrs_2', text: 'Have you actually had any thoughts of killing yourself?', type: 'yesno' },
        ]
    },
    // D
    {
        id: 'dast10',
        name: 'Drug Abuse Screening Test',
        shortName: 'DAST-10',
        description: 'Drug abuse screening',
        instructions: 'The following questions concern information about your possible involvement with drugs. Answer YES or NO.',
        questions: [
            { id: 'dast_1', text: 'Have you used drugs other than those required for medical reasons?', type: 'yesno' },
            { id: 'dast_2', text: 'Do you abuse more than one drug at a time?', type: 'yesno' },
            { id: 'dast_3', text: 'Are you always able to stop using drugs when you want to?', type: 'yesno' },
        ]
    },
    {
        id: 'ders',
        name: 'Difficulties in Emotion Regulation Scale',
        shortName: 'DERS',
        description: 'Emotion regulation assessment',
        instructions: 'Rate how often each statement applies to you.',
        questions: [
            { id: 'ders_1', text: 'I am clear about my feelings', type: 'scale', options: frequencyScale },
            { id: 'ders_2', text: 'I pay attention to how I feel', type: 'scale', options: frequencyScale },
        ]
    },
    {
        id: 'des2',
        name: 'Dissociative Experiences Scale-II',
        shortName: 'DES-II',
        description: 'Dissociative experiences screening',
        instructions: 'Please indicate the percentage of time you have each experience.',
        questions: [
            { id: 'des_1', text: 'Some people have the experience of driving a car and suddenly realizing that they don\'t remember what has happened during all or part of the trip.', type: 'scale', options: ['0%', '10%', '20%', '30%', '40%', '50%+'] },
        ]
    },
    {
        id: 'dla20',
        name: 'Daily Living Activities-20',
        shortName: 'DLA-20',
        description: 'Daily living activities assessment',
        instructions: 'Rate the person\'s ability to perform each activity.',
        questions: [
            { id: 'dla_1', text: 'Health practices (eating, hygiene, medical care)', type: 'scale', options: ['Unable', 'Severe difficulty', 'Moderate difficulty', 'Mild difficulty', 'Independent'] },
        ]
    },
    {
        id: 'epds',
        name: 'Edinburgh Postnatal Depression Scale 1',
        shortName: 'EPDS',
        description: 'Postnatal depression screening',
        instructions: 'Please check the answer that comes closest to how you have felt in the past 7 days.',
        questions: [
            { id: 'epds_1', text: 'I have been able to laugh and see the funny side of things', type: 'scale', options: ['As much as I always could', 'Not quite so much now', 'Definitely not so much now', 'Not at all'] },
        ]
    },
    // G
    {
        id: 'gad7',
        name: 'Anxiety Questionnaire',
        shortName: 'GAD7',
        description: 'Generalized anxiety screening',
        instructions: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
        scoringInfo: 'Score: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-21 Severe',
        questions: [
            { id: 'gad7_1', text: 'Feeling nervous, anxious, or on edge', type: 'scale', options: severityScale },
            { id: 'gad7_2', text: 'Not being able to stop or control worrying', type: 'scale', options: severityScale },
            { id: 'gad7_3', text: 'Worrying too much about different things', type: 'scale', options: severityScale },
            { id: 'gad7_4', text: 'Trouble relaxing', type: 'scale', options: severityScale },
            { id: 'gad7_5', text: 'Being so restless that it is hard to sit still', type: 'scale', options: severityScale },
            { id: 'gad7_6', text: 'Becoming easily annoyed or irritable', type: 'scale', options: severityScale },
            { id: 'gad7_7', text: 'Feeling afraid as if something awful might happen', type: 'scale', options: severityScale },
        ]
    },
    {
        id: 'gad7ad',
        name: 'GAD7 for Adolescents',
        shortName: 'GAD7Ad',
        description: 'Anxiety screening for adolescents',
        instructions: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
        questions: [
            { id: 'gad7ad_1', text: 'Feeling nervous, anxious, or on edge', type: 'scale', options: severityScale },
            { id: 'gad7ad_2', text: 'Not being able to stop or control worrying', type: 'scale', options: severityScale },
        ]
    },
    // L
    {
        id: 'loneliness7',
        name: '7 Types of Loneliness',
        shortName: 'Loneliness7',
        description: 'Loneliness assessment',
        instructions: 'Rate how often you feel the following.',
        questions: [
            { id: 'lone_1', text: 'I feel isolated from others', type: 'scale', options: frequencyScale },
            { id: 'lone_2', text: 'I feel I lack companionship', type: 'scale', options: frequencyScale },
        ]
    },
    // M
    {
        id: 'mdq',
        name: 'Mood Disorder Questionnaire',
        shortName: 'MDQ',
        description: 'Bipolar disorder screening',
        instructions: 'Has there ever been a period of time when you were not your usual self and...',
        questions: [
            { id: 'mdq_1', text: 'You felt so good or so hyper that other people thought you were not your normal self?', type: 'yesno' },
            { id: 'mdq_2', text: 'You were so irritable that you shouted at people or started fights or arguments?', type: 'yesno' },
        ]
    },
    {
        id: 'mfq',
        name: 'Mood and Feelings Questionnaire',
        shortName: 'MFQ',
        description: 'Depression screening for children and adolescents',
        instructions: 'This form is about how you might have been feeling or acting recently.',
        questions: [
            { id: 'mfq_1', text: 'I felt miserable or unhappy', type: 'scale', options: ['Not true', 'Sometimes true', 'True'] },
            { id: 'mfq_2', text: 'I didn\'t enjoy anything at all', type: 'scale', options: ['Not true', 'Sometimes true', 'True'] },
        ]
    },
    // N
    {
        id: 'nichq',
        name: 'Vanderbilt Assessment Scale (ADHD)',
        shortName: 'NICHQ',
        description: 'ADHD assessment tool',
        instructions: 'Please rate each item.',
        questions: [
            { id: 'nichq_1', text: 'Does not pay attention to details or makes careless mistakes', type: 'scale', options: frequencyScale },
            { id: 'nichq_2', text: 'Has difficulty sustaining attention to tasks or activities', type: 'scale', options: frequencyScale },
        ]
    },
    {
        id: 'nst',
        name: 'Nutrition Screening Tools',
        shortName: 'NST',
        description: 'Nutritional risk screening',
        instructions: 'Answer the following questions about nutrition.',
        questions: [
            { id: 'nst_1', text: 'Have you lost weight in the last 3 months without trying?', type: 'yesno' },
            { id: 'nst_2', text: 'Have you been eating less than usual?', type: 'yesno' },
        ]
    },
    // O
    {
        id: 'osa',
        name: 'Ohio Scales for Adults (Adult Form)',
        shortName: 'OSA',
        description: 'Mental health outcomes for adults',
        instructions: 'In the past 30 days, how often have you experienced each of the following?',
        questions: [
            { id: 'osa_1', text: 'Feeling sad or depressed', type: 'scale', options: frequencyScale },
            { id: 'osa_2', text: 'Feeling anxious or nervous', type: 'scale', options: frequencyScale },
        ]
    },
    // PHQ-9
    {
        id: 'phq9',
        name: 'Patient Health Questionnaire-9',
        shortName: 'PHQ-9',
        description: 'Depression screening tool',
        instructions: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
        scoringInfo: 'Score: 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-19 Moderately Severe, 20-27 Severe',
        questions: [
            { id: 'phq9_1', text: 'Little interest or pleasure in doing things', type: 'scale', options: severityScale },
            { id: 'phq9_2', text: 'Feeling down, depressed, or hopeless', type: 'scale', options: severityScale },
            { id: 'phq9_3', text: 'Trouble falling or staying asleep, or sleeping too much', type: 'scale', options: severityScale },
            { id: 'phq9_4', text: 'Feeling tired or having little energy', type: 'scale', options: severityScale },
            { id: 'phq9_5', text: 'Poor appetite or overeating', type: 'scale', options: severityScale },
            { id: 'phq9_6', text: 'Feeling bad about yourself - or that you are a failure or have let yourself or your family down', type: 'scale', options: severityScale },
            { id: 'phq9_7', text: 'Trouble concentrating on things, such as reading the newspaper or watching television', type: 'scale', options: severityScale },
            { id: 'phq9_8', text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual', type: 'scale', options: severityScale },
            { id: 'phq9_9', text: 'Thoughts that you would be better off dead or of hurting yourself in some way', type: 'scale', options: severityScale },
        ]
    },
    // Custom
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
