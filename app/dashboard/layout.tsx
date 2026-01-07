import { ReactNode } from "react";
import DashboardShell from "./components/DashboardShell";
import { getSubscriptionStatus } from "@/lib/subscription";
import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Direct check with authenticated client (Helper uses unauth client on server)
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .maybeSingle();

    const isPro = !!sub;

    // Fetch user's profiles
    const { data: profiles } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    // Use the first profile as active (or logic to find 'last active' if added later)
    const activeProfile = profiles && profiles.length > 0 ? profiles[0] : null;

    return (
        <DashboardShell userEmail={user.email} activeProfile={activeProfile as any} isPro={isPro}>
            {children}
        </DashboardShell>
    );
}
