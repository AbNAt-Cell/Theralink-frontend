import axioxInstance from '../lib/axios';
import Cookies from 'js-cookie';

  // adjusted the response outcome type

interface Res {
  success: boolean;
  message: string;
  data: {
    users: User[];
  };
}

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
}

export const userSearch = async ({ email }: { email: string }) => {
  const response: Res = await axioxInstance.get(`/api/users?email=${email}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get('token')}`,
    },
  });

  // adjusted the result outcome
  return response.data.users;
};
