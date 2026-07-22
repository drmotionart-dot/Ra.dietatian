import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

const foodSchema = new mongoose.Schema(
  {
    source: { type: String, default: "usda" },
    name: { type: String, required: true },
    nameAr: String,
    brand: String,
    category: { type: String, required: true },
    servingSize: { type: Number, default: 100 },
    servingUnit: { type: String, default: "g" },
    servingDescription: String,
    nutrientProfile: mongoose.Schema.Types.Mixed,
    dataQuality: { type: String, default: "verified" },
    region: { type: String, default: "egypt" },
  },
  { timestamps: true, collection: "foods" }
);

const Food = mongoose.model("Food", foodSchema);

const additionalFoods = [
  // ── Egyptian/Mediterranean Additions ──────────────────────
  {
    name: "Mish (Egyptian Aged Cheese)",
    nameAr: "مش",
    category: "dairy",
    servingSize: 30,
    servingDescription: "30g (1 slice)",
    region: "egypt",
    nutrientProfile: { calories: 85, protein: 7, carbs: 1, fat: 6, fiber: 0, sugar: 0, sodium: 420, saturatedFat: 4, cholesterol: 25, vitaminA: 5, vitaminC: 0, calcium: 15, iron: 0.3 },
  },
  {
    name: "Domty (Processed Cheese Spread)",
    nameAr: "دمتي",
    category: "dairy",
    servingSize: 30,
    servingDescription: "30g (2 tbsp)",
    region: "egypt",
    nutrientProfile: { calories: 90, protein: 5, carbs: 2, fat: 7, fiber: 0, sugar: 1, sodium: 380, saturatedFat: 4.5, cholesterol: 20, vitaminA: 3, vitaminC: 0, calcium: 12, iron: 0.1 },
  },
  {
    name: "Qamar al-Din (Apricot Nectar)",
    nameAr: "قمر الدين",
    category: "beverages",
    servingSize: 250,
    servingUnit: "ml",
    servingDescription: "1 cup (250ml)",
    region: "egypt",
    nutrientProfile: { calories: 120, protein: 1, carbs: 28, fat: 0, fiber: 1, sugar: 26, sodium: 5, saturatedFat: 0, cholesterol: 0, vitaminA: 15, vitaminC: 2, calcium: 8, iron: 0.5 },
  },
  {
    name: "Sahlab",
    nameAr: "سحلب",
    category: "beverages",
    servingSize: 250,
    servingUnit: "ml",
    servingDescription: "1 cup (250ml)",
    region: "egypt",
    nutrientProfile: { calories: 180, protein: 5, carbs: 30, fat: 5, fiber: 0, sugar: 20, sodium: 80, saturatedFat: 3, cholesterol: 15, vitaminA: 2, vitaminC: 0, calcium: 20, iron: 0.2 },
  },
  {
    name: "Konafa (Plain)",
    nameAr: "كنافة",
    category: "grains",
    servingSize: 100,
    servingDescription: "100g",
    region: "egypt",
    nutrientProfile: { calories: 320, protein: 5, carbs: 45, fat: 14, fiber: 1, sugar: 0, sodium: 180, saturatedFat: 8, cholesterol: 30, vitaminA: 2, vitaminC: 0, calcium: 3, iron: 0.8 },
  },
  {
    name: "Feteer (Plain, Unfilled)",
    nameAr: "فطير",
    category: "grains",
    servingSize: 100,
    servingDescription: "100g",
    region: "egypt",
    nutrientProfile: { calories: 380, protein: 7, carbs: 48, fat: 18, fiber: 1.5, sugar: 0, sodium: 320, saturatedFat: 9, cholesterol: 25, vitaminA: 0, vitaminC: 0, calcium: 5, iron: 1.5 },
  },
  {
    name: "Feteer with Cheese (Meshaltet)",
    nameAr: "فطير مشلتت بالجبنة",
    category: "grains",
    servingSize: 150,
    servingDescription: "150g (1 piece)",
    region: "egypt",
    nutrientProfile: { calories: 520, protein: 14, carbs: 52, fat: 28, fiber: 1, sugar: 0, sodium: 580, saturatedFat: 15, cholesterol: 55, vitaminA: 3, vitaminC: 0, calcium: 12, iron: 1.8 },
  },
  {
    name: "Feteer with Honey",
    nameAr: "فطير بالعسل",
    category: "grains",
    servingSize: 150,
    servingDescription: "150g (1 piece)",
    region: "egypt",
    nutrientProfile: { calories: 480, protein: 7, carbs: 65, fat: 22, fiber: 1, sugar: 35, sodium: 280, saturatedFat: 10, cholesterol: 20, vitaminA: 0, vitaminC: 0, calcium: 5, iron: 1.5 },
  },
  {
    name: "Baba Ghanoush with Tahini",
    nameAr: "بابا غنوج بالطحينة",
    category: "salads",
    servingSize: 100,
    servingDescription: "100g (1/4 cup)",
    region: "egypt",
    nutrientProfile: { calories: 140, protein: 4, carbs: 8, fat: 11, fiber: 3, sugar: 3, sodium: 280, saturatedFat: 1.5, cholesterol: 0, vitaminA: 2, vitaminC: 8, calcium: 3, iron: 0.8 },
  },
  {
    name: "Fatteh Hummus",
    nameAr: "فته حمص",
    category: "salads",
    servingSize: 250,
    servingDescription: "250g (1 bowl)",
    region: "egypt",
    nutrientProfile: { calories: 310, protein: 14, carbs: 32, fat: 14, fiber: 4, sugar: 3, sodium: 420, saturatedFat: 5, cholesterol: 15, vitaminA: 2, vitaminC: 3, calcium: 8, iron: 1.8 },
  },
  {
    name: "Lentil Soup (Shorbat Ads)",
    nameAr: "شوربة عدس",
    category: "soups",
    servingSize: 300,
    servingUnit: "ml",
    servingDescription: "1 bowl (300ml)",
    region: "egypt",
    nutrientProfile: { calories: 180, protein: 10, carbs: 28, fat: 3, fiber: 6, sugar: 3, sodium: 480, saturatedFat: 0.5, cholesterol: 0, vitaminA: 15, vitaminC: 4, calcium: 3, iron: 2.8 },
  },
  {
    name: "Creamy Chicken Soup",
    nameAr: "شوربة دجاج بالقشطة",
    category: "soups",
    servingSize: 300,
    servingUnit: "ml",
    servingDescription: "1 bowl (300ml)",
    region: "egypt",
    nutrientProfile: { calories: 220, protein: 16, carbs: 18, fat: 9, fiber: 2, sugar: 3, sodium: 520, saturatedFat: 3.5, cholesterol: 45, vitaminA: 20, vitaminC: 5, calcium: 4, iron: 0.8 },
  },
  {
    name: "Musakhan (Chicken with Sumac)",
    nameAr: "مسخن دجاج",
    category: "main",
    servingSize: 350,
    servingDescription: "350g (1 plate)",
    region: "egypt",
    nutrientProfile: { calories: 480, protein: 32, carbs: 35, fat: 22, fiber: 3, sugar: 4, sodium: 580, saturatedFat: 6, cholesterol: 85, vitaminA: 8, vitaminC: 12, calcium: 6, iron: 2.2 },
  },
  {
    name: "Ta'ameya (Fried, Egyptian Falafel)",
    nameAr: "طعمية مقلية",
    category: "protein",
    servingSize: 100,
    servingDescription: "4 pieces (100g)",
    region: "egypt",
    nutrientProfile: { calories: 250, protein: 11, carbs: 22, fat: 14, fiber: 5, sugar: 1, sodium: 380, saturatedFat: 2, cholesterol: 0, vitaminA: 3, vitaminC: 4, calcium: 5, iron: 2.8 },
  },
  {
    name: "Ta'ameya (Baked, Egyptian Falafel)",
    nameAr: "طعمية مشوية",
    category: "protein",
    servingSize: 100,
    servingDescription: "4 pieces (100g)",
    region: "egypt",
    nutrientProfile: { calories: 180, protein: 10, carbs: 20, fat: 7, fiber: 5, sugar: 1, sodium: 350, saturatedFat: 1, cholesterol: 0, vitaminA: 3, vitaminC: 4, calcium: 5, iron: 2.8 },
  },

  // ── International Proteins ────────────────────────────────
  {
    name: "Chicken Breast (Grilled, Skinless)",
    nameAr: "صدر دجاج مشوي بدون جلد",
    category: "protein",
    servingSize: 100,
    servingDescription: "100g (3.5 oz)",
    region: "international",
    nutrientProfile: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0, sodium: 74, saturatedFat: 1, cholesterol: 85, vitaminA: 1, vitaminC: 0, calcium: 1, iron: 0.9 },
  },
  {
    name: "Salmon Fillet (Grilled)",
    nameAr: "فيليه سلمون مشوي",
    category: "protein",
    servingSize: 100,
    servingDescription: "100g (3.5 oz)",
    region: "international",
    nutrientProfile: { calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, sugar: 0, sodium: 59, saturatedFat: 3, cholesterol: 55, vitaminA: 1, vitaminC: 0, calcium: 1, iron: 0.3 },
  },
  {
    name: "Beef Sirloin (Grilled)",
    nameAr: "لحم بقري سيرلوين مشوي",
    category: "protein",
    servingSize: 100,
    servingDescription: "100g (3.5 oz)",
    region: "international",
    nutrientProfile: { calories: 271, protein: 26, carbs: 0, fat: 18, fiber: 0, sugar: 0, sodium: 54, saturatedFat: 7, cholesterol: 87, vitaminA: 0, vitaminC: 0, calcium: 1, iron: 2.6 },
  },
  {
    name: "Turkey Breast (Roasted)",
    nameAr: "صدر ديك رومي مشوي",
    category: "protein",
    servingSize: 100,
    servingDescription: "100g (3.5 oz)",
    region: "international",
    nutrientProfile: { calories: 135, protein: 30, carbs: 0, fat: 1, fiber: 0, sugar: 0, sodium: 48, saturatedFat: 0.3, cholesterol: 63, vitaminA: 0, vitaminC: 0, calcium: 1, iron: 0.4 },
  },
  {
    name: "Shrimp (Grilled)",
    nameAr: "جمبري مشوي",
    category: "protein",
    servingSize: 100,
    servingDescription: "100g (3.5 oz)",
    region: "international",
    nutrientProfile: { calories: 99, protein: 24, carbs: 0, fat: 0.3, fiber: 0, sugar: 0, sodium: 111, saturatedFat: 0.1, cholesterol: 189, vitaminA: 1, vitaminC: 0, calcium: 3, iron: 0.5 },
  },
  {
    name: "Tuna Steak (Grilled)",
    nameAr: "-steak تونة مشوي",
    category: "protein",
    servingSize: 100,
    servingDescription: "100g (3.5 oz)",
    region: "international",
    nutrientProfile: { calories: 132, protein: 28, carbs: 0, fat: 1.3, fiber: 0, sugar: 0, sodium: 47, saturatedFat: 0.4, cholesterol: 44, vitaminA: 1, vitaminC: 0, calcium: 1, iron: 1.0 },
  },
  {
    name: "Eggs (Boiled, Whole)",
    nameAr: "بيض مسلوق كامل",
    category: "protein",
    servingSize: 50,
    servingDescription: "1 large egg (50g)",
    region: "international",
    nutrientProfile: { calories: 78, protein: 6, carbs: 0.6, fat: 5, fiber: 0, sugar: 0.6, sodium: 62, saturatedFat: 1.6, cholesterol: 186, vitaminA: 5, vitaminC: 0, calcium: 3, iron: 0.6 },
  },
  {
    name: "Cottage Cheese (Low-Fat)",
    nameAr: "جبنة قريش قليلة الدسم",
    category: "dairy",
    servingSize: 100,
    servingDescription: "100g (1/2 cup)",
    region: "international",
    nutrientProfile: { calories: 72, protein: 12, carbs: 2.7, fat: 1, fiber: 0, sugar: 2.7, sodium: 364, saturatedFat: 0.6, cholesterol: 17, vitaminA: 1, vitaminC: 0, calcium: 6, iron: 0.1 },
  },
  {
    name: "Greek Yogurt (Plain, Non-Fat)",
    nameAr: "زبادي يوناني عادي بدون دسم",
    category: "dairy",
    servingSize: 100,
    servingDescription: "100g (1/3 cup)",
    region: "international",
    nutrientProfile: { calories: 59, protein: 10, carbs: 3.6, fat: 0.7, fiber: 0, sugar: 3.2, sodium: 36, saturatedFat: 0.1, cholesterol: 5, vitaminA: 0, vitaminC: 0, calcium: 11, iron: 0.1 },
  },
  {
    name: "Skim Milk",
    nameAr: "حليب خالي الدسم",
    category: "dairy",
    servingSize: 250,
    servingUnit: "ml",
    servingDescription: "1 cup (250ml)",
    region: "international",
    nutrientProfile: { calories: 83, protein: 8, carbs: 12, fat: 0.2, fiber: 0, sugar: 12, sodium: 103, saturatedFat: 0.1, cholesterol: 5, vitaminA: 0, vitaminC: 0, calcium: 30, iron: 0 },
  },

  // ── International Grains & Starches ───────────────────────
  {
    name: "Brown Rice (Cooked)",
    nameAr: "أرز بني مطبوخ",
    category: "grains",
    servingSize: 195,
    servingDescription: "1 cup cooked (195g)",
    region: "international",
    nutrientProfile: { calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, sugar: 0.7, sodium: 10, saturatedFat: 0.4, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 1, iron: 0.8 },
  },
  {
    name: "Quinoa (Cooked)",
    nameAr: "كينوا مطبوخة",
    category: "grains",
    servingSize: 185,
    servingDescription: "1 cup cooked (185g)",
    region: "international",
    nutrientProfile: { calories: 222, protein: 8, carbs: 39, fat: 3.5, fiber: 5, sugar: 1.6, sodium: 13, saturatedFat: 0.4, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 3, iron: 2.8 },
  },
  {
    name: "Oatmeal (Cooked)",
    nameAr: "شوفان مطبوخ",
    category: "grains",
    servingSize: 234,
    servingDescription: "1 cup cooked (234g)",
    region: "international",
    nutrientProfile: { calories: 154, protein: 5, carbs: 27, fat: 2.6, fiber: 4, sugar: 0.6, sodium: 9, saturatedFat: 0.5, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 2, iron: 1.6 },
  },
  {
    name: "Whole Wheat Bread",
    nameAr: "خبز قمح كامل",
    category: "grains",
    servingSize: 30,
    servingDescription: "1 slice (30g)",
    region: "international",
    nutrientProfile: { calories: 69, protein: 4, carbs: 12, fat: 1, fiber: 2, sugar: 1.5, sodium: 132, saturatedFat: 0.2, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 3, iron: 0.7 },
  },
  {
    name: "Pasta (Cooked, Whole Wheat)",
    nameAr: "معكرونة مطبوخة (قمح كامل)",
    category: "grains",
    servingSize: 140,
    servingDescription: "1 cup cooked (140g)",
    region: "international",
    nutrientProfile: { calories: 174, protein: 7.5, carbs: 37, fat: 0.8, fiber: 6.3, sugar: 0.8, sodium: 3, saturatedFat: 0.1, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 2, iron: 1.5 },
  },

  // ── International Vegetables ───────────────────────────────
  {
    name: "Broccoli (Steamed)",
    nameAr: "بروكلي مخمر",
    category: "vegetables",
    servingSize: 156,
    servingDescription: "1 cup chopped (156g)",
    region: "international",
    nutrientProfile: { calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, sugar: 2.2, sodium: 64, saturatedFat: 0.1, cholesterol: 0, vitaminA: 12, vitaminC: 101, calcium: 6, iron: 1 },
  },
  {
    name: "Spinach (Raw)",
    nameAr: "سبانخ خام",
    category: "vegetables",
    servingSize: 30,
    servingDescription: "1 cup raw (30g)",
    region: "international",
    nutrientProfile: { calories: 7, protein: 0.9, carbs: 1.1, fat: 0.1, fiber: 0.7, sugar: 0.1, sodium: 24, saturatedFat: 0, cholesterol: 0, vitaminA: 47, vitaminC: 8.4, calcium: 3, iron: 0.8 },
  },
  {
    name: "Sweet Potato (Baked)",
    nameAr: "بطاطا حلوى مشوية",
    category: "vegetables",
    servingSize: 114,
    servingDescription: "1 medium (114g)",
    region: "international",
    nutrientProfile: { calories: 103, protein: 2.3, carbs: 24, fat: 0.1, fiber: 3.8, sugar: 7.4, sodium: 41, saturatedFat: 0, cholesterol: 0, vitaminA: 961, vitaminC: 19.6, calcium: 4, iron: 0.7 },
  },
  {
    name: "Carrots (Raw)",
    nameAr: "جزر خام",
    category: "vegetables",
    servingSize: 61,
    servingDescription: "1 medium (61g)",
    region: "international",
    nutrientProfile: { calories: 25, protein: 0.6, carbs: 6, fat: 0.1, fiber: 1.7, sugar: 2.9, sodium: 42, saturatedFat: 0, cholesterol: 0, vitaminA: 509, vitaminC: 3.6, calcium: 2, iron: 0.2 },
  },
  {
    name: "Cucumber (Sliced)",
    nameAr: "خيار مقطّع",
    category: "vegetables",
    servingSize: 120,
    servingDescription: "1 cup sliced (120g)",
    region: "international",
    nutrientProfile: { calories: 16, protein: 0.7, carbs: 3.1, fat: 0.1, fiber: 0.5, sugar: 1.4, sodium: 2, saturatedFat: 0, cholesterol: 0, vitaminA: 1, vitaminC: 2.8, calcium: 1, iron: 0.2 },
  },
  {
    name: "Tomatoes (Raw)",
    nameAr: "طماطم خام",
    category: "vegetables",
    servingSize: 123,
    servingDescription: "1 medium (123g)",
    region: "international",
    nutrientProfile: { calories: 22, protein: 1.1, carbs: 4.8, fat: 0.2, fiber: 1.5, sugar: 3.2, sodium: 6, saturatedFat: 0, cholesterol: 0, vitaminA: 5, vitaminC: 17, calcium: 1, iron: 0.3 },
  },
  {
    name: "Bell Pepper (Red, Raw)",
    nameAr: "فلفل أحمر خام",
    category: "vegetables",
    servingSize: 119,
    servingDescription: "1 medium (119g)",
    region: "international",
    nutrientProfile: { calories: 37, protein: 1.2, carbs: 7.2, fat: 0.4, fiber: 2.5, sugar: 5, sodium: 5, saturatedFat: 0, cholesterol: 0, vitaminA: 47, vitaminC: 152, calcium: 1, iron: 0.5 },
  },

  // ── International Fruits ───────────────────────────────────
  {
    name: "Banana (Raw)",
    nameAr: "موز خام",
    category: "fruits",
    servingSize: 118,
    servingDescription: "1 medium (118g)",
    region: "international",
    nutrientProfile: { calories: 105, protein: 1.3, carbs: 27, fat: 0.4, fiber: 3.1, sugar: 14, sodium: 1, saturatedFat: 0.1, cholesterol: 0, vitaminA: 1, vitaminC: 10.3, calcium: 1, iron: 0.3 },
  },
  {
    name: "Apple (Raw, with Skin)",
    nameAr: "تفاح خام مع القشرة",
    category: "fruits",
    servingSize: 182,
    servingDescription: "1 medium (182g)",
    region: "international",
    nutrientProfile: { calories: 95, protein: 0.5, carbs: 25, fat: 0.3, fiber: 4.4, sugar: 19, sodium: 2, saturatedFat: 0.1, cholesterol: 0, vitaminA: 1, vitaminC: 8.4, calcium: 1, iron: 0.2 },
  },
  {
    name: "Orange (Raw)",
    nameAr: "برتقالة خام",
    category: "fruits",
    servingSize: 131,
    servingDescription: "1 medium (131g)",
    region: "international",
    nutrientProfile: { calories: 62, protein: 1.2, carbs: 15, fat: 0.2, fiber: 3.1, sugar: 12, sodium: 0, saturatedFat: 0, cholesterol: 0, vitaminA: 2, vitaminC: 70, calcium: 5, iron: 0.1 },
  },
  {
    name: "Strawberries (Raw)",
    nameAr: "فراولة خام",
    category: "fruits",
    servingSize: 152,
    servingDescription: "1 cup (152g)",
    region: "international",
    nutrientProfile: { calories: 49, protein: 1, carbs: 12, fat: 0.5, fiber: 3, sugar: 7.4, sodium: 2, saturatedFat: 0, cholesterol: 0, vitaminA: 1, vitaminC: 89, calcium: 2, iron: 0.6 },
  },
  {
    name: "Blueberries (Raw)",
    nameAr: "توت أزرق خام",
    category: "fruits",
    servingSize: 148,
    servingDescription: "1 cup (148g)",
    region: "international",
    nutrientProfile: { calories: 84, protein: 1.1, carbs: 21, fat: 0.5, fiber: 3.6, sugar: 15, sodium: 1, saturatedFat: 0, cholesterol: 0, vitaminA: 1, vitaminC: 14.4, calcium: 1, iron: 0.4 },
  },
  {
    name: "Avocado (Raw)",
    nameAr: "أفوكادو خام",
    category: "fruits",
    servingSize: 150,
    servingDescription: "1/2 fruit (150g)",
    region: "international",
    nutrientProfile: { calories: 240, protein: 3, carbs: 13, fat: 22, fiber: 10, sugar: 1, sodium: 11, saturatedFat: 3.2, cholesterol: 0, vitaminA: 7, vitaminC: 10, calcium: 2, iron: 0.8 },
  },
  {
    name: "Mango (Raw)",
    nameAr: "مانجو خام",
    category: "fruits",
    servingSize: 165,
    servingDescription: "1 cup chopped (165g)",
    region: "international",
    nutrientProfile: { calories: 99, protein: 1.4, carbs: 25, fat: 0.6, fiber: 2.6, sugar: 23, sodium: 2, saturatedFat: 0.1, cholesterol: 0, vitaminA: 17, vitaminC: 60, calcium: 2, iron: 0.3 },
  },

  // ── Nuts & Seeds ───────────────────────────────────────────
  {
    name: "Almonds (Raw)",
    nameAr: "لوز خام",
    category: "nuts",
    servingSize: 28,
    servingDescription: "1 oz / 23 almonds (28g)",
    region: "international",
    nutrientProfile: { calories: 164, protein: 6, carbs: 6, fat: 14, fiber: 3.5, sugar: 1.2, sodium: 0, saturatedFat: 1.1, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 8, iron: 1.0 },
  },
  {
    name: "Walnuts (Raw)",
    nameAr: "جوز خام",
    category: "nuts",
    servingSize: 28,
    servingDescription: "1 oz / 14 halves (28g)",
    region: "international",
    nutrientProfile: { calories: 185, protein: 4.3, carbs: 3.9, fat: 18.5, fiber: 1.9, sugar: 0.7, sodium: 1, saturatedFat: 1.7, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 3, iron: 0.8 },
  },
  {
    name: "Peanut Butter (Natural)",
    nameAr: "زبدة فول سوداني طبيعية",
    category: "nuts",
    servingSize: 32,
    servingDescription: "2 tbsp (32g)",
    region: "international",
    nutrientProfile: { calories: 190, protein: 8, carbs: 6, fat: 16, fiber: 2, sugar: 1.5, sodium: 136, saturatedFat: 3, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 1, iron: 0.6 },
  },
  {
    name: "Chia Seeds",
    nameAr: "بذور شيا",
    category: "nuts",
    servingSize: 28,
    servingDescription: "1 oz (28g)",
    region: "international",
    nutrientProfile: { calories: 138, protein: 4.7, carbs: 12, fat: 8.7, fiber: 9.8, sugar: 0, sodium: 5, saturatedFat: 0.9, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 15, iron: 2.2 },
  },

  // ── Legumes ────────────────────────────────────────────────
  {
    name: "Lentils (Cooked)",
    nameAr: "عدس مطبوخ",
    category: "protein",
    servingSize: 198,
    servingDescription: "1 cup cooked (198g)",
    region: "international",
    nutrientProfile: { calories: 230, protein: 18, carbs: 40, fat: 0.8, fiber: 15.6, sugar: 3.6, sodium: 4, saturatedFat: 0.1, cholesterol: 0, vitaminA: 0, vitaminC: 3, calcium: 4, iron: 6.6 },
  },
  {
    name: "Chickpeas (Cooked)",
    nameAr: "حمص مطبوخ",
    category: "protein",
    servingSize: 164,
    servingDescription: "1 cup cooked (164g)",
    region: "international",
    nutrientProfile: { calories: 269, protein: 15, carbs: 45, fat: 4.2, fiber: 12.5, sugar: 7.9, sodium: 11, saturatedFat: 0.4, cholesterol: 0, vitaminA: 1, vitaminC: 2, calcium: 8, iron: 4.7 },
  },
  {
    name: "Black Beans (Cooked)",
    nameAr: "فاصوليا سوداء مطبوخة",
    category: "protein",
    servingSize: 172,
    servingDescription: "1 cup cooked (172g)",
    region: "international",
    nutrientProfile: { calories: 227, protein: 15, carbs: 41, fat: 0.9, fiber: 15, sugar: 0.6, sodium: 2, saturatedFat: 0.2, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 5, iron: 3.6 },
  },

  // ── Healthy Fats & Oils ────────────────────────────────────
  {
    name: "Olive Oil (Extra Virgin)",
    nameAr: "زيت زيتون بكر ممتاز",
    category: "fats",
    servingSize: 15,
    servingUnit: "ml",
    servingDescription: "1 tbsp (15ml)",
    region: "international",
    nutrientProfile: { calories: 119, protein: 0, carbs: 0, fat: 14, fiber: 0, sugar: 0, sodium: 0, saturatedFat: 1.9, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0.1 },
  },
  {
    name: "Coconut Oil",
    nameAr: "زيت جوز الهند",
    category: "fats",
    servingSize: 15,
    servingUnit: "ml",
    servingDescription: "1 tbsp (15ml)",
    region: "international",
    nutrientProfile: { calories: 121, protein: 0, carbs: 0, fat: 14, fiber: 0, sugar: 0, sodium: 0, saturatedFat: 11.8, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0 },
  },

  // ── Beverages ───────────────────────────────────────────────
  {
    name: "Green Tea (Unsweetened)",
    nameAr: "شاي أخضر بدون سكر",
    category: "beverages",
    servingSize: 250,
    servingUnit: "ml",
    servingDescription: "1 cup (250ml)",
    region: "international",
    nutrientProfile: { calories: 2, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 2, saturatedFat: 0, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0 },
  },
  {
    name: "Coffee (Black, No Sugar)",
    nameAr: "قهوة سوداء بدون سكر",
    category: "beverages",
    servingSize: 240,
    servingUnit: "ml",
    servingDescription: "1 cup (240ml)",
    region: "international",
    nutrientProfile: { calories: 2, protein: 0.3, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 5, saturatedFat: 0, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0 },
  },
  {
    name: "Orange Juice (Fresh)",
    nameAr: "عصير برتقال طازج",
    category: "beverages",
    servingSize: 250,
    servingUnit: "ml",
    servingDescription: "1 cup (250ml)",
    region: "international",
    nutrientProfile: { calories: 112, protein: 1.7, carbs: 26, fat: 0.5, fiber: 0.5, sugar: 21, sodium: 2, saturatedFat: 0.1, cholesterol: 0, vitaminA: 5, vitaminC: 124, calcium: 3, iron: 0.5 },
  },

  // ── Condiments & Sauces ────────────────────────────────────
  {
    name: "Honey (Pure)",
    nameAr: "عسل طبيعي",
    category: "condiments",
    servingSize: 21,
    servingDescription: "1 tbsp (21g)",
    region: "international",
    nutrientProfile: { calories: 64, protein: 0.1, carbs: 17, fat: 0, fiber: 0, sugar: 17, sodium: 1, saturatedFat: 0, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 0, iron: 0.1 },
  },
  {
    name: "Tahini (Sesame Paste)",
    nameAr: "طحينة",
    category: "condiments",
    servingSize: 15,
    servingDescription: "1 tbsp (15g)",
    region: "international",
    nutrientProfile: { calories: 89, protein: 2.6, carbs: 3.2, fat: 8, fiber: 0.7, sugar: 0.1, sodium: 5, saturatedFat: 1.1, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 6, iron: 0.7 },
  },
  {
    name: "Hummus (Traditional)",
    nameAr: "حمص تقليدي",
    category: "salads",
    servingSize: 30,
    servingDescription: "2 tbsp (30g)",
    region: "international",
    nutrientProfile: { calories: 70, protein: 2, carbs: 4, fat: 5, fiber: 1, sugar: 0.1, sodium: 120, saturatedFat: 0.7, cholesterol: 0, vitaminA: 0, vitaminC: 0, calcium: 1, iron: 0.6 },
  },
  {
    name: "Guacamole",
    nameAr: "غواكامولي",
    category: "salads",
    servingSize: 30,
    servingDescription: "2 tbsp (30g)",
    region: "international",
    nutrientProfile: { calories: 48, protein: 0.6, carbs: 2, fat: 4.5, fiber: 1.5, sugar: 0.3, sodium: 100, saturatedFat: 0.6, cholesterol: 0, vitaminA: 1, vitaminC: 3, calcium: 1, iron: 0.1 },
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected\n");

  let added = 0;
  let skipped = 0;

  for (const food of additionalFoods) {
    try {
      const existing = await Food.findOne({ name: food.name });
      if (existing) {
        skipped++;
        continue;
      }
      await Food.create(food);
      added++;
    } catch {
      skipped++;
    }
  }

  const total = await Food.countDocuments();
  console.log(`Added ${added} new foods, skipped ${skipped} duplicates`);
  console.log(`Total foods in database: ${total}`);

  const categories = await Food.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  console.log("\nCategories:");
  for (const c of categories) {
    console.log(`  ${c._id}: ${c.count}`);
  }

  await mongoose.disconnect();
  console.log("\nDone!");
}

seed().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
