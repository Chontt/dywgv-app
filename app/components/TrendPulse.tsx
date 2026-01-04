"use client";

import { useEffect, useState } from "react";

const TRENDS = [
    { type: "🔥 Hook", text: "POV: You found the best solution for...", growth: "+120%" },
    { type: "🎵 Audio", text: "Sunkissed (High RPM remix)", growth: "+85%" },
    { type: "💡 Idea", text: "Behind the scenes of your morning routine", growth: "+45%" },
    { type: "🔥 Hook", text: "Stop doing [X] if you want [Y]...", growth: "+200%" },
    { type: "🎵 Audio", text: "Golden Hour - Piano Ver.", growth: "+60%" },
];

export default function TrendPulse() {
    const [offset, setOffset] = useState(0);

    // Simple auto-scroll effect
    useEffect(() => {
        const timer = setInterval(() => {
            setOffset((prev) => (prev + 1) % (TRENDS.length * 100)); // Just a rough continuous scroll simulation
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full overflow-hidden bg-slate-900 text-white/90 py-2 border-b border-white/10 relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 z-10" />

            <div className="flex items-center gap-8 animate-infinite-scroll whitespace-nowrap pl-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 shrink-0">
                    🔴 LIVE PULSE
                </span>
                {/* Double the list for infinite loop illusion */}
                {[...TRENDS, ...TRENDS, ...TRENDS].map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-medium shrink-0">
                        <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${t.type.includes('Hook') ? 'bg-indigo-500/20 text-indigo-300' : 'bg-pink-500/20 text-pink-300'}`}>
                            {t.type}
                        </span>
                        <span>{t.text}</span>
                        <span className="text-emerald-400 text-[10px]">{t.growth}</span>
                        <span className="text-white/20 mx-2">•</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
