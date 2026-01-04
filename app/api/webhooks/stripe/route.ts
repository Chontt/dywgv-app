import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client (Service Role)
// We need this to bypass RLS and update subscription data securely
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Fallback ONLY for dev if specific key missing, but should be SERVICE_ROLE
);

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const session = event.data.object as any;

    if (event.type === 'checkout.session.completed') {
        // 1. Retrieve the subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(session.subscription) as any;

        // 2. Get userId from metadata (passed during checkout creation)
        const userId = session.metadata.userId;

        if (!userId) {
            return new NextResponse('User ID missing in metadata', { status: 400 });
        }

        // 3. Upsert subscription into Supabase
        const { error } = await supabaseAdmin
            .from('subscriptions')
            .upsert({
                user_id: userId,
                stripe_customer_id: session.customer,
                stripe_subscription_id: subscription.id,
                status: subscription.status,
                price_id: subscription.items.data[0].price.id,
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            });

        if (error) {
            console.error('Error updating subscription in DB:', error);
            return new NextResponse('Database Error', { status: 500 });
        }
    }

    if (event.type === 'invoice.payment_succeeded') {
        // Handle renewals
        const subscription = await stripe.subscriptions.retrieve(session.subscription) as any;

        // We might need to look up the user by stripe_customer_id if metadata isn't on the invoice event always
        // But typically we update by stripe_subscription_id
        const { error } = await supabaseAdmin
            .from('subscriptions')
            .update({
                status: subscription.status,
                current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq('stripe_subscription_id', subscription.id);

        if (error) console.error('Error updating renewal:', error);
    }

    return new NextResponse(null, { status: 200 });
}
