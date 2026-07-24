import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";
import { checkRateLimit } from "@/lib/rate-limit";

function getClientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const { allowed, retryAfterMs } = checkRateLimit(`register:${ip}`, {
      windowMs: 15 * 60 * 1000,
      maxRequests: 5,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: `Too many registration attempts. Try again in ${Math.ceil(retryAfterMs / 60000)} minutes.` },
        { status: 429 }
      );
    }

    await connectDB();
    const { name, email, password, sex, dateOfBirth, heightCm, weightKg, goal, activityLevel } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email }).lean();

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      passwordHash,
      sex,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      heightCm,
      goal,
      activityLevel,
    });

    return NextResponse.json(
      { user: { id: user._id.toString(), name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
