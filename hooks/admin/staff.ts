import { createClient } from '@/utils/supabase/client';
import { Staff } from '@/types/staff';

const supabase = createClient();

export const getStaffs = async (clinicId?: string) => {
    if (!clinicId) return { users: [] };

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
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
        credentials: '', // Placeholder
        role: profile.role,
        gender: profile.gender || 'Other',
        race: profile.race || '',
        site: '', // Placeholder
        phone: profile.phone || '',
        email: profile.email || '',
        lastDocument: '',
        lastLogin: '',
        numberOfCases: 0
    }));

    return { users: staffMembers };
};

export const createStaff = async (staffData: any, clinicId: string) => {
    // In production, you would call a server action that uses service_role
    // to create an auth user: supabase.auth.admin.createUser()

    // For this demonstration, we'll create a profile with a random ID 
    // to simulate the staff member being added to the database.
    const tempProfileId = crypto.randomUUID();

    // 1. Create Profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([
            {
                id: tempProfileId,
                clinic_id: clinicId,
                first_name: staffData.firstName,
                last_name: staffData.lastName,
                role: staffData.accessLevel.toUpperCase() || 'STAFF'
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
