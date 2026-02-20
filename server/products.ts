/**
 * Stripe Products Configuration
 * Defines all subscription tiers and pricing for Anime Ascend Wellness
 */

export const STRIPE_PRODUCTS = {
  PREMIUM: {
    name: "Premium",
    description: "50 AI messages per month + advanced features",
    price: 999, // $9.99 in cents
    currency: "usd",
    interval: "month",
    tokensPerMonth: 50,
  },
  PRO: {
    name: "Pro",
    description: "200 AI messages per month + all features",
    price: 1999, // $19.99 in cents
    currency: "usd",
    interval: "month",
    tokensPerMonth: 200,
  },
};

export const SUBSCRIPTION_TIERS = {
  free: {
    name: "Free",
    tokensPerMonth: 5,
    features: [
      "Basic habit tracking",
      "Mood logging",
      "Community access",
    ],
  },
  premium: {
    name: "Premium",
    tokensPerMonth: 50,
    features: [
      "Everything in Free",
      "Advanced analytics",
      "Guided meditations",
      "Priority support",
    ],
  },
  pro: {
    name: "Pro",
    tokensPerMonth: 200,
    features: [
      "Everything in Premium",
      "Personalized recommendations",
      "Early access to features",
      "1-on-1 coaching",
    ],
  },
};

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;
