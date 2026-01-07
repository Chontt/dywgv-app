"use client";

import { useI18n } from "@/lib/i18n";
import { Lock, Sparkles, Crown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function UpgradeCard() {
    const { t } = useI18n();
    const router = useRouter();

    return (
        <div className="bg-gradient-to-br from-primary to-secondary rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between h-full group shadow-bubble shadow-primary/20 transition-all duration-700">
            {/* Dynamic Background - Unisex Refinement */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-[60px] -mr-10 -mt-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-[50px] -ml-10 -mb-10" />

            <div className="relative z-20 space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                    <Crown className="w-6 h-6 text-white fill-white/20" />
                </div>

                <div>
                    <h3 className="font-black text-2xl tracking-tight leading-none mb-2 drop-shadow-sm">{t('upgrade_title')}</h3>
                    <p className="text-[11px] text-white/90 font-black uppercase tracking-widest leading-relaxed drop-shadow-sm">
                        {t('upgrade_desc')}
                    </p>
                </div>
            </div>

            <div className="relative z-10 pt-6 space-y-3">
                <div className="space-y-2">
                    {[t('upgrade_feat_1'), t('upgrade_feat_2'), t('upgrade_feat_3')].map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/70">
                            <Lock className="w-3 h-3" /> {feature}
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => router.push('/plans')}
                    className="w-full py-4 bg-white text-primary rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-white/90 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                >
                    {t('upgrade_cta')}
                </button>
            </div>
        </div>
    );
}
