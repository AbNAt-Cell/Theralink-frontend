"use client";

import React from "react";
import Link from "next/link";

interface SettingsSidebarProps {
  links: { label: string; value: string; href: string }[];
  active: string;
  className?: string;
  onSelect?: (value: string) => void;
}

export const settingsLinks = [
  { label: "Clinic", value: "clinic", href: "/admin/more/settings/clinic" },
  { label: "Appointment Reminders", value: "appointment-reminders", href: "/admin/more/settings/appointment-reminders" },
  { label: "Calendar Settings", value: "calendar-settings", href: "/admin/more/settings/calendar-settings" },
  { label: "Client Flags", value: "client-flags", href: "/admin/more/settings/client-flags" },
  { label: "Client Status", value: "client-status", href: "/admin/more/settings/client-status" },
  { label: "Notification Settings", value: "notification-settings", href: "/admin/more/settings/notification-settings" },
];

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ links, active, className, onSelect }) => {
  return (
    <div className={`bg-white rounded-sm border w-full max-w-xs h-[400px] p-4 flex flex-col justify-start ${className || ""}`}>
      <h2 className="text-2xl font-semibold mb-6 mt-4 ml-4">Setting</h2>
      <ul className="flex flex-col gap-2">
        {links.map(link => (
          <li key={link.value} className="flex">
            {onSelect ? (
              <button
                className={`w-full text-left px-3 py-2 rounded-md transition-colors font-medium text-base ${active === link.value ? "bg-blue-100 text-blue-900 ml-8" : "hover:bg-gray-100 text-gray-700 ml-0"}`}
                style={{ outline: "none" }}
                onClick={() => onSelect(link.value)}
              >
                {link.label}
              </button>
            ) : (
              <Link href={link.href} legacyBehavior passHref>
                <a
                  className={`w-full block text-left px-4 py-2 rounded-md transition-colors font-medium text-base ${active === link.value ? "bg-blue-100 text-blue-900 ml-4" : "hover:bg-gray-100 text-gray-700 ml-0"}`}
                  style={{ outline: "none" }}
                >
                  {link.label}
                </a>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsSidebar;
