import { NextResponse } from "next/server";
import { ONBOARDING_SYSTEM_PROMPT } from "@/lib/prompts/onboarding";
import { MASTER_LANGUAGE_CONTROL_PROMPT } from "@/lib/prompts/language";
import { verifyAndRefineJSONLanguage, detectLanguage } from "@/lib/utils/language";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase"; // Note: This might be client side supabase, we need admin or server client if checking auth on server, but typically we just trust the client sends valid data if we don't have strict backend auth check middleware yet. For now, let's just use the OpenAI part.
// Actually, better to check auth context if possible, but let's stick to the generation logic first.

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

interface OnboardingInputs {
    role?: string;
    niche?: string;
    industry?: string;
    value_proposition?: string;
    target_audience_demographics?: string;
    audience_pain?: string;
    audience_desire?: string;
    voice_tone?: string;
    main_platform?: string;
    accuracy_identity?: string;
    accuracy_misconception?: string;
    accuracy_one_thing?: string;
    language?: string;
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { inputs } = body as { inputs: OnboardingInputs };

        // TODO: Verify User Auth if critical.

        if (!openai) {
            console.warn("OPENAI_API_KEY not found. Using mock response.");
            await new Promise(r => setTimeout(r, 2000));
            return NextResponse.json(mockProfile(inputs));
        }

        let targetLangCode = inputs.language || 'en';

        // 2.5 Hybrid Mode & Smart Override
        if (openai) {
            const detectedInputLang = await detectLanguage(openai, JSON.stringify(inputs));

            // Smart Override: If input language is English (default), but survey values are foreign, trust the survey.
            if ((!inputs.language || targetLangCode === 'en' || targetLangCode === 'English') && detectedInputLang !== 'en') {
                console.log(`[LanguageGuard] Smart Override: Overriding ${targetLangCode} with detected ${detectedInputLang} from onboarding inputs.`);
                targetLangCode = detectedInputLang;
            } else if (!inputs.language) {
                targetLangCode = detectedInputLang;
            }
        }

        targetLangCode = targetLangCode || 'en';

        const FULL_SYSTEM_PROMPT = `
${MASTER_LANGUAGE_CONTROL_PROMPT.replace('TARGET_LANGUAGE', `TARGET_LANGUAGE = "${targetLangCode}"`)}

---

${ONBOARDING_SYSTEM_PROMPT}

---

CRITICAL: Generate the JSON response such that all keys are in English (matching the schema), but all values are written strictly in ${targetLangCode}.
`;

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: FULL_SYSTEM_PROMPT },
                { role: "user", content: JSON.stringify(inputs, null, 2) },
            ],
            model: "gpt-4o",
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("No content generated");

        const profile = JSON.parse(content);

        // Phase 3: Output Verification (Post-check)
        const refinedProfile = await verifyAndRefineJSONLanguage(openai, profile, targetLangCode);

        return NextResponse.json(refinedProfile);

    } catch (error) {
        console.error("Onboarding Synthesis Error:", error);
        return NextResponse.json(
            { error: "Failed to synthesize profile" },
            { status: 500 }
        );
    }
}

function mockProfile(inputs: OnboardingInputs) {
    return {
        identity: {
            role: inputs.role || "creator",
            voice_position: "guide",
            experience_level: "growing"
        },
        positioning: {
            lane: `${inputs.niche || 'Niche'} for ${inputs.industry || 'Industry'}`,
            mission: inputs.value_proposition || "To help people win.",
            anti_topics: ["Generic advice", "Get rich quick"],
            accuracy_pillar: inputs.accuracy_one_thing || "Precision Execution"
        },
        audience: {
            description: inputs.target_audience_demographics || "General audience",
            core_fear: inputs.audience_pain || "Failure",
            core_desire: inputs.audience_desire || "Success",
            identity_aspiration: "A smarter version of themselves"
        },
        emotional_outcome: ["confident", "clarity"],
        authority: {
            source: "logic",
            strategy: "Explain complex topics simply"
        },
        content_strategy: {
            primary_platforms: [inputs.main_platform || "twitter"],
            content_types: ["Educational threads", "Short videos"],
            tone: inputs.voice_tone || "Direct"
        },
        conversion: {
            mechanism: "trust",
            description: "Build authority over time to sell services."
        }
    };
}
