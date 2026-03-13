import { createClient as getSupabaseClient } from '@/utils/supabase/client';

const supabase = getSupabaseClient();

// Authorization status types
export type AuthorizationStatus = 'PENDING' | 'APPROVED' | 'DENIED' | 'EXPIRED';

// Authorization interface
export interface Authorization {
    id: string;
    clinicId: string;
    submittedBy: string;
    submittedByName?: string;
    requestDate: string;
    status: AuthorizationStatus;
    comments?: string;
    createdAt: string;
    clients: AuthorizationClient[];
    services: AuthorizationService[];
}

// Authorization Client
export interface AuthorizationClient {
    id: string;
    authorizationId: string;
    clientId: string;
    clientName?: string;
    effectiveDate: string;
    endDate: string;
    authNumber?: string;
}

// Authorization Service
export interface AuthorizationService {
    id: string;
    authorizationId: string;
    serviceId: string;
    serviceName?: string;
    serviceCode?: string;
    totalUnits: number;
    isRestrictive: boolean;
    unitsLimit?: number;
    unitsPeriod?: 'Day' | 'Week' | 'Month';
}

// Authorization Template
export interface AuthorizationTemplate {
    id: string;
    clinicId: string;
    name: string;
    description?: string;
    services: AuthorizationTemplateService[];
    isActive: boolean;
}

export interface AuthorizationTemplateService {
    serviceId: string;
    serviceCode: string;
    totalUnits: number;
    isRestrictive: boolean;
    unitsLimit?: number;
    unitsPeriod?: 'Day' | 'Week' | 'Month';
}

// Create input types
export interface CreateAuthorizationInput {
    clinicId: string;
    submittedBy: string;
    requestDate: string;
    status?: AuthorizationStatus;
    comments?: string;
    clients: {
        clientId: string;
        effectiveDate: string;
        endDate: string;
        authNumber?: string;
    }[];
    services: {
        serviceId: string;
        serviceCode: string;
        totalUnits: number;
        isRestrictive: boolean;
        unitsLimit?: number;
        unitsPeriod?: 'Day' | 'Week' | 'Month';
    }[];
    addToClientServices?: boolean;
}

// Get all authorizations for a clinic
export const getAuthorizations = async (clinicId: string): Promise<Authorization[]> => {
    const { data, error } = await supabase
        .from('authorizations')
        .select(`
            *,
            submitted_by_profile:profiles!submitted_by(first_name, last_name),
            authorization_clients(
                *,
                client:profiles!client_id(first_name, last_name)
            ),
            authorization_services(
                *,
                service:services(name, code)
            )
        `)
        .eq('clinic_id', clinicId)
        .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(auth => ({
        id: auth.id,
        clinicId: auth.clinic_id,
        submittedBy: auth.submitted_by,
        submittedByName: auth.submitted_by_profile
            ? `${auth.submitted_by_profile.first_name} ${auth.submitted_by_profile.last_name}`
            : undefined,
        requestDate: auth.request_date,
        status: auth.status,
        comments: auth.comments,
        createdAt: auth.created_at,
        clients: (auth.authorization_clients || []).map((c: any) => ({
            id: c.id,
            authorizationId: c.authorization_id,
            clientId: c.client_id,
            clientName: c.client ? `${c.client.first_name} ${c.client.last_name}` : undefined,
            effectiveDate: c.effective_date,
            endDate: c.end_date,
            authNumber: c.auth_number
        })),
        services: (auth.authorization_services || []).map((s: any) => ({
            id: s.id,
            authorizationId: s.authorization_id,
            serviceId: s.service_id,
            serviceName: s.service?.name,
            serviceCode: s.service_code || s.service?.code,
            totalUnits: s.total_units,
            isRestrictive: s.is_restrictive,
            unitsLimit: s.units_limit,
            unitsPeriod: s.units_period
        }))
    }));
};

// Create a new authorization
export const createAuthorization = async (input: CreateAuthorizationInput): Promise<string> => {
    // 1. Create the authorization record
    const { data: authData, error: authError } = await supabase
        .from('authorizations')
        .insert({
            clinic_id: input.clinicId,
            submitted_by: input.submittedBy,
            request_date: input.requestDate,
            status: input.status || 'PENDING',
            comments: input.comments
        })
        .select('id')
        .single();

    if (authError) throw authError;
    const authId = authData.id;

    // 2. Add clients
    if (input.clients.length > 0) {
        const clientInserts = input.clients.map(c => ({
            authorization_id: authId,
            client_id: c.clientId,
            effective_date: c.effectiveDate,
            end_date: c.endDate,
            auth_number: c.authNumber
        }));

        const { error: clientsError } = await supabase
            .from('authorization_clients')
            .insert(clientInserts);

        if (clientsError) throw clientsError;
    }

    // 3. Add services
    if (input.services.length > 0) {
        const serviceInserts = input.services.map(s => ({
            authorization_id: authId,
            service_id: s.serviceId,
            service_code: s.serviceCode,
            total_units: s.totalUnits,
            is_restrictive: s.isRestrictive,
            units_limit: s.unitsLimit,
            units_period: s.unitsPeriod
        }));

        const { error: servicesError } = await supabase
            .from('authorization_services')
            .insert(serviceInserts);

        if (servicesError) throw servicesError;
    }

    // 4. Optionally add services to client_services
    if (input.addToClientServices && input.clients.length > 0 && input.services.length > 0) {
        for (const client of input.clients) {
            for (const service of input.services) {
                // Check if already exists
                const { data: existing } = await supabase
                    .from('client_services')
                    .select('id')
                    .eq('client_id', client.clientId)
                    .eq('service_id', service.serviceId)
                    .single();

                if (!existing) {
                    await supabase
                        .from('client_services')
                        .insert({
                            client_id: client.clientId,
                            service_id: service.serviceId
                        });
                }
            }
        }
    }

    return authId;
};

// Update authorization status
export const updateAuthorizationStatus = async (
    authId: string,
    status: AuthorizationStatus
): Promise<void> => {
    const { error } = await supabase
        .from('authorizations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', authId);

    if (error) throw error;
};

// Delete authorization
export const deleteAuthorization = async (authId: string): Promise<void> => {
    const { error } = await supabase
        .from('authorizations')
        .delete()
        .eq('id', authId);

    if (error) throw error;
};

// Get authorization templates
export const getAuthorizationTemplates = async (clinicId: string): Promise<AuthorizationTemplate[]> => {
    const { data, error } = await supabase
        .from('authorization_templates')
        .select('*')
        .eq('clinic_id', clinicId)
        .eq('is_active', true)
        .order('name');

    if (error) throw error;

    return (data || []).map(t => ({
        id: t.id,
        clinicId: t.clinic_id,
        name: t.name,
        description: t.description,
        services: t.services || [],
        isActive: t.is_active
    }));
};

// Create authorization template
export const createAuthorizationTemplate = async (
    clinicId: string,
    name: string,
    description: string,
    services: AuthorizationTemplateService[]
): Promise<string> => {
    const { data, error } = await supabase
        .from('authorization_templates')
        .insert({
            clinic_id: clinicId,
            name,
            description,
            services
        })
        .select('id')
        .single();

    if (error) throw error;
    return data.id;
};
