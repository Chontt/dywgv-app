"use client";

import { useI18n } from "@/lib/i18n";
import { Skeleton } from "./Skeleton";
import { Lock, TrendingUp, TrendingDown } from "lucide-react";

type StatCardProps = {
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    locked?: boolean;
    loading?: boolean;
    onClick?: () => void;
};

export default function StatCard({ label, value, trend, trendUp, locked, loading, onClick }: StatCardProps) {
    const { t } = useI18n();
    return (
        <div
            onClick={onClick}
            className={`bg-surface/40 backdrop-blur-xl p-6 rounded-[32px] border border-border space-y-3 hover:shadow-bubble transition-all duration-700 relative group ${locked ? 'opacity-60 saturate-50' : 'hover:-translate-y-2'} ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[40px]" />

            {locked && (
                <div className="absolute top-6 right-6 bg-background/50 text-muted p-2 rounded-2xl border border-border">
                    <Lock className="w-3.5 h-3.5" />
                </div>
            )}

            <div className="space-y-2 relative z-10">
                <p className="text-[10px] font-black font-sans text-muted uppercase tracking-[0.3em]">{label}</p>
                <div className={`text-5xl font-black tracking-tighter ${locked ? 'text-muted select-none' : 'text-foreground'}`}>
                    {loading ? <Skeleton className="h-12 w-28 bg-surface" /> : value}
                </div>
            </div>

            <div className="flex items-center justify-between relative z-10">
                {trend ? (
                    <div className="flex items-center gap-3">
                        {loading ? (
                            <Skeleton className="h-5 w-20 bg-surface" />
                        ) : (
                            <>
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${trendUp ? 'bg-secondary/20 text-secondary' : 'bg-red-500/10 text-red-400'}`}>
                                    {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {trend}
                                </div>
                                <span className="text-[9px] font-bold text-muted uppercase tracking-widest">{t('dash_vs_last_week') || "vs last week"}</span>
                            </>
                        )}
                    </div>
                ) : <div />}

                {locked && (
                    <div className="text-[9px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        {t('dash_upgrade_unlock') || "Unlock Protocol"}
                    </div>
                )}
            </div>
        </div>
    );
}
