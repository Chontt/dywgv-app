import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error(`Webhook Error: ${error.message}`);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    // Use Service Role Key to bypass RLS (Admin Access)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );
    const session = event.data.object as Stripe.Checkout.Session;
    const subscription = event.data.object as Stripe.Subscription;

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                // Update DB with subscription details

                if (session.metadata?.userId) {
                    const subId = session.subscription as string;
                    // Retrieve full subscription to get status and dates
                    const fullSub = await stripe.subscriptions.retrieve(subId);

                    const { error } = await supabase.from('subscriptions').upsert({
                        user_id: session.metadata.userId,
                        stripe_customer_id: session.customer as string,
                        stripe_subscription_id: subId,
                        price_id: fullSub.items.data[0].price.id,
                        status: fullSub.status,
                        // tier: 'premium', // Column missing in DB cache 
                        current_period_end: ((fullSub as any).current_period_end ? new Date((fullSub as any).current_period_end * 1000).toISOString() : new Date(Date.now() + 86400000 * 30).toISOString()),
                        // cancel_at_period_end: fullSub.cancel_at_period_end ?? false, // Column missing in DB cache 
                    });

                    if (error) {
                        console.error('❌ Supabase Upsert Error:', error);
                    }
                }
                break;

            case 'customer.subscription.updated':
                // Update subscription status in DB

                // Query user by customer_id
                const { data: userSub } = await supabase
                    .from('subscriptions')
                    .select('user_id')
                    .eq('stripe_customer_id', subscription.customer as string)
                    .single();

                if (userSub) {
                    await supabase.from('subscriptions').update({
                        status: subscription.status,
                        price_id: subscription.items.data[0].price.id,
                        // tier: subscription.status === 'active' || subscription.status === 'trialing' ? 'premium' : 'free',
                        current_period_end: ((subscription as any).current_period_end ? new Date((subscription as any).current_period_end * 1000).toISOString() : new Date(Date.now() + 86400000 * 30).toISOString()),
                        // cancel_at_period_end: subscription.cancel_at_period_end,
                        updated_at: new Date().toISOString(),
                    }).eq('user_id', userSub.user_id);
                }
                break;

            case 'customer.subscription.deleted':
                // Downgrade to free
                const { data: delSub } = await supabase
                    .from('subscriptions')
                    .select('user_id')
                    .eq('stripe_customer_id', subscription.customer as string)
                    .single();

                if (delSub) {
                    await supabase.from('subscriptions').update({
                        status: 'canceled',
                        // tier: 'free',
                        updated_at: new Date().toISOString(),
                    }).eq('user_id', delSub.user_id);
                }
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error: any) {
        console.error('Error processing webhook:', error);
        return new NextResponse('Webhook handler failed', { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}
