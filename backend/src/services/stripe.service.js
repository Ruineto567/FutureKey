import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });
export const PRICES = { starter:process.env.STRIPE_PRICE_STARTER, pro:process.env.STRIPE_PRICE_PRO, agency:process.env.STRIPE_PRICE_AGENCY };
