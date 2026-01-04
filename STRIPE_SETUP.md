# Stripe Setup Guide 💳

To make the Payment/Upgrade flow work, you need to add your Stripe Keys to the `.env.local` file.

## 1. Get Your Keys
Go to the [Stripe Dashboard API Keys page](https://dashboard.stripe.com/test/apikeys).

## 2. Edit `.env.local`
Add the following lines to your existing `.env.local` file:

```bash
# STRIPE KEYS
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## 3. Webhook Secret (Critical)
To test payments locally:

1.  Open a new terminal.
2.  Run: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3.  Copy the `whsec_...` signing secret it gives you.
4.  Paste it into `STRIPE_WEBHOOK_SECRET`.

## 4. Product IDs
In `app/plans/page.tsx` line 48, update the `priceIds` object with your real Stripe Price IDs (looks like `price_...`).
