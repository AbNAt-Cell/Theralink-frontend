"use client";
import { useParams } from "next/navigation";
import SettingsSidebar, { settingsLinks } from "../partials/sidebar";
import ClinicDetails from "../partials/clinic";
import AppointmentReminders from "../partials/appointmentReminders";
import CalendarSettings from "../partials/calendarSettings";
import ClientFlags from "../partials/clientFlags";
import ClientStatus from "../partials/clientStatus";
import NotificationSettings from "../partials/notificationSettings";

export default function SettingsSectionPage() {
  const params = useParams();
  const section = Array.isArray(params.section) ? params.section[0] : params.section;

  let content = null;
  if (section === "clinic") {
    content = <ClinicDetails />;
  } else if (section === "appointment-reminders") {
    content = <AppointmentReminders />;
  } else if (section === "calendar-settings") {
    content = <CalendarSettings />;
  } else if (section === "client-flags") {
    content = <ClientFlags />;
  } else if (section === "client-status") {
    content = <ClientStatus />;
  } else if (section === "notification-settings") {
    content = <NotificationSettings />;
  } else {
    content = (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-xl h-full">
        Coming soon: {section?.replace(/-/g, " ")}
      </div>
    );
  }

  return (
    <div className="flex gap-8 w-full min-h-screen mt-2">
      <SettingsSidebar links={settingsLinks} active={section} />
      <div className="flex-1">{content}</div>
    </div>
  );
} 