import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const ClientAppointments = () => {
  return (
    <div className="container max-w-[1350px] mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-medium">Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          

        </CardContent>
      </Card>
    </div>
  )
}

export default ClientAppointments