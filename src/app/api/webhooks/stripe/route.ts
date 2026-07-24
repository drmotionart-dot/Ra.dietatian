import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";
import Stripe from "stripe";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-06-24.dahlia" });
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  await connectDB();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (userId && session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const periodEnd = (subscription as unknown as { items: { data: Array<{ current_period_end: number }> } }).items.data[0]?.current_period_end;
      const expiresAt = new Date((periodEnd || Date.now() / 1000 + 30 * 86400) * 1000);
      await User.findByIdAndUpdate(userId, { $set: { tier: "premium", premiumExpiresAt: expiresAt } });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = (subscription as unknown as { customer: string | null }).customer;
    if (customerId) {
      await User.findOneAndUpdate(
        { stripeCustomerId: customerId },
        { $set: { tier: "free" } }
      );
    }
  }

  return NextResponse.json({ received: true });
}
