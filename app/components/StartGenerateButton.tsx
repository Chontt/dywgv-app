"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useI18n } from "@/lib/i18n";

export default function StartGenerateButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  async function handleClick() {
    setLoading(true);

    try {
      // 1. Check Auth (Authentication Layer)
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        router.push("/login");
        return;
      }

      // 2. Smart Flow: Check for existing brand profiles (User Experience Layer)
      const { data: profiles, error } = await supabase
        .from("brand_profiles")
        .select("id")
        .eq("user_id", user.id)
        .limit(1);

      if (error) {
        console.error("Error checking profiles:", error);
        // Fallback to onboarding if check fails
        router.push("/onboarding");
        return;
      }

      if (profiles && profiles.length > 0) {
        // Case A: Returning User (Has Profile) -> Go to Dashboard/Studio
        // This removes the friction of re-onboarding
        router.push("/dashboard");
      } else {
        // Case B: New User (No Profile) -> Go to Onboarding
        router.push("/onboarding");
      }
    } catch (err) {
      console.error("Unexpected error in smart flow:", err);
      router.push("/onboarding");
    } finally {
      // Ideally reset loading only if not redirecting, but for now simple is ok
      // setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-slate-300 transition-all hover:bg-slate-800 hover:scale-105 active:scale-95 disabled:bg-slate-300 disabled:text-slate-500 disabled:scale-100"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Checking...
        </span>
      ) : (
        `🚀 ${t("home_cta_start")}`
      )}
    </button>
  );
}
