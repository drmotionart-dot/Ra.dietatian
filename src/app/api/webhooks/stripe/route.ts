import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-06-24.dahlia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET || "");
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
      const subData = subscription as unknown as { items: { data: Array<{ current_period_end: number }> } };
      const periodEnd = subData.items.data[0]?.current_period_end;
      const expiresAt = new Date((periodEnd || Date.now() / 1000 + 30 * 86400) * 1000);
      await User.findByIdAndUpdate(userId, { $set: { tier: "premium", premiumExpiresAt: expiresAt } });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const subData = subscription as unknown as { customer: string | null };
    if (subData.customer) {
      await User.findOneAndUpdate(
        { stripeCustomerId: subData.customer },
        { $set: { tier: "free" } }
      );
    }
  }

  return NextResponse.json({ received: true });
}
