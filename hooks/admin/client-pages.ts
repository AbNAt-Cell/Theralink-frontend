import { createClient as getSupabaseClient } from '@/utils/supabase/client';

const supabase = getSupabaseClient();

// ============================================
// CLIENT PROGRESS
// ============================================
export interface ClientProgress {
    id: string;
    clientId: string;
    progressDate: string;
    progressNote?: string;
    sessionType?: string;
    durationMinutes?: number;
    goalsAddressed?: string[];
    interventions?: string[];
    clientResponse?: string;
    planForNextSession?: string;
    createdBy?: string;
    createdAt: string;
}

export const getClientProgress = async (clientId: string, fromDate?: string, toDate?: string): Promise<ClientProgress[]> => {
    let query = supabase
        .from('client_progress')
        .select('*')
        .eq('client_id', clientId)
        .order('progress_date', { ascending: false });

    if (fromDate) query = query.gte('progress_date', fromDate);
    if (toDate) query = query.lte('progress_date', toDate);

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(p => ({
        id: p.id,
        clientId: p.client_id,
        progressDate: p.progress_date,
        progressNote: p.progress_note,
        sessionType: p.session_type,
        durationMinutes: p.duration_minutes,
        goalsAddressed: p.goals_addressed,
        interventions: p.interventions,
        clientResponse: p.client_response,
        planForNextSession: p.plan_for_next_session,
        createdBy: p.created_by,
        createdAt: p.created_at
    }));
};

export const addClientProgress = async (data: Omit<ClientProgress, 'id' | 'createdAt'>): Promise<ClientProgress> => {
    const { data: result, error } = await supabase
        .from('client_progress')
        .insert({
            client_id: data.clientId,
            progress_date: data.progressDate,
            progress_note: data.progressNote,
            session_type: data.sessionType,
            duration_minutes: data.durationMinutes,
            goals_addressed: data.goalsAddressed,
            interventions: data.interventions,
            client_response: data.clientResponse,
            plan_for_next_session: data.planForNextSession,
            created_by: data.createdBy
        })
        .select()
        .single();

    if (error) throw error;
    return {
        id: result.id,
        clientId: result.client_id,
        progressDate: result.progress_date,
        progressNote: result.progress_note,
        sessionType: result.session_type,
        durationMinutes: result.duration_minutes,
        goalsAddressed: result.goals_addressed,
        interventions: result.interventions,
        clientResponse: result.client_response,
        planForNextSession: result.plan_for_next_session,
        createdBy: result.created_by,
        createdAt: result.created_at
    };
};

export const deleteClientProgress = async (id: string): Promise<void> => {
    const { error } = await supabase.from('client_progress').delete().eq('id', id);
    if (error) throw error;
};

// ============================================
// MEDICATIONS
// ============================================
export interface ClientMedication {
    id: string;
    clientId: string;
    medicationName: string;
    dosage?: string;
    frequency?: string;
    route?: string;
    prescriber?: string;
    startDate?: string;
    endDate?: string;
    status: string;
    notes?: string;
    createdAt: string;
}

export const getClientMedications = async (clientId: string, status?: string): Promise<ClientMedication[]> => {
    let query = supabase
        .from('client_medications')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(m => ({
        id: m.id,
        clientId: m.client_id,
        medicationName: m.medication_name,
        dosage: m.dosage,
        frequency: m.frequency,
        route: m.route,
        prescriber: m.prescriber,
        startDate: m.start_date,
        endDate: m.end_date,
        status: m.status,
        notes: m.notes,
        createdAt: m.created_at
    }));
};

export const addClientMedication = async (data: Omit<ClientMedication, 'id' | 'createdAt'>): Promise<void> => {
    const { error } = await supabase.from('client_medications').insert({
        client_id: data.clientId,
        medication_name: data.medicationName,
        dosage: data.dosage,
        frequency: data.frequency,
        route: data.route,
        prescriber: data.prescriber,
        start_date: data.startDate,
        end_date: data.endDate,
        status: data.status,
        notes: data.notes
    });
    if (error) throw error;
};

