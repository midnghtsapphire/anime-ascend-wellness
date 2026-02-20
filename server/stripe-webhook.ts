import Stripe from "stripe";
import { Request, Response } from "express";
import { getDb } from "./db";
import { users, subscriptions, payments } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error("[Webhook] Signature verification failed:", err);
    return res.status(400).json({ error: "Webhook signature verification failed" });
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  const db = await getDb();
  if (!db) {
    console.error("[Webhook] Database unavailable");
    return res.status(500).json({ error: "Database unavailable" });
  }

  try {
    switch (event.type) {
      // ============================================================================
      // CHECKOUT SESSION COMPLETED
      // ============================================================================
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log("[Webhook] Checkout session completed:", session.id);

        const userId = parseInt(session.client_reference_id || "0");
        if (!userId) {
          console.error("[Webhook] No user ID in session");
          return res.status(400).json({ error: "Invalid session" });
        }

        // Update user with Stripe customer ID
        if (session.customer) {
          await db
            .update(users)
            .set({
              stripeCustomerId: session.customer as string,
            })
            .where(eq(users.id, userId));
        }

        break;
      }

      // ============================================================================
      // CUSTOMER SUBSCRIPTION UPDATED
      // ============================================================================
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription & {
          current_period_start: number;
          current_period_end: number;
          canceled_at: number | null;
        };
        console.log("[Webhook] Subscription updated:", subscription.id);

        // Find user by Stripe customer ID
        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, subscription.customer as string))
          .limit(1);

        if (!userResult.length) {
          console.error("[Webhook] User not found for subscription");
          break;
        }

        const user = userResult[0];

        // Update or create subscription record
        const existingSubscription = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, user.id))
          .limit(1);

        const status = subscription.status as
          | "active"
          | "past_due"
          | "canceled"
          | "expired";

        if (existingSubscription.length) {
          await db
            .update(subscriptions)
          .set({
            stripeSubscriptionId: subscription.id,
            status,
            billingCycleStart: new Date((subscription.current_period_start as number) * 1000),
            billingCycleEnd: new Date((subscription.current_period_end as number) * 1000),
            canceledAt:
              (subscription.canceled_at as number | null) !== null
                ? new Date((subscription.canceled_at as number) * 1000)
                : null,
          })
            .where(eq(subscriptions.userId, user.id));
        } else {
          await db.insert(subscriptions).values({
            userId: user.id,
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            tier: "premium",
            status,
            tokensPerMonth: 50,
            currentTokens: 50,
            billingCycleStart: new Date((subscription.current_period_start as number) * 1000),
            billingCycleEnd: new Date((subscription.current_period_end as number) * 1000),
          });
        }

        // Update user subscription status
        await db
          .update(users)
          .set({
            subscriptionStatus: status,
            subscriptionEndsAt: new Date((subscription.current_period_end as number) * 1000),
          })
          .where(eq(users.id, user.id));

        break;
      }

      // ============================================================================
      // CUSTOMER SUBSCRIPTION DELETED
      // ============================================================================
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription & {
          current_period_start: number;
          current_period_end: number;
          canceled_at: number | null;
        };
        console.log("[Webhook] Subscription deleted:", subscription.id);

        const userResult = await db
          .select()
          .from(users)
          .where(eq(users.stripeCustomerId, subscription.customer as string))
          .limit(1);

        if (!userResult.length) break;

        const user = userResult[0];

        // Update subscription status
        await db
          .update(subscriptions)
          .set({
            status: "canceled",
            canceledAt: new Date(),
          })
          .where(eq(subscriptions.userId, user.id));

        // Reset user to free tier
        await db
          .update(users)
          .set({
            subscriptionTier: "free",
            subscriptionStatus: "canceled",
            tokenBalance: 5,
          })
          .where(eq(users.id, user.id));

        break;
      }

      // ============================================================================
      // PAYMENT INTENT SUCCEEDED
      // ============================================================================
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] Payment succeeded:", paymentIntent.id);

        const userId = parseInt(paymentIntent.metadata?.user_id || "0");
        if (!userId) {
          console.error("[Webhook] No user ID in payment intent");
          break;
        }

        // Record payment
        await db.insert(payments).values({
          userId,
          stripePaymentIntentId: paymentIntent.id,
          amount: (paymentIntent.amount / 100).toString(),
          currency: paymentIntent.currency.toUpperCase(),
          status: "succeeded",
          description: paymentIntent.description || "Subscription payment",
          metadata: paymentIntent.metadata,
        });

        break;
      }

      // ============================================================================
      // PAYMENT INTENT FAILED
      // ============================================================================
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("[Webhook] Payment failed:", paymentIntent.id);

        const userId = parseInt(paymentIntent.metadata?.user_id || "0");
        if (!userId) break;

        // Record failed payment
        await db.insert(payments).values({
          userId,
          stripePaymentIntentId: paymentIntent.id,
          amount: (paymentIntent.amount / 100).toString(),
          currency: paymentIntent.currency.toUpperCase(),
          status: "failed",
          description: paymentIntent.description || "Failed payment",
          metadata: paymentIntent.metadata,
        });

        break;
      }

      // ============================================================================
      // INVOICE PAID
      // ============================================================================
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("[Webhook] Invoice paid:", invoice.id);

        // Invoice payment is handled by subscription.updated
        // This is just for logging
        break;
      }

      default:
        console.log("[Webhook] Unhandled event type:", event.type);
    }

    return res.json({ received: true });
  } catch (error) {
    console.error("[Webhook] Error processing event:", error);
    return res.status(500).json({ error: "Webhook processing failed" });
  }
}
