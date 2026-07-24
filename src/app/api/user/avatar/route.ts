import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models";
import { auth } from "@/lib/auth";

const MAX_SIZE = 200 * 1024; // 200KB

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { image } = body;

    if (!image || typeof image !== "string") {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (!image.startsWith("data:image/")) {
      return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
    }

    const sizeBytes = Math.ceil((image.length * 3) / 4);
    if (sizeBytes > MAX_SIZE) {
      return NextResponse.json({ error: "Image too large (max 200KB)" }, { status: 400 });
    }

    await connectDB();
    await User.findByIdAndUpdate(session.user.id, { $set: { image } });

    return NextResponse.json({ image });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    await User.findByIdAndUpdate(session.user.id, { $set: { image: "" } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Avatar delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