export const deleteClientMedication = async (id: string): Promise<void> => {
    const { error } = await supabase.from('client_medications').delete().eq('id', id);
    if (error) throw error;
};

// ============================================
// AUTHORIZATIONS
// ============================================
export interface ClientAuthorization {
    id: string;
    clientId: string;
    authorizationNumber?: string;
    serviceType?: string;
    payerName?: string;
    startDate?: string;
    endDate?: string;
    unitsAuthorized?: number;
    unitsUsed?: number;
    status: string;
    notes?: string;
    createdAt: string;
}

export const getClientAuthorizations = async (clientId: string): Promise<ClientAuthorization[]> => {
    const { data, error } = await supabase
        .from('client_authorizations')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(a => ({
        id: a.id,
        clientId: a.client_id,
        authorizationNumber: a.authorization_number,
        serviceType: a.service_type,
        payerName: a.payer_name,
        startDate: a.start_date,
        endDate: a.end_date,
        unitsAuthorized: a.units_authorized,
        unitsUsed: a.units_used,
        status: a.status,
        notes: a.notes,
        createdAt: a.created_at
    }));
};

export const addClientAuthorization = async (data: Omit<ClientAuthorization, 'id' | 'createdAt'>): Promise<void> => {
    const { error } = await supabase.from('client_authorizations').insert({
        client_id: data.clientId,
        authorization_number: data.authorizationNumber,
        service_type: data.serviceType,
        payer_name: data.payerName,
        start_date: data.startDate,
        end_date: data.endDate,
        units_authorized: data.unitsAuthorized,
        units_used: data.unitsUsed,
        status: data.status,
        notes: data.notes
    });
    if (error) throw error;
};

export const deleteClientAuthorization = async (id: string): Promise<void> => {
    const { error } = await supabase.from('client_authorizations').delete().eq('id', id);
    if (error) throw error;
};

// ============================================
// DOCUMENTS
// ============================================
export interface ClientDocument {
    id: string;
    clientId: string;
    documentName: string;
    documentType?: string;
    fileUrl?: string;
    fileSize?: number;
    uploadedBy?: string;
    documentDate?: string;
    status: string;
    notes?: string;
    createdAt: string;
}

export const getClientDocuments = async (clientId: string): Promise<ClientDocument[]> => {
    const { data, error } = await supabase
        .from('client_documents')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(d => ({
        id: d.id,
        clientId: d.client_id,
        documentName: d.document_name,
        documentType: d.document_type,
        fileUrl: d.file_url,
        fileSize: d.file_size,
        uploadedBy: d.uploaded_by,
        documentDate: d.document_date,
        status: d.status,
        notes: d.notes,
        createdAt: d.created_at
    }));
};

export const deleteClientDocument = async (id: string): Promise<void> => {
    const { error } = await supabase.from('client_documents').delete().eq('id', id);
    if (error) throw error;
};

// ============================================
// ELIGIBILITY
// ============================================
export interface ClientEligibility {
    id: string;
    clientId: string;
    payerName?: string;
    policyNumber?: string;
    groupNumber?: string;
    eligibilityStatus?: string;
    verificationDate?: string;
    coverageStart?: string;
    coverageEnd?: string;
    copay?: number;
    deductible?: number;
    deductibleMet?: number;
    notes?: string;
    createdAt: string;
}

