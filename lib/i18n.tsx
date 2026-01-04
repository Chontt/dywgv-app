"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import en from "@/messages/en.json";
import th from "@/messages/th.json";
import ja from "@/messages/ja.json";
import ko from "@/messages/ko.json";

export type Lang = "en" | "th" | "ja" | "ko";

const dictionaries: Record<Lang, Record<string, string>> = {
  en,
  th,
  ja,
  ko,
};

type I18nContextType = {
  locale: Lang;
  setLocale: (lang: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [mounted, setMounted] = useState(false);

  function updateHtmlLang(newLang: Lang) {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang;
      document.documentElement.classList.remove('lang-en', 'lang-th', 'lang-ja', 'lang-ko');
      document.documentElement.classList.add(`lang-${newLang}`);
    }
  }

  useEffect(() => {
    const initLang = async () => {
      // 1. Try local storage first (fastest)
      const saved = localStorage.getItem("app_lang") as Lang;
      if (saved && ["en", "th", "ja", "ko"].includes(saved)) {
        setLangState(saved);
        updateHtmlLang(saved);
      }

      // 2. Try Supabase user settings
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: settings } = await supabase
          .from("user_settings")
          .select("preferred_language")
          .eq("user_id", user.id)
          .single();

        if (settings?.preferred_language && ["en", "th", "ja", "ko"].includes(settings.preferred_language)) {
          const cloudLang = settings.preferred_language as Lang;
          // If cloud differs from local, cloud wins? Or generic sync?
          // Usually cloud wins if we just logged in.
          if (cloudLang !== saved) {
            setLangState(cloudLang);
            localStorage.setItem("app_lang", cloudLang);
            updateHtmlLang(cloudLang);
          }
        }
      }
    };
    initLang().then(() => setMounted(true));
  }, []);

  

  const setLocale = async (newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem("app_lang", newLang);
    updateHtmlLang(newLang);

    // Persist to Supabase if logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("user_settings").upsert({
        user_id: user.id,
        preferred_language: newLang,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    }
  };

  const t = (key: string) => {
    const dict = dictionaries[lang] || dictionaries["en"];
    return dict[key] || dictionaries["en"][key] || key;
  };

  if (!mounted) {
    // Optional: loading state
  }

  return (
    <I18nContext.Provider value={{ locale: lang, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
