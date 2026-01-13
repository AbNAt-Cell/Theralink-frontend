'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronsRight,
  ChevronsLeft,
  Loader,
} from 'lucide-react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import {
  getAvailableServices,
  getClientServices,
  assignServicesToClient,
  removeServicesFromClient,
  Service,
  ClientService
} from '@/hooks/admin/services';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

export default function ServicesPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [assignedServices, setAssignedServices] = useState<ClientService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected items
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [selectedAssigned, setSelectedAssigned] = useState<string[]>([]);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, allServices, clientServices] = await Promise.all([
        getClientById(params.id),
        getAvailableServices(),
        getClientServices(params.id)
      ]);
      setClient(clientData);

      // Filter out already assigned services from available list
      const assignedServiceIds = clientServices.map(cs => cs.serviceId);
      const available = allServices.filter(s => !assignedServiceIds.includes(s.id));

      setAvailableServices(available);
      setAssignedServices(clientServices);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load services' });
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter available services based on search
  const filteredAvailable = availableServices.filter(s =>
    searchQuery.length < 2 ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle selection in available list
  const toggleAvailableSelection = (serviceId: string) => {
    setSelectedAvailable(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Toggle selection in assigned list
  const toggleAssignedSelection = (serviceId: string) => {
    setSelectedAssigned(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Move selected to assigned
  const moveToAssigned = async () => {
    if (selectedAvailable.length === 0) return;
    try {
      await assignServicesToClient(params.id, selectedAvailable);
      toast({ title: 'Success', description: 'Services assigned successfully' });
      setSelectedAvailable([]);
      loadData();
    } catch (error) {
      console.error('Error assigning services:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to assign services' });
    }
  };

  // Move selected to available
  const moveToAvailable = async () => {
    if (selectedAssigned.length === 0) return;
    try {
      await removeServicesFromClient(params.id, selectedAssigned);
      toast({ title: 'Success', description: 'Services removed successfully' });
      setSelectedAssigned([]);
      loadData();
    } catch (error) {
      console.error('Error removing services:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove services' });
    }
  };

  // Move all to assigned
  const moveAllToAssigned = async () => {
    const allIds = filteredAvailable.map(s => s.id);
    if (allIds.length === 0) return;
    try {
      await assignServicesToClient(params.id, allIds);
      toast({ title: 'Success', description: 'All services assigned successfully' });
      setSelectedAvailable([]);
      loadData();
    } catch (error) {
      console.error('Error assigning services:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to assign services' });
    }
  };

  // Move all to available
  const moveAllToAvailable = async () => {
    const allIds = assignedServices.map(cs => cs.serviceId);
    if (allIds.length === 0) return;
    try {
      await removeServicesFromClient(params.id, allIds);
      toast({ title: 'Success', description: 'All services removed successfully' });
      setSelectedAssigned([]);
      loadData();
    } catch (error) {
      console.error('Error removing services:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove services' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <AdminClientProfile client={client} />

      <h2 className='text-xl font-semibold'>Client Services</h2>

      {/* Search */}
      <div className='relative w-full md:w-64'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
        <input
          type='search'
          placeholder='Search Available Services...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors'
        />
      </div>

      {/* Two-panel layout with arrow buttons */}
      <div className='flex gap-4 items-start'>
        {/* Available Services */}
        <div className='flex-1 border rounded-md bg-white'>
          <div className='p-3 border-b bg-gray-50'>
            <h3 className='font-medium'>Available Services</h3>
          </div>
          <div className='max-h-[400px] overflow-y-auto'>
            {filteredAvailable.length === 0 ? (
              <div className='p-4 text-center text-gray-500 text-sm'>
                No available services found
              </div>
            ) : (
              filteredAvailable.map(service => (
                <div
                  key={service.id}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 text-sm ${selectedAvailable.includes(service.id) ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  onClick={() => toggleAvailableSelection(service.id)}
                >
                  <span className='text-blue-700'>({service.code} {service.name})</span>{' '}
                  <span className='text-gray-700'>{service.description}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Arrow buttons */}
        <div className='flex flex-col gap-2 pt-16'>
          <Button
            variant='outline'
            size='icon'
            onClick={moveToAssigned}
            disabled={selectedAvailable.length === 0}
            className='bg-green-50 hover:bg-green-100 border-green-300'
          >
            <ChevronRight className='h-4 w-4 text-green-600' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={moveToAvailable}
            disabled={selectedAssigned.length === 0}
            className='bg-red-50 hover:bg-red-100 border-red-300'
          >
            <ChevronLeft className='h-4 w-4 text-red-600' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={moveAllToAssigned}
            disabled={filteredAvailable.length === 0}
            className='bg-green-50 hover:bg-green-100 border-green-300'
          >
            <ChevronsRight className='h-4 w-4 text-green-600' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={moveAllToAvailable}
            disabled={assignedServices.length === 0}
            className='bg-red-50 hover:bg-red-100 border-red-300'
          >
            <ChevronsLeft className='h-4 w-4 text-red-600' />
          </Button>
        </div>

        {/* Assigned Services */}
        <div className='flex-1 border rounded-md bg-white'>
          <div className='p-3 border-b bg-gray-50'>
            <h3 className='font-medium'>Assigned Services ({assignedServices.length})</h3>
          </div>
          <div className='max-h-[400px] overflow-y-auto'>
            {assignedServices.length === 0 ? (
              <div className='p-4 text-center text-gray-500 text-sm'>
                No services assigned yet
              </div>
            ) : (
              assignedServices.map(cs => (
                <div
                  key={cs.id}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 text-sm ${selectedAssigned.includes(cs.serviceId) ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  onClick={() => toggleAssignedSelection(cs.serviceId)}
                >
                  <span className='text-blue-700'>({cs.service.code} {cs.service.name})</span>{' '}
                  <span className='text-gray-700'>{cs.service.description}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