export const getClientEligibility = async (clientId: string): Promise<ClientEligibility[]> => {
    const { data, error } = await supabase
        .from('client_eligibility')
        .select('*')
        .eq('client_id', clientId)
        .order('verification_date', { ascending: false });

    if (error) throw error;

    return (data || []).map(e => ({
        id: e.id,
        clientId: e.client_id,
        payerName: e.payer_name,
        policyNumber: e.policy_number,
        groupNumber: e.group_number,
        eligibilityStatus: e.eligibility_status,
        verificationDate: e.verification_date,
        coverageStart: e.coverage_start,
        coverageEnd: e.coverage_end,
        copay: e.copay,
        deductible: e.deductible,
        deductibleMet: e.deductible_met,
        notes: e.notes,
        createdAt: e.created_at
    }));
};

// ============================================
// ASSIGNED STAFF
// ============================================
export interface AssignedStaff {
    id: string;
    clientId: string;
    staffId: string;
    staffName?: string;
    staffEmail?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    isPrimary: boolean;
    createdAt: string;
}

export interface AvailableStaff {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    isAcceptingNewClients?: boolean;
    caseloadCurrent?: number;
    caseloadMax?: number;
}

export const getAvailableStaff = async (): Promise<AvailableStaff[]> => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'therapist')
        .order('last_name');

    if (error) throw error;

    return (data || []).map((s: { id: string; first_name?: string; last_name?: string; email?: string; role?: string; is_accepting_new_clients?: boolean; caseload_current?: number; caseload_max?: number }) => ({
        id: s.id,
        firstName: s.first_name,
        lastName: s.last_name,
        email: s.email,
        role: s.role,
        isAcceptingNewClients: s.is_accepting_new_clients ?? true,
        caseloadCurrent: s.caseload_current,
        caseloadMax: s.caseload_max
    }));
};

export const getAssignedStaff = async (clientId: string): Promise<AssignedStaff[]> => {
    const { data, error } = await supabase
        .from('client_assigned_staff')
        .select(`
            *,
            staff:staff_id (
                first_name,
                last_name,
                email
            )
        `)
        .eq('client_id', clientId)
        .order('is_primary', { ascending: false });

    if (error) throw error;

    return (data || []).map((s: { id: string; client_id: string; staff_id: string; staff?: { first_name?: string; last_name?: string; email?: string }; role?: string; start_date?: string; end_date?: string; is_primary: boolean; created_at: string }) => ({
        id: s.id,
        clientId: s.client_id,
        staffId: s.staff_id,
        staffName: s.staff ? `${s.staff.first_name || ''} ${s.staff.last_name || ''}`.trim() : undefined,
        staffEmail: s.staff?.email,
        role: s.role,
        startDate: s.start_date,
        endDate: s.end_date,
        isPrimary: s.is_primary,
        createdAt: s.created_at
    }));
};

export const assignStaffToClient = async (clientId: string, staffId: string, isPrimary: boolean = false): Promise<void> => {
    const { error } = await supabase.from('client_assigned_staff').insert({
        client_id: clientId,
        staff_id: staffId,
        is_primary: isPrimary,
        start_date: new Date().toISOString().split('T')[0]
    });
    if (error) throw error;
};

export const removeAssignedStaff = async (clientId: string, staffId: string): Promise<void> => {
    const { error } = await supabase
        .from('client_assigned_staff')
        .delete()
        .eq('client_id', clientId)
        .eq('staff_id', staffId);
    if (error) throw error;
};

export const deleteAssignedStaff = async (id: string): Promise<void> => {
    const { error } = await supabase.from('client_assigned_staff').delete().eq('id', id);
    if (error) throw error;
};

// ============================================
// PHYSICIANS
// ============================================
export interface ClientPhysician {
    id: string;
    clientId: string;
    physicianName: string;
    specialty?: string;
    phone?: string;
    fax?: string;
    email?: string;
    address?: string;
    isPrimary: boolean;
    npi?: string;
    notes?: string;
    createdAt: string;
}

