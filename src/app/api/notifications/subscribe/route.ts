import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { NotificationPreference } from "@/models";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const subscription = await req.json();

    if (!subscription?.endpoint) {
      return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    await NotificationPreference.findOneAndUpdate(
      { userId: session.user.id },
      {
        $addToSet: { pushSubscriptions: subscription },
        $set: { pushEnabled: true },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { endpoint } = await req.json();

    if (!endpoint) {
      return NextResponse.json({ error: "Missing endpoint" }, { status: 400 });
    }

    await NotificationPreference.findOneAndUpdate(
      { userId: session.user.id },
      {
        $pull: { pushSubscriptions: { endpoint } },
      }
    );

    const remaining = await NotificationPreference.findOne({ userId: session.user.id });
    if (remaining && remaining.pushSubscriptions.length === 0) {
      remaining.pushEnabled = false;
      await remaining.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
