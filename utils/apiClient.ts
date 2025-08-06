import api from "./api";

// Define types for the data you expect from the API.
// Replace `any` with proper types when you know the API response structure.

export interface ClientSignature {
  // example fields
  signatureUrl: string;
  signedAt: string;
}

export interface Diagnosis {
  // example fields
  diagnosisId: string;
  description: string;
  date: string;
}

export interface TreatmentPlan {
  // example fields
  planId: string;
  treatments: string[];
  startDate: string;
}

export interface Appointment {
  // example fields
  appointmentId: string;
  date: string;
  doctor: string;
  status: string;
}

// Get client signature by clientId
export const getClientSignature = async (clientId: string): Promise<ClientSignature> => {
  try {
    const response = await api.get<ClientSignature>(`/api/clientSignature/${clientId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Get diagnosis by patientId
export const getDiagnosis = async (patientId: string): Promise<Diagnosis[]> => {
  try {
    const response = await api.get<Diagnosis[]>(`/api/diagnosis/${patientId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Get treatment plan by patientId
export const getTreatmentPlan = async (patientId: string): Promise<TreatmentPlan> => {
  try {
    const response = await api.get<TreatmentPlan>(`/api/treatmentPlan/${patientId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Get appointments by patientId
export const getAppointments = async (patientId: string): Promise<Appointment[]> => {
  try {
    const response = await api.get<Appointment[]>(`/api/appointments/${patientId}`);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};
