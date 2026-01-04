export type BrainBuilderState = {
    // Step 1: Identity & Voice
    role: string | null; // "creator", "expert", "business", "founder"
    experience_level: string | null; // "beginner", "growing", "authority"
    brand_name: string;

    // Step 2: Positioning (The Lane)
    niche: string;
    industry: string;
    value_proposition: string; // "I help X do Y"

    // Step 3: Audience (Psychology)
    target_audience_demographics: string;
    audience_pain: string;
    audience_desire: string;

    // Step 4: Authority & Style
    voice_tone: string; // "direct", "empathetic", "high-energy"
    authority_source: string; // "results", "logic", "curation"

    // Step 5: Strategy
    main_platform: string;
    monthly_goal: string;
    content_language: string;
};

export const INITIAL_BRAIN_STATE: BrainBuilderState = {
    role: null,
    experience_level: null,
    brand_name: "",
    niche: "",
    industry: "",
    value_proposition: "",
    target_audience_demographics: "",
    audience_pain: "",
    audience_desire: "",
    voice_tone: "",
    authority_source: "",
    main_platform: "",
    monthly_goal: "",
    content_language: "TH",
};

// --- Constants (Single Source of Truth) ---
export const ROLES = ["Creator", "Founder", "Expert", "Business"] as const;
export const EXP_LEVELS = ["Beginner", "Growing", "Authority"] as const;
export const TONES = ["Direct & Bold", "Empathetic & Soft", "High Energy", "Analytical", "Witty"] as const;
export const SOURCES = ["Results & Case Studies", "Logic & Research", "Curation & Taste", "Personal Experience"] as const;
export const PLATFORMS = ["Twitter / X", "LinkedIn", "Instagram", "Newsletter", "Blog"] as const;

// The output from the AI Synthesis
export type StrategicProfile = {
    identity: {
        role: string;
        voice_position: string;
        experience_level: string;
    };
    positioning: {
        lane: string;
        mission: string;
        anti_topics: string[];
    };
    audience: {
        description: string;
        core_fear: string;
        core_desire: string;
        identity_aspiration: string;
    };
    emotional_outcome: string[];
    authority: {
        source: string;
        strategy: string;
    };
    content_strategy: {
        primary_platforms: string[];
        content_types: string[];
        tone: string;
    };
    conversion: {
        mechanism: string;
        description: string;
    };
};
