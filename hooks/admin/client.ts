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

// Update to match new DB schema
export interface ClientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  role: string;
  clinicId: string;
  clinicName?: string;
  status: string;
  prefix?: string;
  middleName?: string;
  suffix?: string;
  nickname?: string;
  gender: string;
  recordNumber?: string;
  sexualOrientation?: string;
  maritalStatus?: string;
  genderIdentity?: string;
  pregnancyStatus?: string;
  genderPronouns?: string;
  timezone?: string;
  workPhone?: string;

  dateOfBirth?: string;
  ssn?: string;
  race?: string;
  startDate?: string;
  phone?: string;

  isPrivatePay?: boolean;
  assignedSite?: string;

  address: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  physicalAddress?: {
    street?: string;
    line2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  insurance: {
    insuranceType?: string;
    policyNumber?: string;
    startDate?: string;
    endDate?: string;
  };
  comments?: string;
  createdAt: string;
  updatedAt: string;
}

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

        // New Fields
        record_number: clientData.recordNumber,
        sexual_orientation: clientData.sexualOrientation,
        marital_status: clientData.maritalStatus,
        gender_identity: clientData.genderIdentity,
        pregnancy_status: clientData.pregnancyStatus,
        gender_pronouns: clientData.genderPronouns,
        timezone: clientData.timezone,
        work_phone: clientData.workPhone,

        // Address
        address_street: clientData.address?.street,
        address_city: clientData.address?.city,
        address_state: clientData.address?.state,
        address_zip_code: clientData.address?.zipCode,

        // Physical Address
        physical_address_street: clientData.physicalAddress?.street,
        physical_address_line_2: clientData.physicalAddress?.line2,
        physical_address_city: clientData.physicalAddress?.city,
        physical_address_state: clientData.physicalAddress?.state,
        physical_address_zip_code: clientData.physicalAddress?.zipCode,

        // Other new fields
        is_private_pay: clientData.isPrivatePay,
        assigned_site: clientData.assignedSite,

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

export const getClientById = async (clientId: string): Promise<ClientProfile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      client_details (*),
      clinics (*)
    `)
    .eq('id', clientId)
    .single();

  if (error) throw error;

  const details = data.client_details?.[0] || {};
  const clinic = data.clinics;

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    role: data.role,
    clinicId: data.clinic_id,
    clinicName: clinic?.name,
    status: 'Active', // Todo: Implement logic

    // Details
    prefix: details.prefix,
    middleName: details.middle_name,
    suffix: details.suffix,
    nickname: details.nickname,
    gender: details.gender || 'Other',
    recordNumber: details.record_number,
    sexualOrientation: details.sexual_orientation,
    maritalStatus: details.marital_status,
    genderIdentity: details.gender_identity,
    pregnancyStatus: details.pregnancy_status,
    genderPronouns: details.gender_pronouns,
    timezone: details.timezone,
    workPhone: details.work_phone,

    dateOfBirth: details.date_of_birth,
    ssn: details.ssn,
    race: details.race,
    startDate: details.start_date || data.created_at,
    phone: details.phone,
    isPrivatePay: details.is_private_pay,
    assignedSite: details.assigned_site,

    // Address
    address: {
      street: details.address_street,
      city: details.address_city,
      state: details.address_state,
      zipCode: details.address_zip_code,
    },

    // Physical Address
    physicalAddress: {
      street: details.physical_address_street,
      line2: details.physical_address_line_2,
      city: details.physical_address_city,
      state: details.physical_address_state,
      zipCode: details.physical_address_zip_code,
    },

    // Insurance
    insurance: {
      insuranceType: details.insurance_type,
      policyNumber: details.insurance_policy_number,
      startDate: details.insurance_start_date,
      endDate: details.insurance_end_date,
    },

    comments: details.comments,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateClient = async (clientId: string, clientData: any) => {
  // 1. Update Profile
  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      first_name: clientData.firstName,
      last_name: clientData.lastName,
      email: clientData.email,
    })
    .eq('id', clientId);

  if (profileError) throw profileError;

  // 2. Update Client Details
  const { error: detailsError } = await supabase
    .from('client_details')
    .update({
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
      record_number: clientData.recordNumber,
      sexual_orientation: clientData.sexualOrientation,
      marital_status: clientData.maritalStatus,
      gender_identity: clientData.genderIdentity,
      pregnancy_status: clientData.pregnancyStatus,
      gender_pronouns: clientData.genderPronouns,
      timezone: clientData.timezone,
      work_phone: clientData.workPhone,
      address_street: clientData.address?.street,
      address_city: clientData.address?.city,
      address_state: clientData.address?.state,
      address_zip_code: clientData.address?.zipCode,
      physical_address_street: clientData.physicalAddress?.street,
      physical_address_line_2: clientData.physicalAddress?.line2,
      physical_address_city: clientData.physicalAddress?.city,
      physical_address_state: clientData.physicalAddress?.state,
      physical_address_zip_code: clientData.physicalAddress?.zipCode,
      is_private_pay: clientData.isPrivatePay,
      assigned_site: clientData.assignedSite,
      insurance_type: clientData.insurance?.insuranceType,
      insurance_policy_number: clientData.insurance?.policyNumber,
      insurance_start_date: clientData.insurance?.startDate,
      insurance_end_date: clientData.insurance?.endDate,
      comments: clientData.comments
    })
    .eq('profile_id', clientId);

  if (detailsError) throw detailsError;

  return { id: clientId };
};
