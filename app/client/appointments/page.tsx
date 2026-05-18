'use client';

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { EventList } from '@/components/EventList'
import CalendarView from '@/components/CalendarView/index'
import { useClientAppointments } from '@/hooks/client/useClientAppointments'

const ClientAppointments = () => {
  const { events, loading, error } = useClientAppointments();

  if (loading) {
    return (
      <div className="container max-w-[1350px] mx-auto p-6 flex justify-center items-center h-[50vh]">
        <p className="text-muted-foreground">Loading your appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-[1350px] mx-auto p-6 flex justify-center items-center h-[50vh]">
        <p className="text-destructive">Failed to load appointments. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="container max-w-[1350px] mx-auto p-6 space-y-6">
      <Card>
        <CardContent className='flex p-0 overflow-hidden min-h-[700px]'>
          <div className="w-80 border-r bg-background">
            <EventList events={events} />
          </div>
          <div className="flex-1 bg-white">
            <CalendarView events={events} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ClientAppointments