import { NextResponse } from "next/server";
import { EVERYDAY_GENERATOR_SYSTEM_PROMPT } from "@/lib/prompts/everyday";
import { MASTER_LANGUAGE_CONTROL_PROMPT } from "@/lib/prompts/language";
import { verifyAndRefineJSONLanguage, detectLanguage } from "@/lib/utils/language";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userName, profileData, recentActivity, streakContext, planTier, calendarContext, language } = body;

        // 1. Construct Enriched Context
        const enrichedContext = `
USER CONTEXT:
- Name: ${userName}
- Brand Role: ${profileData?.role || "Creator"}
- Authority Level: ${profileData?.authority_level || "Growing"}
- Long-term Content Goal: ${profileData?.content_goal || "Build Trust"}

CALENDAR CONTEXT:
- Date: ${calendarContext?.date || new Date().toDateString()}
- Day: ${calendarContext?.day || "Weekday"}

PAST ACTIVITY (Avoid repeating exact topics):
${recentActivity || "- No recent posts found."}

STREAK CONTEXT:
${streakContext || "User is building momentum."}

PLAN TIER: ${planTier || "free"}
`;

        const langMap: Record<string, string> = { "English": "en", "Thai": "th", "Japanese": "ja", "Korean": "ko" };
        let targetLangCode = langMap[profileData?.language] || langMap[profileData?.language?.split(' ')[0]];

        // 2.5 Hybrid Mode & Smart Override
        if (openai) {
            const detectedInputLang = await detectLanguage(openai, enrichedContext);

            // Smart Override: If profile is English (or not set), but input is non-English, trust the input.
            if ((!targetLangCode || targetLangCode === 'en') && detectedInputLang !== 'en') {
                console.log(`[LanguageGuard] Smart Override: Overriding ${targetLangCode || 'none'} with detected ${detectedInputLang} from input.`);
                targetLangCode = detectedInputLang;
            } else if (!targetLangCode) {
                targetLangCode = detectedInputLang;
            }
        }

        targetLangCode = targetLangCode || 'en';

        const FULL_SYSTEM_PROMPT = `
${MASTER_LANGUAGE_CONTROL_PROMPT.replace('TARGET_LANGUAGE', `TARGET_LANGUAGE = "${targetLangCode}"`)}

---

${EVERYDAY_GENERATOR_SYSTEM_PROMPT}

---

CRITICAL: Generate the JSON response such that all keys are in English (matching the schema), but all values are written strictly in ${targetLangCode}.
`;

        // 2. Mock Response (Fallback)
        if (!openai) {
            return NextResponse.json({
                role: "Educator",
                emotion: "Calm authority",
                focus_action: "Teach 1 concept that removes confusion about your niche.",
                reason: "Building trust by simplifying complexity positions you as the expert.",
                anti_goal: "Don't over-explain. Keep it to one single concept.",
                recommended_content: {
                    platform: "TikTok",
                    content_kind: "creator_video",
                    video_length_sec: 30,
                    format: "faceless b-roll + captions",
                    topic: "Common Myth in " + (profileData?.niche || "your industry"),
                    hook_angle: "myth-busting",
                    cta: "Ask for opinion in comments",
                    parts_to_generate: ["hook", "outline", "script", "caption"]
                }
            });
        }

        const languageInstruction = `
CRITICAL: You are locked into TARGET_LANGUAGE = ${targetLangCode}.
Generate all values strictly in this language.
Keep the JSON keys in English as defined in the contract.
`;

        // 3. AI Generation
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: FULL_SYSTEM_PROMPT },
                { role: "user", content: `${enrichedContext}\n\n${languageInstruction}` },
            ],
            model: "gpt-4o",
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (!content) return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });

        let result = JSON.parse(content);

        // Phase 3: Output Verification (Post-check)
        result = await verifyAndRefineJSONLanguage(openai, result, targetLangCode);

        return NextResponse.json(result);

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Failed to generate dashboard focus" }, { status: 500 });
    }
}
