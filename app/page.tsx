"use client";

import Link from "next/link";
import PricingSection from "@/components/PricingSection";
import { useI18n } from "@/lib/i18n";
import {
  Shield, Zap, Sparkles, Heart, Info, ArrowRight, Smile, UserCheck,
  CheckCircle, Check, XCircle, X, Mail
} from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F1115] text-slate-900 dark:text-white font-sans selection:bg-rose-500/30 overflow-x-hidden transition-colors duration-500">

      <main className="relative">
        {/* Premium Mesh Gradient Background */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, -50, 0],
              y: [0, -50, 100, 0],
              scale: [1, 1.2, 0.9, 1]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-rose-200/30 dark:bg-rose-500/10 blur-[120px] rounded-full"
          />
          <motion.div
            animate={{
              x: [0, -120, 80, 0],
              y: [0, 80, -120, 0],
              scale: [1, 0.8, 1.1, 1]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-blue-200/20 dark:bg-indigo-500/10 blur-[130px] rounded-full"
          />
        </div>

        {/* SECTION 1: HERO (5-Second Clarity) */}
        <section className="relative min-h-[95vh] flex items-center px-8 lg:px-24 py-32 overflow-hidden z-10">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">

            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-12"
            >
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-rose-500 dark:text-rose-400 text-xs font-black uppercase tracking-[0.5em] backdrop-blur-xl shadow-bubble"
                >
                  <Sparkles className="w-3.5 h-3.5" /> {t('home_v2_hero_badge')}
                </motion.div>

                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[110px] font-black tracking-tighter leading-[0.9] text-slate-900 dark:text-white break-words">
                  {t('home_v2_hero_title').split(' ').map((word, i) => (
                    <span key={i} className={word.toLowerCase().includes('accurate') || word.includes('แม่นยำ') || word.includes('正確') || word.includes('정확') ? 'bg-gradient-to-r from-rose-500 to-indigo-500 bg-clip-text text-transparent italic pr-4' : ''}>
                      {word}{' '}
                      {i === 1 && <br className="hidden lg:block" />}
                    </span>
                  ))}
                </h1>

                <p className="max-w-xl text-xl lg:text-2xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed tracking-tight opacity-90">
                  {t('home_v2_hero_subtitle')}
                </p>
              </div>

              <div className="flex flex-col gap-8 pt-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 flex-wrap">
                  <Link
                    href="/login"
                    className="px-12 py-6 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs lg:text-sm font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-bubbles shadow-primary/20 backdrop-blur-3xl group text-center"
                  >
                    <span className="flex items-center justify-center gap-3">
                      {t('home_v2_cta_start')} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="px-12 py-6 rounded-full bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 text-slate-900 dark:text-white text-xs lg:text-sm font-black uppercase tracking-[0.3em] hover:bg-white/60 transition-all backdrop-blur-3xl text-center"
                  >
                    {t('home_v2_cta_see')}
                  </Link>
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide text-center sm:text-left opacity-80">
                  {t('home_v2_hero_microcopy')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="relative hidden lg:flex items-center justify-center"
            >
              <div className="relative w-full max-w-[600px] aspect-square p-2 rounded-[60px] bg-white/10 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-[100px] shadow-soft-glass flex items-center justify-center overflow-hidden">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10 w-full h-full mix-blend-multiply dark:mix-blend-normal contrast-[1.05]"
                >
                  <img src="/hero-modern.png" alt="Visual Identity" className="w-full h-full object-contain drop-shadow-2xl block dark:hidden" />
                  <img src="/hero-modern-dark.png" alt="Visual Identity" className="w-full h-full object-contain drop-shadow-2xl hidden dark:block" />
                </motion.div>

                <div className="absolute bottom-8 right-8 p-6 bg-white/60 dark:bg-black/40 backdrop-blur-3xl rounded-[32px] border border-white/60 dark:border-white/10 shadow-bubble">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Ready</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2: WHAT THIS ACTUALLY DOES (Plain Language) */}
        <section id="what-it-does" className="relative px-8 lg:px-24 py-32 z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-24 items-start">
              <div className="space-y-6">
                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                  {t('home_v2_what_title')}
                </h2>
                <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-md font-medium">
                  {t('home_v2_what_desc')}
                </p>
              </div>
              <ul className="space-y-8">
                {[1, 2, 3].map((i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-6 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 flex items-center justify-center text-primary shadow-sm transition-transform group-hover:scale-110 shrink-0">
                      <CheckCircle className="w-7 h-7" />
                    </div>
                    <div className="pt-2">
                      <p className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-[0.02em]">
                        {t(`home_v2_what_item${i}` as any)}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE VISION (Why we built this) */}
        <section className="relative px-8 lg:px-24 py-48 z-10 bg-primary/[0.03] border-y border-primary/5 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-float-slow" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full animate-pulse-slow" />
          </div>

          <div className="max-w-4xl mx-auto text-center space-y-12 relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/60 dark:bg-white/10 text-primary text-[10px] font-black uppercase tracking-[0.4em] backdrop-blur-3xl shadow-bubble">
              <Heart className="w-4 h-4 fill-current" /> Founder's Vision
            </div>
            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9]">
              {t('home_v2_why_title')}
            </h2>
            <div className="relative">
              <p className="text-2xl lg:text-4xl text-slate-600 dark:text-slate-400 leading-relaxed font-bold italic tracking-tight opacity-90">
                "{t('home_v2_why_desc')}"
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: HOW IT WORKS (3 Simple Steps) */}
        <section id="how-it-works" className="relative px-8 lg:px-24 py-40 z-10">
          <div className="max-w-7xl mx-auto space-y-32">
            <div className="text-center space-y-6">
              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white decoration-primary underline underline-offset-8">
                {t('home_v2_how_title')}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-16 lg:gap-24">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative group">
                  <div className="text-[100px] lg:text-[160px] font-black text-primary/[0.04] dark:text-white/[0.03] absolute -top-24 lg:-top-32 -left-8 leading-none select-none italic">
                    0{i}
                  </div>
                  <div className="relative pt-8 space-y-6">
                    <p className="text-2xl lg:text-3xl font-black text-slate-800 dark:text-slate-200 tracking-tighter leading-[1.1] group-hover:text-primary transition-colors">
                      {t(`home_v2_how_step${i}` as any)}
                    </p>
                    <div className="w-12 h-1 bg-slate-200 dark:bg-white/10 rounded-full group-hover:w-24 transition-all duration-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5: BENEFITS (How you'll feel) */}
        <section className="relative px-8 lg:px-24 py-40 z-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85]">
                {t('home_v2_benefits_title')}
              </h2>
              <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 10 }}
                    className="p-8 rounded-[32px] bg-white/40 dark:bg-white/5 border border-white/60 dark:border-white/10 backdrop-blur-3xl flex items-center gap-8 shadow-sm"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <Zap className="w-7 h-7 fill-current" />
                    </div>
                    <p className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">
                      {t(`home_v2_benefit${i}` as any)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="aspect-[4/3] relative rounded-[64px] bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-white/5 dark:to-white/10 border border-white/40 dark:border-white/10 overflow-hidden shadow-soft-glass">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 bg-primary/5 dark:bg-white/5 rounded-full blur-[60px] animate-pulse" />
                </div>
                <div className="absolute top-12 left-12 p-8 bg-white/40 dark:bg-black/20 backdrop-blur-3xl rounded-[40px] border border-white/60 dark:border-white/10 shadow-bubble">
                  <div className="flex gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <div className="w-3 h-3 rounded-full bg-secondary" />
                    <div className="w-3 h-3 rounded-full bg-accent" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-2.5 w-40 bg-slate-200 dark:bg-white/10 rounded-full" />
                    <div className="h-2.5 w-32 bg-slate-200 dark:bg-white/10 rounded-full" />
                    <div className="h-2.5 w-48 bg-slate-200 dark:bg-white/5 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: CLARITY (For / Not For) */}
        <section className="relative px-8 lg:px-24 py-40 z-10 bg-slate-100/50 dark:bg-white/[0.01]">
          <div className="max-w-6xl mx-auto space-y-20">
            <div className="text-center space-y-4">
              <h2 className="text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
                {t('home_v2_clarity_title')}
              </h2>
            </div>
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="p-16 rounded-[56px] bg-white dark:bg-[#1A1D23] border border-slate-200 dark:border-white/10 space-y-12 h-full shadow-xl">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                    <CheckCircle className="w-3 h-3" /> {t('home_v2_for_title')}
                  </div>
                  <ul className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <li key={i} className="flex items-start gap-4">
                        <div className="mt-1 w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center text-secondary shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <p className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight leading-snug">
                          {t(`home_v2_for_item${i}` as any)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="p-16 rounded-[56px] bg-white/40 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">
                    <XCircle className="w-3 h-3" /> {t('home_v2_notfor_title')}
                  </div>
                  <ul className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <li key={i} className="flex items-start gap-4 grayscale opacity-50">
                        <div className="mt-1 w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-400 shrink-0">
                          <X className="w-3 h-3 stroke-[3]" />
                        </div>
                        <p className="text-lg font-bold text-slate-600 dark:text-slate-400 tracking-tight">
                          {t(`home_v2_notfor_item${i}` as any)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 & 8: RETURNING HOOK & HONESTY + FINAL CTA */}
        <section className="relative px-8 lg:px-24 py-48 z-10 overflow-hidden">
          <div className="max-w-5xl mx-auto text-center space-y-20">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-secondary/5 text-secondary text-xs font-black uppercase tracking-[0.4em]"
              >
                <Smile className="w-4 h-4" /> Returning Home
              </motion.div>
              <h2 className="text-6xl lg:text-[120px] font-black tracking-tighter text-slate-900 dark:text-white leading-[0.8]">
                {t('home_v2_returning_title')}
              </h2>
              <p className="text-2xl lg:text-3xl text-slate-500 dark:text-slate-400 font-bold tracking-tight max-w-2xl mx-auto leading-relaxed">
                {t('home_v2_returning_desc')}
              </p>
            </div>

            <div className="pt-12 space-y-16">
              <Link
                href="/login"
                className="inline-flex px-12 py-6 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs lg:text-sm font-black uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-bubbles shadow-primary/20 backdrop-blur-3xl"
              >
                {t('home_v2_cta_start')}
              </Link>

              <div className="flex flex-col items-center gap-6">
                <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-4 py-4 px-8 rounded-full border border-slate-100 dark:border-white/5">
                  <Shield className="w-5 h-5 text-emerald-500" fill="currentColor" fillOpacity={0.1} /> {t('home_v2_honesty')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: PRICING */}
        <PricingSection isHomePage={true} />
      </main>

      <footer className="py-32 px-8 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black relative z-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16">
          <div className="md:col-span-2 space-y-10">
            <Link href="/" className="flex items-center gap-4 group">
              <img src="/logo.png" alt="DYWGV" className="h-10 w-auto invert-0 dark:brightness-0 dark:invert" />
              <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">{t('brand_name')}</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed font-medium">
              {t('footer_desc')}
            </p>
          </div>

          <div className="space-y-8">
            <h5 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">{t('footer_resources_title')}</h5>
            <div className="flex flex-col gap-4">
              <Link href="/plans" className="text-sm font-black text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-white transition-colors uppercase tracking-widest">{t('footer_resource_plans')}</Link>
              <Link href="/studio" className="text-sm font-black text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-white transition-colors uppercase tracking-widest">{t('footer_resource_studio')}</Link>
              <Link href="/profiles" className="text-sm font-black text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-white transition-colors uppercase tracking-widest">{t('footer_resource_profiles')}</Link>
            </div>
          </div>

          <div className="space-y-8">
            <h5 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">{t('footer_contact_title')}</h5>
            <div className="flex flex-col gap-4">
              <a href="mailto:tangsopa.natchaya@gmail.com" className="text-sm font-black text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {t('footer_contact_support')}
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-32 pt-16 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-600">{t('footer_copyright')}</p>
          <div className="flex gap-12">
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-white transition-colors">{t('footer_link_privacy')}</Link>
            <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-white transition-colors">{t('footer_link_terms')}</Link>
          </div>
        </div>
      </footer>
    </div >
  );
}
