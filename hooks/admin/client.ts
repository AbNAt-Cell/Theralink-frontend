import { createClient as getSupabaseClient } from '@/utils/supabase/client';

const supabase = getSupabaseClient();

export const getClients = async (clinicId?: string) => {
  if (!clinicId) return { players: [] };

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      client_details (*)
    `)
    .eq('clinic_id', clinicId)
    .eq('role', 'CLIENT');

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }

  // Map to User type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const players = (data || []).map((p: any) => {
    const details = p.client_details?.[0] || {}; // supabase returns array for 1:M or simple join
    return {
      id: p.id,
      firstName: p.first_name,
      lastName: p.last_name,
      status: 'Active', // Todo: Implement logic
      balance: 0, // Todo: Implement logic
      dob: details.date_of_birth,
      assignedStaff: [], // Todo: Implement logic
      gender: details.gender || 'Other',
      primaryInsurance: details.insurance_type,
      startDate: details.start_date || p.created_at,
      lastSeenDate: p.updated_at,
      nextAppointment: '', // Todo: Implement logic
      site: details.address_city ? `${details.address_city}` : '',
      lastEligibilityCheck: { status: 'Unknown', date: '' },
      createdAt: p.created_at,
      updatedAt: p.updated_at
    };
  });

  return { players };
};

export const createNewClient = async (clientData: any, clinicId: string) => {
  const tempProfileId = crypto.randomUUID();

  // 1. Create Profile
  // We include email here if the profile table supports it (added via migration)
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        id: tempProfileId,
        clinic_id: clinicId,
        first_name: clientData.firstName,
        last_name: clientData.lastName,
        email: clientData.email,
        role: 'CLIENT'
      }
    ])
    .select()
    .single();

  if (profileError) throw profileError;

  // 2. Create Client Details
  const { error: detailsError } = await supabase
    .from('client_details')
    .insert([
      {
        profile_id: tempProfileId,
        prefix: clientData.prefix,
        middle_name: clientData.middleName,
        suffix: clientData.suffix,
        nickname: clientData.nickName,
        gender: clientData.gender,
        date_of_birth: clientData.dateOfBirth,
        ssn: clientData.ssn,
        race: clientData.race,
        start_date: clientData.startDate,
        phone: clientData.phone,

        // Address
        address_street: clientData.address?.street,
        address_city: clientData.address?.city,
        address_state: clientData.address?.state,
        address_zip_code: clientData.address?.zipCode,

        // Insurance
        insurance_type: clientData.insurance?.insuranceType,
        insurance_policy_number: clientData.insurance?.policyNumber,
        insurance_start_date: clientData.insurance?.startDate,
        insurance_end_date: clientData.insurance?.endDate,

        comments: clientData.comments
      }
    ]);

  if (detailsError) {
    // Cleanup profile if details creation fails
    console.error("Error creating client details:", detailsError);
    // Attempt to delete the profile since the transaction failed "logically"
    await supabase.from('profiles').delete().eq('id', tempProfileId);
    throw detailsError;
  }

  return profile;
};
