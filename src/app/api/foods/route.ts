import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Food } from "@/models";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50") || 50, 200);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0") || 0, 0);

    const filter: Record<string, unknown> = {};

    if (query) {
      const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { name: { $regex: safe, $options: "i" } },
        { nameAr: { $regex: safe, $options: "i" } },
        { brand: { $regex: safe, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    const [foods, total] = await Promise.all([
      Food.find(filter).sort({ name: 1 }).skip(offset).limit(limit).lean(),
      Food.countDocuments(filter),
    ]);

    return NextResponse.json({ foods, total, limit, offset });
  } catch (error) {
    console.error("Food search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { name, nameAr, brand, category, servingSize, servingUnit, servingDescription, barcode, nutrientProfile } = body;

    if (!name || !category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }

    const food = await Food.create({
      name,
      nameAr,
      brand,
      category,
      servingSize: servingSize || 100,
      servingUnit: servingUnit || "g",
      servingDescription,
      barcode,
      nutrientProfile: nutrientProfile || undefined,
      source: "user",
      dataQuality: "user-entered",
    });

    return NextResponse.json({ food }, { status: 201 });
  } catch (error) {
    console.error("Food creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
