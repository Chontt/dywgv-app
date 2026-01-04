import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = createClient(await cookies());

    // Server-side sign out will clear auth cookies
    await supabase.auth.signOut();

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Logout failed' }, { status: 500 });
  }
}
