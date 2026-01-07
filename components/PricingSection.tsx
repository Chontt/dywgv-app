"use client";

import { useState } from "react";
import { CheckIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { motion } from "framer-motion";

interface PricingSectionProps {
    isHomePage?: boolean;
    onUpgrade?: () => void; // Optional handler if we want to override default behavior
}

export default function PricingSection({ isHomePage = false, onUpgrade }: PricingSectionProps) {
    const { t, locale } = useI18n();
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
    const [loading, setLoading] = useState(false);

    const handleUpgradeClick = async () => {
        if (onUpgrade) {
            onUpgrade();
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    interval: billingCycle,
                    locale: locale
                }),
            });

            if (!res.ok) throw new Error('Checkout failed');
            const { url } = await res.json();
            window.location.href = url;
        } catch (error) {
            console.error(error);
            setLoading(false);
            // Optional: Show error toast
        }
    };

    return (
        <section className={`relative px-4 lg:px-24 ${isHomePage ? 'py-40' : 'py-12'} z-10 overflow-hidden`}>
            <div className="max-w-6xl mx-auto text-center space-y-16">

                {/* Header (Only if on homepage, plans page has its own) */}
                {isHomePage && (
                    <div className="space-y-6 max-w-3xl mx-auto">
                        <div className="inline-flex items-center rounded-full bg-pastel-purple/10 border border-pastel-purple/20 px-8 py-3 text-xs font-black tracking-[0.4em] text-pastel-purple uppercase shadow-sm">
                            PRO PROTOCOL
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
                            {t('price_hero_title') || "Investing in your authority."}
                        </h2>
                        <p className="text-xl text-slate-500 dark:text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto tracking-tight">
                            {t('price_hero_sub') || "Stop trading time for content. Build a scalable asset."}
                        </p>
                    </div>
                )}

                {/* Toggle */}
                <div className="flex items-center justify-center gap-4 bg-white dark:bg-slate-950 border border-slate-50 dark:border-slate-800 p-2.5 rounded-[40px] w-fit mx-auto shadow-bubble">
                    <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`px-10 py-5 rounded-full text-sm font-black uppercase tracking-[0.3em] transition-all duration-500 ${billingCycle === 'monthly' ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        {t('price_toggle_monthly')}
                    </button>
                    <button
                        onClick={() => setBillingCycle("yearly")}
                        className={`px-10 py-5 rounded-full text-sm font-black uppercase tracking-[0.3em] transition-all duration-500 relative ${billingCycle === 'yearly' ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-lg' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'}`}
                    >
                        {t('price_toggle_yearly')}
                        <span className="absolute -top-8 -right-6 bg-gradient-to-r from-pastel-pink to-pastel-purple text-white text-xs font-black px-4 py-1.5 rounded-full shadow-bubble animate-float">20% OFF</span>
                    </button>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl mx-auto items-stretch text-left">

                    {/* Free Plan */}
                    <div className="bg-white dark:bg-slate-800 rounded-[64px] p-12 lg:p-16 border border-slate-100 dark:border-slate-700 flex flex-col relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-500">
                        <div className="mb-12">
                            <div className="text-xs font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.5em] mb-6">Entry Protocol</div>
                            <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4">{t('price_free_title')}</h3>
                            <div className="flex items-baseline gap-3 mt-6">
                                <span className="text-7xl font-black text-slate-800 dark:text-white">$0</span>
                                <span className="text-slate-500 dark:text-slate-500 font-black uppercase text-xs tracking-widest">{t('price_forever')}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-8 leading-relaxed font-black uppercase tracking-widest">
                                {t('price_free_desc')}
                            </p>
                        </div>

                        <div className="space-y-8 mb-16 flex-1">
                            <FeatureItem text={t('price_free_f1')} />
                            <FeatureItem text={t('price_free_f2')} />
                            <FeatureItem text={t('price_free_f3')} />
                        </div>

                        <button className="w-full py-7 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-sm uppercase tracking-[0.4em] text-slate-600 dark:text-slate-400 hover:border-slate-800 dark:hover:border-slate-200 hover:text-slate-800 dark:hover:text-white transition-all duration-500 shadow-sm">
                            {t('price_free_cta')}
                        </button>
                    </div>

                    {/* Authority Plan */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-white dark:bg-slate-800 rounded-[64px] p-12 lg:p-16 border border-transparent dark:border-slate-700 flex flex-col relative overflow-hidden shadow-2xl group"
                    >
                        {/* Internal Accent */}
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pastel-blue/10 rounded-full blur-[100px] -mr-48 -mt-48 pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>

                        <div className="mb-12 relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-xs font-black text-pastel-pink uppercase tracking-[0.5em]">{t('price_recommended')}</div>
                                <div className="w-12 h-12 rounded-full bg-pastel-pink/10 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-pastel-pink animate-ping" /></div>
                            </div>
                            <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4">{t('price_pro_title')}</h3>
                            <div className="flex items-baseline gap-3 mt-6 text-slate-800 dark:text-white">
                                <span className="text-7xl font-black">{billingCycle === 'monthly' ? t('price_pro_monthly') : t('price_pro_yearly')}</span>
                                <span className="text-slate-200 font-black uppercase text-xs tracking-widest">{t('price_per_month')}</span>
                            </div>
                            <p className="text-sm text-slate-400 mt-8 leading-relaxed font-black uppercase tracking-widest">
                                {t('price_pro_desc')}
                            </p>
                        </div>

                        <div className="space-y-8 mb-16 flex-1 relative z-10">
                            <FeatureItem text={t('price_pro_f1')} active />
                            <FeatureItem text={t('price_pro_f2')} active />
                            <FeatureItem text={t('price_pro_f3')} active />
                            <FeatureItem text={t('price_pro_f4')} active />
                            <FeatureItem text={t('price_pro_guarantee')} active />
                        </div>

                        <button
                            onClick={handleUpgradeClick}
                            disabled={loading}
                            className={`w-full py-7 rounded-full bg-gradient-to-r from-pastel-pink to-pastel-purple text-white font-black text-sm uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-bubble shadow-pastel-pink/20 relative z-10 flex items-center justify-center gap-4 group ${loading ? 'opacity-70 cursor-wait' : ''}`}
                        >
                            {loading ? "Processing..." : (isHomePage ? "See Plans" : t('price_pro_cta'))} {!loading && <span className="text-xl group-hover:translate-x-2 transition-transform">→</span>}
                        </button>
                    </motion.div>

                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto mt-32 text-left pb-20">
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-16 text-center">{t('price_faq_title')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-4">
                                <h4 className="text-lg font-black text-slate-700 dark:text-slate-200">{t(`price_faq_${i}_q`)}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                    {t(`price_faq_${i}_a`)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FeatureItem({ text, active = false }: { text: string, active?: boolean }) {
    return (
        <div className="flex items-center gap-5 group/item">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${active ? 'bg-pastel-pink/10 text-pastel-pink shadow-sm' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 group-hover/item:bg-slate-800 dark:group-hover/item:bg-slate-700 group-hover/item:text-white'}`}>
                <CheckIcon className="w-4 h-4" />
            </div>
            <span className={`text-[14px] font-black uppercase tracking-widest ${active ? 'text-slate-600 dark:text-slate-300' : 'text-slate-300 dark:text-slate-500 group-hover/item:text-slate-800 dark:group-hover/item:text-white'} transition-colors`}>{text}</span>
        </div>
    );
}
