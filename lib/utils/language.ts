import { LANGUAGE_POST_CHECK_PROMPT, LANGUAGE_DETECTOR_PROMPT } from "@/lib/prompts/language";
import OpenAI from "openai";

/**
 * Checks if a string contains characters from scripts other than the target language.
 */
export function isLanguageMixed(text: string, targetLang: string): boolean {
    const thaiPattern = /[\u0E00-\u0E7F]/;
    const jaPattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
    const krPattern = /[\uAC00-\uD7AF]/;

    // We allow English tech terms/labels, so we only check across the 3 main foreign-to-each-other scripts.
    if (targetLang === 'th') {
        return jaPattern.test(text) || krPattern.test(text);
    }
    if (targetLang === 'jp') {
        return thaiPattern.test(text) || krPattern.test(text);
    }
    if (targetLang === 'kr') {
        return thaiPattern.test(text) || jaPattern.test(text);
    }
    if (targetLang === 'en') {
        return thaiPattern.test(text) || jaPattern.test(text) || krPattern.test(text);
    }

    return false;
}

/**
 * Detects if the model response is a refusal or a meta-commentary instead of actual content.
 */
export function isLLMRefusal(text: string): boolean {
    const refusalPrefixes = [
        "i'm sorry",
        "i cannot",
        "as an ai",
        "fulfillment",
        "fulfill",
        "policy",
        "instruction",
        "sorry",
        "죄송합니다", // Sorry in Korean
        "申し訳ありません" // Sorry in Japanese
    ];
    const lower = text.toLowerCase().trim();
    return refusalPrefixes.some(p => lower.startsWith(p));
}

/**
 * Attempts to extract actual content from a response that might contain a refusal prefix.
 */
export async function recoverFromRefusal(
    openai: OpenAI,
    text: string,
    targetLang: string
): Promise<string> {
    const lower = text.toLowerCase();
    if (!isLLMRefusal(text)) return text;

    console.log("[LanguageGuard] Refusal detected. Attempting recovery...");

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a Content Recovery Agent.
The following text contains an unwanted AI refusal message (like "I'm sorry", "I cannot fulfill").
Your task is to STRIP the refusal and extract only the actual creative content (HOOK:, CAPTION:, etc.).
If no content exists, generate it yourself strictly in ${targetLang} following the context provided.
Do NOT apologize. Do NOT explain. Return ONLY the content.`
                },
                { role: "user", content: text },
            ],
            model: "gpt-4o",
            temperature: 0.3,
        });

        const recovered = completion.choices[0]?.message?.content;
        return recovered && !isLLMRefusal(recovered) ? recovered : text;
    } catch (e) {
        console.error("[LanguageGuard] Recovery failed", e);
        return text;
    }
}

/**
 * Performs an LLM-based post-check to ensure no language mixing occurred.
 */
export async function verifyAndRefineLanguage(
    openai: OpenAI,
    text: string,
    targetLang: string,
    { force = false }: { force?: boolean } = {}
): Promise<string> {
    // 1. Check for primary refusal
    if (isLLMRefusal(text)) {
        return await recoverFromRefusal(openai, text, targetLang);
    }

    // 2. Check for mixed language
    if (!force && !isLanguageMixed(text, targetLang)) {
        return text;
    }

    console.log(`[LanguageGuard] Mixed content detected for ${targetLang}. Refining...`);

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: LANGUAGE_POST_CHECK_PROMPT.replace('{TARGET_LANGUAGE}', targetLang)
                },
                { role: "user", content: text },
            ],
            model: "gpt-4o",
            temperature: 0, // Deterministic for correction
        });

        const refinedContent = completion.choices[0]?.message?.content;

        if (!refinedContent || isLLMRefusal(refinedContent)) {
            console.warn("[LanguageGuard] Refined content was a refusal or empty. Falling back to original.");
            return text;
        }

        return refinedContent;
    } catch (e) {
        console.error("[LanguageGuard] Refinement failed", e);
        return text;
    }
}

/**
 * Refines language within a JSON object.
 */
export async function verifyAndRefineJSONLanguage(
    openai: OpenAI,
    json: any,
    targetLang: string
): Promise<any> {
    const text = JSON.stringify(json, null, 2);

    if (!isLanguageMixed(text, targetLang)) {
        return json;
    }

    console.log(`[LanguageGuard] Mixed content detected in JSON for ${targetLang}. Refining...`);

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `${LANGUAGE_POST_CHECK_PROMPT.replace('{TARGET_LANGUAGE}', targetLang)}
                CRITICAL: Return ONLY valid JSON matching the original structure. Only translate values, keep keys in English.`
                },
                { role: "user", content: text },
            ],
            model: "gpt-4o",
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const refinedText = completion.choices[0]?.message?.content;

        if (!refinedText || isLLMRefusal(refinedText)) {
            console.warn("[LanguageGuard] Refined JSON was a refusal or empty. Falling back to original.");
            return json;
        }

        return JSON.parse(refinedText);
    } catch (e) {
        console.error("[LanguageGuard] Failed to refine JSON", e);
        return json;
    }
}

/**
 * Detects the language of a given text using LLM.
 * Returns 'th', 'en', 'jp', or 'kr'.
 */
export async function detectLanguage(openai: OpenAI, text: string): Promise<string> {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: LANGUAGE_DETECTOR_PROMPT },
                { role: "user", content: `user_message: "${text}"` },
            ],
            model: "gpt-4o",
            temperature: 0,
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) return "en";

        const parsed = JSON.parse(content);
        return parsed.target_language || "en";
    } catch (e) {
        console.error("[LanguageGuard] Language detection failed", e);
        return "en";
    }
}
