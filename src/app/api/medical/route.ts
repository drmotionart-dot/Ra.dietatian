import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { MedicalKnowledge } from "@/models";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const foodId = searchParams.get("foodId");
    const query = searchParams.get("q");
    const category = searchParams.get("category");

    if (foodId) {
      const knowledge = await MedicalKnowledge.findOne({ foodId }).lean();
      if (!knowledge) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json({ knowledge });
    }

    const filter: Record<string, unknown> = {};
    if (query) {
      const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { foodId: { $regex: safe, $options: "i" } },
        { foodCategory: { $regex: safe, $options: "i" } },
      ];
    }
    if (category) {
      filter.foodCategory = category;
    }

    const knowledge = await MedicalKnowledge.find(filter).limit(50).lean();
    return NextResponse.json({ knowledge });
  } catch (error) {
    console.error("Get medical knowledge error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
