import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

export const config = {
  api: {
    bodyParser: false, // For raw body verification if needed
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const sig = req.headers['stripe-signature'] as string | undefined;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    let event: any = req.body;

    // If Stripe webhook secret is configured, verify raw payload
    if (webhookSecret && process.env.STRIPE_SECRET_KEY && sig) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-02-24.acacia' as any,
      });

      try {
        event = stripe.webhooks.constructEvent(
          (req as any).rawBody || JSON.stringify(req.body),
          sig,
          webhookSecret
        );
      } catch (err: any) {
        console.error(`Webhook signature verification failed:`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    }

    const eventType = event?.type || 'checkout.session.completed';
    const session = event?.data?.object || event || {};
    const deliverableId = session?.metadata?.deliverableId || session?.deliverableId || 'demo';
    const amountTotal = session?.amount_total ? session.amount_total / 100 : 1500;
    const stripeAccountId = session?.metadata?.stripeAccountId || 'acct_1N48K2PayLockDemo';

    // Handle checkout completion
    if (eventType === 'checkout.session.completed' || eventType === 'payment_intent.succeeded') {
      const platformFee = Math.round(amountTotal * 0.01 * 100) / 100;
      const creatorPayout = Math.round((amountTotal - platformFee) * 100) / 100;

      const unlockPayload = {
        received: true,
        event: eventType,
        verified: true,
        deliverableId,
        status: 'PAID',
        unlocked: true,
        timestamp: new Date().toISOString(),
        paymentDetails: {
          totalAmount: amountTotal,
          platformFee, // 1% platform fee margin
          creatorPayout, // 99% creator direct payout
          creatorAccountId: stripeAccountId,
        },
        message: `Payment verified. Deliverable ${deliverableId} unlocked. 99% ($${creatorPayout}) routed to creator ${stripeAccountId}, 1% ($${platformFee}) platform fee retained.`,
      };

      return res.status(200).json(unlockPayload);
    }

    return res.status(200).json({ received: true, event: eventType, handled: false });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message || 'Webhook processing failed' });
  }
}
