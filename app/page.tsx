"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import StartGenerateButton from "./components/StartGenerateButton";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

function Hero() {
  const { t } = useI18n();

  return (
    <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-7xl flex-col items-center justify-center px-6 py-10 lg:flex-row lg:justify-between lg:py-20 relative overflow-hidden">

      {/* Abstract Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pastel-lavender/30 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-70 animate-pulse" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pastel-mint/30 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-60" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pastel-peach/30 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-60" />

      {/* Left copy */}
      <section className="max-w-xl space-y-8 relative z-10 text-center lg:text-left">
        <div className="inline-flex items-center rounded-full border border-white/60 bg-white/40 backdrop-blur-md px-4 py-1.5 text-xs font-semibold tracking-wide text-indigo-900 shadow-glass">
          {t("home_badge")}
        </div>

        <h1 className="font-heading text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
          <span className="block">{t("home_title_main").split(" ").slice(0, 3).join(" ")}</span>
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            {t("home_title_main").split(" ").slice(3).join(" ")}
          </span>
        </h1>

        <p className="text-lg leading-relaxed text-slate-600 sm:text-xl font-medium max-w-lg mx-auto lg:mx-0">
          {t("home_subtitle")}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
          <StartGenerateButton />

          <Link
            href="/plans"
            className="inline-flex items-center justify-center rounded-full border border-white/60 bg-white/50 backdrop-blur-sm px-8 py-4 text-base font-semibold text-slate-700 shadow-glass transition hover:bg-white/80 hover:scale-105 active:scale-95"
          >
            {t("home_cta_plans")}
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-6 pt-4 border-t border-slate-200/50">
          <div>
            <p className="font-heading text-2xl font-bold text-slate-800">{t("stats_time")}</p>
            <p className="text-sm text-slate-500 font-medium">{t("stats_time_desc")}</p>
          </div>
          <div>
            <p className="font-heading text-2xl font-bold text-slate-800">{t("stats_tone")}</p>
            <p className="text-sm text-slate-500 font-medium">{t("stats_tone_desc")}</p>
          </div>
        </div>
      </section>

      {/* Right Visual */}
      <section className="mt-16 w-full max-w-xl lg:mt-0 relative perspective-1000">

        {/* Floating 3D Object */}
        <div className="absolute -top-20 -right-20 w-96 h-96 animate-float opacity-90 mix-blend-overlay pointer-events-none select-none z-0">
          {/* Fallback visual if image load fails or just extra decorative blob */}
        </div>

        <div className="relative z-10 animate-float" style={{ animationDelay: "1s" }}>
          <Image
            src="/hero-3d-abstract.png"
            alt="3D Glass Shape"
            width={600}
            height={600}
            className="drop-shadow-2xl opacity-90"
            priority
          />
        </div>

        {/* Glass Card Overlay */}
        <div className="absolute -bottom-10 -left-10 w-80 rounded-3xl border border-white/50 bg-white/30 backdrop-blur-xl p-5 shadow-glass backdrop-saturate-150 animate-float z-20" style={{ animationDelay: "2s" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-pastel-lavender to-purple-200 flex items-center justify-center text-lg shadow-inner font-bold text-purple-700">R</div>
            <div>
              <p className="text-xs font-bold text-slate-800">{t("preview_reel")}</p>
              <p className="text-[10px] text-slate-500">{t("preview_created")}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-2 w-3/4 rounded-full bg-white/60" />
            <div className="h-2 w-1/2 rounded-full bg-white/60" />
            <div className="h-2 w-full rounded-full bg-white/40" />
          </div>
          <div className="mt-4 flex gap-2">
            <span className="text-[10px] px-2 py-1 rounded-full bg-indigo-100/50 text-indigo-700 font-medium">#coffee</span>
            <span className="text-[10px] px-2 py-1 rounded-full bg-pink-100/50 text-pink-700 font-medium">#morning</span>
          </div>
        </div>
      </section>
    </div>
  );
}

function HowItWorks() {
  const { t } = useI18n();

  return (
    <section className="py-24 bg-white/50 backdrop-blur-sm border-t border-slate-200/50 relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute -left-40 top-20 w-96 h-96 bg-pastel-mint/20 rounded-full blur-[100px] -z-10 animate-pulse" />

      <div className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl font-bold text-slate-900 sm:text-4xl mb-6">
            {t('hiw_title')}
          </h2>
        </div>

        {/* 3 Step Process */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent z-0" />

          {/* Step 1 */}
          <div className="relative z-10 text-center group">
            <div className="relative w-full aspect-square max-w-[240px] mx-auto bg-gradient-to-b from-white/80 to-white/40 rounded-3xl shadow-glass flex items-center justify-center mb-8 border border-white/60 group-hover:scale-105 transition-transform duration-500 overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100/50 to-purple-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Image src="/step-1.png" alt="Step 1" width={200} height={200} className="object-contain drop-shadow-xl relative z-10 mix-blend-multiply" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">{t('hiw_s1_title')}</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-base leading-relaxed">{t('hiw_s1_desc')}</p>
          </div>

          {/* Step 2 */}
          <div className="relative z-10 text-center group">
            <div className="relative w-full aspect-square max-w-[240px] mx-auto bg-gradient-to-b from-white/80 to-white/40 rounded-3xl shadow-glass flex items-center justify-center mb-8 border border-white/60 group-hover:scale-105 transition-transform duration-500 delay-75 overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-100/50 to-emerald-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Image src="/step-2.png" alt="Step 2" width={200} height={200} className="object-contain drop-shadow-xl relative z-10 mix-blend-multiply" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors">{t('hiw_s2_title')}</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-base leading-relaxed">{t('hiw_s2_desc')}</p>
          </div>

          {/* Step 3 */}
          <div className="relative z-10 text-center group">
            <div className="relative w-full aspect-square max-w-[240px] mx-auto bg-gradient-to-b from-white/80 to-white/40 rounded-3xl shadow-glass flex items-center justify-center mb-8 border border-white/60 group-hover:scale-105 transition-transform duration-500 delay-150 overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-100/50 to-orange-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <Image src="/step-3.png" alt="Step 3" width={200} height={200} className="object-contain drop-shadow-xl relative z-10 mix-blend-multiply" />
            </div>
            <h3 className="font-heading text-2xl font-bold text-slate-800 mb-3 group-hover:text-rose-600 transition-colors">{t('hiw_s3_title')}</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-base leading-relaxed">{t('hiw_s3_desc')}</p>
          </div>
        </div>

        {/* Why Use This - Benefits Grid */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[t('hiw_why_1'), t('hiw_why_2'), t('hiw_why_3'), t('hiw_why_4')].map((benefit, i) => (
              <div key={i} className="flex items-center justify-center gap-2 p-3 bg-white/60 rounded-xl border border-slate-100 shadow-sm">
                <span className="text-emerald-600 font-bold text-sm">✓</span>
                <span className="text-sm font-semibold text-slate-700">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg font-heading font-bold text-indigo-900/80 italic">
              "{t('hiw_closing')}"
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

function ContactFounder() {
  const { t } = useI18n();
  const [rating, setRating] = useState<number | null>(null);

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-xl mx-auto px-6 text-center">

        {/* Title & Desc */}
        <h2 className="font-heading text-2xl font-bold text-slate-900 mb-3">
          {t('feedback_title')}
        </h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          {t('feedback_desc')}
        </p>

        {/* Feedback Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-left">

          {/* Rate */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              {t('feedback_label_rate')}
            </label>
            <div className="flex gap-2 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-10 h-10 rounded-lg border text-sm font-bold transition-all ${rating === star
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                >
                  {star}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="mb-6">
            <textarea
              className="w-full h-24 p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition resize-none"
              placeholder={t('feedback_placeholder')}
            />
          </div>

          {/* Founder Email */}
          <div className="text-sm text-slate-500 mb-6 pt-4 border-t border-slate-100">
            <p className="mb-1">{t('feedback_contact_label')}</p>
            <a href="mailto:tangsopa.natchaya@gmail.com" className="text-indigo-600 font-medium hover:underline flex items-center gap-2">
              tangsopa.natchaya@gmail.com
            </a>
          </div>

          <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition active:scale-[98%] shadow-md shadow-indigo-200">
            {t('feedback_btn_send')}
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">
            {t('feedback_closing')}
          </p>

        </div>

      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <Hero />
      <HowItWorks />
      <ContactFounder />
    </main>
  );
}
