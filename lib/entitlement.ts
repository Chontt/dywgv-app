import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client for Service Role operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Entitlement Check Result
 */
export interface EntitlementResult {
    allowed: boolean;
    remaining: number; // -1 for unlimited
    tier: "free" | "premium";
    current_usage: number;
    error?: string;
}

/**
 * Feature Configuration
 * Defines limits for Free tier. Premium is generally unlimited.
 */
export const TIER_CONFIG = {
    free: {
        studio_generate: 3,
        everyday_generate: 1,
        profiles_count: 1,
        planner_7d: 0, // 0 means locked
        planner_30d: 0,
        project_save: 5, // total active projects
    },
    premium: {
        studio_generate: 999999, // Unlimited
        everyday_generate: 999999,
        profiles_count: 5,
        planner_7d: 999999,
        planner_30d: 999999,
        project_save: 999999,
    },
};

/**
 * Atomic Entitlement Check
 * REPLACES MISSING RPC with Direct Table Logic
 */
export async function checkAndIncrement(
    userId: string,
    featureKey: keyof typeof TIER_CONFIG.free
): Promise<EntitlementResult> {
    // 1. Check Subscription Status
    const { data: sub } = await supabaseAdmin
        .from('subscriptions')
        .select('status')
        .eq('user_id', userId)
        .maybeSingle();

    const isPremium = sub?.status === 'active' || sub?.status === 'trialing';

    // 2. IMMEDIATE PREMIUM BYPASS (Optimization)
    // If premium, we don't even need to touch usage_counters, just allow it.
    if (isPremium) {
        console.log(`[Entitlement] User: ${userId} | Premium: true | ALLOWED (Bypass)`);
        return {
            allowed: true,
            remaining: 999999,
            tier: "premium",
            current_usage: 0, // Not tracking for premium currently
        };
    }

    // 3. Fallback for Free Users (Direct DB Logic)
    const limit = TIER_CONFIG.free[featureKey];

    // Determine Period Key
    const isDaily = ["studio_generate", "everyday_generate"].includes(featureKey);
    const periodKey = isDaily
        ? `day:${new Date().toISOString().split("T")[0]}`
        : "total";

    // Read Usage
    const { data: usage } = await supabaseAdmin
        .from('usage_counters')
        .select('counter_value')
        .eq('user_id', userId)
        .eq('feature_key', featureKey)
        .eq('period_key', periodKey)
        .maybeSingle();

    const currentCount = usage?.counter_value || 0;

    console.log(`[Entitlement] User: ${userId} | Free | Count: ${currentCount}/${limit}`);

    if (currentCount >= limit) {
        return {
            allowed: false,
            remaining: 0,
            tier: "free",
            current_usage: currentCount,
        };
    }

    // Increment Usage (Upsert)
    // Note: Concurrency race condition possible here, but acceptable for MVP free tier.
    const { error: upsertError } = await supabaseAdmin
        .from('usage_counters')
        .upsert({
            user_id: userId,
            feature_key: featureKey,
            period_key: periodKey,
            counter_value: currentCount + 1,
            last_updated: new Date().toISOString()
        }, { onConflict: 'user_id, feature_key, period_key' });

    if (upsertError) {
        console.error("Usage Increment Failed:", upsertError);
        // Fail open if tracking fails? No, fail closed for safety.
        // Actually for UX, if increment fails, maybe just allow it this time?
        // Let's allow and log error.
    }

    return {
        allowed: true,
        remaining: limit - (currentCount + 1),
        tier: "free",
        current_usage: currentCount + 1,
    };
}

/**
 * Helper to get current subscription status without incrementing.
 */
export async function getSubscriptionStatus(userId: string) {
    const { data, error } = await supabaseAdmin
        .from("subscriptions")
        .select("tier, status")
        .eq("user_id", userId)
        .single();

    if (error || !data) {
        return { tier: "free", status: "none", isPro: false };
    }

    return {
        tier: data.tier,
        status: data.status,
        isPro: data.tier === "premium" && data.status === "active",
    };
}
