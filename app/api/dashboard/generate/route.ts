import { NextResponse } from "next/server";
import { EVERYDAY_GENERATOR_SYSTEM_PROMPT } from "@/lib/prompts/everyday";
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
- PREFERRED LANGUAGE: ${language || "en"} (MANDATORY: Output all human-readable fields in this language)

CALENDAR CONTEXT:
- Date: ${calendarContext?.date || new Date().toDateString()}
- Day: ${calendarContext?.day || "Weekday"}

PAST ACTIVITY (Avoid repeating exact topics):
${recentActivity || "- No recent posts found."}

STREAK CONTEXT:
${streakContext || "User is building momentum."}

PLAN TIER: ${planTier || "free"}
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

        // 3. AI Generation
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: EVERYDAY_GENERATOR_SYSTEM_PROMPT },
                { role: "user", content: enrichedContext },
            ],
            model: "gpt-4-turbo-preview",
            temperature: 0.7,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content || "{}";

        // 4. Robust Parsing (Basic repair if needed, though json_object mode is reliable)
        let json;
        try {
            json = JSON.parse(content);
        } catch (e) {
            console.warn("JSON Parse Error, attempting fallback", content);
            return NextResponse.json({ error: "Failed to parse strategy." }, { status: 500 });
        }

        return NextResponse.json(json);

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Failed to generate dashboard focus" }, { status: 500 });
    }
}
