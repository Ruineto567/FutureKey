// backend/src/routes/billing.routes.js

import express from 'express';
import { authRequired as auth } from '../middlewares/auth.middleware.js';
import * as billingController from '../controllers/billing.controller.js';

const router = express.Router();

/**
 * @route   POST /api/billing/checkout
 * @desc    Cria sessão de checkout do Stripe
 * @access  Privado
 */
router.post('/checkout', auth, billingController.createCheckoutSession);

/**
 * @route   POST /api/billing/webhook
 * @desc    Recebe eventos do Stripe (webhook)
 * @access  Público (mas validado pelo Stripe)
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // necessário para verificação da assinatura do Stripe
  billingController.webhook
);

export default router;
