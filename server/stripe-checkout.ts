import Stripe from "stripe";
import { STRIPE_PRODUCTS } from "./products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export type SubscriptionTierType = "premium" | "pro";

export async function createCheckoutSession(
  userId: number,
  userEmail: string | undefined,
  userName: string | undefined,
  tier: SubscriptionTierType,
  origin: string
) {
  const product = STRIPE_PRODUCTS[tier.toUpperCase() as keyof typeof STRIPE_PRODUCTS];

  if (!product) {
    throw new Error(`Invalid subscription tier: ${tier}`);
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    customer_email: userEmail,
    client_reference_id: userId.toString(),
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.price,
          recurring: {
            interval: product.interval as "month" | "year",
            interval_count: 1,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      user_id: userId.toString(),
      customer_email: userEmail || "",
      customer_name: userName || "",
      tier,
    },
    allow_promotion_codes: true,
    success_url: `${origin}/dashboard?payment=success`,
    cancel_url: `${origin}/pricing?payment=canceled`,
  });

  return session.url;
}

export async function getOrCreateCustomer(
  userId: number,
  userEmail: string | undefined,
  userName: string | undefined,
  stripeCustomerId?: string
) {
  if (stripeCustomerId) {
    return stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: userEmail,
    name: userName,
    metadata: {
      user_id: userId.toString(),
    },
  });

  return customer.id;
}
