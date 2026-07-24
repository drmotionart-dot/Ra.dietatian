import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: { tier: "premium", premiumExpiresAt: expiresAt } },
      { new: true }
    ).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      tier: user.tier,
      premiumExpiresAt: user.premiumExpiresAt,
    });
  } catch (error) {
    console.error("Upgrade error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
