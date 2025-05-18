import Cookies from 'js-cookie';
import axiosInstance from '../../../lib/axios';

export const clients = async () => {
    const token = Cookies.get('token');
    const response = await axiosInstance.get('/api/users?role=CLIENT', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
}