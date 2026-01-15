// Questionnaire Templates for Clinical Assessments
// Full validated question sets for public domain instruments

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
    // ============================================
    // PHQ-9 - Patient Health Questionnaire-9 (PUBLIC DOMAIN)
    // Complete 9-item depression screening tool
    // ============================================
    {
        id: 'phq9',
        name: 'Patient Health Questionnaire-9',
        shortName: 'PHQ-9',
        description: 'A 9-item depression screening and severity measure. Developed by Drs. Robert L. Spitzer, Janet B.W. Williams, Kurt Kroenke.',
        instructions: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
        scoringInfo: 'Scoring: 0-4 Minimal depression, 5-9 Mild depression, 10-14 Moderate depression, 15-19 Moderately severe depression, 20-27 Severe depression',
        questions: [
            { id: 'phq9_1', text: 'Little interest or pleasure in doing things', type: 'scale', options: severityScale },
            { id: 'phq9_2', text: 'Feeling down, depressed, or hopeless', type: 'scale', options: severityScale },
            { id: 'phq9_3', text: 'Trouble falling or staying asleep, or sleeping too much', type: 'scale', options: severityScale },
            { id: 'phq9_4', text: 'Feeling tired or having little energy', type: 'scale', options: severityScale },
            { id: 'phq9_5', text: 'Poor appetite or overeating', type: 'scale', options: severityScale },
            { id: 'phq9_6', text: 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down', type: 'scale', options: severityScale },
            { id: 'phq9_7', text: 'Trouble concentrating on things, such as reading the newspaper or watching television', type: 'scale', options: severityScale },
            { id: 'phq9_8', text: 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual', type: 'scale', options: severityScale },
            { id: 'phq9_9', text: 'Thoughts that you would be better off dead or of hurting yourself in some way', type: 'scale', options: severityScale },
        ]
    },

    // ============================================
    // GAD-7 - Generalized Anxiety Disorder-7 (PUBLIC DOMAIN)
    // Complete 7-item anxiety screening tool
    // ============================================
    {
        id: 'gad7',
        name: 'Generalized Anxiety Disorder-7',
        shortName: 'GAD-7',
        description: 'A 7-item anxiety screening and severity measure. Developed by Drs. Robert L. Spitzer, Kurt Kroenke, Janet B.W. Williams, and Bernd Löwe.',
        instructions: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
        scoringInfo: 'Scoring: 0-4 Minimal anxiety, 5-9 Mild anxiety, 10-14 Moderate anxiety, 15-21 Severe anxiety',
        questions: [
            { id: 'gad7_1', text: 'Feeling nervous, anxious, or on edge', type: 'scale', options: severityScale },
            { id: 'gad7_2', text: 'Not being able to stop or control worrying', type: 'scale', options: severityScale },
            { id: 'gad7_3', text: 'Worrying too much about different things', type: 'scale', options: severityScale },
            { id: 'gad7_4', text: 'Trouble relaxing', type: 'scale', options: severityScale },
            { id: 'gad7_5', text: 'Being so restless that it is hard to sit still', type: 'scale', options: severityScale },
            { id: 'gad7_6', text: 'Becoming easily annoyed or irritable', type: 'scale', options: severityScale },
            { id: 'gad7_7', text: 'Feeling afraid, as if something awful might happen', type: 'scale', options: severityScale },
        ]
    },

    // ============================================
    // PHQ-2 - Patient Health Questionnaire-2 (PUBLIC DOMAIN)
    // Ultra-brief depression screener
    // ============================================
    {
        id: 'phq2',
        name: 'Patient Health Questionnaire-2',
        shortName: 'PHQ-2',
        description: 'A 2-item ultra-brief depression screener. Score ≥3 suggests need for further evaluation with PHQ-9.',
        instructions: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
        scoringInfo: 'Scoring: 0-2 Negative screen, 3-6 Positive screen (consider PHQ-9)',
        questions: [
            { id: 'phq2_1', text: 'Little interest or pleasure in doing things', type: 'scale', options: severityScale },
            { id: 'phq2_2', text: 'Feeling down, depressed, or hopeless', type: 'scale', options: severityScale },
        ]
    },

    // ============================================
    // GAD-2 - Generalized Anxiety Disorder-2 (PUBLIC DOMAIN)
    // Ultra-brief anxiety screener
    // ============================================
    {
        id: 'gad2',
        name: 'Generalized Anxiety Disorder-2',
        shortName: 'GAD-2',
        description: 'A 2-item ultra-brief anxiety screener. Score ≥3 suggests need for further evaluation with GAD-7.',
        instructions: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
        scoringInfo: 'Scoring: 0-2 Negative screen, 3-6 Positive screen (consider GAD-7)',
        questions: [
            { id: 'gad2_1', text: 'Feeling nervous, anxious, or on edge', type: 'scale', options: severityScale },
            { id: 'gad2_2', text: 'Not being able to stop or control worrying', type: 'scale', options: severityScale },
        ]
    },

    // ============================================
    // ASRS-v1.1 - Adult ADHD Self-Report Scale (PUBLIC DOMAIN)
    // Complete 18-item ADHD symptom checklist
    // ============================================
    {
        id: 'asrs',
        name: 'Adult ADHD Self-Report Scale (ASRS-v1.1) Symptom Checklist',
        shortName: 'ASRS-SC',
        description: 'An 18-item ADHD symptom checklist for adults. Developed by the World Health Organization (WHO).',
        instructions: 'Please answer the questions below, rating yourself on each of the criteria shown using the scale. As you answer each question, place an X in the box that best describes how you have felt and conducted yourself over the past 6 months.',
        scoringInfo: 'Part A (questions 1-6): 4+ darkly shaded boxes suggests ADHD. Part B provides additional clinical information.',
        questions: [
            // Part A - Screener
            { id: 'asrs_1', text: 'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?', type: 'scale', options: frequencyScale },
            { id: 'asrs_2', text: 'How often do you have difficulty getting things in order when you have to do a task that requires organization?', type: 'scale', options: frequencyScale },
            { id: 'asrs_3', text: 'How often do you have problems remembering appointments or obligations?', type: 'scale', options: frequencyScale },
            { id: 'asrs_4', text: 'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?', type: 'scale', options: frequencyScale },
            { id: 'asrs_5', text: 'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?', type: 'scale', options: frequencyScale },
            { id: 'asrs_6', text: 'How often do you feel overly active and compelled to do things, like you were driven by a motor?', type: 'scale', options: frequencyScale },
            // Part B - Extended
            { id: 'asrs_7', text: 'How often do you make careless mistakes when you have to work on a boring or difficult project?', type: 'scale', options: frequencyScale },
            { id: 'asrs_8', text: 'How often do you have difficulty keeping your attention when you are doing boring or repetitive work?', type: 'scale', options: frequencyScale },
            { id: 'asrs_9', text: 'How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?', type: 'scale', options: frequencyScale },
            { id: 'asrs_10', text: 'How often do you misplace or have difficulty finding things at home or at work?', type: 'scale', options: frequencyScale },
            { id: 'asrs_11', text: 'How often are you distracted by activity or noise around you?', type: 'scale', options: frequencyScale },
            { id: 'asrs_12', text: 'How often do you leave your seat in meetings or other situations in which you are expected to remain seated?', type: 'scale', options: frequencyScale },
            { id: 'asrs_13', text: 'How often do you feel restless or fidgety?', type: 'scale', options: frequencyScale },
            { id: 'asrs_14', text: 'How often do you have difficulty unwinding and relaxing when you have time to yourself?', type: 'scale', options: frequencyScale },
            { id: 'asrs_15', text: 'How often do you find yourself talking too much when you are in social situations?', type: 'scale', options: frequencyScale },
            { id: 'asrs_16', text: 'When you\'re in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?', type: 'scale', options: frequencyScale },
            { id: 'asrs_17', text: 'How often do you have difficulty waiting your turn in situations when turn taking is required?', type: 'scale', options: frequencyScale },
            { id: 'asrs_18', text: 'How often do you interrupt others when they are busy?', type: 'scale', options: frequencyScale },
        ]
    },

    // ============================================
    // ACE - Adverse Childhood Experiences (PUBLIC DOMAIN)
    // Complete 10-item questionnaire
    // ============================================
    {
        id: 'ace',
        name: 'Adverse Childhood Experiences Questionnaire',
        shortName: 'ACE',
        description: 'A 10-item questionnaire measuring childhood adversity. Developed by Kaiser Permanente and CDC.',
        instructions: 'While you were growing up, during your first 18 years of life, did you experience any of the following?',
        scoringInfo: 'Scoring: Each "Yes" = 1 point. Higher scores indicate more ACEs. Score ≥4 associated with significantly increased health risks.',
        questions: [
            { id: 'ace_1', text: 'Did a parent or other adult in the household often or very often swear at you, insult you, put you down, or humiliate you? OR Act in a way that made you afraid that you might be physically hurt?', type: 'yesno' },
            { id: 'ace_2', text: 'Did a parent or other adult in the household often or very often push, grab, slap, or throw something at you? OR Ever hit you so hard that you had marks or were injured?', type: 'yesno' },
            { id: 'ace_3', text: 'Did an adult or person at least 5 years older than you ever touch or fondle you or have you touch their body in a sexual way? OR Attempt or actually have oral, anal, or vaginal intercourse with you?', type: 'yesno' },
            { id: 'ace_4', text: 'Did you often or very often feel that no one in your family loved you or thought you were important or special? OR Your family didn\'t look out for each other, feel close to each other, or support each other?', type: 'yesno' },
            { id: 'ace_5', text: 'Did you often or very often feel that you didn\'t have enough to eat, had to wear dirty clothes, and had no one to protect you? OR Your parents were too drunk or high to take care of you or take you to the doctor if you needed it?', type: 'yesno' },
            { id: 'ace_6', text: 'Were your parents ever separated or divorced?', type: 'yesno' },
            { id: 'ace_7', text: 'Was your mother or stepmother often or very often pushed, grabbed, slapped, or had something thrown at her? OR Sometimes, often, or very often kicked, bitten, hit with a fist, or hit with something hard? OR Ever repeatedly hit over at least a few minutes or threatened with a gun or knife?', type: 'yesno' },
            { id: 'ace_8', text: 'Did you live with anyone who was a problem drinker or alcoholic, or who used street drugs?', type: 'yesno' },
            { id: 'ace_9', text: 'Was a household member depressed or mentally ill, or did a household member attempt suicide?', type: 'yesno' },
            { id: 'ace_10', text: 'Did a household member go to prison?', type: 'yesno' },
        ]
    },

    // ============================================
    // EPDS - Edinburgh Postnatal Depression Scale (PUBLIC DOMAIN)
    // Complete 10-item postpartum depression screen
    // ============================================
    {
        id: 'epds',
        name: 'Edinburgh Postnatal Depression Scale',
        shortName: 'EPDS',
        description: 'A 10-item questionnaire to screen for postnatal depression. Developed by Cox, Holden, and Sagovsky (1987).',
        instructions: 'As you are pregnant or have recently had a baby, we would like to know how you are feeling. Please check the answer that comes closest to how you have felt IN THE PAST 7 DAYS, not just how you feel today.',
        scoringInfo: 'Scoring: Maximum score 30. Score ≥10 indicates possible depression. Question 10 assesses self-harm thoughts.',
        questions: [
            { id: 'epds_1', text: 'I have been able to laugh and see the funny side of things', type: 'scale', options: ['As much as I always could', 'Not quite so much now', 'Definitely not so much now', 'Not at all'] },
            { id: 'epds_2', text: 'I have looked forward with enjoyment to things', type: 'scale', options: ['As much as I ever did', 'Rather less than I used to', 'Definitely less than I used to', 'Hardly at all'] },
            { id: 'epds_3', text: 'I have blamed myself unnecessarily when things went wrong', type: 'scale', options: ['No, never', 'Not very often', 'Yes, some of the time', 'Yes, most of the time'] },
            { id: 'epds_4', text: 'I have been anxious or worried for no good reason', type: 'scale', options: ['No, not at all', 'Hardly ever', 'Yes, sometimes', 'Yes, very often'] },
            { id: 'epds_5', text: 'I have felt scared or panicky for no very good reason', type: 'scale', options: ['No, not at all', 'No, not much', 'Yes, sometimes', 'Yes, quite a lot'] },
            { id: 'epds_6', text: 'Things have been getting on top of me', type: 'scale', options: ['No, I have been coping as well as ever', 'No, most of the time I have coped quite well', 'Yes, sometimes I haven\'t been coping as well as usual', 'Yes, most of the time I haven\'t been able to cope at all'] },
            { id: 'epds_7', text: 'I have been so unhappy that I have had difficulty sleeping', type: 'scale', options: ['No, not at all', 'Not very often', 'Yes, sometimes', 'Yes, most of the time'] },
            { id: 'epds_8', text: 'I have felt sad or miserable', type: 'scale', options: ['No, not at all', 'Not very often', 'Yes, quite often', 'Yes, most of the time'] },
            { id: 'epds_9', text: 'I have been so unhappy that I have been crying', type: 'scale', options: ['No, never', 'Only occasionally', 'Yes, quite often', 'Yes, most of the time'] },
            { id: 'epds_10', text: 'The thought of harming myself has occurred to me', type: 'scale', options: ['Never', 'Hardly ever', 'Sometimes', 'Yes, quite often'] },
        ]
    },

    // ============================================
    // ASQ - Ask Suicide-Screening Questions (PUBLIC DOMAIN)
    // NIMH validated suicide screening tool
    // ============================================
    {
        id: 'asq',
        name: 'Ask Suicide-Screening Questions',
        shortName: 'ASQ',
        description: 'A brief validated suicide risk screening tool. Developed by the National Institute of Mental Health (NIMH).',
        instructions: 'Ask the patient the following questions. A "Yes" response to any question is a positive screen.',
        scoringInfo: 'Positive Screen: "Yes" to any of questions 1-4. Question 5 asked if any positive responses. Acuity assessed if positive.',
        questions: [
            { id: 'asq_1', text: 'In the past few weeks, have you wished you were dead?', type: 'yesno' },
            { id: 'asq_2', text: 'In the past few weeks, have you felt that you or your family would be better off if you were dead?', type: 'yesno' },
            { id: 'asq_3', text: 'In the past week, have you been having thoughts about killing yourself?', type: 'yesno' },
            { id: 'asq_4', text: 'Have you ever tried to kill yourself?', type: 'yesno' },
            { id: 'asq_5', text: 'Are you having thoughts of killing yourself right now?', type: 'yesno' },
        ]
    },

    // ============================================
    // C-SSRS Screener - Columbia Suicide Severity Rating Scale (PUBLIC DOMAIN)
    // Suicide risk screening version
    // ============================================
    {
        id: 'cssrs',
        name: 'Columbia Suicide Severity Rating Scale - Screener',
        shortName: 'C-SSRS',
        description: 'A suicide risk assessment tool. Developed by Columbia University. Public domain for clinical use.',
        instructions: 'Ask the following questions. Any "Yes" response requires clinical follow-up.',
        scoringInfo: 'Severity: Q1-2 = Ideation, Q3-5 = Ideation with intent, Q6 = Behavior. Higher question numbers = higher severity.',
        questions: [
            { id: 'cssrs_1', text: 'Have you wished you were dead or wished you could go to sleep and not wake up?', type: 'yesno' },
            { id: 'cssrs_2', text: 'Have you actually had any thoughts of killing yourself?', type: 'yesno' },
            { id: 'cssrs_3', text: 'Have you been thinking about how you might do this?', type: 'yesno' },
            { id: 'cssrs_4', text: 'Have you had these thoughts and had some intention of acting on them?', type: 'yesno' },
            { id: 'cssrs_5', text: 'Have you started to work out or worked out the details of how to kill yourself? Do you intend to carry out this plan?', type: 'yesno' },
            { id: 'cssrs_6', text: 'Have you ever done anything, started to do anything, or prepared to do anything to end your life?', type: 'yesno' },
        ]
    },

    // ============================================
    // CAGE - Alcohol Screening (PUBLIC DOMAIN)
    // Classic 4-item alcohol use screening
    // ============================================
    {
        id: 'cage',
        name: 'CAGE Alcohol Screening Questionnaire',
        shortName: 'CAGE',
        description: 'A 4-item alcohol use screening tool. Developed by Dr. John Ewing.',
        instructions: 'Please answer the following questions about your alcohol use.',
        scoringInfo: 'Scoring: 2+ "Yes" responses indicate possible alcohol problems and need for further evaluation.',
        questions: [
            { id: 'cage_1', text: 'Have you ever felt you should Cut down on your drinking?', type: 'yesno' },
            { id: 'cage_2', text: 'Have people Annoyed you by criticizing your drinking?', type: 'yesno' },
            { id: 'cage_3', text: 'Have you ever felt bad or Guilty about your drinking?', type: 'yesno' },
            { id: 'cage_4', text: 'Have you ever had a drink first thing in the morning to steady your nerves or get rid of a hangover (Eye-opener)?', type: 'yesno' },
        ]
    },

    // ============================================
    // AUDIT-C - Alcohol Use Disorders Identification Test (PUBLIC DOMAIN)
    // WHO 3-item alcohol screening
    // ============================================
    {
        id: 'auditc',
        name: 'Alcohol Use Disorders Identification Test - Consumption',
        shortName: 'AUDIT-C',
        description: 'A 3-item alcohol screening tool. Developed by the World Health Organization.',
        instructions: 'Please answer the following questions about your alcohol use.',
        scoringInfo: 'Positive Screen: ≥4 for men, ≥3 for women. Maximum score 12.',
        questions: [
            { id: 'auditc_1', text: 'How often do you have a drink containing alcohol?', type: 'scale', options: ['Never', 'Monthly or less', '2-4 times a month', '2-3 times a week', '4+ times a week'] },
            { id: 'auditc_2', text: 'How many drinks containing alcohol do you have on a typical day when you are drinking?', type: 'scale', options: ['1 or 2', '3 or 4', '5 or 6', '7 to 9', '10 or more'] },
            { id: 'auditc_3', text: 'How often do you have 6 or more drinks on one occasion?', type: 'scale', options: ['Never', 'Less than monthly', 'Monthly', 'Weekly', 'Daily or almost daily'] },
        ]
    },

    // ============================================
    // DAST-10 - Drug Abuse Screening Test (PUBLIC DOMAIN)
    // 10-item drug use screening
    // ============================================
    {
        id: 'dast10',
        name: 'Drug Abuse Screening Test',
        shortName: 'DAST-10',
        description: 'A 10-item drug use screening tool. Developed by Dr. Harvey Skinner.',
        instructions: 'The following questions concern information about your possible involvement with drugs NOT INCLUDING ALCOHOLIC BEVERAGES during the past 12 months.',
        scoringInfo: 'Scoring: 0 = No problems, 1-2 = Low level, 3-5 = Moderate level, 6-8 = Substantial level, 9-10 = Severe level',
        questions: [
            { id: 'dast_1', text: 'Have you used drugs other than those required for medical reasons?', type: 'yesno' },
            { id: 'dast_2', text: 'Do you abuse more than one drug at a time?', type: 'yesno' },
            { id: 'dast_3', text: 'Are you always able to stop using drugs when you want to? (If never use drugs, answer "Yes")', type: 'yesno' },
            { id: 'dast_4', text: 'Have you had "blackouts" or "flashbacks" as a result of drug use?', type: 'yesno' },
            { id: 'dast_5', text: 'Do you ever feel bad or guilty about your drug use? (If never use drugs, choose "No")', type: 'yesno' },
            { id: 'dast_6', text: 'Does your spouse (or parents) ever complain about your involvement with drugs?', type: 'yesno' },
            { id: 'dast_7', text: 'Have you neglected your family because of your use of drugs?', type: 'yesno' },
            { id: 'dast_8', text: 'Have you engaged in illegal activities in order to obtain drugs?', type: 'yesno' },
            { id: 'dast_9', text: 'Have you ever experienced withdrawal symptoms (felt sick) when you stopped taking drugs?', type: 'yesno' },
            { id: 'dast_10', text: 'Have you had medical problems as a result of your drug use (e.g., memory loss, hepatitis, convulsions, bleeding)?', type: 'yesno' },
        ]
    },

    // ============================================
    // PC-PTSD-5 - Primary Care PTSD Screen (PUBLIC DOMAIN)
    // VA/DoD 5-item PTSD screener
    // ============================================
    {
        id: 'pcptsd5',
        name: 'Primary Care PTSD Screen for DSM-5',
        shortName: 'PC-PTSD-5',
        description: 'A 5-item PTSD screening tool developed by the VA National Center for PTSD.',
        instructions: 'Sometimes things happen to people that are unusually or especially frightening, horrible, or traumatic. Have you experienced such an event? If YES, please answer the questions below about the worst event.',
        scoringInfo: 'Scoring: ≥3 "Yes" responses suggest probable PTSD and need for follow-up.',
        questions: [
            { id: 'pcptsd_1', text: 'Had nightmares about the event(s) or thought about the event(s) when you did not want to?', type: 'yesno' },
            { id: 'pcptsd_2', text: 'Tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?', type: 'yesno' },
            { id: 'pcptsd_3', text: 'Been constantly on guard, watchful, or easily startled?', type: 'yesno' },
            { id: 'pcptsd_4', text: 'Felt numb or detached from people, activities, or your surroundings?', type: 'yesno' },
            { id: 'pcptsd_5', text: 'Felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?', type: 'yesno' },
        ]
    },

    // ============================================
    // MDQ - Mood Disorder Questionnaire (PUBLIC DOMAIN for clinical use)
    // Bipolar screening instrument
    // ============================================
    {
        id: 'mdq',
        name: 'Mood Disorder Questionnaire',
        shortName: 'MDQ',
        description: 'A screening instrument for bipolar spectrum disorders. Developed by Dr. Robert Hirschfeld.',
        instructions: 'Has there ever been a period of time when you were not your usual self and...',
        scoringInfo: 'Positive Screen: ≥7 "Yes" in Part 1, "Yes" in Part 2 (same time), "Moderate" or "Serious" in Part 3.',
        questions: [
            { id: 'mdq_1', text: '...you felt so good or so hyper that other people thought you were not your normal self or you were so hyper that you got into trouble?', type: 'yesno' },
            { id: 'mdq_2', text: '...you were so irritable that you shouted at people or started fights or arguments?', type: 'yesno' },
            { id: 'mdq_3', text: '...you felt much more self-confident than usual?', type: 'yesno' },
            { id: 'mdq_4', text: '...you got much less sleep than usual and found you didn\'t really miss it?', type: 'yesno' },
            { id: 'mdq_5', text: '...you were much more talkative or spoke faster than usual?', type: 'yesno' },
            { id: 'mdq_6', text: '...thoughts raced through your head or you couldn\'t slow your mind down?', type: 'yesno' },
            { id: 'mdq_7', text: '...you were so easily distracted by things around you that you had trouble concentrating or staying on track?', type: 'yesno' },
            { id: 'mdq_8', text: '...you had much more energy than usual?', type: 'yesno' },
            { id: 'mdq_9', text: '...you were much more active or did many more things than usual?', type: 'yesno' },
            { id: 'mdq_10', text: '...you were much more social or outgoing than usual, for example, you telephoned friends in the middle of the night?', type: 'yesno' },
            { id: 'mdq_11', text: '...you were much more interested in sex than usual?', type: 'yesno' },
            { id: 'mdq_12', text: '...you did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?', type: 'yesno' },
            { id: 'mdq_13', text: '...spending money got you or your family into trouble?', type: 'yesno' },
            { id: 'mdq_14', text: 'If you checked YES to more than one of the above, have several of these ever happened during the same period of time?', type: 'yesno' },
            { id: 'mdq_15', text: 'How much of a problem did any of these cause you — like being unable to work; having family, money, or legal troubles; getting into arguments or fights?', type: 'scale', options: ['No problem', 'Minor problem', 'Moderate problem', 'Serious problem'] },
        ]
    },

    // ============================================
    // PSC-17 - Pediatric Symptom Checklist (PUBLIC DOMAIN)
    // Youth psychosocial screening
    // ============================================
    {
        id: 'psc17',
        name: 'Pediatric Symptom Checklist-17',
        shortName: 'PSC-17',
        description: 'A 17-item psychosocial screening tool for children and adolescents.',
        instructions: 'Please mark under the heading that best fits your child.',
        scoringInfo: 'Subscales: Internalizing (items 1-5), Attention (items 6-10), Externalizing (items 11-17). Positive screen if total ≥15.',
        questions: [
            { id: 'psc_1', text: 'Feels sad, unhappy', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_2', text: 'Feels hopeless', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_3', text: 'Is down on self', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_4', text: 'Worries a lot', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_5', text: 'Seems to be having less fun', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_6', text: 'Fidgety, unable to sit still', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_7', text: 'Daydreams too much', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_8', text: 'Distracted easily', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_9', text: 'Has trouble concentrating', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_10', text: 'Acts as if driven by a motor', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_11', text: 'Fights with others', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_12', text: 'Does not listen to rules', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_13', text: 'Does not understand other people\'s feelings', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_14', text: 'Teases others', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_15', text: 'Blames others for own troubles', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_16', text: 'Takes things that do not belong to him/her', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
            { id: 'psc_17', text: 'Refuses to share', type: 'scale', options: ['Never', 'Sometimes', 'Often'] },
        ]
    },

    // ============================================
    // Custom Questionnaire
    // ============================================
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
