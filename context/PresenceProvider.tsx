"use client";

import { createClient } from "@/utils/supabase/client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

type PresenceContextType = {
    onlineUsers: Set<string>;
};

const PresenceContext = createContext<PresenceContextType>({
    onlineUsers: new Set(),
});

export const usePresence = () => useContext(PresenceContext);

export default function PresenceProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const { user } = useUser();
    const supabase = createClient();

    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase.channel("online-users", {
            config: {
                presence: {
                    key: user.id,
                },
            },
        });

        channel
            .on("presence", { event: "sync" }, () => {
                const newState = channel.presenceState();
                const users = new Set<string>();

                // newState is an object where keys are user IDs (from the 'key' config) 
                // and values are arrays of presence objects.
                Object.keys(newState).forEach((key) => {
                    users.add(key);
                });

                setOnlineUsers(users);
            })
            .on("presence", { event: "join" }, ({ key, newPresences }) => {
                setOnlineUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.add(key);
                    return newSet;
                });
            })
            .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
                setOnlineUsers((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(key);
                    return newSet;
                });
            })
            .subscribe(async (status) => {
                if (status === "SUBSCRIBED") {
                    await channel.track({
                        online_at: new Date().toISOString(),
                        user_id: user.id,
                    });
                }
            });

        return () => {
            channel.unsubscribe();
        };
    }, [user?.id]);

    return (
        <PresenceContext.Provider value={{ onlineUsers }}>
            {children}
        </PresenceContext.Provider>
    );
}
