import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        // 1. Get the Stripe Customer ID from our DB
        const { data: sub, error } = await supabase
            .from('subscriptions')
            .select('stripe_customer_id')
            .eq('user_id', user.id)
            .single();

        if (error || !sub?.stripe_customer_id) {
            return new NextResponse('No subscription found', { status: 404 });
        }

        // 2. Dynamic Return URL (Settings Page)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const returnUrl = `${appUrl}/settings`;

        // 3. Create Portal Session
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: sub.stripe_customer_id,
            return_url: returnUrl,
        });

        return NextResponse.json({ url: portalSession.url });
    } catch (error: any) {
        console.error('Stripe Portal Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
