import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { provider } = body;
    if (!provider) return NextResponse.json({ error: 'provider required' }, { status: 400 });

    // Derive redirectTo based on request origin or env fallback
    const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';
    const redirectTo = `${origin}/api/auth/oauth/callback`;

    const supabase = createClient(await cookies());

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // If SDK returned a url, redirect browser there
    const url = (data as any)?.url;
    if (url) return NextResponse.redirect(url);

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'OAuth start failed' }, { status: 500 });
  }
}