export const getClientPhysicians = async (clientId: string): Promise<ClientPhysician[]> => {
    const { data, error } = await supabase
        .from('client_physicians')
        .select('*')
        .eq('client_id', clientId)
        .order('is_primary', { ascending: false });

    if (error) throw error;

    return (data || []).map(p => ({
        id: p.id,
        clientId: p.client_id,
        physicianName: p.physician_name,
        specialty: p.specialty,
        phone: p.phone,
        fax: p.fax,
        email: p.email,
        address: p.address,
        isPrimary: p.is_primary,
        npi: p.npi,
        notes: p.notes,
        createdAt: p.created_at
    }));
};

export const addClientPhysician = async (data: Omit<ClientPhysician, 'id' | 'createdAt'>): Promise<void> => {
    const { error } = await supabase.from('client_physicians').insert({
        client_id: data.clientId,
        physician_name: data.physicianName,
        specialty: data.specialty,
        phone: data.phone,
        fax: data.fax,
        email: data.email,
        address: data.address,
        is_primary: data.isPrimary,
        npi: data.npi,
        notes: data.notes
    });
    if (error) throw error;
};

export const deleteClientPhysician = async (id: string): Promise<void> => {
    const { error } = await supabase.from('client_physicians').delete().eq('id', id);
    if (error) throw error;
};

// ============================================
// BACKGROUND
// ============================================
export interface ClientBackground {
    id: string;
    clientId: string;
    sectionType: string;
    content?: string;
    notes?: string;
    createdAt: string;
}

export const getClientBackground = async (clientId: string): Promise<ClientBackground[]> => {
    const { data, error } = await supabase
        .from('client_background')
        .select('*')
        .eq('client_id', clientId);

    if (error) throw error;

    return (data || []).map(b => ({
        id: b.id,
        clientId: b.client_id,
        sectionType: b.section_type,
        content: b.content,
        notes: b.notes,
        createdAt: b.created_at
    }));
};

export const upsertClientBackground = async (data: Omit<ClientBackground, 'id' | 'createdAt'>): Promise<void> => {
    const { error } = await supabase.from('client_background').upsert({
        client_id: data.clientId,
        section_type: data.sectionType,
        content: data.content,
        notes: data.notes
    }, { onConflict: 'client_id,section_type' });
    if (error) throw error;
};

// ============================================
// CONTACTS
// ============================================
export interface ClientContact {
    id: string;
    clientId: string;
    contactName: string;
    relationship?: string;
    phone?: string;
    email?: string;
    address?: string;
    isEmergencyContact: boolean;
    isAuthorizedContact: boolean;
    canPickup: boolean;
    notes?: string;
    createdAt: string;
}

export const getClientContacts = async (clientId: string): Promise<ClientContact[]> => {
    const { data, error } = await supabase
        .from('client_contacts')
        .select('*')
        .eq('client_id', clientId)
        .order('is_emergency_contact', { ascending: false });

    if (error) throw error;

    return (data || []).map(c => ({
        id: c.id,
        clientId: c.client_id,
        contactName: c.contact_name,
        relationship: c.relationship,
        phone: c.phone,
        email: c.email,
        address: c.address,
        isEmergencyContact: c.is_emergency_contact,
        isAuthorizedContact: c.is_authorized_contact,
        canPickup: c.can_pickup,
        notes: c.notes,
        createdAt: c.created_at
    }));
};

export const addClientContact = async (data: Omit<ClientContact, 'id' | 'createdAt'>): Promise<void> => {
    const { error } = await supabase.from('client_contacts').insert({
        client_id: data.clientId,
        contact_name: data.contactName,
        relationship: data.relationship,
        phone: data.phone,
        email: data.email,
        address: data.address,
        is_emergency_contact: data.isEmergencyContact,
        is_authorized_contact: data.isAuthorizedContact,
        can_pickup: data.canPickup,
        notes: data.notes
    });
    if (error) throw error;
};

export const deleteClientContact = async (id: string): Promise<void> => {
    const { error } = await supabase.from('client_contacts').delete().eq('id', id);
    if (error) throw error;
};

