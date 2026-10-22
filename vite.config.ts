import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Custom dev server middleware to support /api/create-checkout and /api/webhooks/payment locally
function paylockApiDevPlugin(): Plugin {
  return {
    name: 'paylock-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, stripe-signature');

        if (req.method === 'OPTIONS') {
          res.statusCode = 200;
          return res.end();
        }

        // Read request body
        const buffers: Buffer[] = [];
        for await (const chunk of req) {
          buffers.push(chunk);
        }
        const rawBody = Buffer.concat(buffers).toString();
        let body: any = {};
        try {
          if (rawBody) {
            body = JSON.parse(rawBody);
          }
        } catch {
          body = {};
        }

        // Route: /api/create-checkout
        if (req.url === '/api/create-checkout' && req.method === 'POST') {
          const {
            deliverableId = 'demo',
            price = 1500,
            stripeAccountId = 'acct_1N48K2PayLockDemo',
            platformFeePercent = 3,
          } = body;

          const totalAmount = Number(price);
          const feeRate = (Number(platformFeePercent) || 3) / 100;
          const platformFee = Math.round(totalAmount * feeRate * 100) / 100;
          const creatorPayout = Math.round((totalAmount - platformFee) * 100) / 100;
          const sessionId = 'cs_paylock_' + Math.random().toString(36).substring(2, 12);

          const payload = {
            success: true,
            sessionId,
            mode: 'stripe_connect_direct',
            deliverableId,
            split: {
              totalAmount,
              platformFee, // 3%
              creatorPayout, // 97%
              destinationAccount: stripeAccountId,
              feePercentage: (feeRate * 100).toFixed(1) + '%',
              creatorPercentage: ((1 - feeRate) * 100).toFixed(1) + '%',
            },
            checkoutUrl: `/p/${deliverableId}?session_id=${sessionId}&success=true`,
            message: `Stripe Connect Direct Charge generated. 97% ($${creatorPayout}) routed to creator ${stripeAccountId}, 3% ($${platformFee}) platform fee retained.`,
          };

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify(payload));
        }

        // Route: /api/webhooks/payment
        if (req.url === '/api/webhooks/payment' && req.method === 'POST') {
          const deliverableId = body?.data?.object?.metadata?.deliverableId || body?.deliverableId || 'demo';
          const totalAmount = Number(body?.totalAmount || 1500);
          const platformFee = Math.round(totalAmount * 0.03 * 100) / 100;
          const creatorPayout = Math.round((totalAmount - platformFee) * 100) / 100;

          const webhookResult = {
            received: true,
            event: 'checkout.session.completed',
            verified: true,
            deliverableId,
            status: 'PAID',
            unlocked: true,
            timestamp: new Date().toISOString(),
            paymentDetails: {
              totalAmount,
              platformFee,
              creatorPayout,
              creatorAccountId: body?.stripeAccountId || 'acct_1N48K2PayLockDemo',
            },
            message: `Webhook verified. Deliverable ${deliverableId} unlocked. 97% ($${creatorPayout}) routed to creator, 3% ($${platformFee}) platform fee.`,
          };

          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          return res.end(JSON.stringify(webhookResult));
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    paylockApiDevPlugin(),
  ],
})
