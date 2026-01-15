'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Plus, Trash, Users, Phone, Mail, AlertTriangle, CheckCircle, Edit } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientContacts, deleteClientContact, addClientContact, ClientContact } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';
import AddContactModal, { ContactFormData } from '@/components/modals/AddContactModal';

interface PageProps {
  params: { id: string };
}

export default function ContactRelationsPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [contacts, setContacts] = useState<ClientContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, contactData] = await Promise.all([
        getClientById(params.id),
        getClientContacts(params.id)
      ]);
      setClient(clientData);
      setContacts(contactData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  }, [params.id, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this contact?')) return;

    setDeletingId(id);
    try {
      await deleteClientContact(id);
      toast({ title: 'Success', description: 'Contact removed' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to remove contact' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddContact = async (data: ContactFormData) => {
    try {
      // Build full address from address, city, state
      const fullAddress = [data.address, data.city, data.state]
        .filter(Boolean)
        .join(', ');

      await addClientContact({
        clientId: params.id,
        contactName: `${data.firstName} ${data.lastName}`,
        relationship: data.relationship,
        phone: data.phoneNo,
        address: fullAddress,
        isEmergencyContact: data.isEmergencyContact,
        isAuthorizedContact: data.isAuthorizedContact,
        canPickup: data.canPickup,
        notes: data.comments
      });
      toast({ title: 'Success', description: 'Contact added' });
      loadData();
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to add contact' });
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminClientProfile client={client} />

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Contacts & Relations</h2>
        <Button
          className="bg-blue-900 hover:bg-blue-800"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <Users className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-500">No Contacts Added</p>
          <p className="text-gray-400 text-sm mt-1">Click &quot;Add Contact&quot; to add emergency contacts or relations</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{contact.contactName}</span>
                      {contact.isEmergencyContact && (
                        <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                          <AlertTriangle className="w-3 h-3" />
                          Emergency
                        </span>
                      )}
                      {contact.isAuthorizedContact && (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          <CheckCircle className="w-3 h-3" />
                          Authorized
                        </span>
                      )}
                    </div>
                    {contact.relationship && (
                      <p className="text-sm text-gray-500 capitalize">{contact.relationship}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                      {contact.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {contact.phone}
                        </div>
                      )}
                      {contact.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {contact.email}
                        </div>
                      )}
                    </div>
                    {contact.address && (
                      <p className="text-sm text-gray-500 mt-2">{contact.address}</p>
                    )}
                    {contact.canPickup && (
                      <p className="text-xs text-green-600 mt-2">✓ Can pick up client</p>
                    )}
                    {contact.notes && (
                      <p className="text-sm text-gray-400 mt-2 italic">{contact.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                    disabled={deletingId === contact.id}
                    className="text-red-500 hover:text-red-700"
                  >
                    {deletingId === contact.id ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddContact}
      />
    </div>
  );
}
