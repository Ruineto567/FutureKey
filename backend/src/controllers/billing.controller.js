// backend/src/controllers/billing.controller.js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

/**
 * Retorna o ID de preço correspondente ao plano
 */
function getPriceId(plan) {
  switch (plan) {
    case 'starter': return process.env.STRIPE_PRICE_STARTER;
    case 'pro':     return process.env.STRIPE_PRICE_PRO;
    case 'agency':  return process.env.STRIPE_PRICE_AGENCY;
    default:        return null;
  }
}

/**
 * Cria uma sessão de checkout do Stripe
 */
export async function createCheckoutSession(req, res) {
  try {
    const { plan } = req.body;

    const price = getPriceId(plan);
    if (!price) return res.status(400).json({ error: 'Plano inválido' });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price, quantity: 1 }],
      success_url: `${process.env.FRONTEND_BASE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/billing/cancel`,
      metadata: {
        // client_reference_id: req.userId, // opcional
      },
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error('[billing] Erro ao criar sessão de checkout:', e);
    res.status(500).json({ error: 'Erro ao criar sessão de pagamento' });
  }
}

/**
 * Webhook de eventos do Stripe
 */
export async function webhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    let event;

    if (secret) {
      event = stripe.webhooks.constructEvent(req.body, sig, secret);
    } else {
      event = req.body; // Em dev: usar mock direto
    }

    switch (event.type) {
      case 'checkout.session.completed':
        console.log('💰 Pagamento confirmado:', event.data.object.id);
        break;
      // TODO: lidar com subscription.updated, etc.
      default:
        console.log(`⚠️ Evento não tratado: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (e) {
    console.error('[billing] Erro no webhook:', e.message);
    res.status(400).send(`Webhook Error: ${e.message}`);
  }
}
