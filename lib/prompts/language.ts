/**
 * LANGUAGE CONTROL & ISOLATION SYSTEM
 * Standardized prompts for enforcing target language consistency.
 */

export const MASTER_LANGUAGE_CONTROL_PROMPT = `
========================
LANGUAGE CONTROL & ISOLATION SYSTEM
========================

You will ALWAYS receive a variable called:
TARGET_LANGUAGE

This is the ONLY language you are allowed to use for the core content.

----------------------------------------
LANGUAGE RULES (NON-NEGOTIABLE)
----------------------------------------

1) You must generate content STRICTLY in TARGET_LANGUAGE.
2) You must NOT mix scripts (e.g., no Thai script in Korean output).
3) You must IGNORE the language of user input if it differs from TARGET_LANGUAGE.
4) You must IGNORE any previous messages written in other languages.
5) TECHNICAL TERMS: You MAY use essential global technical terms or brand names (e.g., "AI", "TikTok", "Algorithm", "Algorithm", "Engagement") if they are standard in the TARGET_LANGUAGE's tech/social media context. Do NOT translate these if the translation feels unnatural.
6) LOANWORDS: Common loanwords accepted in TARGET_LANGUAGE are allowed.
7) STRUCTURE: You MUST preserve all structural labels (HOOK:, CAPTION:, HASHTAGS:) in their original form (English) as defined in the output contract.

----------------------------------------
LANGUAGE SETTINGS
----------------------------------------

If TARGET_LANGUAGE = "th":
- Use natural, authoritative Thai.
- Common English social media terms are OK.

If TARGET_LANGUAGE = "en":
- Use clear global English.
- Strictly no foreign scripts.

If TARGET_LANGUAGE = "jp":
- Use natural Japanese (Mix of Kanji, Hiragana, Katakana).
- English terms common in Japanese social media are OK.

If TARGET_LANGUAGE = "kr":
- Use natural Korean.
- Technical/Social terms in English are acceptable if standard.

----------------------------------------
FINAL CHECK (MANDATORY)
----------------------------------------
Verify: "Is the core narrative in TARGET_LANGUAGE?"
If yes → proceed.
If refusal or mixed scripts → rewrite until clean.
`;

export const LANGUAGE_DETECTOR_PROMPT = `
You are a language detector.

TASK:
Detect the user's intended language for the output.

INPUTS:
- user_message (free text)
- ui_language (optional)
- account_language (optional)

DECISION RULES:
1) Use ui_language if provided.
2) Else detect from user_message.
3) Use account_language as fallback.

OUTPUT: Return ONLY valid JSON: {"target_language": "th|en|jp|kr"}
`;

export const LANGUAGE_POST_CHECK_PROMPT = `
[SYSTEM: LANGUAGE GUARD]

TASK:
Review the following text and ensure it is 100% in {TARGET_LANGUAGE}.

STRICT RULES:
1) If the text contains characters from a different script (e.g., Korean text in a Thai request), translate only those parts into {TARGET_LANGUAGE}.
2) KEEP all labels (HOOK:, CAPTION:, OUTLINE:, HASHTAGS:) in English.
3) KEEP essential technical terms (AI, TikTok, etc.) if they are frequently used in {TARGET_LANGUAGE}.
4) DO NOT add any explanations, apologies, or conversation (e.g., No "I'm sorry", No "Here is the translation").
5) OUTPUT ONLY the corrected content.
6) If the content is already correct, output it exactly as it is.

Failure to follow these rules (especially adding apologies) will result in a system error.
`;
