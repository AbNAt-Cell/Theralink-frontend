'use client'

import React, { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const ClientCarePlan = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showCompleted, setShowCompleted] = useState(false)

  const carePlanData = [
    {
      id: 'CP001',
      client: 'John Doe',
      assignedStaff: 'Dr. Smith',
      planStartDate: '2023-06-01',
      planDuration: '3 months',
      primaryGoal: 'Reduce anxiety symptoms',
      medicationPlan: 'Sertraline 50mg daily',
      appointment: 'Weekly therapy sessions',
      status: 'Active'
    },
    {
      id: 'CP002',
      client: 'Jane Smith',
      assignedStaff: 'Dr. Johnson',
      planStartDate: '2023-05-15',
      planDuration: '6 months',
      primaryGoal: 'Manage depression',
      medicationPlan: 'Fluoxetine 20mg daily',
      appointment: 'Bi-weekly check-ins',
      status: 'Completed'
    }
  ]

  const filteredCarePlanData = useMemo(() => {
    return carePlanData.filter(plan => 
      (showCompleted || plan.status === 'Active') &&
      Object.values(plan).some(value => 
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [carePlanData, searchTerm, showCompleted])

  return (
    <div className="container max-w-[1350px] mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-medium">Care Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row justify-between gap-4 mb-4'>
            <div className='flex flex-col md:flex-row gap-4'>
              <div className="flex items-center space-x-2">
                <Switch 
                  id="show-completed" 
                  checked={showCompleted}
                  onCheckedChange={setShowCompleted}
                />
                <Label htmlFor="show-completed">Show Closed/Completed Plan</Label>
              </div>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-2.5 text-gray-500" />
                <Input 
                  className='mt-0 pl-10 w-full' 
                  placeholder="Find medications, appointments, or goals"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Showing {filteredCarePlanData.length} of {carePlanData.length} care plans
              </span>
            </div>
          </div>
          <Table className="rounded-md border">
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Assigned Staff</TableHead>
                <TableHead>Plan Start Date</TableHead>
                <TableHead>Plan Duration</TableHead>
                <TableHead>Primary Goal</TableHead>
                <TableHead>Medication Plan</TableHead>
                <TableHead>Appointment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCarePlanData.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell>{plan.id}</TableCell>
                  <TableCell>{plan.client}</TableCell>
                  <TableCell>{plan.assignedStaff}</TableCell>
                  <TableCell>{plan.planStartDate}</TableCell>
                  <TableCell>{plan.planDuration}</TableCell>
                  <TableCell>{plan.primaryGoal}</TableCell>
                  <TableCell>{plan.medicationPlan}</TableCell>
                  <TableCell>{plan.appointment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default ClientCarePlan