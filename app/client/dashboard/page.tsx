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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Calendar, Cigarette, Dna, Globe, LoaderCircle, Phone } from 'lucide-react'
import UpdateClientSignatureForm from "@/components/forms/UpdateClientSignatureForm"

import { useState } from "react"

export default function ClientDashboard() {
  const [signature, setSignature] = useState<string | null>(null);

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
                Auspicious Community Service, LLC
              </h3>
              <p className="text-sm text-muted-foreground">
                305 FM 517 Road E.
              </p>
              <p className="text-sm text-muted-foreground">
                Dickinson, TX 77539-1628
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 border rounded-lg p-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Calendar className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">DOB:</p>
                  <p className="font-medium">06/05/1998</p>
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
                  <p className="font-medium">N/A</p>
                </div>
              </div>

              <div className="flex items-center gap-2 border rounded-lg p-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Dna className="w-7 h-7 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sex:</p>
                  <p className="font-medium">Male</p>
                </div>
              </div>

              <div className="flex items-center gap-2 border rounded-lg p-2">
                <div className="p-2 bg-violet-100 rounded-lg">
                  <LoaderCircle className="w-7 h-7 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ethnicity:</p>
                  <p className="font-medium">N/A</p>
                </div>
              </div>

              <div className="flex items-center gap-2 border rounded-lg p-2">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Globe className="w-7 h-7 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Race:</p>
                  <p className="font-medium">African</p>
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
                Auspicious Community Service, LLC
              </h3>
              <p className="text-sm text-muted-foreground">
                305 FM 517 Road E.
              </p>
              <p className="text-sm text-muted-foreground">
                Dickinson, TX 77539-1628
              </p>
              <div className="flex items-center gap-2 border rounded-lg p-2 mt-2 text-emerald-600">
                <Phone className="w-4 h-4" />
                <span>(832) 774-7144</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="font-medium">Client Signature</p>
                <div className="flex items-center justify-center border rounded-lg p-4 h-24 bg-gray-50">
                  {signature ? (
                    <img src={signature} alt="Client Signature" className="h-full w-auto" />
                  ) : (
                    <p className="text-muted-foreground text-sm">No signature available</p>
                  )}
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="w-full">
                      Update Signature
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Signature</DialogTitle>
                      <UpdateClientSignatureForm onSignatureUpdate={setSignature} />
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  className="w-full"
                >
                  Change PIN?
                </Button>
              </div>

              <div className="space-y-4">
                <p className="font-medium">Parent Signature</p>
                <div className="border rounded-lg p-4 h-24 bg-gray-50" />
                <Button variant="secondary" className="w-full">
                  Add Signature
                </Button>
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
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No documents found
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
            <TabsContent value="completed">
              {/* Similar table structure for completed documents */}
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
          <p className="text-muted-foreground">
            No Upcoming Appointments in your calendar.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
