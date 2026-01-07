"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { HelpCircle, MessageSquare, Star, Send } from "lucide-react";
import SideNav from "../dashboard/components/SideNav";
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";

export default function HelpFeedbackPage() {
    const { t } = useI18n();
    const [rating, setRating] = useState(5);
    const [feedback, setFeedback] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data.user));
    }, []);

    const faqs = [
        { q: "What is DYWGV?", a: "DYWGV is an Influence & Revenue system designed to turn attention into belief and trust." },
        { q: "How do I build authority?", a: "By consistently using your strategic Identity and focusing on Everyday Focus actions." },
        { q: "Can I manage multiple brands?", a: "Yes, multiple Identity profiles are supported on the Revenue System plan." },
    ];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;
        setSubmitting(true);
        const { error } = await supabase.from("user_feedback").insert({
            user_id: user.id,
            rating,
            feedback_text: feedback,
        });
        setSubmitting(false);
        if (!error) {
            setSubmitted(true);
            setFeedback("");
        }
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 transition-colors duration-700">
            <SideNav userEmail={user?.email} isPro={false} />

            <main className="flex-1 lg:ml-72 p-8 lg:p-20 max-w-5xl mx-auto space-y-16 relative overflow-hidden">
                {/* Decorative Blobs */}
                <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full -mr-80 -mt-80 pointer-events-none z-0" />
                <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 blur-[100px] rounded-full -ml-64 -mb-64 pointer-events-none z-0" />

                <div className="relative z-10 space-y-12">
                    <header className="border-b border-border pb-12">
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-foreground mb-4">
                            System Intel & <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Feedback</span>
                        </h1>
                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-muted">
                            Refining the architecture of influence.
                        </p>
                    </header>

                    {/* FAQ Section */}
                    <section className="space-y-8">
                        <h2 className="text-lg font-black uppercase tracking-widest text-slate-800 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-pastel-blue/20 flex items-center justify-center text-pastel-blue">
                                <HelpCircle className="w-4 h-4" />
                            </span>
                            Intelligence Base
                        </h2>
                        <div className="grid gap-6">
                            {faqs.map((faq, i) => (
                                <div key={i} className="bg-white/60 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-bubble hover:shadow-executive transition-all duration-300">
                                    <h3 className="font-heading font-bold text-lg text-slate-800 mb-3">{faq.q}</h3>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <Separator />

                    {/* Feedback Section */}
                    <section className="space-y-8">
                        <h2 className="text-lg font-black uppercase tracking-widest text-slate-800 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-pastel-pink/20 flex items-center justify-center text-pastel-pink">
                                <MessageSquare className="w-4 h-4" />
                            </span>
                            Architectural Input
                        </h2>

                        {submitted ? (
                            <div className="bg-emerald-50/50 p-12 rounded-[32px] border border-emerald-100/50 text-center shadow-sm max-w-2xl mx-auto">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                                    ✓
                                </div>
                                <h3 className="font-black text-xl text-emerald-800 uppercase tracking-tight mb-2">Intel Received</h3>
                                <p className="text-sm font-medium text-emerald-600 mb-8">Your feedback has been logged into the system. Thank you for contributing to the evolution.</p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="px-6 py-3 rounded-full bg-white border border-emerald-200 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 hover:bg-emerald-50 transition-colors shadow-sm"
                                >
                                    Submit more intel
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[48px] border border-slate-50 shadow-bubble space-y-10 max-w-3xl">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block">System Performance Rating</label>
                                    <div className="flex gap-3">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setRating(s)}
                                                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${rating >= s
                                                    ? 'bg-gradient-to-br from-pastel-pink to-pastel-purple text-white shadow-pastel-pink/30 scale-105'
                                                    : 'bg-slate-50 text-slate-200 hover:bg-slate-100'
                                                    }`}
                                            >
                                                <Star className={`w-6 h-6 ${rating >= s ? 'fill-current' : ''}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] ml-2 block">Direct Observations</label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Report issues or suggest optimizations..."
                                        className="w-full h-40 p-6 rounded-[32px] border border-slate-100 bg-slate-50 font-medium text-slate-700 placeholder:text-slate-300 focus:bg-white focus:ring-4 focus:ring-pastel-pink/10 focus:border-pastel-pink/30 transition-all text-sm outline-none resize-none shadow-inner"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-pastel-pink to-pastel-purple text-white rounded-[24px] text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-bubble shadow-pastel-pink/20 transition-all"
                                >
                                    {submitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Transmitting...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Submit Intel
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

function Separator() {
    return <div className="h-px bg-slate-100 w-full" />;
}
