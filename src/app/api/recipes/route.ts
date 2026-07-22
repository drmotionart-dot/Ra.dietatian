import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models";
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
    const limit = parseInt(searchParams.get("limit") || "50");

    const filter: Record<string, unknown> = {
      $or: [{ userId: session.user.id }, { userId: { $exists: false } }],
    };

    const conditions: unknown[] = [];

    if (query) {
      conditions.push({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { nameAr: { $regex: query, $options: "i" } },
        ],
      });
    }

    if (category && category !== "all") {
      filter.category = category;
    }

    if (conditions.length > 0) {
      filter.$and = conditions;
    }

    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error("Get recipes error:", error);
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

    const recipe = await Recipe.create({
      userId: session.user.id,
      name: body.name,
      nameAr: body.nameAr,
      description: body.description,
      category: body.category,
      cuisineStyle: body.cuisineStyle,
      cookingMethod: body.cookingMethod,
      instructions: body.instructions || [],
      instructionsAr: body.instructionsAr || [],
      prepTimeMinutes: body.prepTimeMinutes,
      cookTimeMinutes: body.cookTimeMinutes,
      difficulty: body.difficulty || "easy",
      nutritionPerServing: body.nutritionPerServing || {},
      servingsCount: body.servingsCount || 1,
    });

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error("Create recipe error:", error);
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
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
    }

    await Recipe.deleteOne({ _id: id, userId: session.user.id });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete recipe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
