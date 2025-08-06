"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/types/calendar";
import { EventList } from "@/components/EventList";
import CalendarView from "@/components/CalendarView";
import { getAppointments } from "@/utils/apiClient"; // Make sure this path is correct

const ClientAppointments = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments("patient123"); // Replace this
        // Map your data if necessary to match <Event> type
        setEvents(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="container max-w-[1350px] mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="flex">
          <div className="w-80 border-r bg-background">
            <EventList events={events} error={error} loading={loading} />
          </div>
          <div className="flex-1">
            <CalendarView events={events} error={error} loading={loading} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientAppointments;
