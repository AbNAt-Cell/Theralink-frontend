import { createClient as getSupabaseClient } from '@/utils/supabase/client';

const supabase = getSupabaseClient();

export const getClients = async (clinicId?: string) => {
  if (!clinicId) return { players: [] };

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('clinic_id', clinicId)
    .eq('role', 'CLIENT');

  if (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }

  return { players: data || [] };
};

export const createNewClient = async (clientData: any, clinicId: string) => {
  const tempProfileId = crypto.randomUUID();

  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: tempProfileId,
        clinic_id: clinicId,
        first_name: clientData.firstName,
        last_name: clientData.lastName,
        role: 'CLIENT'
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};
