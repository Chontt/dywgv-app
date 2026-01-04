"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        setHydrated(true);

        const syncLanguage = async () => {
            try {
                // 1. Check if we have a user
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return; // Stay default 'en'

                // 2. Get active profile ID from settings
                const { data: settings } = await supabase
                    .from("user_settings")
                    .select("active_profile_id")
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (!(settings as any)?.active_profile_id) return;

                const activeProfileId = (settings as any).active_profile_id;

                // 3. Get profile language
                const { data: profile } = await supabase
                    .from("brand_profiles")
                    .select("language")
                    .eq("id", activeProfileId)
                    .single();

                if ((profile as any)?.language) {
                    const lang = (profile as any).language;

                    // Update HTML tag
                    document.documentElement.lang = lang;

                    // Reset Classes
                    document.documentElement.classList.remove("lang-th", "lang-jp", "lang-ko", "lang-en");

                    // Add new class
                    document.documentElement.classList.add(`lang-${lang}`);

                    // Log for debugging
                    console.log(`[LanguageSystem] Switched to: ${lang}`);
                }

            } catch (err) {
                console.error("[LanguageSystem] Failed to sync language:", err);
            }
        };

        syncLanguage();

        // Listen for profile changes (optional, but good for reactivity)
        // For now, simpler is better. We assume page refresh on language change or just re-mounting.

    }, []);

    if (!hydrated) {
        // Prevent mismatch? No, we just render children.
        // The language update happens client-side, initially potentially 'en'.
        // This is acceptable for a "Root Cause Fix" phase.
    }

    return <>{children}</>;
}
