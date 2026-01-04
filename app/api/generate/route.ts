import { NextResponse } from "next/server";
import { MASTER_SYSTEM_PROMPT } from "@/lib/prompts/core";
import { STUDIO_SYSTEM_PROMPT } from "@/lib/prompts/studio";
import { OUTPUT_CONTRACT } from "@/lib/prompts/contract";
import OpenAI from "openai";
import { createClient } from "@/lib/supabaseServer";

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
      parts: requestedParts = ["Full script", "Caption"]
    } = await request.json();

    // 2. Check Subscription & Usage
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status, current_period_end')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle();

    const isPro = !!sub;
    let finalParts = requestedParts;

    if (!isPro) {
      // Free Plan Enforcement
      const today = new Date().toISOString().split('T')[0];
      const { count: generationsToday } = await supabase
        .from('content_projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today);

      if ((generationsToday || 0) >= 3) {
        return NextResponse.json({
          error: "AUTHORITY_REQUIRED",
          message: "You have reached your daily limit of 3 generations. Upgrade to Authority Plan for unlimited content.",
          upgradeUrl: "/plans"
        }, { status: 402 });
      }

      // Restrict Parts
      const ALLOWED_PARTS_FREE = ["Hooks", "Caption & Hashtags"];
      // We map the requested parts to allowed ones if necessary, or just force them.
      // For free users, we only allow them to get Hooks and Captions.
      finalParts = requestedParts.filter((p: string) =>
        p === "Hooks" || p === "Caption & Hashtags"
      );

      if (finalParts.length === 0) {
        finalParts = ["Hooks"];
      }
    }

    // Construct the System Prompt Chain
    // CORE -> STUDIO -> CONTRACT
    const FULL_SYSTEM_PROMPT = `${MASTER_SYSTEM_PROMPT}

---

${STUDIO_SYSTEM_PROMPT}

---

${OUTPUT_CONTRACT}`;

    // Language Context (Reinforcement)
    const languageInstruction = `TARGET LANGUAGE: ${profile?.language || 'English'}
NOTE: Output must be 100% in the target language.`;

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
- Profile Brand: ${profile?.brand_name || profile?.business_name}
- Role/Authority: ${profile?.role} (${profile?.authority_level})
- Target Audience: ${profile?.target_audience}
- Content Goal: ${profile?.content_goal}
- Tone: ${profile?.tone}
- Length: ${length}
- Requested Parts: ${finalParts.join(", ")}

FORM DATA:
${Object.entries(form).map(([k, v]) => !k.startsWith('_') && k !== 'everyday_role' ? `- ${k}: ${v}` : '').filter(Boolean).join("\n")}

${strategicConstraints}
${languageInstruction}

Generate the content parts requested.
`;

    if (!openai) {
      console.warn("OPENAI_API_KEY not found. Using mock response.");
      await new Promise(r => setTimeout(r, 1500));

      return NextResponse.json({
        content: `[MOCK GENERATION - API KEY MISSING]
        
Hooks:
1. Stop doing ${form.topic} the wrong way.
2. The secret to ${form.topic} isn't what you think.

Full script:
"Hey guys, if you are struggling with ${form.topic}, listen up.
Most people think it's about X, but it's actually about Y.
I tried this myself and the results were crazy.
Just check the link in bio for the full guide."

Caption:
Stop struggling with ${form.topic}. 🛑
We found a better way.
#${form.topic?.replace(/\s/g, '')}
`
      });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: FULL_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "";

    return NextResponse.json({ content });

  } catch (error) {
    console.error("Generate API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
