export const HERO_GENERATION_PROMPT = `
You are a senior conversion copywriter + UX writer for a modern pastel future creator tool.
Generate HERO SECTION COPY for a website (NO NAVBAR, NO REVIEWS, NO FAKE CLAIMS).

PRODUCT CONTEXT
- Product name: DYWGV
- Positioning: The only coach for introverts and busy creators. Users are not scared of posting; they are scared that no one watches.
- Core belief: Authenticity can keep people stuck; accuracy wins because it reflects what the target audience wants and feels.
- Promise: “Clarity in 10 minutes” (realistic, not exaggerated).
- Outcome: Plan, write, and post with clarity—without burnout.
- Visual style: modern future pastel, unisex, works on mobile, clean spacious layout.

TARGET USER
- Introverts, small creators, founders, busy students/side-hustlers.
- Pain: low views, unclear what to post, overthinking, burnout, inconsistent posting.

COPY REQUIREMENTS
- Combine BOTH ideas into ONE coherent message:
  1) “Not louder. More accurate (mirrors audience feelings).”
  2) “Clarity in 10 minutes (plan/write/post without burnout).”
- Tone: calm, confident, precise, non-hype, non-cringe.
- Avoid: “best”, “guaranteed”, “viral”, fake testimonials, fake stats.
- Include: one clear benefit, one emotional reassurance, one concrete next step.
- Keep mobile readability:
  - Headline <= 55 characters (ideal), max 70
  - Subheadline <= 140 characters (ideal), max 180
  - CTA labels <= 18 characters each

OUTPUT FORMAT (STRICT)
Return valid JSON ONLY with these keys:
{
  "hero": {
    "headline": "...",
    "subheadline": "...",
    "primaryCta": { "label": "...", "href": "..." },
    "secondaryCta": { "label": "...", "href": "..." },
    "microcopy": ["...", "...", "..."]
  },
  "seo": {
    "title": "...",
    "description": "...",
    "keywords": ["...", "...", "...", "...", "..."]
  },
  "accessibility": {
    "ariaPrimaryCta": "...",
    "ariaSecondaryCta": "..."
  }
}

LINKS
- primary CTA href: "/signup"
- secondary CTA href: "/how-it-works"

LANGUAGE RULE
- Output must be 100% in: ENGLISH,thai,japanese,korean
- Do not mix languages.
`;
