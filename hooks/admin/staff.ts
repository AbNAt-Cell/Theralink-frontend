import { createClient } from '@/utils/supabase/client';
import { Staff } from '@/types/staff';

const supabase = createClient();

export const getStaffs = async (clinicId?: string) => {
    if (!clinicId) return { users: [] };

    const { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            staff_details (*)
        `)
        .eq('clinic_id', clinicId)
        .in('role', ['ADMIN', 'STAFF']);

    if (error) {
        console.error('Error fetching staff:', error);
        throw error;
    }

    // Map Supabase profile to Staff type
    const staffMembers: Staff[] = (data || []).map(profile => ({
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        credentials: '', // Placeholder mapping if needed
        role: profile.role,
        gender: profile.staff_details?.[0]?.gender || 'Other',
        race: profile.staff_details?.[0]?.race || '',
        site: '',
        phone: profile.staff_details?.[0]?.phone || '',
        email: profile.email || '',
        lastDocument: '',
        lastLogin: '',
        numberOfCases: 0
    }));

    return { users: staffMembers };
};

export const getStaffById = async (id: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select(`
            *,
            staff_details (*)
        `)
        .eq('id', id)
        .single();

    if (error) throw error;

    return {
        id: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        role: data.role,
        ...data.staff_details?.[0],
        max_capacity: data.staff_details?.[0]?.max_capacity,
        accepting_new_clients: data.staff_details?.[0]?.accepting_new_clients ?? true
    };
};

export const createStaff = async (staffData: any, clinicId: string) => {
    const tempProfileId = crypto.randomUUID();

    // 1. Create Profile (with email)
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([
            {
                id: tempProfileId,
                clinic_id: clinicId,
                first_name: staffData.firstName,
                last_name: staffData.lastName,
                email: staffData.email,
                role: staffData.accessLevel || 'STAFF'
            }
        ])
        .select()
        .single();

    if (profileError) throw profileError;

    // 2. Create Staff Details
    const { error: detailsError } = await supabase
        .from('staff_details')
        .insert([
            {
                profile_id: tempProfileId,
                phone: staffData.phone,
                gender: staffData.gender,
                race: staffData.race,
                position: staffData.position,
                position_effective_date: staffData.positionEffectiveDate,
                date_of_birth: staffData.dateOfBirth
            }
        ]);

    if (detailsError) {
        // Cleanup profile if details fail
        await supabase.from('profiles').delete().eq('id', tempProfileId);
        throw detailsError;
    }

    return profile;
};

export const getStaffCredentials = async (staffId: string) => {
    const { data, error } = await supabase
        .from('staff_credentials')
        .select('*')
        .eq('staff_id', staffId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const addStaffCredential = async (credential: {
    staff_id: string;
    name: string;
    effective_date?: string;
    expiration_date?: string;
}) => {
    const { data, error } = await supabase
        .from('staff_credentials')
        .insert([credential])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteStaffCredential = async (id: string) => {
    const { error } = await supabase
        .from('staff_credentials')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// --- Caseload Management ---

export const getAssignedClients = async (staffId: string) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('assigned_staff_id', staffId)
        .eq('role', 'CLIENT');

    if (error) throw error;
    return data;
};

export const getAvailableClients = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .is('assigned_staff_id', null)
        .eq('role', 'CLIENT');

    if (error) throw error;
    return data;
};

export const updateStaffCaseloadSettings = async (
    staffId: string,
    settings: { max_capacity?: number | null; accepting_new_clients?: boolean }
) => {
    // We need to find the staff_details record linked to this profile
    // Assuming staff_details.profile_id is the foreign key to profiles.id (staffId)
    const { error } = await supabase
        .from('staff_details')
        .update(settings)
        .eq('profile_id', staffId);

    if (error) throw error;
};

export const assignClientToStaff = async (clientId: string, staffId: string) => {
    const { error } = await supabase
        .from('profiles')
        .update({ assigned_staff_id: staffId })
        .eq('id', clientId);

    if (error) throw error;
};

export const unassignClientFromStaff = async (clientId: string) => {
    const { error } = await supabase
        .from('profiles')
        .update({ assigned_staff_id: null })
        .eq('id', clientId);

    if (error) throw error;
};

// --- Staff Sites Management ---

export const getStaffSites = async (staffId: string) => {
    const { data, error } = await supabase
        .from('staff_sites')
        .select(`
            *,
            clinics:clinic_id (*)
        `)
        .eq('staff_id', staffId);

    if (error) throw error;
    // Map to a cleaner format if needed, or return as is
    return data.map((item: any) => item.clinics);
};

export const getAllClinics = async () => {
    const { data, error } = await supabase
        .from('clinics')
        .select('*');

    if (error) throw error;
    return data;
};

export const assignSiteToStaff = async (staffId: string, clinicId: string) => {
    const { error } = await supabase
        .from('staff_sites')
        .insert({ staff_id: staffId, clinic_id: clinicId });

    if (error) throw error;
};

export const unassignSiteFromStaff = async (staffId: string, clinicId: string) => {
    const { error } = await supabase
        .from('staff_sites')
        .delete()
        .match({ staff_id: staffId, clinic_id: clinicId });

    if (error) throw error;
};

// --- Staff Certifications Management ---

export const getStaffCertifications = async (staffId: string) => {
    const { data, error } = await supabase
        .from('staff_certifications')
        .select('*')
        .eq('staff_id', staffId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const addStaffCertification = async (certification: {
    staff_id: string;
    name: string;
    issue_date?: string;
    expiration_date?: string;
    never_expires?: boolean;
    completed?: boolean;
    file_url?: string;
}) => {
    const { data, error } = await supabase
        .from('staff_certifications')
        .insert([certification])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteStaffCertification = async (id: string) => {
    const { error } = await supabase
        .from('staff_certifications')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// --- Staff Files Management ---

export const getStaffFiles = async (staffId: string) => {
    const { data, error } = await supabase
        .from('staff_files')
        .select('*')
        .eq('staff_id', staffId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const addStaffFile = async (fileRec: {
    staff_id: string;
    name: string;
    file_url: string;
}) => {
    const { data, error } = await supabase
        .from('staff_files')
        .insert([fileRec])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteStaffFile = async (id: string) => {
    const { error } = await supabase
        .from('staff_files')
        .delete()
        .eq('id', id);

    if (error) throw error;
};
