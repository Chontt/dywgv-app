import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { stripe, getOrCreateStripeCustomer, resolveStripePriceId } from '@/lib/stripe';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { interval, locale } = body;

        // Use the robust resolver (locale acts as market signal)
        const priceId = resolveStripePriceId(interval, locale);

        if (!priceId) {
            return new NextResponse('Price ID not found for this region/interval', { status: 400 });
        }

        const customerId = await getOrCreateStripeCustomer(user.email || '', user.id, supabase);

        // Dynamic Base URL (support Localhost vs Production automatically)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${appUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${appUrl}/plans?checkout=canceled`,
            metadata: {
                userId: user.id,
                market: locale || 'en', // Track which market they originated from
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
