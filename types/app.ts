import { Database } from './supabase';

export type BrandProfile = Database['public']['Tables']['brand_profiles']['Row'] & {
    authority_level?: string | null;
    emoji_preference?: string | null;
    content_goal?: string | null;
    platform_focus?: string | null;
    positioning_statement?: string | null;
    emotional_impact?: string | null;
};
