import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Event } from '@/types/calendar'
import { EventList } from '@/components/EventList'
import CalendarView from '@/components/CalendarView/index'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

const events: Event[] = [
  {
    id: '1',
    title: 'Client Meeting',
    date: '2025-03-04',
    time: '07:15 AM',
    location: '96 Davion Mission Suite 157',
    image: '/placeholder.svg?height=400&width=600',
    type: 'client-meeting'
  },
  {
    id: '90',
    title: 'Client Meeting',
    date: '2025-03-06',
    time: '01:15 AM',
    location: '96 Davion Mission Suite 157',
    image: '/placeholder.svg?height=400&width=600',
    type: 'client-meeting'
  },
  {
    id: '2',
    title: 'Weekend Festival',
    date: '2025-03-23',
    time: '01:00 PM',
    location: '823 Monte Flats Suite 158',
    type: 'festival'
  },
  {
    id: '3',
    title: 'Glastonbury Festival',
    date: '2025-03-25',
    time: '08:30 PM',
    location: '646 Walter Road Apt. 571',
    type: 'festival'
  },
  {
    id: '4',
    title: 'Ultra Europe 2019',
    date: '2025-03-28',
    time: '10:00 PM',
    location: '956 Satterfield Tunnel Apt. 965',
    type: 'festival'
  }
]



const AdminCalendar = () => {
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