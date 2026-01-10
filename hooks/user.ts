import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export const userSearch = async ({ email }: { email: string }) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .ilike('email', `%${email}%`);

  if (error) {
    console.error('Error searching users:', error);
    throw error;
  }

  return (data || []).map(profile => ({
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
    role: profile.role
  }));
};
