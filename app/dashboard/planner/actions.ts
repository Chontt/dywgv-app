"use server";

import { createClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { VIRAL_PLANNER_PROMPT, PlannerInput } from "@/lib/prompts/planner";
import { MASTER_LANGUAGE_CONTROL_PROMPT } from "@/lib/prompts/language";
import { verifyAndRefineJSONLanguage, detectLanguage } from "@/lib/utils/language";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generatePlan(input: PlannerInput) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Check Subscription Status
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle();

    const isPremium = !!sub;

    // 1. Premium Only Feature: 30-Day Plan
    if (input.duration === '30_day' && !isPremium) {
        return { success: false, error: "30-Day Plans are for Premium members only." };
    }

    // 2. Free Plan Limit: 1 Plan per Month (30 days)
    if (!isPremium) {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { count } = await supabase
            .from('plans')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .gte('created_at', thirtyDaysAgo.toISOString());

        if (count && count >= 1) {
            return { success: false, error: "Free limit reached. You can generate 1 plan every 30 days. Upgrade to Premium for unlimted access." };
        }
    }

    // 3. Language & Prompt Context
    const { data: settings } = await supabase
        .from('user_settings')
        .select('preferred_language')
        .eq('user_id', user.id)
        .maybeSingle();

    const targetLangCode = settings?.preferred_language || 'en';

    let finalLangCode = targetLangCode;
    if (openai) {
        const detectedInputLang = await detectLanguage(openai, JSON.stringify(input));

        // Smart Override: If profile is English (or not set), but input is non-English, trust the input.
        if ((!settings?.preferred_language || targetLangCode === 'en' || targetLangCode === 'English') && detectedInputLang !== 'en') {
            console.log(`[LanguageGuard] Smart Override: Overriding ${targetLangCode} with detected ${detectedInputLang} from input.`);
            finalLangCode = detectedInputLang;
        } else if (!settings?.preferred_language) {
            finalLangCode = detectedInputLang;
        }
    }

    const FULL_SYSTEM_PROMPT = `
${MASTER_LANGUAGE_CONTROL_PROMPT.replace('TARGET_LANGUAGE', `TARGET_LANGUAGE = "${finalLangCode}"`)}

---

${VIRAL_PLANNER_PROMPT}

---

CRITICAL: Generate the JSON response such that all keys are in English (matching the schema), but all values are written strictly in ${finalLangCode}.
`;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: FULL_SYSTEM_PROMPT },
                { role: "user", content: JSON.stringify({ ...input, planType: isPremium ? 'PREMIUM' : 'FREE' }) },
            ],
            temperature: 0.7,
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        const parsedContent = JSON.parse(content);

        // Phase 3: Output Verification (Post-check)
        const refinedContent = await verifyAndRefineJSONLanguage(openai, parsedContent, finalLangCode);

        // Save to database
        const { data: plan, error } = await supabase
            .from("plans")
            .insert({
                user_id: user.id,
                title: `${input.niche ? input.niche + ' - ' : ''}${input.duration === '7_day' ? '7-Day' : '30-Day'} Plan`,
                type: input.duration,
                inputs: input as any,
                content: refinedContent,
            })
            .select('*')
            .single();

        if (error || !plan) throw error || new Error("Failed to create plan");

        revalidatePath("/dashboard/planner");
        return { success: true, planId: (plan as any).id };
    } catch (error) {
        console.error("Plan generation error:", error);
        return { success: false, error: "Failed to generate plan" };
    }
}


export async function deletePlan(planId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("plans")
        .delete()
        .eq("id", planId);

    if (error) throw error;
    revalidatePath("/dashboard/planner");
}

export async function updatePlanContent(planId: string, newContent: any) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("plans")
        .update({ content: newContent })
        .eq("id", planId);

    if (error) throw error;
    revalidatePath(`/dashboard/planner/${planId}`);
}

export async function getPlans() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from("plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return data || [];
}
