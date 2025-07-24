"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsRootRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/more/settings/clinic");
  }, [router]);
  return null;
}