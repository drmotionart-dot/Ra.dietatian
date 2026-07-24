import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Recipe } from "@/models";
import { auth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();

    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50") || 50, 200);

    const filter: Record<string, unknown> = session?.user?.id
      ? { $or: [{ userId: session.user.id }, { userId: { $exists: false } }] }
      : { userId: { $exists: false } };

    const conditions: unknown[] = [];

    if (query) {
      const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      conditions.push({
        $or: [
          { name: { $regex: safe, $options: "i" } },
          { nameAr: { $regex: safe, $options: "i" } },
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

    if (!body.name || typeof body.name !== "string" || body.name.trim().length === 0) {
      return NextResponse.json({ error: "Recipe name is required" }, { status: 400 });
    }

    const validCategories = ["breakfast", "lunch", "dinner", "snack", "dessert", "appetizer", "soup", "salad", "beverage"];
    const validDifficulties = ["easy", "medium", "hard"];

    const recipe = await Recipe.create({
      userId: session.user.id,
      name: body.name.trim(),
      nameAr: body.nameAr,
      description: body.description,
      category: validCategories.includes(body.category) ? body.category : "lunch",
      cuisineStyle: body.cuisineStyle,
      cookingMethod: body.cookingMethod,
      instructions: Array.isArray(body.instructions) ? body.instructions : [],
      instructionsAr: Array.isArray(body.instructionsAr) ? body.instructionsAr : [],
      prepTimeMinutes: typeof body.prepTimeMinutes === "number" ? body.prepTimeMinutes : 0,
      cookTimeMinutes: typeof body.cookTimeMinutes === "number" ? body.cookTimeMinutes : 0,
      difficulty: validDifficulties.includes(body.difficulty) ? body.difficulty : "easy",
      nutritionPerServing: typeof body.nutritionPerServing === "object" ? body.nutritionPerServing : {},
      servingsCount: typeof body.servingsCount === "number" ? body.servingsCount : 1,
    });

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error("Create recipe error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
    }

    const validCategories = ["breakfast", "lunch", "dinner", "snack", "dessert", "appetizer", "soup", "salad", "beverage"];
    const validDifficulties = ["easy", "medium", "hard"];

    const updates: Record<string, unknown> = {};
    if (body.name) updates.name = body.name.trim();
    if (body.nameAr !== undefined) updates.nameAr = body.nameAr;
    if (body.description !== undefined) updates.description = body.description;
    if (body.category && validCategories.includes(body.category)) updates.category = body.category;
    if (body.cuisineStyle !== undefined) updates.cuisineStyle = body.cuisineStyle;
    if (body.cookingMethod !== undefined) updates.cookingMethod = body.cookingMethod;
    if (Array.isArray(body.instructions)) updates.instructions = body.instructions;
    if (Array.isArray(body.instructionsAr)) updates.instructionsAr = body.instructionsAr;
    if (Array.isArray(body.tips)) updates.tips = body.tips;
    if (Array.isArray(body.tipsAr)) updates.tipsAr = body.tipsAr;
    if (typeof body.prepTimeMinutes === "number") updates.prepTimeMinutes = body.prepTimeMinutes;
    if (typeof body.cookTimeMinutes === "number") updates.cookTimeMinutes = body.cookTimeMinutes;
    if (body.difficulty && validDifficulties.includes(body.difficulty)) updates.difficulty = body.difficulty;
    if (typeof body.nutritionPerServing === "object") updates.nutritionPerServing = body.nutritionPerServing;
    if (typeof body.servingsCount === "number") updates.servingsCount = body.servingsCount;

    const recipe = await Recipe.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { $set: updates },
      { new: true }
    ).lean();

    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Update recipe error:", error);
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
