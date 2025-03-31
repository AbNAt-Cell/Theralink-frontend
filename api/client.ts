import axiosInstance from "@/lib/axios";

export const createClient = async (data: any): Promise<{ message: string; patient: any }> => {
  const response = await axiosInstance.post('/api/patients', data);
  return response.data;
};

export const getClients = async (): Promise<{ patients: any[] }> => {
  const response = await axiosInstance.get('/api/patients');
  return response.data;
};