'use client';

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { EventList } from '@/components/EventList'
import CalendarView from '@/components/CalendarView/index'
import { Button } from '@/components/ui/button'
import { PlusIcon, Loader2, CalendarX } from 'lucide-react'
import { useCalendarData } from '@/hooks/useCalendarData'

const AdminCalendar = () => {
  const { events, loading, error } = useCalendarData();

  if (loading) {
    return (
      <div className="container max-w-[1350px] mx-auto space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center h-[600px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              <p className="text-gray-500">Loading calendar...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-[1350px] mx-auto space-y-6">
        <Card>
          <CardContent className="flex items-center justify-center h-[600px]">
            <div className="flex flex-col items-center gap-3 text-red-500">
              <CalendarX className="w-12 h-12" />
              <p>Failed to load calendar: {error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-[1350px] mx-auto space-y-6">
      <Card>
        <CardContent className='flex'>
          <div className=" border-r bg-background">
            <div className='p-4 border-b'>
              <Button className='w-full gap-2'>
                <PlusIcon className="mr-2 h-4 w-4" />
                Add New Event
              </Button>
            </div>
            <EventList events={events} />
          </div>
          <div className="flex-1">
            <CalendarView events={events} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminCalendar