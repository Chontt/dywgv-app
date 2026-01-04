import { supabase } from "@/lib/supabase";

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'free';

export async function getSubscriptionStatus(userId: string): Promise<{ isPro: boolean; status: SubscriptionStatus }> {
    if (!userId) return { isPro: false, status: 'free' };

    const { data: sub, error } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', userId)
        .in('status', ['active', 'trialing'])
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

    if (error) {
        console.error("Error fetching subscription:", error);
        return { isPro: false, status: 'free' };
    }

    if (sub) {
        return { isPro: true, status: sub.status as SubscriptionStatus };
    }

    return { isPro: false, status: 'free' };
}
