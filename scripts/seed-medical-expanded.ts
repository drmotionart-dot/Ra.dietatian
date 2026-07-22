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

const newEntries = [
  {
    foodId: "Aish Baladi",
    foodCategory: "grains",
    micronutrients: [
      { name: "Fiber", nameAr: "الألياف", amount: "2.4", unit: "g", dailyValue: 9, benefitsAr: ["تحسين الهضم"], considerationsAr: ["أقل من الخبز الأسمر الكامل"] },
      { name: "Iron", nameAr: "الحديد", amount: "1.8", unit: "mg", dailyValue: 10, benefitsAr: ["دعم الطاقة"], considerationsAr: [] },
      { name: "Magnesium", nameAr: "المغنيسيوم", amount: "22", unit: "mg", dailyValue: 5, benefitsAr: ["صحة العضلات"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Thiamine (B1)", nameAr: "الثيامين (ب1)", amount: "0.18", unit: "mg", dailyValue: 15, benefitsAr: ["تحويل الطعام إلى طاقة"], considerationsAr: [] },
      { name: "Niacin (B3)", nameAr: "النياسين (ب3)", amount: "2.4", unit: "mg", dailyValue: 15, benefitsAr: ["صحة الجهاز الهضمي"], considerationsAr: [] },
    ],
    pros: [
      { text: "Whole grain - more nutritious than white bread", textAr: "حبوب كاملة - أكثر قيمة غذائية من العيش الأبيض", category: "heart_health" },
      { text: "Lower glycemic index than white bread", textAr: "مؤشر سكر أقل من العيش الأبيض", category: "weight_management" },
      { text: "Contains fiber for digestive health", textAr: "يحتوي على ألياف لصحة الجهاز الهضمي", category: "immune_support" },
    ],
    cons: [
      { text: "Still contains gluten", textAr: "يحتوي على الجلوتين", category: "immune_support" },
      { text: "Carb-heavy - monitor for diabetics", textAr: "غالي الكربوهيدرات - راقب لمرضى السكري", category: "weight_management" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "Moderate portions - better than white bread but still carbs", descriptionAr: "حصص معتدلة - أفضل من العيش الأبيض لكن لا يزال كربوهيدرات" },
      { name: "Celiac Disease", nameAr: "السليلياك", description: "Contains gluten - must avoid completely", descriptionAr: "يحتوي على الجلوتين - يجب تجنبه تماماً" },
      { name: "IBS", nameAr: "متلازمة الأمعاء المتهيجة", description: "May trigger symptoms in sensitive individuals", descriptionAr: "قد يسبب أعراض لدى الأشخاص الحساسين" },
    ],
    drugInteractions: [],
    disclaimer: "Aish Baladi is a staple food. Individual responses may vary based on health conditions.",
    disclaimerAr: "العيش بلدي غذاء أساسي. الاستجابات الفردية قد تختلف حسب الحالة الصحية.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Roz Bel Laban",
    foodCategory: "desserts",
    micronutrients: [
      { name: "Calcium", nameAr: "الكالسيوم", amount: "110", unit: "mg", dailyValue: 8, benefitsAr: ["دعم العظام"], considerationsAr: [] },
      { name: "Phosphorus", nameAr: "الفوسفور", amount: "95", unit: "mg", dailyValue: 8, benefitsAr: ["صحة العظام"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin D", nameAr: "فيتامين د", amount: "0.8", unit: "mcg", dailyValue: 4, benefitsAr: ["امتصاص الكالسيوم"], considerationsAr: [] },
      { name: "Vitamin B12", nameAr: "فيتامين ب12", amount: "0.4", unit: "mcg", dailyValue: 17, benefitsAr: ["صحة الأعصاب"], considerationsAr: [] },
    ],
    pros: [
      { text: "Good source of calcium from milk", textAr: "مصدر جيد للكالسيوم من الحليب", category: "skin_health" },
      { text: "Contains tryptophan - may aid sleep", textAr: "يحتوي على تربتوفان - قد يساعد في النوم", category: "immune_support" },
    ],
    cons: [
      { text: "High in sugar", textAr: "عالي في السكر", category: "weight_management" },
      { text: "Lactose content may cause issues", textAr: "محتوى اللاكتوز قد يسبب مشاكل", category: "immune_support" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "High sugar - limit portions or use sugar-free version", descriptionAr: "سكر عالي - قلل الحصص أو استخدم نسخة بدون سكر" },
      { name: "Lactose Intolerance", nameAr: "التحلل اللاكتوزي", description: "Use lactose-free milk or take lactase enzyme", descriptionAr: "استخدم حليب بدون لاكتوز أو تناول إنزيم اللاكتاز" },
    ],
    drugInteractions: [
      { drug: "Antibiotics (tetracyclines)", drugAr: "المضادات الحيوية (التتراسيكلين)", interaction: "Calcium may reduce absorption", interactionAr: "الكالسيوم قد يقلل الامتصاص" },
    ],
    disclaimer: "Roz Bel Laban is a dessert. Enjoy occasionally as part of a balanced diet.",
    disclaimerAr: "رز بلبن حلوى. استمتع بها بشكل غير دوري كجزء من نظام غذائي متوازن.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Feteer Meshaltet",
    foodCategory: "grains",
    micronutrients: [
      { name: "Selenium", nameAr: "السيلينيوم", amount: "8.4", unit: "mcg", dailyValue: 15, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
      { name: "Iron", nameAr: "الحديد", amount: "1.2", unit: "mg", dailyValue: 7, benefitsAr: ["دعم الطاقة"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Thiamine (B1)", nameAr: "الثيامين (ب1)", amount: "0.15", unit: "mg", dailyValue: 13, benefitsAr: ["الطاقة"], considerationsAr: [] },
    ],
    pros: [
      { text: "Quick energy source", textAr: "مصدر سريع للطاقة", category: "immune_support" },
    ],
    cons: [
      { text: "Very high in refined carbs and fat", textAr: "عالي جداً في الكربوهيدرات المكررة والدهون", category: "weight_management" },
      { text: "Extremely calorie-dense", textAr: "كثيف جداً بالسعرات الحرارية", category: "weight_management" },
      { text: "Saturated fat from ghee raises cholesterol", textAr: "الدهون المشبعة من السمن ترفع الكوليسترول", category: "heart_health" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "AVOID - very high GI and fat content", descriptionAr: "تجنب - مؤشر سكر ومحتوى دهون عالي جداً" },
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Very high saturated fat - avoid", descriptionAr: "دهون مشبعة عالية جداً - تجنب" },
      { name: "Obesity", nameAr: "السمنة", description: "Extremely calorie-dense - avoid", descriptionAr: "كثيف جداً بالسعرات - تجنب" },
    ],
    drugInteractions: [],
    disclaimer: "Feteer Meshaltet is an indulgent traditional bread. Consume rarely and in small portions.",
    disclaimerAr: "فطير مشلتت خبز فاخر تقليدي. تناوله نادراً وبأحجام صغيرة.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Koshari with Lentils",
    foodCategory: "grains",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "3.8", unit: "mg", dailyValue: 21, benefitsAr: ["منع فقر الدم"], considerationsAr: ["الفيتامين C من الصلصة يساعد الامتصاص"] },
      { name: "Fiber", nameAr: "الألياف", amount: "5.6", unit: "g", dailyValue: 20, benefitsAr: ["تحسين الهضم", "الشبع"], considerationsAr: ["قد يسبب انتفاخ في البداية"] },
      { name: "Folate", nameAr: "الفولات", amount: "120", unit: "mcg", dailyValue: 30, benefitsAr: ["صحة الخلايا"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin B6", nameAr: "فيتامين ب6", amount: "0.25", unit: "mg", dailyValue: 15, benefitsAr: ["إنتاج السيروتونين"], considerationsAr: [] },
    ],
    pros: [
      { text: "Complete plant protein from lentils + rice", textAr: "بروتين نباتي كامل من العدس + الأرز", category: "immune_support" },
      { text: "High fiber promotes satiety", textAr: "ألياف عالية ت promote الشبع", category: "weight_management" },
      { text: "Iron from lentils prevents anemia", textAr: "الحديد من العدس يمنع فقر الدم", category: "heart_health" },
    ],
    cons: [
      { text: "High glycemic load when portions are large", textAr: "حِمل سكر عالي عند الأحجام الكبيرة", category: "weight_management" },
      { text: "Fried onions add unnecessary calories", textAr: "البصل المقلي يضيف سعرات غير ضرورية", category: "weight_management" },
      { text: "High sodium from sauces", textAr: "صوديوم عالي من الصلصات", category: "heart_health" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "Monitor portions carefully - high carb load", descriptionAr: "راقب الأحجام بعناية - حِمل كربوهيدرات عالي" },
      { name: "Iron Deficiency", nameAr: "نقص الحديد", description: "Good plant source of iron - pair with vitamin C", descriptionAr: "مصدر نباتي جيد للحديد - ادمجه مع فيتامين ج" },
    ],
    drugInteractions: [
      { drug: "Blood thinners (Warfarin)", drugAr: "أدوية سيولة الدم (وارفارين)", interaction: "Vitamin K in lentils may reduce effectiveness", interactionAr: "فيتامين K في العدس قد يقلل الفعالية" },
    ],
    disclaimer: "Koshari is a complete meal. Pair with salad for added nutrition and fiber.",
    disclaimerAr: "الكشري وجبة كاملة. ادمجه مع سلطة للتغذية والألياف الإضافية.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Mahalabia",
    foodCategory: "desserts",
    micronutrients: [
      { name: "Calcium", nameAr: "الكالسيوم", amount: "130", unit: "mg", dailyValue: 10, benefitsAr: ["دعم العظام"], considerationsAr: [] },
      { name: "Phosphorus", nameAr: "الفوسفور", amount: "100", unit: "mg", dailyValue: 8, benefitsAr: ["صحة العظام"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin B12", nameAr: "فيتامين ب12", amount: "0.3", unit: "mcg", dailyValue: 13, benefitsAr: ["صحة الأعصاب"], considerationsAr: [] },
    ],
    pros: [
      { text: "Good calcium source from milk", textAr: "مصدر جيد للكالسيوم من الحليب", category: "skin_health" },
      { text: "Lighter than many Middle Eastern desserts", textAr: "أخف من العديد من الحلويات الشرق أوسطية", category: "weight_management" },
    ],
    cons: [
      { text: "High sugar content", textAr: "محتوى سكر عالي", category: "weight_management" },
      { text: "Often topped with cream - adds saturated fat", textAr: "غالباً يُقدم مع قشطة - تضيف دهون مشبعة", category: "heart_health" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "High sugar - consume rarely", descriptionAr: "سكر عالي - تناول نادراً" },
      { name: "Lactose Intolerance", nameAr: "التحلل اللاكتوزي", description: "Contains dairy", descriptionAr: "يحتوي على منتجات ألبان" },
    ],
    drugInteractions: [],
    disclaimer: "Mahalabia is a milk-based dessert. Enjoy occasionally.",
    disclaimerAr: "محلبية حلوى قائمة على الحليب. استمتع بها بشكل غير دوري.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Chicken Breast (Grilled)",
    foodCategory: "protein",
    micronutrients: [
      { name: "Selenium", nameAr: "السيلينيوم", amount: "24", unit: "mcg", dailyValue: 44, benefitsAr: ["مضاد أكسدة قوي", "دعم الغدة الدرقية"], considerationsAr: [] },
      { name: "Phosphorus", nameAr: "الفوسفور", amount: "196", unit: "mg", dailyValue: 16, benefitsAr: ["صحة العظام"], considerationsAr: [] },
      { name: "Zinc", nameAr: "الزنك", amount: "0.9", unit: "mg", dailyValue: 8, benefitsAr: ["تعزيز المناعة"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Niacin (B3)", nameAr: "النياسين (ب3)", amount: "13.7", unit: "mg", dailyValue: 86, benefitsAr: ["تحويل الطعام إلى طاقة", "صحة الجلد"], considerationsAr: [] },
      { name: "Vitamin B6", nameAr: "فيتامين ب6", amount: "0.6", unit: "mg", dailyValue: 35, benefitsAr: ["دعم الدماغ", "إنتاج الخلايا الدموية"], considerationsAr: [] },
      { name: "Vitamin B12", nameAr: "فيتامين ب12", amount: "0.3", unit: "mcg", dailyValue: 13, benefitsAr: ["صحة الأعصاب"], considerationsAr: [] },
    ],
    pros: [
      { text: "Leanest protein source - almost no fat", textAr: "أقل مصدر دهون - شبه خالي من الدهون", category: "heart_health" },
      { text: "High protein supports muscle building", textAr: "بروتين عالي يدعم بناء العضلات", category: "immune_support" },
      { text: "Very low calorie density", textAr: "كثافة سعرات منخفضة جداً", category: "weight_management" },
      { text: "Rich in niacin for energy metabolism", textAr: "غني بالنياسين لتمثيل الطاقة", category: "immune_support" },
    ],
    cons: [
      { text: "Can be dry if overcooked", textAr: "قد يكون جافاً إذا طُبخ كثيراً", category: "weight_management" },
      { text: "Bland without seasoning", textAr: "بلا طعم بدون توابل", category: "weight_management" },
    ],
    conditions: [
      { name: "Obesity", nameAr: "السمنة", description: "Excellent choice - high protein, low calorie", descriptionAr: "اختيار ممتاز - بروتين عالي، سعرات منخفضة" },
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Excellent choice - virtually no saturated fat", descriptionAr: "اختيار ممتاز - شبه خالي من الدهون المشبعة" },
      { name: "Diabetes", nameAr: "السكري", description: "Excellent choice - no carbs, high protein", descriptionAr: "اختيار ممتاز - لا كربوهيدرات، بروتين عالي" },
      { name: "Pregnancy", nameAr: "الحمل", description: "Safe and nutritious - ensure thorough cooking", descriptionAr: "آمن ومغذي - تأكد من الطهي الجيد" },
    ],
    drugInteractions: [],
    disclaimer: "Chicken breast is one of the healthiest protein sources available. Ensure proper cooking to avoid foodborne illness.",
    disclaimerAr: "صدر الدجاج واحد من أفضل مصادر البروتين الصحية. تأكد من الطهي الجيد لتجنب أمراض الطعام.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Salmon (Grilled)",
    foodCategory: "protein",
    micronutrients: [
      { name: "Omega-3 (EPA+DHA)", nameAr: "أوميغا 3 (إيبي ديتش أي)", amount: "2.1", unit: "g", dailyValue: 131, benefitsAr: ["صحة القلب", "صحة الدماغ", "مضاد للالتهابات"], considerationsAr: [] },
      { name: "Selenium", nameAr: "السيلينيوم", amount: "36", unit: "mcg", dailyValue: 65, benefitsAr: ["مضاد أكسدة", "دعم الغدة الدرقية"], considerationsAr: [] },
      { name: "Potassium", nameAr: "البوتاسيوم", amount: "363", unit: "mg", dailyValue: 8, benefitsAr: ["تنظيم ضغط الدم"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin D", nameAr: "فيتامين د", amount: "11", unit: "mcg", dailyValue: 55, benefitsAr: ["قوة العظام", "المناعة"], considerationsAr: [] },
      { name: "Vitamin B12", nameAr: "فيتامين ب12", amount: "2.8", unit: "mcg", dailyValue: 117, benefitsAr: ["صحة الأعصاب", "منع فقر الدم"], considerationsAr: [] },
    ],
    pros: [
      { text: "Highest natural source of omega-3 fatty acids", textAr: "أعلى مصدر طبيعي لأحماض أوميغا 3", category: "heart_health" },
      { text: "Excellent source of Vitamin D - rare in food", textAr: "مصدر ممتاز لفيتامين د - نادر في الطعام", category: "immune_support" },
      { text: "Reduces inflammation throughout the body", textAr: "يقلل الالتهابات في جميع أنحاء الجسم", category: "skin_health" },
    ],
    cons: [
      { text: "Higher in calories than white fish", textAr: "سعرات أعلى من الأسماك البيضاء", category: "weight_management" },
      { text: "Mercury concern in large species", textAr: "مخاوف الزئبق في الأنواع الكبيرة", category: "immune_support" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Highly recommended - omega-3 reduces cardiac risk", descriptionAr: "يُنصح به بشدة - أوميغا 3 يقلل مخاطر القلب" },
      { name: "Depression", nameAr: "الاكتئاب", description: "Omega-3 may help reduce symptoms", descriptionAr: "أوميغا 3 قد يساعد في تقليل الأعراض" },
      { name: "Pregnancy", nameAr: "الحمل", description: "DHA critical for baby brain - 2-3 servings/week recommended", descriptionAr: "DHA ضروري لدماغ الطفل - 2-3 حصص أسبوعياً موصى بها" },
    ],
    drugInteractions: [
      { drug: "Blood thinners (Warfarin)", drugAr: "أدوية سيولة الدم (وارفارين)", interaction: "Omega-3 may increase bleeding risk", interactionAr: "أوميغا 3 قد تزيد خطر النزيف" },
    ],
    disclaimer: "Salmon is one of the most nutritious foods. Aim for 2-3 servings per week.",
    disclaimerAr: "السلمون واحد من أكثر الأطعمة تغذية. اهدف إلى 2-3 حصص أسبوعياً.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Eggs (Boiled)",
    foodCategory: "protein",
    micronutrients: [
      { name: "Selenium", nameAr: "السيلينيوم", amount: "15.4", unit: "mcg", dailyValue: 28, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
      { name: "Choline", nameAr: "الكولين", amount: "147", unit: "mg", dailyValue: 27, benefitsAr: ["صحة الدماغ", "وظائف الكبد"], considerationsAr: [] },
      { name: "Iron", nameAr: "الحديد", amount: "0.9", unit: "mg", dailyValue: 5, benefitsAr: ["دعم الطاقة"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin B12", nameAr: "فيتامين ب12", amount: "0.6", unit: "mcg", dailyValue: 25, benefitsAr: ["صحة الأعصاب"], considerationsAr: [] },
      { name: "Vitamin D", nameAr: "فيتامين د", amount: "1.1", unit: "mcg", dailyValue: 6, benefitsAr: ["العظام"], considerationsAr: [] },
    ],
    pros: [
      { text: "Complete protein with all essential amino acids", textAr: "بروتين كامل بجميع الأحماض الأمينية الأساسية", category: "immune_support" },
      { text: "Rich in choline - essential for brain development", textAr: "غني بالكولين - ضروري لتطور الدماغ", category: "heart_health" },
      { text: "Very filling - helps with weight management", textAr: "شبعي جداً - يساعد في إدارة الوزن", category: "weight_management" },
    ],
    cons: [
      { text: "Contains cholesterol (dietary impact debated)", textAr: "يحتوي على كوليسترول (تأثيره الغذائي مثير للجدل)", category: "heart_health" },
      { text: "Some people are allergic to eggs", textAr: "بعض الناس يعانون من حساسية البيض", category: "immune_support" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "1-2 eggs/day generally safe per latest research", descriptionAr: "1-2 بيضة يومياً آمنة عموماً حسب أحدث البحوث" },
      { name: "Diabetes", nameAr: "السكري", description: "Good choice - no carbs, high protein", descriptionAr: "اختيار جيد - لا كربوهيدرات، بروتين عالي" },
      { name: "Pregnancy", nameAr: "الحمل", description: "Excellent - rich in choline. Must be fully cooked.", descriptionAr: "ممتاز - غني بالكولين. يجب أن يكون مطبوخاً بالكامل." },
    ],
    drugInteractions: [
      { drug: "MAO inhibitors", drugAr: "مثبطات أكسيداز أحادي الأمين", interaction: "Tyramine in aged eggs may cause hypertensive crisis", interactionAr: "التايروسين في البيض القديم قد يسبب أزمة ضغط الدم" },
    ],
    disclaimer: "Eggs are one of the most nutritious foods. Current evidence supports 1-3 eggs daily for most people.",
    disclaimerAr: "البيض واحد من أكثر الأطعمة تغذية. الأدلة الحالية تدعم تناول 1-3 بيضات يومياً لمعظم الأشخاص.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Brown Rice",
    foodCategory: "grains",
    micronutrients: [
      { name: "Manganese", nameAr: "المنغنيز", amount: "1.8", unit: "mg", dailyValue: 78, benefitsAr: ["صحة العظام", "تمثيل الطاقة"], considerationsAr: [] },
      { name: "Magnesium", nameAr: "المغنيسيوم", amount: "43", unit: "mg", dailyValue: 10, benefitsAr: ["صحة العضلات والقلب"], considerationsAr: [] },
      { name: "Selenium", nameAr: "السيلينيوم", amount: "15.1", unit: "mcg", dailyValue: 27, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Thiamine (B1)", nameAr: "الثيامين (ب1)", amount: "0.2", unit: "mg", dailyValue: 17, benefitsAr: ["الطاقة"], considerationsAr: [] },
      { name: "Niacin (B3)", nameAr: "النياسين (ب3)", amount: "3.0", unit: "mg", dailyValue: 19, benefitsAr: ["الطاقة", "صحة الجلد"], considerationsAr: [] },
    ],
    pros: [
      { text: "Whole grain - retains bran and germ", textAr: "حبوب كاملة - تحتفظ بالنخالة والجنين", category: "heart_health" },
      { text: "High fiber promotes digestive health", textAr: "ألياف عالية تروج لصحة الجهاز الهضمي", category: "weight_management" },
      { text: "Low glycemic index - good for blood sugar", textAr: "مؤشر سكر منخفض - جيد للتحكم بمستوى السكر", category: "weight_management" },
    ],
    cons: [
      { text: "Contains antinutrients (phytic acid)", textAr: "يحتوي على مواد مضادة للمغذيات (حمض الفytic)", category: "immune_support" },
      { text: "Longer cooking time than white rice", textAr: "وقت طهي أطول من الأرز الأبيض", category: "weight_management" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "Excellent choice - low GI, high fiber", descriptionAr: "اختيار ممتاز - مؤشر سكر منخفض، ألياف عالية" },
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Reduces cholesterol - heart-healthy grain", descriptionAr: "يقلل الكوليسترول - حبوب مفيدة للقلب" },
      { name: "Obesity", nameAr: "السمنة", description: "More filling than white rice", descriptionAr: "أشبع من الأرز الأبيض" },
    ],
    drugInteractions: [],
    disclaimer: "Brown rice is a nutritious whole grain. Rinse before cooking to reduce antinutrients.",
    disclaimerAr: "الرز البني حبوب كاملة مغذية. اغسله قبل الطهي لتقليل المواد المضادة للمغذيات.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Oats",
    foodCategory: "grains",
    micronutrients: [
      { name: "Manganese", nameAr: "المنغنيز", amount: "1.3", unit: "mg", dailyValue: 57, benefitsAr: ["صحة العظام"], considerationsAr: [] },
      { name: "Phosphorus", nameAr: "الفوسفور", amount: "135", unit: "mg", dailyValue: 11, benefitsAr: ["صحة العظام"], considerationsAr: [] },
      { name: "Magnesium", nameAr: "المغنيسيوم", amount: "36", unit: "mg", dailyValue: 9, benefitsAr: ["صحة القلب"], considerationsAr: [] },
      { name: "Iron", nameAr: "الحديد", amount: "1.5", unit: "mg", dailyValue: 8, benefitsAr: ["دعم الطاقة"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Thiamine (B1)", nameAr: "الثيامين (ب1)", amount: "0.26", unit: "mg", dailyValue: 22, benefitsAr: ["الطاقة"], considerationsAr: [] },
    ],
    pros: [
      { text: "Beta-glucan fiber lowers cholesterol", textAr: "ألياف بيتا-جلوكان تخفض الكوليسترول", category: "heart_health" },
      { text: "Very filling - excellent for weight management", textAr: "شبعي جداً - ممتاز لإدارة الوزن", category: "weight_management" },
      { text: "Stabilizes blood sugar levels", textAr: "يثبت مستويات السكر في الدم", category: "weight_management" },
    ],
    cons: [
      { text: "Instant oats are highly processed", textAr: "الشوفان السريع عالي المعالجة", category: "weight_management" },
      { text: "Contains gluten (cross-contamination risk)", textAr: "يحتوي على جلوتين (خطر التلوث)", category: "immune_support" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "FDA-approved health claim: lowers cholesterol", descriptionAr: "ادعاء صحي معتمد من FDA: يخفض الكوليسترول" },
      { name: "Diabetes", nameAr: "السكري", description: "Excellent - beta-glucan slows glucose absorption", descriptionAr: "ممتاز - بيتا-جلوكان يبطئ امتصاص الجلوكوز" },
      { name: "Obesity", nameAr: "السمنة", description: "Very filling - reduces overall calorie intake", descriptionAr: "شبعي جداً - يقلل إجمالي السعرات" },
    ],
    drugInteractions: [
      { drug: "Metformin", drugAr: "الميتفورمين", interaction: "Oats may enhance blood sugar lowering", interactionAr: "الشوفان قد يعزز خفض السكر" },
    ],
    disclaimer: "Oats are one of the healthiest grains. Choose minimally processed varieties.",
    disclaimerAr: "الشوفان واحد من أكثر الحبوب الصحية. اختر الأنواع الأقل معالجة.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Broccoli",
    foodCategory: "vegetables",
    micronutrients: [
      { name: "Fiber", nameAr: "الألياف", amount: "2.6", unit: "g", dailyValue: 9, benefitsAr: ["تحسين الهضم"], considerationsAr: [] },
      { name: "Potassium", nameAr: "البوتاسيوم", amount: "316", unit: "mg", dailyValue: 7, benefitsAr: ["تنظيم ضغط الدم"], considerationsAr: [] },
      { name: "Calcium", nameAr: "الكالسيوم", amount: "47", unit: "mg", dailyValue: 4, benefitsAr: ["صحة العظام"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin C", nameAr: "فيتامين ج", amount: "89", unit: "mg", dailyValue: 99, benefitsAr: ["مضاد أكسدة قوي", "تعزيز المناعة"], considerationsAr: ["الطهي يقلل المحتوى"] },
      { name: "Vitamin K", nameAr: "فيتامين ك", amount: "102", unit: "mcg", dailyValue: 85, benefitsAr: ["تخثر الدم", "صحة العظام"], considerationsAr: ["يتعارض مع وارفارين"] },
      { name: "Folate", nameAr: "الفولات", amount: "63", unit: "mcg", dailyValue: 16, benefitsAr: ["صحة الخلايا"], considerationsAr: [] },
    ],
    pros: [
      { text: "One of the most nutrient-dense vegetables", textAr: "واحد من أكثر الخضروات كثافة المغذيات", category: "immune_support" },
      { text: "Contains sulforaphane - anti-cancer compound", textAr: "يحتوي على سلفورافان - مركب مضاد للسرطان", category: "immune_support" },
      { text: "Very low calorie, high fiber", textAr: "سعرات منخفضة جداً، ألياف عالية", category: "weight_management" },
      { text: "High vitamin C boosts immune system", textAr: "فيتامين ج عالي يعزز المناعة", category: "immune_support" },
    ],
    cons: [
      { text: "May cause gas in some individuals", textAr: "قد يسبب غازات لدى بعض الأفراد", category: "weight_management" },
      { text: "Goitrogens may affect thyroid in very large amounts", textAr: "ال goitrogens قد تؤثر على الغدة الدرقية بكميات كبيرة", category: "immune_support" },
    ],
    conditions: [
      { name: "Cancer Prevention", nameAr: "منع السرطان", description: "Sulforaphane shows anti-cancer properties", descriptionAr: "السلفورافان يظهر خصائص مضادة للسرطان" },
      { name: "Diabetes", nameAr: "السكري", description: "Excellent - very low carb, high fiber", descriptionAr: "ممتاز - كربوهيدرات منخفضة جداً، ألياف عالية" },
      { name: "Pregnancy", nameAr: "الحمل", description: "Excellent source of folate for fetal development", descriptionAr: "مصدر ممتاز للفولات لتطور الجنين" },
    ],
    drugInteractions: [
      { drug: "Warfarin", drugAr: "وارفارين", interaction: "High vitamin K - maintain consistent intake", interactionAr: "فيتامين ك عالٍ - حافظ على تناول ثابت" },
    ],
    disclaimer: "Broccoli is one of the healthiest vegetables. Steam or lightly cook to preserve nutrients.",
    disclaimerAr: "البروكلي واحد من أكثر الخضروات صحة. اخُره أو اطبخه خفيفاً للحفاظ على العناصر الغذائية.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Spinach (Raw)",
    foodCategory: "vegetables",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "2.7", unit: "mg", dailyValue: 15, benefitsAr: ["منع فقر الدم"], considerationsAr: ["الحديد النباتي يحتاج فيتامين C للامتصاص"] },
      { name: "Calcium", nameAr: "الكالسيوم", amount: "99", unit: "mg", dailyValue: 8, benefitsAr: ["صحة العظام"], considerationsAr: ["الأوكسالات تقلل الامتصاص"] },
      { name: "Magnesium", nameAr: "المغنيسيوم", amount: "79", unit: "mg", dailyValue: 19, benefitsAr: ["صحة العضلات والقلب"], considerationsAr: [] },
      { name: "Folate", nameAr: "الفولات", amount: "194", unit: "mcg", dailyValue: 49, benefitsAr: ["صحة الخلايا", "مهم جداً للحوامل"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin K", nameAr: "فيتامين ك", amount: "483", unit: "mcg", dailyValue: 403, benefitsAr: ["تخثر الدم", "صحة العظام"], considerationsAr: ["جرعة عالية جداً - يتعارض مع وارفارين"] },
      { name: "Vitamin A", nameAr: "فيتامين أ", amount: "469", unit: "mcg", dailyValue: 52, benefitsAr: ["صحة العيون", "المناعة"], considerationsAr: [] },
      { name: "Vitamin C", nameAr: "فيتامين ج", amount: "28", unit: "mg", dailyValue: 31, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
      { name: "Vitamin E", nameAr: "فيتامين هـ", amount: "2.0", unit: "mg", dailyValue: 13, benefitsAr: ["مضاد أكسدة", "صحة الجلد"], considerationsAr: [] },
    ],
    pros: [
      { text: "Extremely nutrient-dense - packed with vitamins", textAr: "كثافة مغذيات شديدة - مليء بالفيتامينات", category: "immune_support" },
      { text: "Rich in iron and folate - prevents anemia", textAr: "غني بالحديد والفولات - يمنع فقر الدم", category: "heart_health" },
      { text: "High vitamin K for bone health", textAr: "فيتامين ك عالي لصحة العظام", category: "skin_health" },
      { text: "Very low calorie", textAr: "سعرات منخفضة جداً", category: "weight_management" },
    ],
    cons: [
      { text: "High oxalates may contribute to kidney stones", textAr: "أوكسالات عالية قد تسبب حصوات الكلى", category: "weight_management" },
      { text: "Very high vitamin K - affects blood thinners", textAr: "فيتامين ك عالي جداً - يؤثر على أدوية سيولة الدم", category: "heart_health" },
    ],
    conditions: [
      { name: "Iron Deficiency Anemia", nameAr: "فقر الدم لنقص الحديد", description: "Good plant source of iron - pair with vitamin C", descriptionAr: "مصدر نباتي جيد للحديد - ادمجه مع فيتامين ج" },
      { name: "Pregnancy", nameAr: "الحمل", description: "Excellent source of folate for preventing birth defects", descriptionAr: "مصدر ممتاز للفولات لمنع عيوب الخلق" },
      { name: "Kidney Stones", nameAr: "حصوات الكلى", description: "High oxalate - moderate intake for stone formers", descriptionAr: "أوكسالات عالية - تناول معتدل لمن لديهم حصوات" },
    ],
    drugInteractions: [
      { drug: "Warfarin (Coumadin)", drugAr: "وارفارين (كومادين)", interaction: "VERY HIGH vitamin K - maintain consistent intake", interactionAr: "فيتامين ك عالي جداً - حافظ على تناول ثابت" },
      { drug: "Blood pressure medications", drugAr: "أدوية ضغط الدم", interaction: "High potassium may enhance effects", interactionAr: "البوتاسيوم العالي قد يعزز التأثيرات" },
    ],
    disclaimer: "Spinach is a superfood. Wash thoroughly before eating. Cooked spinach has more available iron.",
    disclaimerAr: "السبانخ خُرَاق. اغسلها جيداً قبل الأكل. السبانخ المطبوخة تحتوي على الحديد المتاح أكثر.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Banana",
    foodCategory: "fruits",
    micronutrients: [
      { name: "Potassium", nameAr: "البوتاسيوم", amount: "422", unit: "mg", dailyValue: 9, benefitsAr: ["تنظيم ضغط الدم", "صحة القلب"], considerationsAr: ["المرضى بالكلى يراقبون المدخول"] },
      { name: "Magnesium", nameAr: "المغنيسيوم", amount: "32", unit: "mg", dailyValue: 8, benefitsAr: ["صحة العضلات"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin B6", nameAr: "فيتامين ب6", amount: "0.43", unit: "mg", dailyValue: 25, benefitsAr: ["صحة الدماغ", "إنتاج السيروتونين"], considerationsAr: [] },
      { name: "Vitamin C", nameAr: "فيتامين ج", amount: "10.3", unit: "mg", dailyValue: 11, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
    ],
    pros: [
      { text: "Excellent source of potassium", textAr: "مصدر ممتاز للبوتاسيوم", category: "heart_health" },
      { text: "Quick energy - perfect pre/post workout", textAr: "طاقة سريعة - مثالي قبل/بعد التمرين", category: "immune_support" },
      { text: "Contains resistant starch when unripe", textAr: "يحتوي على نشا مقاوم عندما يكون غير ناضج", category: "weight_management" },
      { text: "Natural antacid - soothes stomach", textAr: "مضاد حمض طبيعي - يهدئ المعدة", category: "immune_support" },
    ],
    cons: [
      { text: "Higher in sugar than most fruits", textAr: "عالي في السكر أكثر من معظم الفواكه", category: "weight_management" },
      { text: "Ripe bananas have high glycemic index", textAr: "الموز الناضج مؤشر سكر مرتفع", category: "weight_management" },
    ],
    conditions: [
      { name: "Hypertension", nameAr: "ارتفاع ضغط الدم", description: "Excellent - potassium helps lower blood pressure", descriptionAr: "ممتاز - البوتاسيوم يساعد في خفض ضغط الدم" },
      { name: "Muscle Cramps", nameAr: "تشنجات العضلات", description: "Potassium and magnesium prevent cramps", descriptionAr: "البوتاسيوم والمغنيسيوم يمنعان التشنجات" },
      { name: "Diabetes", nameAr: "السكري", description: "Moderate portions - choose less ripe (lower GI)", descriptionAr: "حصص معتدلة - اختر الأقل نضوجاً" },
      { name: "Kidney Disease", nameAr: "أمراض الكلى", description: "High potassium - consult doctor", descriptionAr: "بوتاسيوم عالي - استشر طبيبك" },
    ],
    drugInteractions: [
      { drug: "ACE inhibitors", drugAr: "مثبطات ACE", interaction: "Both increase potassium - risk of hyperkalemia", interactionAr: "كلاهما يزيد البوتاسيوم - خطر فرط البوتاسيوم" },
      { drug: "Beta-blockers", drugAr: "حاصرات بيتا", interaction: "May increase potassium levels", interactionAr: "قد تزيد مستويات البوتاسيوم" },
    ],
    disclaimer: "Bananas are a convenient, nutritious snack. Choose greener bananas for lower sugar.",
    disclaimerAr: "الموز وجبة خفيفة مريحة ومغذية. اختر الموز الأخضر للأقل سكراً.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Apple",
    foodCategory: "fruits",
    micronutrients: [
      { name: "Fiber", nameAr: "الألياف", amount: "2.4", unit: "g", dailyValue: 9, benefitsAr: ["تحسين الهضم", "الشبع"], considerationsAr: [] },
      { name: "Potassium", nameAr: "البوتاسيوم", amount: "107", unit: "mg", dailyValue: 2, benefitsAr: ["صحة القلب"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin C", nameAr: "فيتامين ج", amount: "8.4", unit: "mg", dailyValue: 9, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
    ],
    pros: [
      { text: "High fiber - pectin helps lower cholesterol", textAr: "ألياف عالية - البكتين يخفض الكوليسترول", category: "heart_health" },
      { text: "Quercetin antioxidant may reduce cancer risk", textAr: "مضاد الأكسدة الكيرسيتين قد يقلل خطر السرطان", category: "immune_support" },
      { text: "Very filling due to fiber and water", textAr: "شبعي جداً بسبب الألياف والماء", category: "weight_management" },
      { text: "Low glycemic index despite sweetness", textAr: "مؤشر سكر منخفض رغم الحلاوة", category: "weight_management" },
    ],
    cons: [
      { text: "Pesticide residue on non-organic apples", textAr: "بقايا مبيدات على التفاح غير العضوي", category: "immune_support" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Regular consumption linked to reduced cardiac risk", descriptionAr: "التناول المنتظم مرتبط بانخفاض مخاطر القلب" },
      { name: "Diabetes", nameAr: "السكري", description: "Good choice - low GI, high fiber", descriptionAr: "اختيار جيد - مؤشر سكر منخفض، ألياف عالية" },
    ],
    drugInteractions: [],
    disclaimer: "An apple a day supports good health. Eat with skin for maximum fiber.",
    disclaimerAr: "تفاحة يومياً تدعم الصحة. كله مع القشرة لأقصى ألياف.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Almonds",
    foodCategory: "nuts",
    micronutrients: [
      { name: "Magnesium", nameAr: "المغنيسيوم", amount: "76", unit: "mg", dailyValue: 18, benefitsAr: ["صحة العضلات", "تنظيم السكر"], considerationsAr: [] },
      { name: "Vitamin E", nameAr: "فيتامين هـ", amount: "7.3", unit: "mg", dailyValue: 49, benefitsAr: ["مضاد أكسدة", "صحة الجلد"], considerationsAr: [] },
      { name: "Manganese", nameAr: "المنغنيز", amount: "0.6", unit: "mg", dailyValue: 26, benefitsAr: ["صحة العظام"], considerationsAr: [] },
      { name: "Copper", nameAr: "النحاس", amount: "0.3", unit: "mg", dailyValue: 33, benefitsAr: ["إنتاج خلايا الدم"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin E", nameAr: "فيتامين هـ", amount: "7.3", unit: "mg", dailyValue: 49, benefitsAr: ["حماية الخلايا من التلف"], considerationsAr: [] },
    ],
    pros: [
      { text: "Heart-healthy monounsaturated fats", textAr: "دهون أحادية غير مشبعة مفيدة للقلب", category: "heart_health" },
      { text: "High in vitamin E - powerful antioxidant", textAr: "عالي في فيتامين هـ - مضاد أكسدة قوي", category: "skin_health" },
      { text: "High protein and fiber - very filling", textAr: "بروتين وألياف عالية - شبعي جداً", category: "weight_management" },
      { text: "Helps lower LDL cholesterol", textAr: "يساعد في خفض كوليسترول LDL", category: "heart_health" },
    ],
    cons: [
      { text: "Very calorie-dense - easy to overeat", textAr: "كثيف جداً بالسعرات - سهل الإفراط", category: "weight_management" },
      { text: "Tree nut allergy - potentially severe", textAr: "حساسية من المكسرات - قد تكون خطيرة", category: "immune_support" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "FDA allows heart health claim for nuts", descriptionAr: "الFDA يسمح بادعاء صحة القلب للمكسرات" },
      { name: "Diabetes", nameAr: "السكري", description: "Excellent snack - helps stabilize blood sugar", descriptionAr: "وجبة خفيفة ممتازة - يساعد في تثبيت السكر" },
    ],
    drugInteractions: [
      { drug: "Blood thinners (Warfarin)", drugAr: "أدوية سيولة الدم (وارفارين)", interaction: "Vitamin E may increase bleeding risk", interactionAr: "فيتامين هـ قد يزيد خطر النزيف" },
    ],
    disclaimer: "Almonds are a nutrient powerhouse. Limit to a small handful (23 almonds) per day.",
    disclaimerAr: "اللوز قوة غذائية. قلل إلى حفنة صغيرة (23 حبة لوز) يومياً.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Greek Yogurt",
    foodCategory: "dairy",
    micronutrients: [
      { name: "Calcium", nameAr: "الكالسيوم", amount: "110", unit: "mg", dailyValue: 8, benefitsAr: ["قوة العظام"], considerationsAr: [] },
      { name: "Phosphorus", nameAr: "الفوسفور", amount: "135", unit: "mg", dailyValue: 11, benefitsAr: ["صحة العظام"], considerationsAr: [] },
      { name: "Potassium", nameAr: "البوتاسيوم", amount: "141", unit: "mg", dailyValue: 3, benefitsAr: ["صحة القلب"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin B12", nameAr: "فيتامين ب12", amount: "0.75", unit: "mcg", dailyValue: 31, benefitsAr: ["صحة الأعصاب"], considerationsAr: [] },
      { name: "Riboflavin (B2)", nameAr: "الرايبوفلافين (ب2)", amount: "0.27", unit: "mg", dailyValue: 21, benefitsAr: ["إنتاج الطاقة"], considerationsAr: [] },
    ],
    pros: [
      { text: "Twice the protein of regular yogurt", textAr: "ضعف بروتين الزبادي العادي", category: "immune_support" },
      { text: "Probiotics support gut health", textAr: "البكتيريا النافعة تدعم صحة الأمعاء", category: "immune_support" },
      { text: "Calcium and protein for bone health", textAr: "كالسيوم وبروتين لصحة العظام", category: "skin_health" },
    ],
    cons: [
      { text: "Flavored varieties are very high in sugar", textAr: "الأنواع المنكهة عالية جداً في السكر", category: "weight_management" },
      { text: "Lactose content may affect intolerant individuals", textAr: "محتوى اللاكتوز قد يؤثر على الأشخاص الحساسين", category: "immune_support" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "Excellent choice - choose plain, unsweetened", descriptionAr: "اختيار ممتاز - اختر العادي غير المحلاة" },
      { name: "Obesity", nameAr: "السمنة", description: "High protein promotes satiety", descriptionAr: "البروتين العالي ي promote الشبع" },
      { name: "Osteoporosis", nameAr: "هشاشة العظام", description: "Good source of calcium and protein", descriptionAr: "مصدر جيد للكالسيوم والبروتين" },
    ],
    drugInteractions: [
      { drug: "Antibiotics (tetracyclines)", drugAr: "المضادات الحيوية", interaction: "Calcium may reduce absorption - take 2 hours apart", interactionAr: "الكالسيوم قد يقلل الامتصاص - تناولها بفاصل ساعتين" },
    ],
    disclaimer: "Greek yogurt is nutritious. Choose plain, unsweetened for maximum benefits.",
    disclaimerAr: "الزبادي اليوناني مغذي. اختر العادي غير المحلاة لأقصى فوائد.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Sweet Potato",
    foodCategory: "vegetables",
    micronutrients: [
      { name: "Fiber", nameAr: "الألياف", amount: "3.0", unit: "g", dailyValue: 11, benefitsAr: ["تحسين الهضم"], considerationsAr: [] },
      { name: "Potassium", nameAr: "البوتاسيوم", amount: "337", unit: "mg", dailyValue: 7, benefitsAr: ["تنظيم ضغط الدم"], considerationsAr: [] },
      { name: "Manganese", nameAr: "المنغنيز", amount: "0.3", unit: "mg", dailyValue: 13, benefitsAr: ["صحة العظام"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin A", nameAr: "فيتامين أ", amount: "961", unit: "mcg", dailyValue: 107, benefitsAr: ["صحة العيون", "المناعة", "صحة الجلد"], considerationsAr: ["الجرعة العالية من المكملات قد تكون ضارة"] },
      { name: "Vitamin C", nameAr: "فيتامين ج", amount: "19.6", unit: "mg", dailyValue: 22, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
    ],
    pros: [
      { text: "Extremely rich in beta-carotene (vitamin A)", textAr: "غني جداً بيتا-كاروتين (فيتامين أ)", category: "immune_support" },
      { text: "Lower glycemic index than white potatoes", textAr: "مؤشر سكر أقل من البطاطس البيضاء", category: "weight_management" },
      { text: "High fiber for digestive health", textAr: "ألياف عالية لصحة الجهاز الهضمي", category: "weight_management" },
    ],
    cons: [
      { text: "Still contains carbs - monitor for diabetics", textAr: "يحتوي على كربوهيدرات - راقب لمرضى السكري", category: "weight_management" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "Better than white potatoes but monitor portions", descriptionAr: "أفضل من البطاطس البيضاء لكن راقب الأحجام" },
      { name: "Eye Health", nameAr: "صحة العيون", description: "Excellent - very high beta-carotene", descriptionAr: "ممتاز - بيتا-كاروتين عالي جداً" },
      { name: "Pregnancy", nameAr: "الحمل", description: "Excellent source of folate and vitamin A", descriptionAr: "مصدر ممتاز للفولات وفيتامين أ" },
    ],
    drugInteractions: [
      { drug: "ACE inhibitors", drugAr: "مثبطات ACE", interaction: "Potassium content - monitor levels", interactionAr: "محتوى البوتاسيوم - راقب المستويات" },
    ],
    disclaimer: "Sweet potatoes are nutritious root vegetables. Bake or boil for healthiest preparation.",
    disclaimerAr: "البطاطا الحلوى خضروات جذرية مغذية. اخبزها أو ا沸ها لأصح تحضير.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Lentils (Cooked)",
    foodCategory: "protein",
    micronutrients: [
      { name: "Iron", nameAr: "الحديد", amount: "3.3", unit: "mg", dailyValue: 18, benefitsAr: ["منع فقر الدم"], considerationsAr: ["الفيتامين C يساعد الامتصاص"] },
      { name: "Folate", nameAr: "الفولات", amount: "181", unit: "mcg", dailyValue: 45, benefitsAr: ["صحة الخلايا", "مهم جداً للحوامل"], considerationsAr: [] },
      { name: "Potassium", nameAr: "البوتاسيوم", amount: "369", unit: "mg", dailyValue: 8, benefitsAr: ["تنظيم ضغط الدم"], considerationsAr: [] },
      { name: "Magnesium", nameAr: "المغنيسيوم", amount: "27", unit: "mg", dailyValue: 6, benefitsAr: ["صحة القلب"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Folate (B9)", nameAr: "الفولات (ب9)", amount: "181", unit: "mcg", dailyValue: 45, benefitsAr: ["تكوين الخلايا"], considerationsAr: [] },
    ],
    pros: [
      { text: "Excellent plant protein - pair with rice", textAr: "بروتين نباتي ممتاز - ادمجه مع الأرز", category: "immune_support" },
      { text: "Very high folate - critical for pregnancy", textAr: "فولات عالي جداً - حيوي للحمل", category: "heart_health" },
      { text: "High fiber promotes heart health", textAr: "ألياف عالية تروج لصحة القلب", category: "heart_health" },
      { text: "Low glycemic index", textAr: "مؤشر سكر منخفض", category: "weight_management" },
    ],
    cons: [
      { text: "Contains antinutrients - soaking reduces them", textAr: "يحتوي على مواد مضادة للمغذيات - النقع يقللها", category: "immune_support" },
      { text: "Can cause digestive gas initially", textAr: "قد يسبب غازات هضمية في البداية", category: "weight_management" },
    ],
    conditions: [
      { name: "Diabetes", nameAr: "السكري", description: "Excellent - very low GI, high fiber", descriptionAr: "ممتاز - مؤشر سكر منخفض جداً، ألياف عالية" },
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Reduces cholesterol and blood pressure", descriptionAr: "يقلل الكوليسترول وضغط الدم" },
      { name: "Pregnancy", nameAr: "الحمل", description: "Excellent - high folate prevents birth defects", descriptionAr: "ممتاز - فولات عالي يمنع عيوب الخلق" },
    ],
    drugInteractions: [
      { drug: "MAO inhibitors", drugAr: "مثبطات أكسيداز أحادي الأمين", interaction: "Tyramine may cause hypertensive crisis", interactionAr: "التايروسين قد يسبب أزمة ضغط الدم" },
    ],
    disclaimer: "Lentils are a nutritional powerhouse. Soak overnight to improve digestibility.",
    disclaimerAr: "العدس قوة غذائية. انقعه طوال الليل لتحسين الهضم.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Tuna (Canned)",
    foodCategory: "protein",
    micronutrients: [
      { name: "Selenium", nameAr: "السيلينيوم", amount: "40", unit: "mcg", dailyValue: 73, benefitsAr: ["مضاد أكسدة قوي"], considerationsAr: [] },
      { name: "Phosphorus", nameAr: "الفوسفور", amount: "115", unit: "mg", dailyValue: 9, benefitsAr: ["صحة العظام"], considerationsAr: [] },
      { name: "Omega-3", nameAr: "أوميغا 3", amount: "0.5", unit: "g", dailyValue: 31, benefitsAr: ["صحة القلب"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin B12", nameAr: "فيتامين ب12", amount: "1.8", unit: "mcg", dailyValue: 75, benefitsAr: ["صحة الأعصاب"], considerationsAr: [] },
    ],
    pros: [
      { text: "Very high protein, low calorie", textAr: "بروتين عالي جداً، سعرات منخفضة", category: "weight_management" },
      { text: "Rich in selenium and B12", textAr: "غني بالسيلينيوم وفيتامين ب12", category: "immune_support" },
    ],
    cons: [
      { text: "Mercury content - limit to 2-3 cans/week", textAr: "محتوى الزئبق - حد أقصى 2-3 علب أسبوعياً", category: "immune_support" },
      { text: "High sodium in regular varieties", textAr: "صوديوم عالي في الأنواع العادية", category: "heart_health" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Good omega-3 source - choose in water", descriptionAr: "مصدر جيد لأوميغا 3 - اختر بالماء" },
      { name: "Pregnancy", nameAr: "الحمل", description: "Limit to 2-3 servings/week due to mercury", descriptionAr: "حد أقصى 2-3 حصص أسبوعياً بسبب الزئبق" },
    ],
    drugInteractions: [
      { drug: "Blood thinners", drugAr: "أدوية سيولة الدم", interaction: "Omega-3 may increase bleeding risk", interactionAr: "أوميغا 3 قد تزيد خطر النزيف" },
    ],
    disclaimer: "Choose tuna in water with low sodium. Limit to 2-3 servings/week due to mercury.",
    disclaimerAr: "اختر التونة بالماء منخفضة الصوديوم. حد أقصى 2-3 حصص أسبوعياً بسبب الزئبق.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Avocado",
    foodCategory: "fruits",
    micronutrients: [
      { name: "Potassium", nameAr: "البوتاسيوم", amount: "485", unit: "mg", dailyValue: 10, benefitsAr: ["تنظيم ضغط الدم"], considerationsAr: [] },
      { name: "Fiber", nameAr: "الألياف", amount: "6.7", unit: "g", dailyValue: 24, benefitsAr: ["تحسين الهضم", "الشبع"], considerationsAr: [] },
      { name: "Folate", nameAr: "الفولات", amount: "81", unit: "mcg", dailyValue: 20, benefitsAr: ["صحة الخلايا"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin K", nameAr: "فيتامين ك", amount: "21", unit: "mcg", dailyValue: 18, benefitsAr: ["تخثر الدم"], considerationsAr: [] },
      { name: "Vitamin C", nameAr: "فيتامين ج", amount: "10", unit: "mg", dailyValue: 11, benefitsAr: ["مضاد أكسدة"], considerationsAr: [] },
      { name: "Vitamin E", nameAr: "فيتامين هـ", amount: "2.1", unit: "mg", dailyValue: 14, benefitsAr: ["صحة الجلد"], considerationsAr: [] },
    ],
    pros: [
      { text: "Heart-healthy monounsaturated fats", textAr: "دهون أحادية غير مشبعة مفيدة للقلب", category: "heart_health" },
      { text: "Extremely high in fiber", textAr: "عالي جداً في الألياف", category: "weight_management" },
      { text: "More potassium than banana", textAr: "بوتاسيوم أكثر من الموز", category: "heart_health" },
      { text: "Helps absorb fat-soluble vitamins", textAr: "يساعد في امتصاص الفيتامينات الذائبة في الدهون", category: "immune_support" },
    ],
    cons: [
      { text: "Very calorie-dense (240 kcal per fruit)", textAr: "كثيف جداً بالسعرات (240 سعرة لكل حبة)", category: "weight_management" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Excellent - monounsaturated fats reduce LDL", descriptionAr: "ممتاز - الدهون الأحادية تخفض LDL" },
      { name: "Pregnancy", nameAr: "الحمل", description: "Rich in folate for fetal development", descriptionAr: "غني بالفولات لتطور الجنين" },
    ],
    drugInteractions: [
      { drug: "Blood thinners (Warfarin)", drugAr: "أدوية سيولة الدم (وارفارين)", interaction: "Moderate vitamin K - maintain consistent intake", interactionAr: "فيتامين ك متوسط - حافظ على تناول ثابت" },
    ],
    disclaimer: "Avocado is nutrient-dense. Control portions due to high calorie content.",
    disclaimerAr: "الأفوكادو غني بالعناصر الغذائية. تحكم في الأحجام بسبب المحتوى العالي من السعرات.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
  {
    foodId: "Tofu",
    foodCategory: "protein",
    micronutrients: [
      { name: "Calcium", nameAr: "الكالسيوم", amount: "350", unit: "mg", dailyValue: 27, benefitsAr: ["قوة العظام"], considerationsAr: [] },
      { name: "Iron", nameAr: "الحديد", amount: "5.4", unit: "mg", dailyValue: 30, benefitsAr: ["منع فقر الدم"], considerationsAr: [] },
      { name: "Magnesium", nameAr: "المغنيسيوم", amount: "37", unit: "mg", dailyValue: 9, benefitsAr: ["صحة القلب"], considerationsAr: [] },
    ],
    vitamins: [
      { name: "Vitamin B1", nameAr: "فيتامين ب1", amount: "0.06", unit: "mg", dailyValue: 5, benefitsAr: ["الطاقة"], considerationsAr: [] },
    ],
    pros: [
      { text: "Complete plant protein", textAr: "بروتين نباتي كامل", category: "immune_support" },
      { text: "Very low in saturated fat", textAr: "منخفض جداً في الدهون المشبعة", category: "heart_health" },
      { text: "Excellent calcium source (calcium-set tofu)", textAr: "مصدر ممتاز للكالسيوم (توف بالكالسيوم)", category: "skin_health" },
      { text: "Contains isoflavones - may reduce cancer risk", textAr: "يحتوي على 아이سوفلافونات - قد تقلل خطر السرطان", category: "immune_support" },
    ],
    cons: [
      { text: "Some people dislike the texture", textAr: "بعض الناس لا يحبون الملمس", category: "weight_management" },
      { text: "Goitrogens may affect thyroid in very large amounts", textAr: "ال goitrogens قد تؤثر على الغدة الدرقية بكميات كبيرة", category: "immune_support" },
    ],
    conditions: [
      { name: "Heart Disease", nameAr: "أمراض القلب", description: "Excellent - low saturated fat, no cholesterol", descriptionAr: "ممتاز - دهون مشبعة منخفضة، لا كوليسترول" },
      { name: "Osteoporosis", nameAr: "هشاشة العظام", description: "Good calcium source for bone health", descriptionAr: "مصدر جيد للكالسيوم لصحة العظام" },
      { name: "Pregnancy", nameAr: "الحمل", description: "Good protein source - safe when cooked", descriptionAr: "مصدر جيد للبروتين - آمن عند الطهي" },
    ],
    drugInteractions: [
      { drug: "Thyroid medications", drugAr: "أدوية الغدة الدرقية", interaction: "Soy isoflavones may affect thyroid hormone levels", interactionAr: "أي سوفلافونات الصويا قد تؤثر على مستويات هرمونات الغدة الدرقية" },
    ],
    disclaimer: "Tofu is a versatile, nutritious protein source. Choose calcium-set for extra calcium.",
    disclaimerAr: "التوف مصدر بروتين مرن ومغذي. اختر بالكالسيوم لكالسيوم إضافي.",
    lastReviewed: new Date("2025-06-01"),
    reviewedBy: "FitTracker Nutrition Team",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    let added = 0;
    let skipped = 0;

    for (const entry of newEntries) {
      try {
        await MedicalKnowledge.findOneAndUpdate(
          { foodId: entry.foodId },
          { $setOnInsert: entry },
          { upsert: true }
        );
        added++;
      } catch {
        skipped++;
      }
    }

    const total = await MedicalKnowledge.countDocuments();
    console.log(`Done! Added ${added} new entries, skipped ${skipped}. Total: ${total}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
