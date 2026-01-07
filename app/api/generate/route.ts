import { NextResponse } from "next/server";
import { MASTER_SYSTEM_PROMPT } from "@/lib/prompts/core";
import { STUDIO_SYSTEM_PROMPT } from "@/lib/prompts/studio";
import { OUTPUT_CONTRACT } from "@/lib/prompts/contract";
import { MASTER_LANGUAGE_CONTROL_PROMPT } from "@/lib/prompts/language";
import { verifyAndRefineLanguage, detectLanguage } from "@/lib/utils/language";
import OpenAI from "openai";
import { createClient } from "@/lib/supabaseServer";
import { checkAndIncrement } from "@/lib/entitlement";

// Initialize OpenAI client only if key exists
const apiKey = process.env.OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate User
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      mode,
      contentKind,
      form,
      profile,
      length = "medium",
      authorityLevel,
      parts: requestedParts = ["Full script", "Caption"]
    } = await request.json();

    // 2. Check Entitlement (Atomic)
    const entitlement = await checkAndIncrement(user.id, "studio_generate");

    if (!entitlement.allowed) {
      return NextResponse.json({
        error: "AUTHORITY_REQUIRED",
        message: "You have reached your daily generation limit. Upgrade to Authority Plan to continue building leverage.",
        upgradeUrl: "/plans"
      }, { status: 402 });
    }

    const isPro = entitlement.tier === "premium";
    let finalParts = requestedParts;

    if (!isPro) {
      // Free Plan Feature Restrictions
      const ALLOWED_PARTS_FREE = ["HOOK", "CAPTION", "HASHTAGS"];
      finalParts = requestedParts.filter((p: string) =>
        ALLOWED_PARTS_FREE.includes(p.toUpperCase())
      );

      if (finalParts.length === 0) {
        finalParts = ["HOOK"];
      }
    }

    // Language Context (Reinforcement)
    const langMap: Record<string, string> = {
      'Thai': 'th',
      'English': 'en',
      'Japanese': 'jp',
      'Korean': 'kr',
      'th': 'th',
      'en': 'en',
      'jp': 'jp',
      'ja': 'jp',
      'kr': 'kr',
      'ko': 'kr'
    };

    let targetLangCode = langMap[profile?.language] || langMap[profile?.language?.split(' ')[0]];

    // 2.5 Hybrid Mode & Smart Override
    if (openai) {
      const firstFormValue = Object.values(form).find(v => typeof v === 'string' && (v as string).length > 5) as string;

      if (firstFormValue) {
        const detectedInputLang = await detectLanguage(openai, firstFormValue);

        // Smart Override: If profile is English (or not set), but input is non-English, trust the input.
        if ((!targetLangCode || targetLangCode === 'en') && detectedInputLang !== 'en') {
          console.log(`[LanguageGuard] Smart Override: Overriding ${targetLangCode || 'none'} with detected ${detectedInputLang} from input.`);
          targetLangCode = detectedInputLang;
        } else if (!targetLangCode) {
          targetLangCode = detectedInputLang;
        }
      }
    }

    targetLangCode = targetLangCode || 'en';

    // Construct the System Prompt Chain with Language Lock
    const FULL_SYSTEM_PROMPT = `
${MASTER_LANGUAGE_CONTROL_PROMPT.replace('TARGET_LANGUAGE', `TARGET_LANGUAGE = "${targetLangCode}"`)}

---

${MASTER_SYSTEM_PROMPT}

---

${MASTER_SYSTEM_PROMPT.includes('dywgv') ? '' : 'Brand: dywgv (Influence & Revenue System)'}
${STUDIO_SYSTEM_PROMPT}

---

${OUTPUT_CONTRACT}`;

    const languageInstruction = `
CRITICAL: You are locked into TARGET_LANGUAGE = ${targetLangCode}.
Generate all content parts strictly in this language.
Do NOT translate the labels (HOOK:, OUTLINE:, FULL SCRIPT:, CAPTION:, HASHTAGS:).
Keep labels in English, but the content must be 100% in ${targetLangCode}.
`;

    // Construct User Prompt (Context)
    // Extract hidden strategic fields
    const everydayRole = form["everyday_role"];
    const antiGoal = form["_anti_goal"];

    const strategicConstraints = (everydayRole || antiGoal) ? `
STRATEGIC CONSTRAINTS (OVERRIDE BASICS):
${everydayRole ? `- MANDATORY ROLE: Adopt the persona of "${everydayRole}". Consistency is key.` : ""}
${antiGoal ? `- ANTI-GOAL (STRICT): ${antiGoal}. Do NOT violate this.` : ""}
` : "";

    const userPrompt = `
CONTEXT:
- Mode: ${mode}
- Content Kind: ${contentKind}
- Profile Brand: ${profile?.brand_name}
- Role/Authority: ${profile?.role} (${authorityLevel || profile?.authority_level})
- Target Audience: ${profile?.target_audience}
- Content Goal: ${profile?.content_goal}
- Tone: ${profile?.tone}
- Length: ${length}
- Requested Parts: ${finalParts.join(", ")}

FORM DATA:
${Object.entries(form).map(([k, v]) => !k.startsWith('_') && k !== 'everyday_role' ? `- ${k}: ${v}` : '').filter(Boolean).join("\n")}

${strategicConstraints}
${languageInstruction}

Generate the content parts requested. Follow the OUTPUT_CONTRACT strictly: NO MARKDOWN. NO BULLETS. Label each part clearly in ALL CAPS (e.g., HOOK:).
`;

    if (!openai) {
      console.warn("OPENAI_API_KEY not found. Using mock response.");
      await new Promise(r => setTimeout(r, 1500));

      return NextResponse.json({
        content: `MOCK INTEL STREAM: DYWGV_REVENUE_ARCHITECT_v1

HOOK:
Most systems optimize for attention. We optimize for belief. This is how you build authority for ${form.topic || 'your niche'} without the hype.

OUTLINE:
- The attention-belief gap in current market strategy
- Why ${form.topic || 'this approach'} fails long-term leverage
- The triad of authority: Tone, Proof, and Consistent Revenue logic

FULL SCRIPT:
Authority isn't something you claim. It is something the market grants you when your logic is undeniable. For ${form.topic || 'your business'}, the focus shouldn't be on the next viral trend. It should be on the architecture of your message. Stop optimizing for clicks and start optimizing for conviction. This is the difference between labor and leverage.

CAPTION:
Conviction scales. Clicks don't. We built the DYWGV system to Architect Influence, not just content. If you're building for the next decade, not the next hour, this is the intel you need.

HASHTAGS:
#DYWGV #RevenueArchitecture #InfluenceScale #AuthoritySystem`
      });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: FULL_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      model: "gpt-4o",
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "";

    // Phase 3: Output Verification (Post-check)
    const refinedContent = await verifyAndRefineLanguage(openai, content, targetLangCode);

    return NextResponse.json({ content: refinedContent });

  } catch (error) {
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
