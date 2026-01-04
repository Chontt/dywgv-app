import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    const supabase = createClient(await cookies());

    if (code) {
      // Exchange the auth code for a session; this will let the SDK set cookies
      await supabase.auth.exchangeCodeForSession(code);
    } else {
      // For implicit flow, the provider may return tokens in hash — in that case
      // client-side handling is required. We just redirect to root.
    }

    // Redirect user back to app (dashboard or homepage)
    const redirectTo = process.env.NEXT_PUBLIC_APP_URL || '/';
    return NextResponse.redirect(redirectTo);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'OAuth callback failed' }, { status: 500 });
  }
}
