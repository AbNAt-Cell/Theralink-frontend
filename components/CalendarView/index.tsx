'use client'

import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Event } from '@/types/calendar'

import "./styles.css"

const CalendarView = ({ events }: { events: Event[] }) => {
  return (
    <div className='w-full h-full p-4'>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'today prev,next',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
        events={events}
        eventContent={renderEventContent}
        eventClick={function(info) {
          console.log(info.event);
          //display a modal with the event details

          
        }}
      />
    </div>
  )
}

function renderEventContent(eventInfo: any) {
  return(
    <div className='flex flex-col text-black text-xs overflow-hidden'>
      <b>{eventInfo.event.extendedProps.time}</b>
      <i className='text-sm'>{eventInfo.event.title}</i>
      <i className='text-sm'>{eventInfo.event.extendedProps.location}</i>
    </div>
  )
}

export default CalendarView