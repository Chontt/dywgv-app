"use client";

import { useEffect, useState } from 'react';

export type PlanData = {
    plan: 'free' | 'pro';
    isPro: boolean;
    limits: {
        generationsPerDay: number;
        projectsLimit: number;
        profilesLimit: number;
    };
    usage: {
        generationsToday: number;
        totalProjects: number;
    };
    user: {
        id: string;
        email: string;
    };
};

export function usePlan() {
    const [data, setData] = useState<PlanData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlan = async () => {
        try {
            const res = await fetch('/api/me');
            if (!res.ok) throw new Error('Failed to fetch plan');
            const json = await res.json();
            setData(json);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlan();
    }, []);

    return {
        ...data,
        loading,
        error,
        refreshPlan: fetchPlan
    };
}
