"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/types/calendar";
import { EventList } from "@/components/EventList";
import CalendarView from "@/components/CalendarView";
import { getAppointments } from "@/utils/apiClient"; // Make sure this path is correct
import Cookies from "js-cookie";

const ClientAppointments = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);

  useEffect(() => {
    if (!loggedInUser) {
      const user = Cookies.get("user");
      if (user) {
        try {
          const parsedUser = JSON.parse(user);
          setLoggedInUser(parsedUser);
        } catch (err) {
          console.error("Failed to parse user cookie", err);
        }
      }
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (!loggedInUser) return;
    const fetchAppointments = async () => {
      try {
        const data = await getAppointments(loggedInUser?.id); // Replace this
        // Map your data if necessary to match <Event> type
        setEvents(Array.isArray(data) ? data : [data]);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [loggedInUser]);

  return (
    <div className="container max-w-[1350px] mx-auto lg:p-6 space-y-6">
      <Card>
        <CardContent className="lg:flex">
          <div className="lg:w-80 border-b lg:border-b-none lg:border-r bg-background">
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
