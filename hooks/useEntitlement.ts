import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { TIER_CONFIG } from "@/lib/entitlement";

export interface EntitlementState {
    isPro: boolean;
    tier: "free" | "premium";
    loading: boolean;
    usage: Record<string, number>;
}

export function useEntitlement() {
    const [state, setState] = useState<EntitlementState>({
        isPro: false,
        tier: "free",
        loading: true,
        usage: {},
    });

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setState((s) => ({ ...s, loading: false }));
                return;
            }

            // Parallel fetch: Subscription + Usage
            const [subRes, usageRes] = await Promise.all([
                supabase.from("subscriptions").select("tier, status").eq("user_id", user.id).maybeSingle(),
                supabase.from("usage_counters").select("feature_key, count").eq("user_id", user.id),
            ]);

            const tier = subRes.data?.tier || "free";
            const status = subRes.data?.status || "none";
            const isPro = tier === "premium" && status === "active";

            const usageMap: Record<string, number> = {};
            usageRes.data?.forEach((row) => {
                usageMap[row.feature_key] = row.count;
            });

            setState({
                isPro,
                tier: tier as "free" | "premium",
                loading: false,
                usage: usageMap,
            });
        }

        load();
    }, []);

    /**
     * Check if a feature is accessible.
     * NOTE: This is a frontend hint only. Real enforcement is on the backend.
     */
    const checkAccess = (feature: keyof typeof TIER_CONFIG.free) => {
        if (state.isPro) return { allowed: true, remaining: -1 };

        const limit = TIER_CONFIG.free[feature];
        if (limit === 0) return { allowed: false, remaining: 0, reason: "locked" };

        const current = state.usage[feature] || 0;
        return {
            allowed: current < limit,
            remaining: Math.max(0, limit - current),
            reason: current >= limit ? "limit_reached" : undefined,
        };
    };

    return { ...state, checkAccess };
}
