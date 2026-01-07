"use server";

import { createClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { MANIFESTATION_PROMPT, EVERYDAY_STRATEGIST_PROMPT } from "@/lib/prompts/core";
import { MASTER_LANGUAGE_CONTROL_PROMPT } from "@/lib/prompts/language";
import { verifyAndRefineJSONLanguage, detectLanguage } from "@/lib/utils/language";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function getDailyGuidance() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // 1. Check if guidance exists for today
    // We use a raw query or simple check. Postgres 'CURRENT_DATE' matches UTC date usually.
    // Let's assume server time is reasonable guidance.
    const today = new Date().toISOString().split('T')[0];

    const { data: existing } = await supabase
        .from('daily_guidance')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

    if (existing) {
        return existing;
    }

    // 2. If not, generate new guidance
    // 2a. Fetch User Profile & Settings for Language
    const { data: rawProfile } = await supabase
        .from('brand_profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    const { data: settings } = await supabase
        .from('user_settings')
        .select('preferred_language')
        .eq('user_id', user.id)
        .maybeSingle();

    const profile = rawProfile as any;
    let targetLangCode = settings?.preferred_language || 'en';

    // Default context if no profile
    const context = profile ? JSON.stringify({
        niche: profile.niche,
        role: profile.role,
        industry: profile.industry,
        audience: profile.target_audience,
        goal: profile.content_goal,
    }) : `User is a generic content creator looking for growth.`;

    // 2.5 Hybrid Mode & Smart Override
    if (openai) {
        const detectedInputLang = await detectLanguage(openai, context);

        // Smart Override: If profile is English (or not set/English), but input is non-English, trust the input.
        if ((!settings?.preferred_language || targetLangCode === 'en' || targetLangCode === 'English') && detectedInputLang !== 'en') {
            console.log(`[LanguageGuard] Smart Override: Overriding ${targetLangCode} with detected ${detectedInputLang} from input.`);
            targetLangCode = detectedInputLang;
        } else if (!settings?.preferred_language) {
            targetLangCode = detectedInputLang;
        }
    }

    targetLangCode = targetLangCode || 'en';

    // 2b. Call AI (Parallel) with Language Lock
    const LANGUAGE_LOCK = MASTER_LANGUAGE_CONTROL_PROMPT.replace('TARGET_LANGUAGE', `TARGET_LANGUAGE = "${targetLangCode}"`);

    const MANIFESTATION_SYSTEM = `${LANGUAGE_LOCK}\n---\n${MANIFESTATION_PROMPT}\n---\nCRITICAL: Output values strictly in ${targetLangCode}. Keys in English.`;
    const STRATEGIST_SYSTEM = `${LANGUAGE_LOCK}\n---\n${EVERYDAY_STRATEGIST_PROMPT}\n---\nCRITICAL: Output values strictly in ${targetLangCode}. Keys in English.`;

    const [manifestationRes, strategistRes] = await Promise.all([
        openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: MANIFESTATION_SYSTEM },
                { role: "user", content: `Context: ${context}` }
            ],
            response_format: { type: "json_object" }
        }),
        openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: STRATEGIST_SYSTEM },
                { role: "user", content: `Context: ${context}` }
            ],
            response_format: { type: "json_object" }
        })
    ]);

    // 2c. Parse Results
    const manifestationStr = manifestationRes.choices[0].message.content || "{}";
    const strategistStr = strategistRes.choices[0].message.content || "{}";

    let manifestationJSON, strategistJSON;
    try {
        manifestationJSON = JSON.parse(manifestationStr);
        strategistJSON = JSON.parse(strategistStr);

        // Phase 3: Output Verification (Post-check)
        manifestationJSON = await verifyAndRefineJSONLanguage(openai, manifestationJSON, targetLangCode);
        strategistJSON = await verifyAndRefineJSONLanguage(openai, strategistJSON, targetLangCode);

    } catch (e) {
        console.error("Failed to parse AI output", e);
        return null;
    }

    // 2d. Prepare Data
    const insertData = {
        user_id: user.id,
        date: today,
        role: strategistJSON.role || "Creator",
        manifestation_text: manifestationJSON.manifestation || "You are capable.",
        focus_action: strategistJSON.focus_action || "Create content.",
        emotion: strategistJSON.emotion || manifestationJSON.emotion_target || "Calm",
        raw_json: {
            manifestation: manifestationJSON,
            strategist: strategistJSON
        }
    };

    // 2e. Insert to DB
    const { data: newGuidance, error } = await supabase
        .from('daily_guidance')
        .insert(insertData)
        .select()
        .single();

    if (error) {
        console.error("Error saving guidance:", error);
        // It's possible a race condition occurred and it was created in the meantime
        return null;
    }

    return newGuidance as any;
}
