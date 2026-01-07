"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SideNav from "../dashboard/components/SideNav";
import { BrandProfile } from "@/types/app";
import { getSubscriptionStatus } from "@/lib/subscription";
import { useI18n } from "@/lib/i18n";
import PricingSection from "@/components/PricingSection";

export default function PlansPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [isPro, setIsPro] = useState(false);

  // Load Session (for SideNav context)
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setUserId(user.email || "");

      // Check Subscription
      const { isPro: proStatus } = await getSubscriptionStatus(user.id);
      setIsPro(proStatus);

      const { data: settings } = await supabase
        .from("user_settings")
        .select("active_profile_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if ((settings as any)?.active_profile_id) {
        const { data: activeP } = await supabase
          .from("brand_profiles")
          .select("*")
          .eq("id", (settings as any).active_profile_id)
          .maybeSingle();

        if (activeP) setProfile(activeP as BrandProfile);
      }
      setLoading(false);
    }
    load();
  }, [router]);


  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground selection:bg-pastel-pink/30 transition-colors duration-500">
      <SideNav userEmail={userId} activeProfile={profile} isPro={isPro} />

      <main className="flex-1 lg:ml-68 min-h-screen p-8 lg:p-20 flex flex-col items-center relative overflow-hidden">
        {/* Decorative Pastels */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-pastel-blue/5 blur-[150px] rounded-full -mr-96 -mt-96 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-pastel-pink/5 blur-[150px] rounded-full -ml-96 -mb-96 pointer-events-none" />

        <div className="max-w-6xl w-full pt-12 pb-40 relative z-10 text-center">
          {/* Header */}
          <div className="max-w-4xl mx-auto mb-24 space-y-8">
            <div className="inline-flex items-center rounded-full bg-pastel-purple/10 border border-pastel-purple/20 px-8 py-3 text-xs font-black tracking-[0.4em] text-pastel-purple uppercase shadow-sm">
              PRO PROTOCOL
            </div>
            <h1 className="text-6xl lg:text-8xl font-black leading-tight tracking-tighter text-slate-800 dark:text-white">
              {t('price_hero_title')}
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-black leading-relaxed max-w-2xl mx-auto uppercase tracking-widest">
              {t('price_hero_sub')}
            </p>

            {/* Pricing Section Component */}
            <div className="mt-[-80px]"> {/* Negative margin to pull it up into the layout flow */}
              <PricingSection />
            </div>

            <p className="text-center text-slate-400 dark:text-slate-600 text-xs font-black uppercase tracking-[0.6em] mt-32">
              {t('price_stripe_note')}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

