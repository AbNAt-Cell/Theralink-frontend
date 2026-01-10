import { z } from 'zod';
import { createClient } from '@/utils/supabase/client';

export const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF' | 'CLIENT';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  clinicId?: string;
  createdAt?: string;
  updatedAt?: string;
};

const supabase = createClient();

export const login = async (data: LoginFormValues) => {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (authError) throw authError;

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  if (profileError) throw profileError;

  const user: User = {
    id: authData.user.id,
    email: authData.user.email!,
    firstName: profileData.first_name,
    lastName: profileData.last_name,
    role: profileData.role,
    clinicId: profileData.clinic_id,
  };

  return { user, session: authData.session };
};

export const logout = async () => {
  await supabase.auth.signOut();
};

export const getStoredUser = async (): Promise<User | null> => {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) return null;

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.id)
    .single();

  if (!profileData) return null;

  return {
    id: authUser.id,
    email: authUser.email!,
    firstName: profileData.first_name,
    lastName: profileData.last_name,
    role: profileData.role,
    clinicId: profileData.clinic_id,
  };
};

export const sendForgotPassword = async (data: { email: string }) => {
  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
  return { message: "Password reset link sent to your email." };
};

export const sendResetPassword = async (data: { password: string; token?: string | null }) => {
  const { error } = await supabase.auth.updateUser({ password: data.password });
  if (error) throw error;
  return { message: "Password updated successfully." };
};

