import axiosInstance from './axios';
import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export type User = {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginResponse = {
  user: User;
  token: string;
};

export const login = async (data: LoginFormValues): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/api/auth/login', {
    username: data.username,
    password: data.password,
  });

  const { user, token } = response.data;
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));

  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getStoredUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
