import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabaseServer'

export async function GET() {
    const supabase = await createClient()

    // 1. Get Auth Session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Fetch Subscription Status
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('status, current_period_end')
        .eq('user_id', user.id)
        .in('status', ['active', 'trialing'])
        .gt('current_period_end', new Date().toISOString())
        .maybeSingle()

    const isPro = !!sub
    const plan = isPro ? 'pro' : 'free'

    // 3. Fetch Usage (Generations today)
    const today = new Date().toISOString().split('T')[0]
    const { count: generationsToday, error: usageError } = await supabase
        .from('content_projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today)

    // 4. Fetch Total Projects
    const { count: totalProjects } = await supabase
        .from('content_projects')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    // 5. Define Limits
    const limits = {
        generationsPerDay: isPro ? 100 : 3,
        projectsLimit: isPro ? 1000 : 5,
        profilesLimit: isPro ? 10 : 1
    }

    return NextResponse.json({
        user: {
            id: user.id,
            email: user.email,
        },
        plan,
        isPro,
        usage: {
            generationsToday: generationsToday || 0,
            totalProjects: totalProjects || 0
        },
        limits
    })
}
