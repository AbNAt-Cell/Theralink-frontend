'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Plus, Trash, ClipboardList, Calendar, CheckCircle, Clock, XCircle, Mail, Edit, Download } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import {
  getClientQuestionnaires,
  deleteClientQuestionnaire,
  addClientQuestionnaire,
  updateClientQuestionnaire,
  sendQuestionnaireEmail,
  ClientQuestionnaire
} from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';
import AddQuestionnaireModal, { QuestionnaireFormData } from '@/components/modals/AddQuestionnaireModal';
import SendQuestionnaireModal from '@/components/modals/SendQuestionnaireModal';
import ViewEditQuestionnaireModal, { QuestionnaireEditData } from '@/components/modals/ViewEditQuestionnaireModal';

interface PageProps {
  params: { id: string };
}

export default function QuestionnairePage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [questionnaires, setQuestionnaires] = useState<ClientQuestionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<ClientQuestionnaire | null>(null);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, questData] = await Promise.all([
        getClientById(params.id),
        getClientQuestionnaires(params.id)
      ]);
      setClient(clientData);
      setQuestionnaires(questData);
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
    if (!confirm('Are you sure you want to delete this questionnaire?')) return;

    setDeletingId(id);
    try {
      await deleteClientQuestionnaire(id);
      toast({ title: 'Success', description: 'Questionnaire deleted' });
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete questionnaire' });
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddQuestionnaire = async (data: QuestionnaireFormData) => {
    try {
      await addClientQuestionnaire({
        clientId: params.id,
        questionnaireName: data.templateName,
        questionnaireType: data.templateId,
        completedDate: data.completedDate,
        score: data.score,
        status: 'completed',
        notes: data.comments,
        answers: data.answers
      });
      toast({ title: 'Success', description: 'Questionnaire saved' });
      loadData();
    } catch (error) {
      console.error('Error saving questionnaire:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to save questionnaire' });
      throw error;
    }
  };

  const handleEditQuestionnaire = (quest: ClientQuestionnaire) => {
    setSelectedQuestionnaire(quest);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (data: QuestionnaireEditData) => {
    try {
      await updateClientQuestionnaire(data.id, {
        questionnaireName: data.questionnaireName,
        questionnaireType: data.questionnaireType,
        completedDate: data.completedDate,
        score: data.score,
        status: data.status,
        notes: data.notes
      });
      toast({ title: 'Success', description: 'Questionnaire updated' });
      loadData();
    } catch (error) {
      console.error('Error updating questionnaire:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to update questionnaire' });
      throw error;
    }
  };

  const handleSendQuestionnaire = async (templateId: string, templateName: string) => {
    if (!client?.email) {
      toast({ variant: 'destructive', title: 'Error', description: 'Client email not found' });
      return;
    }

    try {
      await sendQuestionnaireEmail(
        client.email,
        `${client.firstName} ${client.lastName}`,
        templateName,
        templateId
      );

      // Record the sent questionnaire as pending
      await addClientQuestionnaire({
        clientId: params.id,
        questionnaireName: templateName,
        questionnaireType: templateId,
        status: 'pending',
        notes: `Sent to client via email on ${new Date().toLocaleDateString()}`
      });

      toast({ title: 'Success', description: `Questionnaire sent to ${client.email}` });
      loadData();
    } catch (error) {
      console.error('Error sending questionnaire:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to send questionnaire' });
      throw error;
    }
  };

  const exportAllToCSV = () => {
    if (questionnaires.length === 0) return;

    const headers = ['Name', 'Type', 'Status', 'Date', 'Score', 'Notes'];
    const rows = questionnaires.map(q => [
      q.questionnaireName,
      q.questionnaireType || '',
      q.status,
      q.completedDate ? new Date(q.completedDate).toLocaleDateString() : '',
      q.score?.toString() || '',
      q.notes || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `questionnaires_${client?.firstName}_${client?.lastName}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({ title: 'Export Complete', description: 'All questionnaires exported to CSV' });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'expired': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
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
        <h2 className="text-xl font-semibold">Questionnaires</h2>
        <div className="flex gap-2">
          <Button
            className="bg-blue-900 hover:bg-blue-800"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Questionnaire
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsSendModalOpen(true)}
          >
            <Mail className="w-4 h-4 mr-2" />
            Send to Client
          </Button>
          {questionnaires.length > 0 && (
            <Button
              variant="outline"
              onClick={exportAllToCSV}
            >
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          )}
        </div>
      </div>

      {questionnaires.length === 0 ? (
        <div className="border rounded-md p-8 bg-white flex flex-col items-center justify-center min-h-[300px]">
          <div className="w-24 h-24 mb-4 flex items-center justify-center bg-gray-100 rounded-full">
            <ClipboardList className="w-12 h-12 text-gray-300" />
          </div>
          <p className="text-gray-500">No Questionnaires</p>
          <p className="text-gray-400 text-sm mt-1">Click &quot;Add Questionnaire&quot; to fill out an assessment or &quot;Send&quot; to email one to the client</p>
        </div>
      ) : (
        <div className="border rounded-lg bg-white overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-medium text-gray-600">Questionnaire</th>
                <th className="text-left p-4 font-medium text-gray-600">Type</th>
                <th className="text-left p-4 font-medium text-gray-600">Status</th>
                <th className="text-left p-4 font-medium text-gray-600">Date</th>
                <th className="text-left p-4 font-medium text-gray-600">Score</th>
                <th className="text-right p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questionnaires.map((quest) => (
                <tr key={quest.id} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="w-5 h-5 text-blue-500" />
                      <span className="font-medium">{quest.questionnaireName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{quest.questionnaireType || '-'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded capitalize ${getStatusColor(quest.status)}`}>
                      {getStatusIcon(quest.status)}
                      {quest.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {quest.completedDate ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(quest.completedDate).toLocaleDateString()}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="p-4 text-gray-600 font-medium">
                    {quest.score !== undefined && quest.score !== null ? quest.score : '-'}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditQuestionnaire(quest)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(quest.id)}
                        disabled={deletingId === quest.id}
                        className="text-red-500 hover:text-red-700"
                      >
                        {deletingId === quest.id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Questionnaire Modal */}
      <AddQuestionnaireModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddQuestionnaire}
        clientName={client ? `${client.firstName} ${client.lastName}` : ''}
      />

      {/* Send Questionnaire Modal */}
      <SendQuestionnaireModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        clientName={client ? `${client.firstName} ${client.lastName}` : ''}
        clientEmail={client?.email || ''}
        onSend={handleSendQuestionnaire}
      />

      {/* View/Edit Questionnaire Modal */}
      <ViewEditQuestionnaireModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedQuestionnaire(null);
        }}
        onSave={handleSaveEdit}
        questionnaire={selectedQuestionnaire}
        clientName={client ? `${client.firstName} ${client.lastName}` : ''}
      />
    </div>
  );
}