// ============================================
// CONTACT NOTES
// ============================================
export interface ClientContactNote {
    id: string;
    clientId: string;
    contactDate: string;
    contactType?: string;
    contactWith?: string;
    subject?: string;
    notes?: string;
    followUpRequired: boolean;
    followUpDate?: string;
    createdBy?: string;
    createdAt: string;
}

export const getClientContactNotes = async (clientId: string): Promise<ClientContactNote[]> => {
    const { data, error } = await supabase
        .from('client_contact_notes')
        .select('*')
        .eq('client_id', clientId)
        .order('contact_date', { ascending: false });

    if (error) throw error;

    return (data || []).map(n => ({
        id: n.id,
        clientId: n.client_id,
        contactDate: n.contact_date,
        contactType: n.contact_type,
        contactWith: n.contact_with,
        subject: n.subject,
        notes: n.notes,
        followUpRequired: n.follow_up_required,
        followUpDate: n.follow_up_date,
        createdBy: n.created_by,
        createdAt: n.created_at
    }));
};

export const addClientContactNote = async (data: Omit<ClientContactNote, 'id' | 'createdAt'>): Promise<void> => {
    const { error } = await supabase.from('client_contact_notes').insert({
        client_id: data.clientId,
        contact_date: data.contactDate,
        contact_type: data.contactType,
        contact_with: data.contactWith,
        subject: data.subject,
        notes: data.notes,
        follow_up_required: data.followUpRequired,
        follow_up_date: data.followUpDate,
        created_by: data.createdBy
    });
    if (error) throw error;
};

export const deleteClientContactNote = async (id: string): Promise<void> => {
    const { error } = await supabase.from('client_contact_notes').delete().eq('id', id);
    if (error) throw error;
};

// ============================================
// QUESTIONNAIRES
// ============================================
export interface ClientQuestionnaire {
    id: string;
    clientId: string;
    questionnaireName: string;
    questionnaireType?: string;
    completedDate?: string;
    score?: number;
    status: string;
    notes?: string;
    createdAt: string;
}

export const getClientQuestionnaires = async (clientId: string): Promise<ClientQuestionnaire[]> => {
    const { data, error } = await supabase
        .from('client_questionnaires')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(q => ({
        id: q.id,
        clientId: q.client_id,
        questionnaireName: q.questionnaire_name,
        questionnaireType: q.questionnaire_type,
        completedDate: q.completed_date,
        score: q.score,
        status: q.status,
        notes: q.notes,
        createdAt: q.created_at
    }));
};

export const addClientQuestionnaire = async (data: {
    clientId: string;
    questionnaireName: string;
    questionnaireType?: string;
    completedDate?: string;
    score?: number;
    status: string;
    notes?: string;
    answers?: Record<string, string | number>;
}): Promise<void> => {
    const { error } = await supabase.from('client_questionnaires').insert({
        client_id: data.clientId,
        questionnaire_name: data.questionnaireName,
        questionnaire_type: data.questionnaireType,
        completed_date: data.completedDate,
        score: data.score,
        status: data.status,
        notes: data.notes
    });
    if (error) throw error;
};

export const sendQuestionnaireEmail = async (
    clientEmail: string,
    clientName: string,
    questionnaireName: string,
    questionnaireId: string
): Promise<void> => {
    // For now, simulating email send - in production, this would call an Edge Function or email API
    console.log(`Sending ${questionnaireName} questionnaire to ${clientName} at ${clientEmail}`);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In production, you would call:
    // const { error } = await supabase.functions.invoke('send-questionnaire-email', {
    //     body: { clientEmail, clientName, questionnaireName, questionnaireId }
    // });
};

export const deleteClientQuestionnaire = async (id: string): Promise<void> => {
    const { error } = await supabase.from('client_questionnaires').delete().eq('id', id);
    if (error) throw error;
};

