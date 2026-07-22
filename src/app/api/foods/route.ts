import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Food } from "@/models";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    const filter: Record<string, unknown> = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: "i" } },
        { nameAr: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } },
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
