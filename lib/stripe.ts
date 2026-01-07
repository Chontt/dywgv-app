import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    typescript: true,
});

type PlanInterval = 'monthly' | 'yearly';
type Market = 'US' | 'TH' | 'JP' | 'KR' | string;

/**
 * Single Source of Truth for resolving Stripe Price IDs based on Market/Region.
 * Defaults to 'US' (USD) if market is unknown or unsupported.
 */
export const resolveStripePriceId = (interval: PlanInterval, market: Market = 'US') => {
    // Normalize market code (e.g. 'th-TH' -> 'TH', 'en-US' -> 'US')
    // We assume the incoming market/locale string starts with the language code mostly (e.g. 'th', 'ja', 'ko')
    // except for 'en' which defaults to US.

    // Simple logic: mapping language/locale prefix to Market Code
    let region = market?.split('-')[0]?.toUpperCase() || 'US';

    // Map language codes to Regions if necessary (e.g. 'JA' -> 'JP', 'KO' -> 'KR')
    if (region === 'JA') region = 'JP';
    if (region === 'KO') region = 'KR';
    if (region === 'EN') region = 'US';

    let envKeyMonthly = 'STRIPE_PRICE_ID_MONTHLY'; // Default USD
    let envKeyYearly = 'STRIPE_PRICE_ID_YEARLY';   // Default USD

    switch (region) {
        case 'TH':
            envKeyMonthly = 'STRIPE_PRICE_ID_MONTHLY_TH';
            envKeyYearly = 'STRIPE_PRICE_ID_YEARLY_TH';
            break;
        case 'JP':
            envKeyMonthly = 'STRIPE_PRICE_ID_MONTHLY_JP';
            envKeyYearly = 'STRIPE_PRICE_ID_YEARLY_JP';
            break;
        case 'KR':
            envKeyMonthly = 'STRIPE_PRICE_ID_MONTHLY_KR';
            envKeyYearly = 'STRIPE_PRICE_ID_YEARLY_KR';
            break;
        default:
            // fallback to US/Global is already set above
            break;
    }

    const priceId = interval === 'monthly' ? process.env[envKeyMonthly] : process.env[envKeyYearly];

    // Safety Fallback: Use Default USD if specific region key is missing in .env
    if (!priceId) {
        return interval === 'monthly'
            ? process.env.STRIPE_PRICE_ID_MONTHLY
            : process.env.STRIPE_PRICE_ID_YEARLY;
    }

    return priceId;
};

// Legacy helper compatibility (optional, can be removed if strictly refactoring everything)
export const getStripePriceId = (interval: PlanInterval, locale: string = 'en') => {
    return resolveStripePriceId(interval, locale);
};

export const getOrCreateStripeCustomer = async (email: string, userId: string, supabase: any) => {
    // 1. Check DB first
    const { data: sub } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .single();

    if (sub?.stripe_customer_id) {
        return sub.stripe_customer_id;
    }

    // 2. Search Stripe by email
    const customers = await stripe.customers.list({ email: email, limit: 1 });
    if (customers.data.length > 0) {
        // Save to DB
        const customerId = customers.data[0].id;
        await supabase.from('subscriptions').upsert({ user_id: userId, stripe_customer_id: customerId });
        return customerId;
    }

    // 3. Create new customer
    const customer = await stripe.customers.create({
        email: email,
        metadata: { supabase_user_id: userId }
    });

    // Save to DB
    await supabase.from('subscriptions').upsert({ user_id: userId, stripe_customer_id: customer.id });
    return customer.id;
};