// ============================================
// IMMUNIZATIONS
// ============================================
export interface ClientImmunization {
    id: string;
    clientId: string;
    vaccineName: string;
    administrationDate?: string;
    lotNumber?: string;
    site?: string;
    administeredBy?: string;
    nextDueDate?: string;
    notes?: string;
    createdAt: string;
}

export const getClientImmunizations = async (clientId: string): Promise<ClientImmunization[]> => {
    const { data, error } = await supabase
        .from('client_immunizations')
        .select('*')
        .eq('client_id', clientId)
        .order('administration_date', { ascending: false });

    if (error) throw error;

    return (data || []).map(i => ({
        id: i.id,
        clientId: i.client_id,
        vaccineName: i.vaccine_name,
        administrationDate: i.administration_date,
        lotNumber: i.lot_number,
        site: i.site,
        administeredBy: i.administered_by,
        nextDueDate: i.next_due_date,
        notes: i.notes,
        createdAt: i.created_at
    }));
};

export const addClientImmunization = async (data: Omit<ClientImmunization, 'id' | 'createdAt'>): Promise<void> => {
    const { error } = await supabase.from('client_immunizations').insert({
        client_id: data.clientId,
        vaccine_name: data.vaccineName,
        administration_date: data.administrationDate,
        lot_number: data.lotNumber,
        site: data.site,
        administered_by: data.administeredBy,
        next_due_date: data.nextDueDate,
        notes: data.notes
    });
    if (error) throw error;
};

export const deleteClientImmunization = async (id: string): Promise<void> => {
    const { error } = await supabase.from('client_immunizations').delete().eq('id', id);
    if (error) throw error;
};

// ============================================
// FILES
// ============================================
export interface ClientFile {
    id: string;
    clientId: string;
    fileName: string;
    fileType?: string;
    fileUrl: string;
    fileSize?: number;
    category?: string;
    uploadedBy?: string;
    notes?: string;
    createdAt: string;
}

export const getClientFiles = async (clientId: string): Promise<ClientFile[]> => {
    const { data, error } = await supabase
        .from('client_files')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(f => ({
        id: f.id,
        clientId: f.client_id,
        fileName: f.file_name,
        fileType: f.file_type,
        fileUrl: f.file_url,
        fileSize: f.file_size,
        category: f.category,
        uploadedBy: f.uploaded_by,
        notes: f.notes,
        createdAt: f.created_at
    }));
};

export const deleteClientFile = async (id: string): Promise<void> => {
    const { error } = await supabase.from('client_files').delete().eq('id', id);
    if (error) throw error;
};

// ============================================
// DISCHARGE
// ============================================
export interface ClientDischarge {
    id: string;
    clientId: string;
    dischargeDate?: string;
    dischargeType?: string;
    dischargeReason?: string;
    dischargeSummary?: string;
    referrals?: string;
    followUpPlan?: string;
    status: string;
    createdAt: string;
}

export const getClientDischarge = async (clientId: string): Promise<ClientDischarge | null> => {
    const { data, error } = await supabase
        .from('client_discharge')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    return {
        id: data.id,
        clientId: data.client_id,
        dischargeDate: data.discharge_date,
        dischargeType: data.discharge_type,
        dischargeReason: data.discharge_reason,
        dischargeSummary: data.discharge_summary,
        referrals: data.referrals,
        followUpPlan: data.follow_up_plan,
        status: data.status,
        createdAt: data.created_at
    };
};

export const upsertClientDischarge = async (data: Omit<ClientDischarge, 'id' | 'createdAt'>): Promise<void> => {
    const { error } = await supabase.from('client_discharge').upsert({
        client_id: data.clientId,
        discharge_date: data.dischargeDate,
        discharge_type: data.dischargeType,
        discharge_reason: data.dischargeReason,
        discharge_summary: data.dischargeSummary,
        referrals: data.referrals,
        follow_up_plan: data.followUpPlan,
        status: data.status
    }, { onConflict: 'client_id' });
    if (error) throw error;
};
