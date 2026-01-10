"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getStaffById } from '@/hooks/admin/staff';

interface StaffDetail {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    role: string;
    username?: string;
    gender?: string;
    date_of_birth?: string;
    position?: string;
    race?: string;
    position_effective_date?: string;
    site?: string;
}

export const useStaffData = () => {
    const params = useParams();
    const id = params.id as string;
    const [staff, setStaff] = useState<StaffDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        const fetchStaff = async () => {
            try {
                const data = await getStaffById(id);
                setStaff(data);
            } catch (error) {
                console.error("Error fetching staff:", error);
                setError("Failed to fetch staff data");
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, [id]);

    return { staff, loading, error, id };
};
