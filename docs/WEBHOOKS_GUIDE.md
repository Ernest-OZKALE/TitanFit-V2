# TitanFit V2 - Webhooks Configuration Guide

## 🪝 Overview

Webhooks allow external services to notify your application about events in real-time. This guide covers setting up and managing webhooks for TitanFit V2.

---

## 📋 Supported Webhook Events

### Stripe Payment Events
- `payment_intent.succeeded` - Payment successful
- `payment_intent.failed` - Payment failed
- `customer.subscription.created` - New subscription
- `customer.subscription.updated` - Subscription modified
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_succeeded` - Invoice paid
- `invoice.payment_failed` - Invoice payment failed

### Application Events
- `user.created` - New user registered
- `user.updated` - User profile updated
- `user.deleted` - User account deleted
- `order.created` - New order placed
- `order.completed` - Order fulfilled
- `order.refunded` - Order refunded

---

## 🔧 Setup Instructions

### 1. Stripe Webhooks

**Step 1: Create Webhook Endpoint**

File: `src/app/api/webhooks/stripe/route.ts`

```typescript
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;
    
    case 'customer.subscription.created':
      const subscription = event.data.object;
      await handleSubscriptionCreated(subscription);
      break;
    
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object;
      await handleSubscriptionCancelled(deletedSubscription);
      break;
    
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  // Update order status in database
  const { error } = await supabase
    .from('orders')
    .update({ 
      status: 'completed',
      payment_intent_id: paymentIntent.id 
    })
    .eq('payment_intent_id', paymentIntent.id);
  
  if (error) console.error('Error updating order:', error);
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  // Create subscription record
  const { error } = await supabase
    .from('subscriptions')
    .insert({
      stripe_subscription_id: subscription.id,
      customer_id: subscription.customer as string,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000),
    });
  
  if (error) console.error('Error creating subscription:', error);
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  // Update subscription status
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('stripe_subscription_id', subscription.id);
  
  if (error) console.error('Error cancelling subscription:', error);
}
```

**Step 2: Configure Stripe Dashboard**

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter URL: `https://titanfit.com/api/webhooks/stripe`
4. Select events to listen to
5. Copy webhook signing secret
6. Add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

### 2. Custom Application Webhooks

**Webhook Registry Table** (Supabase):

```sql
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_triggered_at TIMESTAMPTZ
);
```

**Webhook Delivery Service**:

File: `src/lib/webhook-service.ts`

```typescript
import { supabase } from './supabase';
import crypto from 'crypto';

export async function triggerWebhook(event: string, data: any) {
  // Fetch all active webhooks listening to this event
  const { data: webhooks } = await supabase
    .from('webhooks')
    .select('*')
    .eq('active', true)
    .contains('events', [event]);

  if (!webhooks || webhooks.length === 0) return;

  // Trigger each webhook
  for (const webhook of webhooks) {
    try {
      const signature = generateSignature(webhook.secret, data);
      
      await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Signature': signature,
          'X-Webhook-Event': event,
        },
        body: JSON.stringify(data),
      });

      // Update last triggered timestamp
      await supabase
        .from('webhooks')
        .update({ last_triggered_at: new Date().toISOString() })
        .eq('id', webhook.id);
        
    } catch (error) {
      console.error(`Webhook delivery failed for ${webhook.name}:`, error);
    }
  }
}

function generateSignature(secret: string, data: any): string {
  const payload = JSON.stringify(data);
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}
```

**Usage Example**:

```typescript
import { triggerWebhook } from '@/lib/webhook-service';

// When user registers
await triggerWebhook('user.created', {
  id: user.id,
  email: user.email,
  created_at: user.created_at,
});

// When order is created
await triggerWebhook('order.created', {
  id: order.id,
  user_id: order.user_id,
  total: order.total,
  items: order.items,
});
```

---

## 🔐 Security Best Practices

### 1. Verify Webhook Signatures

Always verify signatures to ensure webhooks are legitimate:

```typescript
function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

### 2. Use HTTPS Only

Never accept webhooks over HTTP in production.

### 3. Implement Retry Logic

```typescript
async function deliverWebhookWithRetry(
  webhook: Webhook,
  data: any,
  maxRetries = 3
) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        body: JSON.stringify(data),
        timeout: 10000,
      });
      
      if (response.ok) return true;
      
      attempt++;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    } catch (error) {
      attempt++;
    }
  }
  
  return false; // Failed after all retries
}
```

### 4. Rate Limiting

Prevent webhook spam:

```typescript
const webhookRateLimits = new Map<string, number>();

function checkRateLimit(webhookId: string): boolean {
  const now = Date.now();
  const lastCall = webhookRateLimits.get(webhookId) || 0;
  
  if (now - lastCall < 1000) { // 1 second cooldown
    return false;
  }
  
  webhookRateLimits.set(webhookId, now);
  return true;
}
```

---

## 📊 Webhook Management UI

Admin page for managing webhooks: `/admin/webhooks`

**Features:**
- ✅ Add/Edit/Delete webhooks
- ✅ Test webhook delivery
- ✅ View delivery logs
- ✅ Enable/Disable webhooks
- ✅ Regenerate secrets
- ✅ Delivery statistics

---

## 🧪 Testing Webhooks

### Local Development with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start ngrok tunnel
ngrok http 3000

# Use ngrok URL in Stripe dashboard
https://abc123.ngrok.io/api/webhooks/stripe
```

### Manual Testing

```bash
curl -X POST https://titanfit.com/api/webhooks/stripe \
  -H "Content-Type: application/json" \
  -H "stripe-signature: test_signature" \
  -d '{
    "type": "payment_intent.succeeded",
    "data": {
      "object": {
        "id": "pi_test",
        "amount": 5000,
        "currency": "usd",
        "status": "succeeded"
      }
    }
  }'
```

---

## 📈 Monitoring & Logging

### Webhook Event Logs Table

```sql
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID REFERENCES webhooks(id),
  event TEXT NOT NULL,
  payload JSONB NOT NULL,
  status INT NOT NULL, -- HTTP status code
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Monitoring Dashboard

Track:
- Total webhook deliveries
- Success/failure rates
- Average response time
- Failed deliveries requiring retry

---

**Last Updated**: 2026-01-13  
**Version**: 1.0  
**Contact**: tech@titanfit.com
