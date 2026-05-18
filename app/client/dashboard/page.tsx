'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Calendar, Cigarette, Dna, Globe, LoaderCircle, Phone } from 'lucide-react'
import UpdateClientSignatureForm from "@/components/forms/UpdateClientSignatureForm"
import ChangePinForm from "@/components/forms/ChangePinForm"

import { useState, useEffect } from "react"
import { useUser } from "@/context/UserContext"
import { getClientById, ClientProfile, updateClient } from "@/hooks/admin/client"
import Image from "next/image"
import { useClientDashboard } from "@/hooks/client/useClientDashboard"
import { format } from "date-fns"

export default function ClientDashboard() {
  const { user } = useUser();
  const [client, setClient] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Signatures & PINs state
  const [openClientSignature, setOpenClientSignature] = useState(false);
  const [openParentSignature, setOpenParentSignature] = useState(false);
  const [openClientPin, setOpenClientPin] = useState(false);
  const [openParentPin, setOpenParentPin] = useState(false);
  const [clientSignature, setClientSignature] = useState<string | null>(null);
  const [parentSignature, setParentSignature] = useState<string | null>(null);

  const { upcomingAppointments, pendingDocuments, completedDocuments, refresh: _refreshDashboardData, loading: dashboardLoading } = useClientDashboard();

  useEffect(() => {
    const fetchClientData = async () => {
      if (!user?.id) return;
      try {
        setLoading(true);
        const data = await getClientById(user.id);
        setClient(data);
        if (data.clientPin) setClientSignature('/placeholder-signature.png'); // Placeholder if PIN exists
        if (data.parentPin) setParentSignature('/placeholder-signature.png');
      } catch (error) {
        console.error("Error fetching client data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchClientData();
  }, [user]);

  const handleClientPinChange = async (oldPin: string, newPin: string) => {
    try {
        if (!client) return;
        await updateClient(client.id, { ...client, clientPin: newPin });
        const updated = await getClientById(client.id);
        setClient(updated);
        console.log('Successfully updated Client PIN');
    } catch (err) {
        console.error('Failed to change Client PIN', err);
    }
  };

  const handleParentPinChange = async (oldPin: string, newPin: string) => {
    try {
        if (!client) return;
        await updateClient(client.id, { ...client, parentPin: newPin });
        const updated = await getClientById(client.id);
        setClient(updated);
        console.log('Successfully updated Parent PIN');
    } catch (err) {
        console.error('Failed to change Parent PIN', err);
    }
  };

  if (loading || dashboardLoading) return <div className="p-8">Loading dashboard...</div>;
  if (!client) return <div className="p-8">Client profile not found.</div>;

  return (
    <div className="container max-w-[1350px] mx-auto p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Client Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Client Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-secondary">
                {client.clinicName || 'Clinic Name Not Set'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {client.address?.street || 'No Address Provided'}
              </p>
              <p className="text-sm text-muted-foreground">
                {client.address?.city ? `${client.address.city}, ${client.address.state || ''} ${client.address.zipCode || ''}` : ''}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 border rounded-lg p-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Calendar className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">DOB:</p>
                  <p className="font-medium">{client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 border rounded-lg p-2">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Cigarette className="w-7 h-7 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Smoking Status:
                  </p>
                  <p className="font-medium">{client.smokingStatus || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 border rounded-lg p-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Dna className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sex:</p>
                  <p className="font-medium">{client.gender || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 border rounded-lg p-2">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <LoaderCircle className="w-7 h-7 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ethnicity:</p>
                  <p className="font-medium">{client.ethnicity || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 border rounded-lg p-2">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Globe className="w-7 h-7 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Race:</p>
                  <p className="font-medium">{client.race || 'N/A'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Clinic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-secondary">
                {client.clinicName || 'Clinic Name Not Set'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {client.address?.street || 'No Address Provided'}
              </p>
              <p className="text-sm text-muted-foreground">
                {client.address?.city ? `${client.address.city}, ${client.address.state || ''} ${client.address.zipCode || ''}` : ''}
              </p>
              <div className="flex items-center gap-2 border rounded-lg p-2 mt-2 text-emerald-600">
                <Phone className="w-4 h-4" />
                <span>{client.phone || client.workPhone || 'No Phone on Record'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="font-medium">Client Signature</p>
                <div className="flex items-center justify-center border rounded-lg p-4 h-24 bg-gray-50">
                  {clientSignature ? (
                    <Image src={clientSignature} alt="Client Signature" height={100} width={100} className="h-full w-auto" />
                  ) : (
                    <p className="text-muted-foreground text-sm">No client signature available</p>
                  )}
                </div>
                <Dialog open={openClientSignature} onOpenChange={setOpenClientSignature}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      Update Signature
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Signature</DialogTitle>
                      <UpdateClientSignatureForm
                        onSignatureUpdate={(sig, pin) => {
                          setClientSignature(sig);
                          setOpenClientSignature(false);
                          console.log("Pin captured:", pin);
                        }}
                        onCancel={() => setOpenClientSignature(false)}
                      />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                
                {client.clientPin && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setOpenClientPin(true)}
                    >
                      Change PIN?
                    </Button>
                    <Dialog open={openClientPin} onOpenChange={setOpenClientPin}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Client PIN</DialogTitle>
                        </DialogHeader>
                        <ChangePinForm setOpen={setOpenClientPin} onPinChange={handleClientPinChange} />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>

              <div className="space-y-4">
                <p className="font-medium">Parent Signature</p>
                <div className="flex items-center justify-center border rounded-lg p-4 h-24 bg-gray-50">
                  {parentSignature ? (
                    <Image src={parentSignature} alt="Parent Signature" height={100} width={100} className="h-full w-auto" />
                  ) : (
                    <p className="text-muted-foreground text-sm">No parent signature available</p>
                  )}
                </div>
                <Dialog open={openParentSignature} onOpenChange={setOpenParentSignature}>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      Add Signature
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Parent Signature</DialogTitle>
                    </DialogHeader>
                    <UpdateClientSignatureForm
                      onSignatureUpdate={(sig, pin) => {
                        handleParentPinChange('', pin); // Save initial PIN
                        setParentSignature(sig);
                        setOpenParentSignature(false);
                      }}
                      onCancel={() => setOpenParentSignature(false)}
                    />
                  </DialogContent>
                </Dialog>
                {client.parentPin && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setOpenParentPin(true)}
                    >
                      Change PIN?
                    </Button>
                    <Dialog open={openParentPin} onOpenChange={setOpenParentPin}>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Change Parent PIN</DialogTitle>
                        </DialogHeader>
                        <ChangePinForm setOpen={setOpenParentPin} onPinChange={handleParentPinChange} />
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents Section */}
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending Documents</TabsTrigger>
              <TabsTrigger value="completed">Completed Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 border rounded-lg p-2">
                  <span className="text-sm text-muted-foreground">
                    Rows per page
                  </span>
                  <Select defaultValue="10">
                    <SelectTrigger className="w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="30">30</SelectItem>
                      <SelectItem value="40">40</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-sm text-muted-foreground">0-0 of 0</p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doc ID</TableHead>
                    <TableHead>Service Date</TableHead>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No pending documents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    pendingDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.id.substring(0,8)}...</TableCell>
                        <TableCell>{format(new Date(doc.date_of_service), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{doc.doc_type || doc.file_name || 'Document'}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Review & Sign</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="completed" className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doc ID</TableHead>
                    <TableHead>Service Date</TableHead>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedDocuments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        No completed documents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    completedDocuments.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.id.substring(0,8)}...</TableCell>
                        <TableCell>{format(new Date(doc.date_of_service), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{doc.doc_type || doc.file_name || 'Document'}</TableCell>
                        <TableCell>
                          <Button variant="secondary" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Upcoming Appointments Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="text-muted-foreground">
              No Upcoming Appointments in your calendar.
            </p>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appt) => (
                <div key={appt.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{format(new Date(appt.appointment_date + 'T' + appt.appointment_time), 'EEEE, MMMM do yyyy')}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date('1970-01-01T' + appt.appointment_time), 'h:mm a')} • {appt.appointment_type}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Provider: {appt.staff?.first_name} {appt.staff?.last_name}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline">Reschedule</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
