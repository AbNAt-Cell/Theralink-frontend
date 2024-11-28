'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { FileText, Search } from "lucide-react"
import DiagnosisForm from '@/components/forms/DiagnosisForm'

interface Diagnosis {
  id: string;
  date: string;
  diagnosis: string;
  provider: string;
  status: 'active' | 'inactive';
  notes?: string;
}

export default function ClientDiagnosis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);

  // Mock data - replace with actual API call
  const diagnoses: Diagnosis[] = [
    {
      id: 'D001',
      date: '2024-01-15',
      diagnosis: 'Major Depressive Disorder',
      provider: 'Dr. John Smith',
      status: 'active',
    },
    {
      id: 'D002',
      date: '2023-12-01',
      diagnosis: 'Generalized Anxiety Disorder',
      provider: 'Dr. Sarah Johnson',
      status: 'active',
    },
    {
      id: 'D003',
      date: '2023-10-15',
      diagnosis: 'Insomnia',
      provider: 'Dr. John Smith',
      status: 'inactive',
    },
  ];

  const filteredDiagnoses = diagnoses.filter(diagnosis => {
    const matchesSearch = diagnosis.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || diagnosis.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddDiagnosis = (data: Omit<Diagnosis, 'id'>) => {
    console.log('Adding new diagnosis:', data);
    // Add API call to create diagnosis
  };

  const handleEditDiagnosis = (data: Omit<Diagnosis, 'id'>) => {
    if (!selectedDiagnosis) return;
    console.log('Updating diagnosis:', { id: selectedDiagnosis.id, ...data });
    // Add API call to update diagnosis
  };

  const handleViewDetails = (diagnosis: Diagnosis) => {
    setSelectedDiagnosis(diagnosis);
    setOpenEditDialog(true);
  };

  return (
    <div className="container max-w-[1350px] mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-medium">Diagnosis History</CardTitle>
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Add Diagnosis
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Diagnosis</DialogTitle>
                <DialogDescription>
                  Enter the details of the new diagnosis.
                </DialogDescription>
              </DialogHeader>
              <DiagnosisForm setOpen={setOpenAddDialog} onSubmit={handleAddDiagnosis} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search diagnoses..."
                  className="pl-8 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                value={selectedStatus}
                onValueChange={setSelectedStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {filteredDiagnoses.length} of {diagnoses.length} diagnoses
              </span>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiagnoses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No diagnoses found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDiagnoses.map((diagnosis) => (
                    <TableRow key={diagnosis.id}>
                      <TableCell>{new Date(diagnosis.date).toLocaleDateString()}</TableCell>
                      <TableCell>{diagnosis.diagnosis}</TableCell>
                      <TableCell>{diagnosis.provider}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          diagnosis.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {diagnosis.status.charAt(0).toUpperCase() + diagnosis.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(diagnosis)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Diagnosis</DialogTitle>
            <DialogDescription>
              Update the diagnosis details.
            </DialogDescription>
          </DialogHeader>
          {selectedDiagnosis && (
            <DiagnosisForm
              setOpen={setOpenEditDialog}
              onSubmit={handleEditDiagnosis}
              initialData={selectedDiagnosis}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
