import { createClient as getSupabaseClient } from '@/utils/supabase/client';

const supabase = getSupabaseClient();

// Service interface
export interface Service {
    id: string;
    code: string;
    name: string;
    description?: string;
    category?: string;
    isTelehealth: boolean;
    isActive: boolean;
}

// Client Service (assigned service)
export interface ClientService {
    id: string;
    clientId: string;
    serviceId: string;
    service: Service;
    assignedAt: string;
}

// Get all available services for the clinic
export const getAvailableServices = async (): Promise<Service[]> => {
    const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('code');

    if (error) throw error;

    return (data || []).map(s => ({
        id: s.id,
        code: s.code,
        name: s.name,
        description: s.description,
        category: s.category,
        isTelehealth: s.is_telehealth,
        isActive: s.is_active
    }));
};

// Get services assigned to a client
export const getClientServices = async (clientId: string): Promise<ClientService[]> => {
    const { data, error } = await supabase
        .from('client_services')
        .select(`
      *,
      service:services(*)
    `)
        .eq('client_id', clientId);

    if (error) throw error;

    return (data || []).map(cs => ({
        id: cs.id,
        clientId: cs.client_id,
        serviceId: cs.service_id,
        service: {
            id: cs.service.id,
            code: cs.service.code,
            name: cs.service.name,
            description: cs.service.description,
            category: cs.service.category,
            isTelehealth: cs.service.is_telehealth,
            isActive: cs.service.is_active
        },
        assignedAt: cs.assigned_at
    }));
};

// Assign a service to a client
export const assignServiceToClient = async (clientId: string, serviceId: string): Promise<void> => {
    const { error } = await supabase
        .from('client_services')
        .insert({
            client_id: clientId,
            service_id: serviceId
        });

    if (error) throw error;
};

// Assign multiple services to a client
export const assignServicesToClient = async (clientId: string, serviceIds: string[]): Promise<void> => {
    const inserts = serviceIds.map(serviceId => ({
        client_id: clientId,
        service_id: serviceId
    }));

    const { error } = await supabase
        .from('client_services')
        .insert(inserts);

    if (error) throw error;
};

// Remove a service from a client
export const removeServiceFromClient = async (clientId: string, serviceId: string): Promise<void> => {
    const { error } = await supabase
        .from('client_services')
        .delete()
        .eq('client_id', clientId)
        .eq('service_id', serviceId);

    if (error) throw error;
};

// Remove multiple services from a client
export const removeServicesFromClient = async (clientId: string, serviceIds: string[]): Promise<void> => {
    const { error } = await supabase
        .from('client_services')
        .delete()
        .eq('client_id', clientId)
        .in('service_id', serviceIds);

    if (error) throw error;
};
