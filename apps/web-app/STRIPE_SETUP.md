# Stripe Integration Setup

TitanFit V2 is now ready to process payments. Follow these steps to activate it.

## 1. Get your API Keys
Go to the [Stripe Dashboard](https://dashboard.stripe.com/apikeys) (Developers > API keys).
Copy:
- **Publishable key** (`pk_test_...`)
- **Secret key** (`sk_test_...`)

## 2. Configure Environment
Add these to your `.env.local` file:

```bash
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

## 3. Set up Webhooks (Critical)
To make sure users maintain their premium status after paying, you must set up webhooks.

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks).
2. Click **Add endpoint**.
3. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
   - For local testing, use the Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.deleted`
5. Click **Add endpoint**.
6. Reveal the **Signing secret** (`whsec_...`).
7. Add it to your `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 4. Testing
1. Click the "Devenir Titan" button in the Dashboard.
2. Use a [Stripe Test Card](https://stripe.com/docs/testing) (e.g., 4242 4242 4242 4242).
3. Check your Profile page or Supabase table (`profiles.is_premium` should be `true`).
