import { NextResponse } from "next/server";
import { ONBOARDING_SYSTEM_PROMPT } from "@/lib/prompts/onboarding";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase"; // Note: This might be client side supabase, we need admin or server client if checking auth on server, but typically we just trust the client sends valid data if we don't have strict backend auth check middleware yet. For now, let's just use the OpenAI part.
// Actually, better to check auth context if possible, but let's stick to the generation logic first.

const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { inputs } = body;

        // TODO: Verify User Auth if critical.

        if (!openai) {
            console.warn("OPENAI_API_KEY not found. Using mock response.");
            await new Promise(r => setTimeout(r, 2000));
            return NextResponse.json(mockProfile(inputs));
        }

        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: ONBOARDING_SYSTEM_PROMPT },
                { role: "user", content: JSON.stringify(inputs, null, 2) },
            ],
            model: "gpt-4-turbo-preview",
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error("No content generated");

        const profile = JSON.parse(content);
        return NextResponse.json(profile);

    } catch (error) {
        console.error("Onboarding Synthesis Error:", error);
        return NextResponse.json(
            { error: "Failed to synthesize profile" },
            { status: 500 }
        );
    }
}

function mockProfile(inputs: any) {
    return {
        identity: {
            role: inputs.role || "creator",
            voice_position: "guide",
            experience_level: "growing"
        },
        positioning: {
            lane: `${inputs.niche} for ${inputs.industry}`,
            mission: inputs.value_proposition || "To help people win.",
            anti_topics: ["Generic advice", "Get rich quick"]
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
