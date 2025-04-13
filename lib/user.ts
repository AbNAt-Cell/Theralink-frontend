import axioxInstance from './axios';
import Cookies from 'js-cookie';

interface Res {
  success: boolean;
  message: string;
  data: {
    user: User[];
  };
}

interface User {
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

  return response.data.user;
};
