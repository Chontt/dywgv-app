export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            brand_profiles: {
                Row: {
                    id: string
                    user_id: string
                    brand_name: string | null
                    business_name: string | null
                    industry: string | null
                    target_audience: string | null
                    primary_platform: string | null
                    content_style: string | null
                    tone: string | null
                    website_url: string | null
                    avatar_url: string | null
                    mode: 'business' | 'creator'
                    niche: string | null
                    role: string | null
                    language: string | null
                    authority_level: string | null
                    emoji_preference: string | null
                    content_goal: string | null
                    platform_focus: string | null
                    positioning_statement: string | null
                    emotional_impact: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: any
                Update: any
                Relationships: any[]
            }
            user_settings: {
                Row: {
                    user_id: string
                    active_profile_id: string | null
                    onboarding_completed: boolean
                    preferred_language: string | null
                    theme: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: any
                Update: any
                Relationships: any[]
            }
            content_projects: {
                Row: {
                    id: string
                    user_id: string
                    profile_id: string | null
                    title: string | null
                    content_kind: string | null
                    mode: string | null
                    form_json: Json | null
                    output_text: string | null
                    status: string | null
                    created_at: string
                    updated_at: string
                    last_opened_at: string | null
                    completed_at: string | null
                }
                Insert: any
                Update: any
                Relationships: any[]
            }
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    stripe_customer_id: string | null
                    stripe_subscription_id: string | null
                    status: string | null
                    price_id: string | null
                    current_period_end: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: any
                Update: any
                Relationships: any[]
            }
            daily_goals: {
                Row: {
                    id: string
                    user_id: string
                    goal_text: string
                    is_completed: boolean
                    created_at: string
                    goal_date?: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    goal_text: string
                    is_completed?: boolean
                    created_at?: string
                    goal_date?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    goal_text?: string
                    is_completed?: boolean
                    created_at?: string
                    goal_date?: string
                }
                Relationships: any[]
            }

            daily_guidance: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    role: string
                    manifestation_text: string | null
                    focus_action: string | null
                    emotion: string | null
                    reason: string | null
                    anti_goal: string | null
                    raw_json: Json | null
                    is_completed: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    date?: string
                    role: string
                    manifestation_text?: string | null
                    focus_action?: string | null
                    emotion?: string | null
                    raw_json?: Json | null
                    is_completed?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    role?: string
                    manifestation_text?: string | null
                    focus_action?: string | null
                    emotion?: string | null
                    raw_json?: Json | null
                    is_completed?: boolean
                    created_at?: string
                }
                Relationships: any[]
            },
            user_feedback: {
                Row: {
                    id: string
                    user_id: string
                    rating: number
                    feedback_text: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    rating: number
                    feedback_text: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    rating?: number
                    feedback_text?: string
                    created_at?: string
                }
                Relationships: any[]
            }
            plans: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    type: '7_day' | '30_day'
                    inputs: Json
                    content: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    type: '7_day' | '30_day'
                    inputs: Json
                    content: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    type?: '7_day' | '30_day'
                    inputs?: Json
                    content?: Json
                    created_at?: string
                    updated_at?: string
                }
                Relationships: any[]
            },
            // Catch-all to prevent 'never' collapse
            [key: string]: any
        }
        Views: {
            [key: string]: any
        }
        Functions: {
            [key: string]: any
        }
        Enums: {
            [key: string]: any
        }
    }
}
