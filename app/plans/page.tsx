"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SideNav from "../dashboard/components/SideNav";
import { BrandProfile } from "@/types/app";
import { getSubscriptionStatus } from "@/lib/subscription";
import { useI18n } from "@/lib/i18n";

export default function PlansPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<BrandProfile | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
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

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      // Price ID map (You must replace these with your REAL Stripe Price IDs)
      const priceIds = {
        monthly: "price_1Qgb94GqA2A...PLACEHOLDER",
        yearly: "price_1Qgb9RGqA2A...PLACEHOLDER"
      };

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: priceIds[billingCycle],
          userId: userId,
          email: userId,
          billingCycle
        })
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error("Server returned non-JSON response. This usually means a configuration error.");
      }

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(`Upgrade failed: ${data.error || response.statusText}`);
      }
    } catch (error: any) {
      console.error(error);
      alert(`Something went wrong: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <SideNav userEmail={userId} activeProfile={profile} isPro={isPro} />

      <main className="flex-1 lg:ml-64 min-h-screen bg-slate-50 p-8 flex flex-col items-center">

        <div className="max-w-5xl w-full pt-12 pb-24">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="font-heading text-4xl font-bold text-slate-900 mb-4">
              {t('price_hero_title')}
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              {t('price_hero_sub')}
            </p>

            {/* Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>{t('price_toggle_monthly')}</span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                
                aria-label={billingCycle === 'monthly' ? t('price_toggle_switch_to_yearly') : t('price_toggle_switch_to_monthly')}
                title={billingCycle === 'monthly' ? t('price_toggle_switch_to_yearly') : t('price_toggle_switch_to_monthly')}
                className="w-14 h-8 bg-slate-200 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-300 ${billingCycle === 'monthly' ? 'left-1' : 'left-7'}`}></div>
              </button>
              <span className={`text-sm font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>
                {t('price_toggle_yearly')} <span className="text-green-600 text-xs ml-1 bg-green-50 px-2 py-0.5 rounded-full">{t('price_save_badge')}</span>
              </span>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* Free Plan */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 flex flex-col relative overflow-hidden">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{t('price_free_title')}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900">$0</span>
                  <span className="text-slate-400 font-medium">{t('price_forever')}</span>
                </div>
                <p className="text-sm text-slate-500 mt-4 leading-relaxed">
                  {t('price_free_desc')}
                </p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                <FeatureItem text={t('price_free_f1')} />
                <FeatureItem text={t('price_free_f2')} />
                <FeatureItem text={t('price_free_f3')} />
                <FeatureItem text={t('price_pro_guarantee')} />
              </div>

              <button className="w-full py-4 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                {t('price_free_cta')}
              </button>
            </div>

            {/* Authority Plan */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 flex flex-col relative overflow-hidden shadow-2xl shadow-indigo-200">
              {/* Gradient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-20 -mr-16 -mt-16 pointer-events-none"></div>

              <div className="mb-6 relative z-10">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  {t('price_pro_title')}
                  <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">{t('price_recommended')}</span>
                </h3>
                <div className="flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-bold">{billingCycle === 'monthly' ? t('price_pro_monthly') : t('price_pro_yearly')}</span>
                  <span className="text-slate-400 font-medium">{t('price_per_month')}</span>
                </div>
                <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                  {t('price_pro_desc')}
                </p>
              </div>

              <div className="space-y-4 mb-8 flex-1 relative z-10">
                <FeatureItem text={t('price_pro_f1')} light />
                <FeatureItem text={t('price_pro_f2')} light />
                <FeatureItem text={t('price_pro_f3')} light />
                <FeatureItem text={t('price_pro_f4')} light />
                <FeatureItem text={t('price_pro_guarantee')} light />
              </div>

              <button
                onClick={handleUpgrade}
                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-500/30 relative z-10 active:scale-95"
              >
                {t('price_pro_cta')} &rarr;
              </button>
            </div>

          </div>

          <p className="text-center text-slate-400 text-xs mt-12">
            {t('price_stripe_note')}
          </p>

        </div>
      </main>
    </div>
  );
}

function FeatureItem({ text, light = false }: { text: string, light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <svg className={`w-5 h-5 flex-shrink-0 ${light ? 'text-indigo-400' : 'text-indigo-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span className={`text-sm font-medium ${light ? 'text-slate-200' : 'text-slate-600'}`}>{text}</span>
    </div>
  );
}
