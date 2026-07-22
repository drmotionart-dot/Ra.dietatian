import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

const medicalSchema = new mongoose.Schema(
  {
    foodId: { type: String, required: true, unique: true },
    foodCategory: { type: String, required: true },
    micronutrients: [mongoose.Schema.Types.Mixed],
    vitamins: [mongoose.Schema.Types.Mixed],
    pros: [mongoose.Schema.Types.Mixed],
    cons: [mongoose.Schema.Types.Mixed],
    conditions: [mongoose.Schema.Types.Mixed],
    drugInteractions: [mongoose.Schema.Types.Mixed],
    disclaimer: String,
    disclaimerAr: String,
    lastReviewed: Date,
    reviewedBy: String,
  },
  { timestamps: true, collection: "medical_knowledge" }
);

const MedicalKnowledge = mongoose.model("MedicalKnowledge", medicalSchema);

const entries = [
  {
    foodId: "Koshari",
    foodCategory: "grains",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "2.8", unit: "mg", dailyValue: 15, benefitsAr: ["دعم إنتاج خلايا الدم الحمراء", "منع فقر الدم"], considerationsAr: ["الجرعة الزائدة قد تسبب اضطرابات في المعدة"] },
      { name: "Calcium", nameAr: "الكالسيوم", amount: "45", unit: "mg", dailyValue: 3, benefitsAr: ["دعم صحة العظام والأسنان"], considerationsAr: ["الكمية منخفضة - يحتاج مصادر إضافية"] },
      { name: "Fiber", nameAr: "الألياف", amount: "4.2", unit: "g", dailyValue: 15, benefitsAr: ["تحسين الهضم", "المساعدة في السيطرة على السكر"], considerationsAr: ["قد يسبب انتفاخ في البداية"] },
    ],
    vitamins: [],
    pros: [
      { text: "High fiber content from lentils and rice", textAr: "محتوى عالي من الألياف من العدس والأرز", category: "weight_management" },
      { text: "Good plant-based protein combination", textAr: "مزيج جيد من البروتين النباتي", category: "heart_health" },
      { text: "Rich in iron from lentils", textAr: "غني بالحديد من العدس", category: "immune_support" },
    ],
    cons: [
      { text: "High sodium from tomato sauce", textAr: "محتوى عالي من الصوديوم من صلصة الطماطم", category: "heart_health" },
      { text: "High glycemic index when eaten alone", textAr: "مؤشر سكر مرتفع عند الأكل وحده", category: "weight_management" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "Monitor portions - koshari has high carbs", descriptionAr: "راقب الحصص - الكشري يحتوي على كربوهيدرات عالية" },
      { name: "Celiac Disease", nameAr: "ال CELIAC", description: "Contains gluten from pasta and bread", descriptionAr: "يحتوي على الجلوتين من المعكرونة والعيش" },
    ],
    drugInteractions: [
      { drug: "Blood thinners", drugAr: "أدوية سيولة الدم", interaction: "Vitamin K in lentils may reduce effectiveness", interactionAr: "فيتامين K في العدس قد يقلل الفعالية" },
    ],
    disclaimer: "Nutritional information is approximate and may vary based on preparation method.",
    disclaimerAr: "المعلومات الغذائية تقريبية وقد تختلف حسب طريقة التحضير.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Ful Medames",
    foodCategory: "protein",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "4.2", unit: "mg", dailyValue: 23, benefitsAr: ["ممتاز لمنع فقر الدم", "دعم الطاقة اليومية"], considerationsAr: ["يُفضل تناوله مع فيتامين C لامتصاص أفضل"] },
      { name: "Folate", nameAr: "الفولات", amount: "156", unit: "mcg", dailyValue: 39, benefitsAr: ["ضروري لصحة الخلايا", "مهم جداً للحوامل"], considerationsAr: ["نقص الفولات يسبب تشوهات في الجنين"] },
      { name: "Potassium", nameAr: "البوتاسيوم", amount: "280", unit: "mg", dailyValue: 6, benefitsAr: ["تنظيم ضغط الدم", "صحة القلب"], considerationsAr: ["المرضى بالكلى يجب أن يراقبوا المدخول"] },
    ],
    vitamins: [
      { name: "Vitamin B6", nameAr: "فيتامين ب6", amount: "0.2", unit: "mg", dailyValue: 12, benefitsAr: ["دعم وظائف الدماغ", "إنتاج السيروتونين"], considerationsAr: [] },
    ],
    pros: [
      { text: "Excellent source of plant protein and fiber", textAr: "مصدر ممتاز للبروتين النباتي والألياف", category: "immune_support" },
      { text: "Low glycemic index - good for diabetics", textAr: "مؤشر سكر منخفض - جيد لمرضى السكري", category: "weight_management" },
      { text: "Rich in folate - essential for pregnant women", textAr: "غني بالفولات - ضروري للحوامل", category: "heart_health" },
      { text: "Contains prebiotic fiber for gut health", textAr: "يحتوي على ألياف قبلية لصحة الأمعاء", category: "immune_support" },
    ],
    cons: [
      { text: "Can cause gas and bloating", textAr: "قد يسبب انتفاخ وغازات", category: "weight_management" },
      { text: "High sodium when prepared with salt", textAr: "محتوى عالي من الصوديوم عند التحضير بالملح", category: "heart_health" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "Excellent choice - low GI, high fiber", descriptionAr: "اختيار ممتاز - مؤشر سكر منخفض، ألياف عالية" },
      { name: "Pregnancy", nameAr: "ال الحمل", description: "Rich in folate - highly recommended", descriptionAr: "غني بالفولات - يُنصح به بشدة" },
      { name: "Iron Deficiency", nameAr: "نقص الحديد", description: "Good source of plant-based iron", descriptionAr: "مصدر جيد للحديد النباتي" },
    ],
    drugInteractions: [
      { drug: "MAO inhibitors", drugAr: "مثبطات أكسيداز أحادي الأمين", interaction: "Tyramine in ful may cause hypertensive crisis", interactionAr: "التايروسين في الفول قد يسبب أزمة ارتفاع ضغط الدم" },
    ],
    disclaimer: "This is general nutritional information. Consult your doctor for personalized dietary advice.",
    disclaimerAr: "هذه معلومات غذائية عامة. استشر طبيبك للحصول على نصيحة غذائية مخصصة.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Taameya (Falafel)",
    foodCategory: "protein",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "3.6", unit: "mg", dailyValue: 20, benefitsAr: ["دعم إنتاج الطاقة", "منع فقر الدم"], considerationsAr: ["القلي يقلل امتصاص الحديد قليلاً"] },
      { name: "Manganese", nameAr: "المنغنيز", amount: "1.2", unit: "mg", dailyValue: 52, benefitsAr: ["دعم العظام", "metabolism"], considerationsAr: [] },
      { name: "Copper", nameAr: "النحاس", amount: "0.4", unit: "mg", dailyValue: 44, benefitsAr: ["إنتاج خلايا الدم", "صحة الأنسجة"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Folate", nameAr: "الفولات", amount: "120", unit: "mcg", dailyValue: 30, benefitsAr: ["صحة الخلايا", "مهم للحوامل"], considerationsAr: [] },
    ],
    pros: [
      { text: "High in plant protein from fava beans", textAr: "غني بالبروتين النباتي من الفول", category: "immune_support" },
      { text: "Good source of fiber and minerals", textAr: "مصدر جيد للألياف والمعادن", category: "weight_management" },
      { text: "Contains no cholesterol", textAr: "لا يحتوي على كوليسترول", category: "heart_health" },
    ],
    cons: [
      { text: "Deep frying adds significant calories", textAr: "القلي العميق يضيف سعرات حرارية كبيرة", category: "weight_management" },
      { text: "High sodium content", textAr: "محتوى عالي من الصوديوم", category: "heart_health" },
      { text: "May contain anti-nutrients from fava beans", textAr: "قد يحتوي على مواد مضادة للمغذيات من الفول", category: "immune_support" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Baked falafel is heart-healthy; fried increases risk", descriptionAr: "الطامية المشوية مفيدة للقلب؛ المقلية تزيد المخاطر" },
    ],
    drugInteractions: [],
    disclaimer: "Nutritional values are approximate for homemade falafel. Restaurant versions may vary significantly.",
    disclaimerAr: "القيم الغذائية تقريبية لالطامية المنزلية. أصدار المطاعم قد يختلف بشكل كبير.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Molokhia",
    foodCategory: "vegetables",
    micronutrients: [
      { name: "Calcium", nameAr: "الكالسيوم", amount: "152", unit: "mg", dailyValue: 12, benefitsAr: ["دعم قوة العظام", "صحة الأسنان"], considerationsAr: ["يحتوي على أوكسالات قد تعيق الامتصاص"] },
      { name: "Iron", nameAr: "الحديد", amount: "6.4", unit: "mg", dailyValue: 36, benefitsAr: ["ممتاز لمنع فقر الدم", "دعم الطاقة"], considerationsAr: ["الإفراط قد يسبب إمساكاً"] },
      { name: "Magnesium", nameAr: "المغنيسيوم", amount: "42", unit: "mg", dailyValue: 10, benefitsAr: ["عملية العضلات", "صحة القلب"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin A", nameAr: "فيتامين أ", amount: "8500", unit: "IU", dailyValue: 170, benefitsAr: ["صحة العيون", "المناعة", "صحة الجلد"], considerationsAr: ["الجرعة العالية من مكملات فيتامين أ قد تكون سامة"] },
      { name: "Vitamin C", nameAr: "فيتامين ج", amount: "32", unit: "mg", dailyValue: 36, benefitsAr: ["مضاد للأكسدة", "امتصاص الحديد"], considerationsAr: ["الطهي يقلل المحتوى"] },
    ],
    pros: [
      { text: "Extremely rich in Vitamin A - great for eyes", textAr: "غني جداً بفيتامين أ - ممتاز للعيون", category: "immune_support" },
      { text: "High in iron - prevents anemia", textAr: "غني بالحديد - يمنع فقر الدم", category: "heart_health" },
      { text: "Contains antioxidants", textAr: "يحتوي على مضادات أكسدة", category: "immune_support" },
      { text: "Anti-inflammatory properties", textAr: "خصائص مضادة للالتهابات", category: "skin_health" },
    ],
    cons: [
      { text: "High oxalate content may affect kidney stones", textAr: "محتوى عالي من الأوكسالات قد يؤثر على حصوات الكلى", category: "weight_management" },
      { text: "Usually served with ghee/oil - adds calories", textAr: "يُقدم عادة بالسمن/الزيت - يضيف سعرات", category: "weight_management" },
    ],
    conditions: [
      { name: "Kidney Stones", nameAr: "حصوات الكلى", description: "High oxalate - moderate intake recommended", descriptionAr: "أوكسالات عالية - يُنصح بتناول معتدل" },
      { name: "Pregnancy", nameAr: "الحمل", description: "Excellent source of folate and iron", descriptionAr: "مصدر ممتاز للفولات والحديد" },
    ],
    drugInteractions: [
      { drug: "Blood thinners (Warfarin)", drugAr: "أدوية سيولة الدم (وارفارين)", interaction: "Vitamin K may reduce effectiveness", interactionAr: "فيتامين K قد يقلل الفعالية" },
    ],
    disclaimer: "Molokhia nutritional values vary greatly depending on preparation (amount of ghee, meat broth, etc.).",
    disclaimerAr: "القيم الغذائية للملوخية تختلف كثيراً حسب طريقة التحضير (كمية السمن، مرق اللحم، إلخ).",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Shawarma (Chicken)",
    foodCategory: "protein",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "2.1", unit: "mg", dailyValue: 12, benefitsAr: ["دعم خلايا الدم"], considerationsAr: [] },
      { name: "Zinc", nameAr: "الزنك", amount: "2.4", unit: "mg", dailyValue: 22, benefitsAr: ["تعزيز المناعة", "التئام الجروح"], considerationsAr: [] },
      { name: "Phosphorus", nameAr: "الفوسفور", amount: "180", unit: "mg", dailyValue: 14, benefitsAr: ["صحة العظام"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Niacin (B3)", nameAr: "النياسين (ب3)", amount: "8.2", unit: "mg", dailyValue: 51, benefitsAr: ["صحة الجلد", "نظام العصبي"], considerationsAr: [] },
      { name: "Vitamin B6", nameAr: "فيتامين ب6", amount: "0.5", unit: "mg", dailyValue: 29, benefitsAr: ["دعم المناعة", "إنتاج الطاقة"], considerationsAr: [] },
    ],
    pros: [
      { text: "Good lean protein source", textAr: "مصدر جيد للبروتين الخالي من الدهون", category: "heart_health" },
      { text: "Rich in B vitamins for energy", textAr: "غني بفيتامينات ب للطاقة", category: "immune_support" },
    ],
    cons: [
      { text: "High sodium from marinade and tahini", textAr: "محتوى عالي من الصوديوم من التتبيلة والطحينة", category: "heart_health" },
      { text: "Pita bread adds refined carbs", textAr: "العيش يضيف كربوهيدرات مكررة", category: "weight_management" },
      { text: "Garlic sauce is high in calories", textAr: "صلصة الثوم عالية بالسعرات", category: "weight_management" },
    ],
    conditions: [
      { name: "Hypertension", nameAr: "ارتفاع ضغط الدم", description: "High sodium - limit portions", descriptionAr: "صوديوم عالي - قلل الحصص" },
    ],
    drugInteractions: [],
    disclaimer: "Shawarma nutritional values depend heavily on preparation style and condiments used.",
    disclaimerAr: "القيم الغذائية للشاورما تعتمد بشكل كبير على أسلوب التحضير والتوابل المستخدمة.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Liver (Kibda)",
    foodCategory: "protein",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "6.8", unit: "mg", dailyValue: 38, benefitsAr: ["ممتاز لفقر الدم", "طرد السمية"], considerationsAr: ["الإفراط قد يسبب تراكم الحديد"] },
      { name: "Zinc", nameAr: "الزنك", amount: "4.2", unit: "mg", dailyValue: 38, benefitsAr: ["تعزيز المناعة", "التئام الجروح"], considerationsAr: [] },
      { name: "Selenium", nameAr: "السيلينيوم", amount: "36", unit: "mcg", dailyValue: 65, benefitsAr: ["مضاد أكسدة قوي"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin A", nameAr: "فيتامين أ", amount: "12400", unit: "IU", dailyValue: 248, benefitsAr: ["صحة العيون والجلد", "المناعة"], considerationsAr: ["الجرعة العالية في الكبد قد تكون خطيرة للحوامل"] },
      { name: "Vitamin B12", nameAr: "فيتامين ب12", amount: "58", unit: "mcg", dailyValue: 2417, benefitsAr: ["صحة الأعصاب", "منع فقر الدم"], considerationsAr: [] },
      { name: "Riboflavin (B2)", nameAr: "الرايبوفلافين (ب2)", amount: "2.8", unit: "mg", dailyValue: 215, benefitsAr: ["إنتاج الطاقة"], considerationsAr: [] },
    ],
    pros: [
      { text: "One of the most nutrient-dense foods available", textAr: "واحد من أكثر الأطعمة كثافة المغذيات المتاحة", category: "immune_support" },
      { text: "Exceptional source of B12 and iron", textAr: "مصدر استثنائي لفيتامين ب12 والحديد", category: "heart_health" },
      { text: "High-quality complete protein", textAr: "بروتين كامل عالي الجودة", category: "immune_support" },
    ],
    cons: [
      { text: "Very high in cholesterol", textAr: "عالي جداً في الكوليسترول", category: "heart_health" },
      { text: "Very high in Vitamin A - toxic in excess", textAr: "عالي جداً في فيتامين أ - سام بالفائض", category: "weight_management" },
      { text: "Often fried in oil - adds calories", textAr: "غالباً يُقلي في الزيت - يضيف سعرات", category: "weight_management" },
    ],
    conditions: [
      { name: "Pregnancy", nameAr: "الحمل", description: "AVOID - excessive Vitamin A is teratogenic", descriptionAr: "تجنب - فيتامين أ الزائد مسبب لتشوهات الجنين" },
      { name: "Gout", nameAr: "النقرس", description: "High purines may trigger attacks", descriptionAr: "البيورينات العالية قد تهاجم النوبات" },
      { name: "Hemochromatosis", nameAr: "فرط تحمّل الحديد", description: "Avoid - extremely high in iron", descriptionAr: "تجنب - عالي جداً في الحديد" },
    ],
    drugInteractions: [
      { drug: "Vitamin A supplements", drugAr: "مكملات فيتامين أ", interaction: "Risk of hypervitaminosis A", interactionAr: "خطر فرط فيتامين أ" },
      { drug: "Warfarin", drugAr: "وارفارين", interaction: "Vitamin K content may interfere", interactionAr: "محتوى فيتامين K قد يتعارض" },
    ],
    disclaimer: "Liver is extremely nutrient-dense but should be consumed in moderation (1-2 servings per week maximum).",
    disclaimerAr: "الكبد غني جداً بالعناصر الغذائية لكن يجب تناوله باعتدال (1-2 حصص أسبوعياً كحد أقصى).",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Om Ali",
    foodCategory: "desserts",
    micronutrients: [
      { name: "Calcium", nameAr: "الكالسيوم", amount: "165", unit: "mg", dailyValue: 13, benefitsAr: ["دعم العظام"], considerationsAr: [] },
      { name: "Phosphorus", nameAr: "الفوسفور", amount: "120", unit: "mg", dailyValue: 10, benefitsAr: ["صحة العظام"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin A", nameAr: "فيتامين أ", amount: "8", unit: "IU", dailyValue: 0, benefitsAr: [], considerationsAr: [] },
    ],
    pros: [
      { text: "Good source of calcium from milk and nuts", textAr: "مصدر جيد للكالسيوم من الحليب والمكسرات", category: "skin_health" },
      { text: "Contains protein from milk and nuts", textAr: "يحتوي على بروتين من الحليب والمكسرات", category: "immune_support" },
    ],
    cons: [
      { text: "Very high in sugar", textAr: "عالي جداً في السكر", category: "weight_management" },
      { text: "High in saturated fat from ghee and cream", textAr: "عالي في الدهون المشبعة من السمن والقشطة", category: "heart_health" },
      { text: "Calorie-dense - easy to overeat", textAr: "كثيف بالسعرات - سهل الإفراط", category: "weight_management" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "Very high sugar - avoid or limit severely", descriptionAr: "سكر عالي جداً - تجنب أو قلل بشدة" },
      { name: "Lactose Intolerance", nameAr: "التحلل اللاكتوزي", description: "Contains dairy - may cause symptoms", descriptionAr: "يحتوي على منتجات ألبان - قد يسبب أعراض" },
    ],
    drugInteractions: [],
    disclaimer: "Om Ali is a dessert and should be enjoyed occasionally, not as a regular meal.",
    disclaimerAr: "أم علي حلوى ويجب تناولها بشكل غير دوري وليس كوجبة منتظمة.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Kawareh",
    foodCategory: "protein",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "3.2", unit: "mg", dailyValue: 18, benefitsAr: ["دعم الطاقة"], considerationsAr: [] },
      { name: "Zinc", nameAr: "الزنك", amount: "5.8", unit: "mg", dailyValue: 53, benefitsAr: ["تعزيز المناعة"], considerationsAr: [] },
      { name: "Collagen", nameAr: "الكولاجين", amount: "high", unit: "", dailyValue: 0, benefitsAr: ["صحة المفاصل والجلد"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin B12", nameAr: "فيتامين ب12", amount: "3.2", unit: "mcg", dailyValue: 133, benefitsAr: ["صحة الأعصاب"], considerationsAr: [] },
    ],
    pros: [
      { text: "Rich in collagen - good for joints", textAr: "غني بالكولاجين - ممتاز للمفاصل", category: "skin_health" },
      { text: "High in protein", textAr: "عالي البروتين", category: "immune_support" },
    ],
    cons: [
      { text: "Very high in saturated fat", textAr: "عالي جداً في الدهون المشبعة", category: "heart_health" },
      { text: "High cholesterol", textAr: "كوليسترول عالي", category: "heart_health" },
      { text: "Very calorie-dense", textAr: "كثيف جداً بالسعرات الحرارية", category: "weight_management" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Very high saturated fat - avoid or limit", descriptionAr: "دهون مشبعة عالية جداً - تجنب أو قلل" },
      { name: "High Cholesterol", nameAr: "كوليسترول عالي", description: "Should be avoided", descriptionAr: "يجب تجنبه" },
    ],
    drugInteractions: [],
    disclaimer: "Kawareh is a traditional dish best enjoyed occasionally due to its high fat content.",
    disclaimerAr: "كوارع طبق تقليدي يُفضل تناوله بشكل غير دوري بسبب محتواه العالي من الدهون.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Hawawshi",
    foodCategory: "protein",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "3.4", unit: "mg", dailyValue: 19, benefitsAr: ["دعم خلايا الدم"], considerationsAr: [] },
      { name: "Zinc", nameAr: "الزنك", amount: "3.8", unit: "mg", dailyValue: 35, benefitsAr: ["المناعة"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Niacin (B3)", nameAr: "النياسين (ب3)", amount: "6.4", unit: "mg", dailyValue: 40, benefitsAr: ["الطاقة"], considerationsAr: [] },
    ],
    pros: [
      { text: "Good protein source from spiced beef", textAr: "مصدر جيد للبروتين من اللحم المتبل", category: "immune_support" },
      { text: "Contains vegetables (onion, pepper)", textAr: "يحتوي على خضروات (بصل، فلفل)", category: "immune_support" },
    ],
    cons: [
      { text: "White bread - refined carbs", textAr: "عيش أبيض - كربوهيدرات مكررة", category: "weight_management" },
      { text: "High sodium from spices", textAr: "محتوى عالي من الصوديوم من التوابل", category: "heart_health" },
      { text: "High in fat from ground beef", textAr: "عالي في الدهون من اللحم المفروم", category: "weight_management" },
    ],
    conditions: [
      { name: "Hypertension", nameAr: "ارتفاع ضغط الدم", description: "High sodium - monitor intake", descriptionAr: "صوديوم عالي - راقب المدخول" },
    ],
    drugInteractions: [],
    disclaimer: "Hawawshi nutritional content varies by bakery and preparation style.",
    disclaimerAr: "المحتوى الغذائي للحواوشي يختلف حسب المخابز وطريقة التحضير.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Warak Enab",
    foodCategory: "vegetables",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "2.2", unit: "mg", dailyValue: 12, benefitsAr: ["دعم الطاقة"], considerationsAr: [] },
      { name: "Calcium", nameAr: "الكالسيوم", amount: "68", unit: "mg", dailyValue: 5, benefitsAr: ["صحة العظام"], considerationsAr: [] },
      { name: "Fiber", nameAr: "الألياف", amount: "4.8", unit: "g", dailyValue: 17, benefitsAr: ["تحسين الهضم", "الشبع"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin K", nameAr: "فيتامين ك", amount: "32", unit: "mcg", dailyValue: 27, benefitsAr: ["تخثر الدم"], considerationsAr: ["يتعارض مع وارفارين"] },
      { name: "Vitamin C", nameAr: "فيتامين ج", amount: "14", unit: "mg", dailyValue: 16, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
    ],
    pros: [
      { text: "Low calorie, high fiber", textAr: "سعرات منخفضة، ألياف عالية", category: "weight_management" },
      { text: "Good source of antioxidants from grape leaves", textAr: "مصدر جيد لمضادات الأكسدة من أوراق العنب", category: "immune_support" },
    ],
    cons: [
      { text: "Rice stuffing adds carbs and calories", textAr: "حشوة الأرز تضيف كربوهيدرات وسعرات", category: "weight_management" },
      { text: "Often prepared with oil", textAr: "يُحضر غالباً بالزيت", category: "weight_management" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "Moderate portions due to rice stuffing", descriptionAr: "حصص معتدلة بسبب حشوة الأرز" },
    ],
    drugInteractions: [
      { drug: "Warfarin", drugAr: "وارفارين", interaction: "Vitamin K affects blood clotting", interactionAr: "فيتامين ك يؤثر على تخثر الدم" },
    ],
    disclaimer: "Nutritional values depend on filling and amount of oil used.",
    disclaimerAr: "القيم الغذائية تعتمد على الحشوة وكمية الزيت المستخدمة.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Fattah",
    foodCategory: "grains",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "2.4", unit: "mg", dailyValue: 13, benefitsAr: ["دعم الطاقة"], considerationsAr: [] },
      { name: "Calcium", nameAr: "الكالسيوم", amount: "180", unit: "mg", dailyValue: 14, benefitsAr: ["صحة العظام"], considerationsAr: [] },
    ],
    vitamins: [],
    pros: [
      { text: "Good combination of protein and carbs", textAr: "مزيج جيد من البروتين والكربوهيدرات", category: "immune_support" },
      { text: "Calcium from yogurt and bones", textAr: "كالسيوم من اللبن والعظام", category: "skin_health" },
    ],
    cons: [
      { text: "Fried bread adds calories", textAr: "العيش المحمّر يضيف سعرات", category: "weight_management" },
      { text: "High sodium from garlic-vinegar sauce", textAr: "صوديوم عالي من صلصة الثوم والخل", category: "heart_health" },
      { text: "Ghee adds saturated fat", textAr: "السمن يضيف دهون مشبعة", category: "heart_health" },
    ],
    conditions: [
      { name: "Hypertension", nameAr: "ارتفاع ضغط الدم", description: "High sodium - limit portions", descriptionAr: "صوديوم عالي - قلل الحصص" },
    ],
    drugInteractions: [],
    disclaimer: "Fattah is traditionally served during celebrations and should be enjoyed in moderation.",
    disclaimerAr: "الفتة تُقدم تقليدياً أثناء الاحتفالات ويجب تناولها باعتدال.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Bamia",
    foodCategory: "vegetables",
    micronutrients: [
      { name: "Fiber", nameAr: "الألياف", amount: "5.4", unit: "g", dailyValue: 19, benefitsAr: ["تحسين الهضم", "السيطرة على السكر"], considerationsAr: [] },
      { name: "Vitamin C", nameAr: "فيتامين ج", amount: "18", unit: "mg", dailyValue: 20, benefitsAr: ["مضاد أكسدة", "امتصاص الحديد"], considerationsAr: [] },
      { name: "Folate", nameAr: "الفولات", amount: "88", unit: "mcg", dailyValue: 22, benefitsAr: ["صحة الخلايا"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin K", nameAr: "فيتامين ك", amount: "28", unit: "mcg", dailyValue: 23, benefitsAr: ["تخثر الدم"], considerationsAr: [] },
    ],
    pros: [
      { text: "Low calorie, high fiber vegetable", textAr: "خضار منخفض السعرات، عالي الألياف", category: "weight_management" },
      { text: "Good for digestive health", textAr: "جيد لصحة الجهاز الهضمي", category: "immune_support" },
    ],
    cons: [
      { text: "Mucilaginous texture may not appeal to everyone", textAr: "الملمس المخاطي قد لا يعجب الجميع", category: "weight_management" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "Excellent choice - high fiber, low calorie", descriptionAr: "اختيار ممتاز - ألياف عالية، سعرات منخفضة" },
    ],
    drugInteractions: [
      { drug: "Warfarin", drugAr: "وارفارين", interaction: "Vitamin K content", interactionAr: "محتوى فيتامين ك" },
    ],
    disclaimer: "Bamia is a healthy vegetable dish when prepared with minimal oil.",
    disclaimerAr: "البامية طبق خضريات صحي عند تحضيرها بقليل من الزيت.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Hummus",
    foodCategory: "protein",
    micronutrients: [
      { name: "Fiber", nameAr: "الألياف", amount: "4.8", unit: "g", dailyValue: 17, benefitsAr: ["تحسين الهضم", "الشبع"], considerationsAr: [] },
      { name: "Iron", nameAr: "الحديد", amount: "2.8", unit: "mg", dailyValue: 16, benefitsAr: ["دعم الطاقة"], considerationsAr: [] },
      { name: "Manganese", nameAr: "المنغنيز", amount: "0.8", unit: "mg", dailyValue: 35, benefitsAr: ["دعم العظام"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Folate", nameAr: "الفولات", amount: "95", unit: "mcg", dailyValue: 24, benefitsAr: ["صحة الخلايا"], considerationsAr: [] },
    ],
    pros: [
      { text: "Heart-healthy fats from tahini and olive oil", textAr: "دهون مفيدة للقلب من الطحينة وزيت الزيتون", category: "heart_health" },
      { text: "Excellent plant protein", textAr: "بروتين نباتي ممتاز", category: "immune_support" },
      { text: "High fiber for satiety", textAr: "ألياف عالية للشبع", category: "weight_management" },
    ],
    cons: [
      { text: "Calorie-dense due to tahini", textAr: "كثيف بالسعرات بسبب الطحينة", category: "weight_management" },
      { text: "High sodium", textAr: "صوديوم عالي", category: "heart_health" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Heart-healthy when consumed in moderation", descriptionAr: "مفيدة للقلب عند تناولها باعتدال" },
      { name: "Diabetes", nameAr: "السكري", description: "Good choice - moderate GI, high fiber", descriptionAr: "اختيار جيد - مؤشر سكر متوسط، ألياف عالية" },
    ],
    drugInteractions: [],
    disclaimer: "Hummus is a nutritious food when eaten in appropriate portions.",
    disclaimerAr: "الحمص طعام مغذي عند تناوله بكميات مناسبة.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Feseekh",
    foodCategory: "protein",
    micronutrients: [
      { name: "Sodium", nameAr: "الصوديوم", amount: "1240", unit: "mg", dailyValue: 54, benefitsAr: [], considerationsAr: ["محتوى صوديوم ضخم - خطير لمرضى الضغط"] },
      { name: "Protein", nameAr: "البروتين", amount: "24.8", unit: "g", dailyValue: 50, benefitsAr: ["مصدر ممتاز للبروتين"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin D", nameAr: "فيتامين د", amount: "4.2", unit: "mcg", dailyValue: 21, benefitsAr: ["صحة العظام"], considerationsAr: [] },
    ],
    pros: [
      { text: "Very high in protein", textAr: "عالي جداً في البروتين", category: "immune_support" },
      { text: "Contains omega-3 fatty acids", textAr: "يحتوي على أحماض أوميغا 3", category: "heart_health" },
    ],
    cons: [
      { text: "EXTREMELY high sodium - dangerous for hypertension", textAr: "صوديوم عالي جداً - خطير لارتفاع ضغط الدم", category: "heart_health" },
      { text: "Risk of botulism if improperly prepared", textAr: "خطر التسمم البطني إذا لم يُحضر بشكل صحيح", category: "immune_support" },
      { text: "Histamine content may cause reactions", textAr: "محتوى الهستامين قد يسبب تفاعلات", category: "immune_support" },
    ],
    conditions: [
      { name: "Hypertension", nameAr: "ارتفاع ضغط الدم", description: "DANGEROUS - extremely high sodium. Avoid.", descriptionAr: "خطير - صودodium عالي جداً. تجنب." },
      { name: "Heart Failure", nameAr: "فشل القلب", description: "Contraindicated due to sodium", descriptionAr: "مضاد للاستعمال بسبب الصوديوم" },
      { name: "Pregnancy", nameAr: "الحمل", description: "Risk of listeria and botulism", descriptionAr: "خطر لisteria والبطني" },
    ],
    drugInteractions: [
      { drug: "ACE inhibitors", drugAr: "مثبطات ACE", interaction: "High sodium counteracts medication", interactionAr: "الصوديوم العالي يعاكس الدواء" },
      { drug: "Diuretics", drugAr: "مدرات البول", interaction: "Sodium load overwhelms medication", interactionAr: "حِمل الصوديوم يثقل الدواء" },
    ],
    disclaimer: "Feseekh is a traditional dish. Improperly prepared feseekh can cause botulism. Buy only from trusted sources.",
    disclaimerAr: "فسيخ طبق تقليدي. الفسيخ الذي يُحضر بشكل غير صحيح قد يسبب التسمم البطني. اشترِ فقط من مصادر موثوقة.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Grilled Kofta",
    foodCategory: "protein",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "3.2", unit: "mg", dailyValue: 18, benefitsAr: ["دعم الطاقة"], considerationsAr: [] },
      { name: "Zinc", nameAr: "الزنك", amount: "4.8", unit: "mg", dailyValue: 44, benefitsAr: ["المناعة"], considerationsAr: [] },
      { name: "Selenium", nameAr: "السيلينيوم", amount: "22", unit: "mcg", dailyValue: 40, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin B12", nameAr: "فيتامين ب12", amount: "2.8", unit: "mcg", dailyValue: 117, benefitsAr: ["صحة الأعصاب"], considerationsAr: [] },
    ],
    pros: [
      { text: "High-quality complete protein", textAr: "بروتين كامل عالي الجودة", category: "immune_support" },
      { text: "Rich in B12 and iron", textAr: "غني بفيتامين ب12 والحديد", category: "heart_health" },
    ],
    cons: [
      { text: "High in saturated fat from beef/lamb", textAr: "عالي في الدهون المشبعة من اللحم", category: "heart_health" },
      { text: "Charring from grilling may produce carcinogens", textAr: "الحرق من الشوي قد ينتج مسببات سرطان", category: "weight_management" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Limit portions due to saturated fat", descriptionAr: "قلل الحصص بسبب الدهون المشبعة" },
    ],
    drugInteractions: [],
    disclaimer: "Grilled kofta should be consumed in moderation as part of a balanced diet.",
    disclaimerAr: "كفتة مشوية يجب تناولها باعتدال كجزء من نظام غذائي متوازن.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Shakshuka",
    foodCategory: "protein",
    micronutrients: [
      { name: "Choline", nameAr: "الكولين", amount: "147", unit: "mg", dailyValue: 27, benefitsAr: ["صحة الدماغ", "وظائف الكبد"], considerationsAr: [] },
      { name: "Selenium", nameAr: "السيلينيوم", amount: "30", unit: "mcg", dailyValue: 55, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin A", nameAr: "فيتامين أ", amount: "42", unit: "IU", dailyValue: 1, benefitsAr: ["صحة العيون"], considerationsAr: [] },
      { name: "Vitamin D", nameAr: "فيتامين د", amount: "1.2", unit: "mcg", dailyValue: 6, benefitsAr: ["العظام"], considerationsAr: [] },
    ],
    pros: [
      { text: "Eggs are complete protein", textAr: "البيض بروتين كامل", category: "immune_support" },
      { text: "Tomatoes provide lycopene antioxidant", textAr: "الطماطم توفر ليكوبين مضاد الأكسدة", category: "heart_health" },
      { text: "Good balance of protein, carbs and fat", textAr: "توازن جيد بين البروتين والكربوهيدرات والدهون", category: "weight_management" },
    ],
    cons: [
      { text: "Oil used in cooking adds calories", textAr: "الزيت المستخدم في الطبخ يضيف سعرات", category: "weight_management" },
      { text: "High cholesterol from eggs", textAr: "كوليسترول عالي من البيض", category: "heart_health" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Moderate - egg cholesterol debated", descriptionAr: "معتدل - كوليسترول البيض مثير للجدل" },
    ],
    drugInteractions: [],
    disclaimer: "Shakshuka is generally healthy when prepared with moderate oil.",
    disclaimerAr: "الشكشوكة عامة صحيحة عند تحضيرها بزيت معتدل.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Baba Ghanoush",
    foodCategory: "vegetables",
    micronutrients: [
      { name: "Fiber", nameAr: "الألياف", amount: "3.2", unit: "g", dailyValue: 11, benefitsAr: ["تحسين الهضم"], considerationsAr: [] },
      { name: "Potassium", nameAr: "البوتاسيوم", amount: "142", unit: "mg", dailyValue: 3, benefitsAr: ["صحة القلب"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin C", nameAr: "فيتامين ج", amount: "12", unit: "mg", dailyValue: 13, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
    ],
    pros: [
      { text: "Heart-healthy fats from tahini", textAr: "دهون مفيدة للقلب من الطحينة", category: "heart_health" },
      { text: "Low calorie dip/spread", textAr: "صوص منخفض السعرات", category: "weight_management" },
    ],
    cons: [
      { text: "Tahini adds calories", textAr: "الطحينة تضيف سعرات", category: "weight_management" },
    ],
    conditions: [],
    drugInteractions: [],
    disclaimer: "Baba ghanoush is a healthy choice when consumed in moderation.",
    disclaimerAr: "بابا غنوج اختيار صحي عند تناوله باعتدال.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Sayyadiah",
    foodCategory: "protein",
    micronutrients: [
      { name: "Omega-3", nameAr: "أوميغا 3", amount: "1.2", unit: "g", dailyValue: 75, benefitsAr: ["صحة القلب والدماغ", "مضاد للالتهابات"], considerationsAr: [] },
      { name: "Selenium", nameAr: "السيلينيوم", amount: "42", unit: "mcg", dailyValue: 76, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
      { name: "Phosphorus", nameAr: "الفوسفور", amount: "220", unit: "mg", dailyValue: 18, benefitsAr: ["صحة العظام"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin D", nameAr: "فيتامين د", amount: "2.8", unit: "mcg", dailyValue: 14, benefitsAr: ["العظام", "المناعة"], considerationsAr: [] },
      { name: "Vitamin B12", nameAr: "فيتامين ب12", amount: "3.4", unit: "mcg", dailyValue: 142, benefitsAr: ["صحة الأعصاب"], considerationsAr: [] },
    ],
    pros: [
      { text: "Excellent source of omega-3 fatty acids", textAr: "مصدر ممتاز لأحماض أوميغا 3", category: "heart_health" },
      { text: "High quality protein from fish", textAr: "بروتين عالي الجودة من السمك", category: "immune_support" },
      { text: "Low saturated fat", textAr: "دهون مشبعة منخفضة", category: "heart_health" },
    ],
    cons: [
      { text: "High sodium from seasoned rice", textAr: "صوديوم عالي من الأرز المتبل", category: "heart_health" },
      { text: "Some people dislike fish", textAr: "بعض الناس لا يحبون السمك", category: "weight_management" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Excellent choice - omega-3 protective", descriptionAr: "اختيار ممتاز - أوميغا 3 واقعي" },
      { name: "Pregnancy", nameAr: "الحمل", description: "Good source of DHA for baby's brain", descriptionAr: "مصدر جيد لـ DHA لدماغ الطفل" },
    ],
    drugInteractions: [
      { drug: "Blood thinners", drugAr: "أدوية سيولة الدم", interaction: "Omega-3 may increase bleeding risk", interactionAr: "أوميغا 3 قد تزيد خطر النزيف" },
    ],
    disclaimer: "Fish should be consumed 2-3 times per week for optimal health benefits.",
    disclaimerAr: "يجب تناول السمك 2-3 مرات أسبوعياً للحصول على أقصى فوائد صحية.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Basbousa",
    foodCategory: "desserts",
    micronutrients: [
      { name: "Selenium", nameAr: "السيلينيوم", amount: "6.2", unit: "mcg", dailyValue: 11, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
    ],
    vitamins: [],
    pros: [
      { text: "Quick energy from carbs", textAr: "طاقة سريعة من الكربوهيدرات", category: "immune_support" },
    ],
    cons: [
      { text: "Very high in sugar", textAr: "عالي جداً في السكر", category: "weight_management" },
      { text: "High glycemic index", textAr: "مؤشر سكر مرتفع", category: "weight_management" },
      { text: "Saturated fat from ghee", textAr: "دهون مشبعة من السمن", category: "heart_health" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "AVOID - very high sugar and GI", descriptionAr: "تجنب - سكر ومؤشر سكر عالي جداً" },
      { name: "Obesity", nameAr: "السمنة", description: "High calorie density", descriptionAr: "كثافة سعرات عالية" },
    ],
    drugInteractions: [],
    disclaimer: "Basbousa is a dessert high in sugar and should be consumed rarely.",
    disclaimerAr: "بسبوسة حلوى عالية السكر ويجب تناولها نادراً.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Fetere",
    foodCategory: "grains",
    micronutrients: [
      { name: "Selenium", nameAr: "السيلينيوم", amount: "8.4", unit: "mcg", dailyValue: 15, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
      { name: "Thiamine", nameAr: "الثيامين", amount: "0.3", unit: "mg", dailyValue: 25, benefitsAr: ["الطاقة"], considerationsAr: [] },
    ],
    vitamins: [],
    pros: [
      { text: "Traditional Egyptian bread - cultural significance", textAr: "عيش مصري تقليدي - أهمية ثقافية", category: "immune_support" },
    ],
    cons: [
      { text: "High in refined carbs", textAr: "عالي في الكربوهيدرات المكررة", category: "weight_management" },
      { text: "Very high in fat from ghee/butter", textAr: "عالي جداً في الدهون من السمن/الزبدة", category: "heart_health" },
      { text: "Calorie-dense", textAr: "كثيف بالسعرات", category: "weight_management" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "High GI and fat - limit severely", descriptionAr: "مؤشر سكر ودهون عالية - قلل بشدة" },
    ],
    drugInteractions: [],
    disclaimer: "Fetere meshaltet is an indulgent bread best enjoyed occasionally.",
    disclaimerAr: "فطير مشلتت عيش فاخر يُفضل تناوله بشكل غير دوري.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Aish Baladi",
    foodCategory: "grains",
    micronutrients: [
      { name: "Fiber", nameAr: "الألياف", amount: "2.4", unit: "g", dailyValue: 9, benefitsAr: ["تحسين الهضم"], considerationsAr: [] },
      { name: "Iron", nameAr: "الحديد", amount: "1.8", unit: "mg", dailyValue: 10, benefitsAr: ["دعم الطاقة"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Thiamine", nameAr: "الثيامين", amount: "0.2", unit: "mg", dailyValue: 17, benefitsAr: ["الطاقة"], considerationsAr: [] },
      { name: "Niacin (B3)", nameAr: "النياسين (ب3)", amount: "2.8", unit: "mg", dailyValue: 18, benefitsAr: ["الطاقة"], considerationsAr: [] },
    ],
    pros: [
      { text: "Whole grain - better than white bread", textAr: "حبوب كاملة - أفضل من العيش الأبيض", category: "heart_health" },
      { text: "Staple food - provides energy", textAr: "غذاء أساسي - يوفر الطاقة", category: "immune_support" },
      { text: "Low fat", textAr: "دهون منخفضة", category: "weight_management" },
    ],
    cons: [
      { text: "Still contains carbs - monitor for diabetics", textAr: "يحتوي على كربوهيدرات - راقب لمرضى السكري", category: "weight_management" },
      { text: "Sodium from salt", textAr: "صوديوم من الملح", category: "heart_health" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "Moderate portions - better than white bread", descriptionAr: "حصص معتدلة - أفضل من العيش الأبيض" },
      { name: "Celiac Disease", nameAr: "السليلياك", description: "Contains gluten - must avoid", descriptionAr: "يحتوي على الجلوتين - يجب تجنبه" },
    ],
    drugInteractions: [],
    disclaimer: "Aish baladi is a nutritious whole-grain bread and a cornerstone of Egyptian diet.",
    disclaimerAr: "عيش بلدي خبز حبوب كاملة مغذي وركيزة النظام الغذائي المصري.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Basturma Eggs",
    foodCategory: "protein",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "3.4", unit: "mg", dailyValue: 19, benefitsAr: ["دعم الطاقة"], considerationsAr: [] },
      { name: "Selenium", nameAr: "السيلينيوم", amount: "32", unit: "mcg", dailyValue: 58, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin B12", nameAr: "فيتامين ب12", amount: "1.8", unit: "mcg", dailyValue: 75, benefitsAr: ["صحة الأعصاب"], considerationsAr: [] },
      { name: "Vitamin D", nameAr: "فيتامين د", amount: "2.2", unit: "mcg", dailyValue: 11, benefitsAr: ["العظام"], considerationsAr: [] },
    ],
    pros: [
      { text: "Excellent protein from eggs and basturma", textAr: "بروتين ممتاز من البيض والبسطرمة", category: "immune_support" },
      { text: "Rich in choline from egg yolks", textAr: "غني بالكولين من صفار البيض", category: "heart_health" },
    ],
    cons: [
      { text: "Basturma is very high in sodium", textAr: "البسطرمة عالية جداً في الصوديوم", category: "heart_health" },
      { text: "High cholesterol from eggs", textAr: "كوليسترول عالي من البيض", category: "heart_health" },
      { text: "Processed meat - carcinogen risk", textAr: "لحم مُعالَج - خطر مسببات السرطان", category: "weight_management" },
    ],
    conditions: [
      { name: "Hypertension", nameAr: "ارتفاع ضغط الدم", description: "Very high sodium from basturma", descriptionAr: "صوديوم عالي جداً من البسطرمة" },
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Limit frequency", descriptionAr: "قلل التكرار" },
    ],
    drugInteractions: [
      { drug: "ACE inhibitors", drugAr: "مثبطات ACE", interaction: "Sodium counteracts medication", interactionAr: "الصوديوم يعاكس الدواء" },
    ],
    disclaimer: "Basturma is a processed meat. Limit consumption to 1-2 times per week.",
    disclaimerAr: "البسطرمة لحم مُعالَج. قلل التناول إلى 1-2 مرات أسبوعياً.",
    lastReviewed: new Date("2025-01-15"),
    reviewedBy: "FitTracker Nutrition Team",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await MedicalKnowledge.deleteMany({});
    console.log("Cleared existing medical knowledge");

    await MedicalKnowledge.insertMany(entries);
    console.log(`Seeded ${entries.length} medical knowledge entries`);

    await mongoose.disconnect();
    console.log("Done!");
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
