import api from "./api";

// Patients
export const createPatient = (data: any) => api.post("/api/patients", data);

export const getPatients = () => api.get("/api/patients");

export const getPatientById = (patientId: string) => api.get(`/api/patients/${patientId}`);

export const updatePatientById = (patientId: string, data: any) => api.put(`/api/patients/${patientId}`, data);

// Conversations
export const getConversations = () => api.get("/api/conversations");

export const getMessagesByConversation = (conversationId: string) => api.get(`/api/message/${conversationId}`);

// Insurance
export const getInsuranceByPatient = (patientId: string) => api.get(`/api/insurance/${patientId}`);

// Signatures
export const getParentSignature = (clientId: string) => api.get(`/api/parentSignature/${clientId}`);

export const getClientSignature = (clientId: string) => api.get(`/api/clientSignature/${clientId}`);
