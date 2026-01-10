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
        ...data.staff_details?.[0]
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
