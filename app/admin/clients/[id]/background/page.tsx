'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminClientProfile from '@/components/AdminClientProfile';
import { Button } from '@/components/ui/button';
import { Loader, Edit, FileText, Heart, Users, Briefcase, GraduationCap, Scale, Wine } from 'lucide-react';
import { getClientById, ClientProfile } from '@/hooks/admin/client';
import { getClientBackground, ClientBackground } from '@/hooks/admin/client-pages';
import { useToast } from '@/hooks/Partials/use-toast';

interface PageProps {
  params: { id: string };
}

const sectionConfig = [
  { type: 'medical', label: 'Medical History', icon: Heart, color: 'text-red-500' },
  { type: 'social', label: 'Social History', icon: Users, color: 'text-blue-500' },
  { type: 'family', label: 'Family History', icon: Users, color: 'text-purple-500' },
  { type: 'education', label: 'Education History', icon: GraduationCap, color: 'text-green-500' },
  { type: 'employment', label: 'Employment History', icon: Briefcase, color: 'text-orange-500' },
  { type: 'legal', label: 'Legal History', icon: Scale, color: 'text-gray-500' },
  { type: 'substance', label: 'Substance Use History', icon: Wine, color: 'text-amber-500' },
];

export default function BackgroundPage({ params }: PageProps) {
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [background, setBackground] = useState<ClientBackground[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [clientData, bgData] = await Promise.all([
        getClientById(params.id),
        getClientBackground(params.id)
      ]);
      setClient(clientData);
      setBackground(bgData);
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

  const getBackgroundContent = (sectionType: string) => {
    return background.find(b => b.sectionType === sectionType)?.content || '';
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
        <h2 className="text-xl font-semibold">Background</h2>
      </div>

      <div className="space-y-4">
        {sectionConfig.map(({ type, label, icon: Icon, color }) => {
          const content = getBackgroundContent(type);
          return (
            <div key={type} className="border rounded-lg bg-white overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <span className="font-medium">{label}</span>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
              <div className="p-4">
                {content ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400">
                    <FileText className="w-4 h-4" />
                    <span>No {label.toLowerCase()} recorded</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
