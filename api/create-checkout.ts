import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const {
      deliverableId = 'demo',
      deliverableTitle = 'PayLock Master Deliverable',
      clientName = 'Client',
      price = 1500,
      stripeAccountId = 'acct_1N48K2PayLockDemo',
      platformFeePercent = 3, // 3% Platform Fee, 97% Creator
    } = req.body || {};

    const origin = req.headers.origin || 'http://localhost:5173';
    const totalAmountCents = Math.round(Number(price) * 100);
    const feeRate = (Number(platformFeePercent) || 3) / 100;
    const applicationFeeCents = Math.round(totalAmountCents * feeRate);
    const creatorPayoutCents = totalAmountCents - applicationFeeCents;

    const payoutSplit = {
      totalAmount: Number(price),
      platformFee: applicationFeeCents / 100,
      creatorPayout: creatorPayoutCents / 100,
      destinationAccount: stripeAccountId,
      feePercentage: (feeRate * 100).toFixed(1) + '%',
      creatorPercentage: ((1 - feeRate) * 100).toFixed(1) + '%',
    };

    // If live Stripe secret key is available in environment
    if (process.env.STRIPE_SECRET_KEY) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-02-24.acacia' as any,
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: deliverableTitle,
                description: `PayLock Asset Release for ${clientName} • Guaranteed Escrow`,
              },
              unit_amount: totalAmountCents,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        // Stripe Connect Direct / Destination Charges split
        payment_intent_data: {
          application_fee_amount: applicationFeeCents, // 3% to platform
          transfer_data: {
            destination: stripeAccountId, // 97% to creator
          },
          metadata: {
            deliverableId,
            clientName,
            stripeAccountId,
            platformFee: (applicationFeeCents / 100).toString(),
            creatorPayout: (creatorPayoutCents / 100).toString(),
          },
        },
        metadata: {
          deliverableId,
          clientName,
          stripeAccountId,
        },
        success_url: `${origin}/p/${deliverableId}?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancel_url: `${origin}/p/${deliverableId}?canceled=true`,
      });

      return res.status(200).json({
        success: true,
        sessionId: session.id,
        url: session.url,
        split: payoutSplit,
        mode: 'live_stripe',
      });
    }

    // Development / Sandbox Simulated Mode when no live Stripe keys are provided
    const mockSessionId = 'cs_test_' + Math.random().toString(36).substring(2, 14);
    return res.status(200).json({
      success: true,
      sessionId: mockSessionId,
      url: `${origin}/p/${deliverableId}?session_id=${mockSessionId}&success=true`,
      split: payoutSplit,
      mode: 'simulated_stripe_connect',
      message: 'Checkout session created with Stripe Connect Direct Charges (3% platform fee, 97% creator destination payout).',
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error while creating checkout session',
    });
  }
}
