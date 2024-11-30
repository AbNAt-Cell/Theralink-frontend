'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { DatePickerWithRange } from '@/components/DatePickerWithRange'

interface Diagnosis {
  id: string;
  date: string;
  diagnosis: string;
  provider: string;
  dxCode: string;
  notes?: string;
}

export default function ClientDiagnosis() {
  const [searchTerm, setSearchTerm] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [startDate, setStartDate] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [endDate, setEndDate] = useState('');

  const diagnoses: Diagnosis[] = [
    {
      id: 'D001',
      date: '2024-01-15',
      diagnosis: 'Major Depressive Disorder',
      provider: 'Dr. John Smith',
      dxCode: 'D001',
    },
    {
      id: 'D002',
      date: '2023-12-01',
      diagnosis: 'Generalized Anxiety Disorder',
      provider: 'Dr. Sarah Johnson',
      dxCode: 'D002',
    },
    {
      id: 'D003',
      date: '2023-10-15',
      diagnosis: 'Insomnia',
      provider: 'Dr. John Smith',
      dxCode: 'D003',
    },
  ];

  const filteredDiagnoses = diagnoses.filter(diagnosis => {
    const matchesSearch = diagnosis.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diagnosis.dxCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDateRange = (!startDate || diagnosis.date >= startDate) &&
      (!endDate || diagnosis.date <= endDate);
    return matchesSearch && matchesDateRange;
  });

  return (
    <div className="container max-w-[1350px] mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-medium">Diagnosis History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search diagnoses..."
                  className="pl-8 w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <DatePickerWithRange />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {filteredDiagnoses.length} of {diagnoses.length} diagnoses
              </span>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Diagnosis</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Dx Code</TableHead>
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
                        <span className="text-xs font-medium">
                          {diagnosis.dxCode}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
