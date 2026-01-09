'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, getStoredUser } from '@/hooks/auth';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type UserContextType = {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();
    const router = useRouter();

    const refreshUser = async () => {
        setLoading(true);
        try {
            const userData = await getStoredUser();
            setUser(userData);
        } catch (error) {
            console.error('Error refreshing user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                refreshUser();
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
                router.push('/');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
