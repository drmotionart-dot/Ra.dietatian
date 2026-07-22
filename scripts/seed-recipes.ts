import "dotenv/config";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

const RecipeSchema = new mongoose.Schema(
  {
    userId: String,
    name: { type: String, required: true },
    nameAr: String,
    description: String,
    category: String,
    cuisineStyle: String,
    cookingMethod: String,
    instructions: [String],
    instructionsAr: [String],
    tips: [String],
    tipsAr: [String],
    prepTimeMinutes: Number,
    cookTimeMinutes: Number,
    difficulty: String,
    nutritionPerServing: mongoose.Schema.Types.Mixed,
    servingsCount: { type: Number, default: 1 },
    occasions: [String],
  },
  { timestamps: true, collection: "recipes" }
);

const Recipe = mongoose.model("Recipe", RecipeSchema);

const recipes = [
  // ── Breakfast ──────────────────────────────────────────────
  {
    name: "Foul Medames (Classic)",
    nameAr: "فول مدمس كلاسيك",
    description: "Egyptian slow-cooked fava beans with tahini, lemon, and olive oil",
    category: "breakfast",
    cuisineStyle: "Egyptian",
    cookingMethod: "boiled",
    instructions: [
      "Soak dried fava beans overnight, then boil until tender (1-2 hours)",
      "Drain, reserving some cooking liquid",
      "Mash roughly with a fork, add cumin, garlic, lemon juice, and olive oil",
      "Serve in a bowl topped with tahini, chopped parsley, and a drizzle of olive oil",
      "Serve with Egyptian bread (Aish Baladi)"
    ],
    instructionsAr: [
      "انقع الفول المجفف طوال الليل ثم اغليه حتى ينضج (1-2 ساعة)",
      "صفِّه مع الاحتفاظ ببعض الماء",
      "اهرسه برفق بالشوكة وأضف الكمون والثوم وعصير الليمون وزيت الزيتون",
      "قدمه في وعاء مع الطحينة والبصل الأخضر ورشة زيت زيتون",
      "قدمه مع العيش البلدي"
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 90,
    difficulty: "easy",
    nutritionPerServing: { calories: 310, protein: 18, carbs: 42, fat: 8 },
    servingsCount: 2,
    occasions: ["breakfast", "ramadan"],
  },
  {
    name: "Egyptian Breakfast Platter",
    nameAr: "طبق فطار مصري",
    description: "Traditional Egyptian breakfast with foul, eggs, cheese, and fresh vegetables",
    category: "breakfast",
    cuisineStyle: "Egyptian",
    cookingMethod: "mixed",
    instructions: [
      "Prepare foul medames as a side dish",
      "Fry eggs sunny-side up with a pinch of salt and pepper",
      "Slice white cheese (gibna baida) and arrange on plate",
      "Add sliced tomatoes, cucumbers, and fresh mint",
      "Serve with warm Aish Baladi and tahini"
    ],
    instructionsAr: [
      "حضر الفول مدمس كطبق جانبي",
      "اقلي البيض مع رشة ملح وفلفل",
      "قطّع الجبنة البيضاء ورتبها في الطبق",
      "أضف شرائح الطماطم والخيار والنعناع الطازج",
      "قدم مع العيش البلدي الدافئ والطحينة"
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    difficulty: "easy",
    nutritionPerServing: { calories: 450, protein: 24, carbs: 35, fat: 22 },
    servingsCount: 1,
    occasions: ["breakfast"],
  },
  {
    name: "Baladi Bread (Aish Baladi)",
    nameAr: "عيش بلدي",
    description: "Traditional Egyptian whole wheat flatbread",
    category: "bread",
    cuisineStyle: "Egyptian",
    cookingMethod: "baked",
    instructions: [
      "Mix whole wheat flour with yeast, salt, and warm water",
      "Knead for 8-10 minutes until smooth and elastic",
      "Let rise for 1 hour until doubled",
      "Divide into 6 balls, roll into flat circles",
      "Bake in very hot oven (250°C) for 5-7 minutes until puffed",
      "Brush with water immediately after removing from oven"
    ],
    instructionsAr: [
      "اخلط دقيق القمح الكامل معخميرة والملح والماء الدافئ",
      "اعجن لمدة 8-10 دقائق حتى يصبح ناعماً ومتماسكاً",
      "اتركه يخمر لمدة ساعة حتى يتضاعف",
      "قسمه إلى 6 كرات وافرد الأقراص",
      "اخبز في فرن ساخن جداً (250 درجة) لمدة 5-7 دقائق حتى يتورم",
      "افركه بالماء فوراً بعد إخراجه من الفرن"
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 10,
    difficulty: "medium",
    nutritionPerServing: { calories: 120, protein: 4, carbs: 24, fat: 1 },
    servingsCount: 6,
    occasions: ["daily"],
  },

  // ── Main Dishes ────────────────────────────────────────────
  {
    name: "Grilled Chicken Kebab",
    nameAr: "شيش طاووق",
    description: "Marinated and grilled chicken breast cubes with Middle Eastern spices",
    category: "main",
    cuisineStyle: "Egyptian",
    cookingMethod: "grilled",
    instructions: [
      "Cut chicken breast into 2cm cubes",
      "Marinate with yogurt, lemon juice, paprika, cumin, garlic, and olive oil for 2+ hours",
      "Thread onto metal or soaked wooden skewers",
      "Grill on medium-high heat for 3-4 minutes per side until charred",
      "Serve with rice, salad, and pickles"
    ],
    instructionsAr: [
      "قطّع صدور الدجاج إلى مكعبات 2 سم",
      "تبلها باللبن الزبادي وعصير الليمون والبابريكا والكمون والثوم وزيت الزيتون لمدة ساعتين على الأقل",
      "اهرسها على أسياخ معدنية أو خشبية منقوعة",
      "اشويها على نار متوسطة-عالية لمدة 3-4 دقائق لكل جانب حتى تحمر",
      "قدمها مع الأرز السلطة وال.pickles"
    ],
    prepTimeMinutes: 20,
    cookTimeMinutes: 12,
    difficulty: "easy",
    nutritionPerServing: { calories: 280, protein: 35, carbs: 4, fat: 14 },
    servingsCount: 4,
    occasions: ["dinner"],
  },
  {
    name: "Molokhia (Egyptian Jute Leaf Stew)",
    nameAr: "ملوخية",
    description: "Traditional Egyptian soup made with jute leaves, garlic, and coriander",
    category: "main",
    cuisineStyle: "Egyptian",
    cookingMethod: "stewed",
    instructions: [
      "Bring chicken broth to a boil with whole spices (bay leaf, cardamom, cinnamon)",
      "Add finely chopped or blended molokhia leaves",
      "Simmer on low heat for 30 minutes, stirring occasionally",
      "Prepare the 'tasha': fry minced garlic and coriander in ghee until golden",
      "Pour the tasha into the molokhia, stir well, and serve over rice",
      "Serve with roasted chicken on the side"
    ],
    instructionsAr: [
      "اغلي مرق الدجاج مع التوابل الكامل (ورق لوري، هيل، قرفة)",
      "أضف أوراق الملوخية المقطعة ناعماً أو المخلوطة",
      "اتركها على نار هادئة لمدة 30 دقيقة مع التحريك أحياناً",
      "حضّر الطشة: اقلي الثوم المفروم والكزبرة في السمن حتى يذهب لونه",
      "أضف الطشة إلى الملوخية وقلبها جيداً ثم قدمها مع الأرز",
      "قدمها مع دجاج مشوي جانبياً"
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 45,
    difficulty: "medium",
    nutritionPerServing: { calories: 320, protein: 28, carbs: 12, fat: 18 },
    servingsCount: 4,
    occasions: ["dinner", "ramadan"],
  },
  {
    name: "Stuffed Bell Peppers (Mahshi Felfel)",
    nameAr: "محشي فلفل",
    description: "Bell peppers stuffed with spiced rice and ground beef",
    category: "main",
    cuisineStyle: "Egyptian",
    cookingMethod: "baked",
    instructions: [
      "Cut tops off bell peppers, remove seeds",
      "Mix ground beef with rice, diced onion, tomatoes, parsley, cumin, and allspice",
      "Stuff the peppers tightly with the mixture",
      "Place in baking dish, add tomato sauce and water around them",
      "Cover and bake at 180°C for 45-50 minutes",
      "Serve with yogurt on the side"
    ],
    instructionsAr: [
      "اقلع أطراف الفلفل وأزل البذور",
      "اخلط اللحم المفروم مع الأرز والبصل المقطّع والطماطم والبقدونس والكمون والقرفة",
      "احشو الفلفل بالخليط بإحكام",
      "ضعه في صينية وأضف صلصة الطماطم والماء حولها",
      "غطِّها واخبزها في 180 درجة لمدة 45-50 دقيقة",
      "قدمها مع اللبن الزبادي جانبياً"
    ],
    prepTimeMinutes: 25,
    cookTimeMinutes: 50,
    difficulty: "medium",
    nutritionPerServing: { calories: 340, protein: 22, carbs: 32, fat: 14 },
    servingsCount: 4,
    occasions: ["dinner"],
  },
  {
    name: "Koshari (Lentils, Rice & Pasta)",
    nameAr: "كشري",
    description: "Egypt's national dish: layers of rice, lentils, pasta, and spiced tomato sauce",
    category: "main",
    cuisineStyle: "Egyptian",
    cookingMethod: "mixed",
    instructions: [
      "Cook brown lentils until tender, drain and set aside",
      "Cook rice separately until fluffy",
      "Boil elbow macaroni until al dente, drain",
      "Prepare the sauce: sauté onions until crispy (ta'leya), cook tomato sauce with garlic and cumin",
      "Layer: rice, lentils, pasta, then top with tomato sauce and crispy onions",
      "Serve with chickpeas on top and vinegar on the side"
    ],
    instructionsAr: [
      "اطبخ العدس البني حتى ينضج وصفِّه",
      "اطبخ الأرز منفرداً حتى ينضج",
      "اغلي المعكرونة حتى تنضج وصفِّها",
      "حضّر الصلصة: اقلي البصل حتى يصبح مقرمشاً، ثم اطبخ صلصة الطماطم مع الثوم والكمون",
      "رتب الطبق: أرز ثم عدس ثم معكرونة ثم صلصة الطماطم ثم البصل المقرمش",
      "قدمها مع الحمص وخل على الجانب"
    ],
    prepTimeMinutes: 20,
    cookTimeMinutes: 40,
    difficulty: "medium",
    nutritionPerServing: { calories: 420, protein: 18, carbs: 62, fat: 10 },
    servingsCount: 4,
    occasions: ["lunch", "dinner"],
  },
  {
    name: "Grilled Fish (Samak Mashwi)",
    nameAr: "سمك مشوي",
    description: "Whole grilled fish with cumin, lemon, and herb stuffing",
    category: "main",
    cuisineStyle: "Egyptian",
    cookingMethod: "grilled",
    instructions: [
      "Clean and score whole sea bass or bream",
      "Stuff cavity with chopped parsley, dill, garlic, cumin, and lemon slices",
      "Rub outside with olive oil, cumin, paprika, salt, and pepper",
      "Grill on medium heat for 6-7 minutes per side",
      "Squeeze fresh lemon before serving",
      "Serve with tahini sauce and rice"
    ],
    instructionsAr: [
      "نظّف السمك واحفر فيه شقوقاً",
      "احشوه بالبقدونس والشبت والثوم والكمون وشرائح الليمون",
      "افرك خارجه بزيت الزيتون والكمون والبابريكا والملح والفلفل",
      "اشويه على نار متوسطة لمدة 6-7 دقائق لكل جانب",
      "اضغط عليه عصير ليمون طازج قبل التقديم",
      "قدمه مع صلصة الطحينة والأرز"
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    difficulty: "easy",
    nutritionPerServing: { calories: 260, protein: 32, carbs: 2, fat: 13 },
    servingsCount: 2,
    occasions: ["dinner"],
  },

  // ── Salads & Sides ─────────────────────────────────────────
  {
    name: "Fattet Hummus",
    nameAr: "فته حمص",
    description: "Layered yogurt, chickpeas, and bread with garlic tahini dressing",
    category: "salad",
    cuisineStyle: "Egyptian",
    cookingMethod: "mixed",
    instructions: [
      "Cut Aish Baladi into small pieces and toast until golden",
      "Warm canned or cooked chickpeas",
      "Mix yogurt with minced garlic and a pinch of salt",
      "Layer: toasted bread, chickpeas, yogurt mixture",
      "Top with toasted pine nuts and a drizzle of melted butter with paprika"
    ],
    instructionsAr: [
      "قطّع العيش البلدي إلى قطع صغيرة واحتره حتى يصبح ذهبياً",
      "دفئ الحمص المعلب أو المطبوخ",
      "اخلط اللبن الزبادي مع الثوم المفروم ورشة ملح",
      "رتب الطبقات: عيش محمص، حمص، خليط اللبن",
      "زِّينه بجوز الصنوبر المحمص ورشة سمن ذائب مع البابريكا"
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 5,
    difficulty: "easy",
    nutritionPerServing: { calories: 280, protein: 12, carbs: 30, fat: 12 },
    servingsCount: 3,
    occasions: ["lunch", "ramadan"],
  },
  {
    name: "Salata Baladi",
    nameAr: "سلطة بلدي",
    description: "Classic Egyptian tomato, cucumber, and onion salad with herbs",
    category: "salad",
    cuisineStyle: "Egyptian",
    cookingMethod: "raw",
    instructions: [
      "Dice tomatoes, cucumbers, and green bell pepper",
      "Thinly slice red onion",
      "Chop fresh parsley and mint",
      "Toss everything with olive oil, lemon juice, salt, and pepper",
      "Let sit 10 minutes for flavors to meld"
    ],
    instructionsAr: [
      "قطّع الطماطم والخيار والفلفل الأخضر",
      "شرّب البصل الأحمر شرائح رفيعة",
      "افرم البقدونس والنعناع الطازج",
      "اخلط كل شيء مع زيت الزيتون وعصير الليمون والملح والفلفل",
      "اتركها 10 دقائق حتى تتداخل النكهات"
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    difficulty: "easy",
    nutritionPerServing: { calories: 85, protein: 2, carbs: 8, fat: 6 },
    servingsCount: 3,
    occasions: ["daily"],
  },
  {
    name: "Baba Ganoush",
    nameAr: "بابا غنوج",
    description: "Smoky roasted eggplant dip with tahini, garlic, and lemon",
    category: "salad",
    cuisineStyle: "Middle Eastern",
    cookingMethod: "roasted",
    instructions: [
      "Roast whole eggplants over open flame or in oven at 220°C until collapsed",
      "Let cool, peel, and chop flesh",
      "Blend with tahini, garlic, lemon juice, and a pinch of salt",
      "Drizzle with olive oil and sprinkle with smoked paprika",
      "Serve with warm pita bread"
    ],
    instructionsAr: [
      "اشوي الباذنجان كاملاً على النار أو في الفرن حتى يرتخي",
      "اتركه يبرد ثم قشّره وقطّعه",
      "اخضره مع الطحينة والثوم وعصير الليمون ورشة ملح",
      "رشّه بزيت الزيتون ونثر البابrika المدخنة",
      "قدمه مع خبز البيتا الدافئ"
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    difficulty: "easy",
    nutritionPerServing: { calories: 150, protein: 4, carbs: 10, fat: 11 },
    servingsCount: 4,
    occasions: ["lunch", "dinner"],
  },
  {
    name: "Hummus bi Tahini",
    nameAr: "حمص بالطحينة",
    description: "Creamy chickpea dip with tahini, garlic, and lemon",
    category: "salad",
    cuisineStyle: "Middle Eastern",
    cookingMethod: "blended",
    instructions: [
      "Drain and rinse cooked chickpeas (reserve some liquid)",
      "Blend chickpeas with tahini, garlic, lemon juice, and cumin",
      "Add reserved chickpea liquid until smooth and creamy",
      "Season with salt and adjust lemon to taste",
      "Serve in a shallow bowl with olive oil drizzle and paprika"
    ],
    instructionsAr: [
      "صفِّ واغسل الحمص المطبوخ (احتفظ ببعض الماء)",
      "اخضره مع الطحينة والثوم وعصير الليمون والكمون",
      "أضف ماء الحمص حتى يصبح ناعماً وكريمياً",
      "تبّل بالملح وعدّل الليمون حسب الذوق",
      "قدمه في وعاء ضحل مع رشة زيت زيتون وبابريكا"
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 0,
    difficulty: "easy",
    nutritionPerServing: { calories: 180, protein: 8, carbs: 18, fat: 9 },
    servingsCount: 4,
    occasions: ["lunch", "dinner", "ramadan"],
  },

  // ── Soups ───────────────────────────────────────────────────
  {
    name: "Lentil Soup (Shorbat Ads)",
    nameAr: "شوربة عدس",
    description: "Classic Egyptian red lentil soup with cumin and crispy onions",
    category: "soup",
    cuisineStyle: "Egyptian",
    cookingMethod: "boiled",
    instructions: [
      "Sauté diced onion and carrot in olive oil until soft",
      "Add red lentils, cumin, turmeric, and chicken broth",
      "Simmer for 20 minutes until lentils dissolve",
      "Blend until smooth, season with salt and pepper",
      "Serve topped with crispy fried onions and a squeeze of lemon"
    ],
    instructionsAr: [
      "اقلي البصل والجزر المقطّعين في زيت الزيتون حتى ينضجا",
      "أضف العدس الأحمر والكمون والكركم ومرق الدجاج",
      "اتركه يغلي على نار هادئة لمدة 20 دقيقة حتى يذوب العدس",
      "اخضره حتى يصبح ناعماً وتبّل بالملح والفلفل",
      "قدمه مع بصل مقلي ورشة ليمون"
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    difficulty: "easy",
    nutritionPerServing: { calories: 200, protein: 12, carbs: 30, fat: 4 },
    servingsCount: 4,
    occasions: ["lunch", "ramadan"],
  },
  {
    name: "Creamy Chicken Soup",
    nameAr: "شوربة دجاج بالقشطة",
    description: "Creamy chicken soup with vegetables and vermicelli noodles",
    category: "soup",
    cuisineStyle: "Egyptian",
    cookingMethod: "boiled",
    instructions: [
      "Boil chicken breast until cooked, shred into strips",
      "Sauté diced onion, carrot, and celery in butter",
      "Add chicken broth and bring to a boil",
      "Add vermicelli noodles, diced potatoes, and corn",
      "Simmer until vegetables are tender, stir in a splash of cream",
      "Season with salt, pepper, and a pinch of nutmeg"
    ],
    instructionsAr: [
      "اغلي صدر الدجاج حتى ينضج ثم اقطعه شرائح",
      "اقلي البصل والجزر والكرفس المقطّعين في الزبدة",
      "أضف مرق الدجاج واتركه يغلي",
      "أضف المعكرونة الرقيقة والبطاطس المقطعة والحصص",
      "اتركها تنضج ثم أضف رشة قشطة",
      "تبّل بالملح والفلفل وجوزة الطيب"
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    difficulty: "easy",
    nutritionPerServing: { calories: 240, protein: 20, carbs: 22, fat: 8 },
    servingsCount: 4,
    occasions: ["lunch"],
  },

  // ── Snacks & Light Meals ────────────────────────────────────
  {
    name: "Fatta Pan (Chicken)",
    nameAr: "فطعة دجاج",
    description: "Layered bread, chicken, and yogurt in a pan - a complete meal",
    category: "main",
    cuisineStyle: "Egyptian",
    cookingMethod: "baked",
    instructions: [
      "Toast Aish Baladi pieces until golden and crunchy",
      "Cook chicken with onions, garlic, and spices until tender",
      "Shred the chicken and set aside",
      "Layer: toasted bread, shredded chicken, rice, yogurt-garlic sauce",
      "Bake at 180°C for 20 minutes until golden on top",
      "Serve immediately with a drizzle of melted butter"
    ],
    instructionsAr: [
      "احتر قطع العيش البلدي حتى يصبح ذهبياً ومقرمشاً",
      "اطبخ الدجاج مع البصل والثوم والتوابل حتى ينضج",
      "افرد الدجاج واحتفظ به جانباً",
      "رتب الطبقات: عيش محمص، دجاج مفرود، أرز، صلصة لبن بالثوم",
      "اخبزها في 180 درجة لمدة 20 دقيقة حتى تصبح ذهبية",
      "قدمها فوراً مع رشة سمن ذائب"
    ],
    prepTimeMinutes: 20,
    cookTimeMinutes: 30,
    difficulty: "medium",
    nutritionPerServing: { calories: 380, protein: 28, carbs: 34, fat: 14 },
    servingsCount: 3,
    occasions: ["lunch", "dinner"],
  },
  {
    name: "Ta'ameya (Egyptian Falafel)",
    nameAr: "طعمية",
    description: "Egyptian fava bean fava falafel - crispy outside, green inside",
    category: "snack",
    cuisineStyle: "Egyptian",
    cookingMethod: "fried",
    instructions: [
      "Soak dried fava beans overnight, drain and peel",
      "Blend with fresh herbs (cilantro, dill, parsley), onion, and garlic",
      "Add cumin, coriander, salt, and a pinch of baking powder",
      "Shape into small patties",
      "Deep fry in hot oil until golden brown (3-4 minutes)",
      "Drain on paper towels and serve in Aish Baladi"
    ],
    instructionsAr: [
      "انقع الفول المجفف طوال الليل وصفِّه وقشّره",
      "اخضره مع الأعشاب الطازجة (كزبرة، شبت، بقدونس) والبصل والثوم",
      "أضف الكمون والكزبرة والملح ورشة باكينج باودر",
      "شكّلها على شكل كرات مسطحة",
      "اقليها في زيت ساخن حتى تحمر (3-4 دقائق)",
      "صفِّها على مناديل وقدمها في عيش بلدي"
    ],
    prepTimeMinutes: 20,
    cookTimeMinutes: 10,
    difficulty: "medium",
    nutritionPerServing: { calories: 220, protein: 10, carbs: 22, fat: 11 },
    servingsCount: 4,
    occasions: ["snack", "ramadan"],
  },
  {
    name: "Koshari Ta'ameya (Mixed Plate)",
    nameAr: "plate كشري وطعمية",
    description: "Classic combo: Koshari topped with Ta'ameya for the ultimate Egyptian meal",
    category: "main",
    cuisineStyle: "Egyptian",
    cookingMethod: "mixed",
    instructions: [
      "Prepare Koshari (rice, lentils, pasta, tomato sauce, crispy onions)",
      "Prepare Ta'ameya (Egyptian falafel)",
      "Plate Koshari as the base",
      "Place 2-3 Ta'ameya on top",
      "Drizzle with extra tomato sauce and tahini",
      "Add hot sauce to taste"
    ],
    instructionsAr: [
      "حضّر الكشري (أرز، عدس، معكرونة، صلصة طماطم، بصل مقلي)",
      "حضّر الطعمية",
      " ضع الكشري كقاعدة في الطبق",
      "ضع 2-3 قطع طعمية فوقها",
      "رشّها بصلصة الطماطم والطحينة",
      "أضف الصوص الحار حسب الرغبة"
    ],
    prepTimeMinutes: 30,
    cookTimeMinutes: 30,
    difficulty: "medium",
    nutritionPerServing: { calories: 520, protein: 22, carbs: 58, fat: 20 },
    servingsCount: 2,
    occasions: ["lunch"],
  },
  {
    name: "Shawarma Plate",
    nameAr: "طبق شاورما",
    description: "Spiced chicken shawarma with garlic sauce, pickles, and fresh vegetables",
    category: "main",
    cuisineStyle: "Egyptian",
    cookingMethod: "grilled",
    instructions: [
      "Slice chicken thighs thinly and marinate with shawarma spices (cardamom, turmeric, cinnamon, cumin)",
      "Let marinate for at least 4 hours",
      "Cook in a hot skillet or grill until caramelized",
      "Serve on a plate with tahini sauce, garlic sauce (toum), and pickled turnips",
      "Add sliced tomatoes, cucumbers, and lettuce",
      "Wrap in Aish Baladi or serve with rice"
    ],
    instructionsAr: [
      "قطّع أفخاذ الدجاج رفيعاً وتبلها بتوابل الشاورما (هيل، كرمان، قرفة، كمون)",
      "اتركها تتبل لمدة 4 ساعات على الأقل",
      "اطبخها في مقلاة ساخنة أو شوي حتى تحمر",
      "قدمها في طبق مع صلصة الطحينة وصلصة الثوم (التووم) واللفت المخلل",
      "أضف شرائح الطماطم والخيار والخس",
      "لفها في عيش بلدي أو قدمها مع الأرز"
    ],
    prepTimeMinutes: 30,
    cookTimeMinutes: 15,
    difficulty: "medium",
    nutritionPerServing: { calories: 360, protein: 30, carbs: 20, fat: 18 },
    servingsCount: 3,
    occasions: ["lunch", "dinner"],
  },
  {
    name: "Musakhan (Chicken with Sumac Onions)",
    nameAr: "مسخن دجاج",
    description: "Palestinian-Egyptian dish: roasted chicken on taboon bread with sumac onions",
    category: "main",
    cuisineStyle: "Egyptian",
    cookingMethod: "roasted",
    instructions: [
      "Slice onions thinly, cook slowly with sumac and olive oil for 20 minutes",
      "Season whole chicken with sumac, allspice, cinnamon, and salt",
      "Roast chicken at 200°C for 45 minutes until golden",
      "Place sumac onions on taboon bread or pita",
      "Place roasted chicken on top and serve with rice and salad"
    ],
    instructionsAr: [
      "شرّب البصل رقيقاً واطبخه ببطء مع السماق وزيت الزيتون لمدة 20 دقيقة",
      "تبّل الدجاج الكامل بالسماق والقرفة والهيل والملح",
      "اشوي الدجاج في 200 درجة لمدة 45 دقيقة حتى يحمر",
      "ضع بصل السماق على خبز طابون أو بيتا",
      "ضع الدجاج المشوي فوقه وقدمه مع الأرز والسلطة"
    ],
    prepTimeMinutes: 20,
    cookTimeMinutes: 50,
    difficulty: "medium",
    nutritionPerServing: { calories: 400, protein: 32, carbs: 22, fat: 20 },
    servingsCount: 4,
    occasions: ["dinner"],
  },
  {
    name: "Macarona Bechamel",
    nameAr: "مكرونة بشاميل",
    description: "Egyptian baked pasta with meat sauce and creamy béchamel topping",
    category: "main",
    cuisineStyle: "Egyptian",
    cookingMethod: "baked",
    instructions: [
      "Cook penne pasta until al dente, drain",
      "Prepare meat sauce: brown ground beef with onions, tomato paste, and spices",
      "Prepare béchamel: melt butter, add flour, whisk in warm milk, season with nutmeg",
      "Layer: pasta, meat sauce, more pasta, then pour béchamel on top",
      "Bake at 190°C for 25-30 minutes until golden brown",
      "Let rest 10 minutes before cutting"
    ],
    instructionsAr: [
      "اطبخ المعكرونة حتى تنضج وصفِّها",
      "حضّر صلصة اللحم: اقلي اللحم المفروم مع البصل ومعجون الطماطم والتوابل",
      "حضّر البشاميل: اذب الزبدة وأضف الطحين ثم الحليب الدافئ وتبّل بجوزة الطيب",
      "رتب الطبقات: معكرونة، صلصة لحم، معكرونة، ثم اسكب البشاميل فوق",
      "اخبزها في 190 درجة لمدة 25-30 دقيقة حتى تحمر",
      "اتركها ترتاح 10 دقائق قبل التقطيع"
    ],
    prepTimeMinutes: 25,
    cookTimeMinutes: 30,
    difficulty: "medium",
    nutritionPerServing: { calories: 450, protein: 25, carbs: 42, fat: 20 },
    servingsCount: 4,
    occasions: ["lunch", "dinner"],
  },

  // ── Desserts ────────────────────────────────────────────────
  {
    name: "Om Ali (Egyptian Bread Pudding)",
    nameAr: "أم علي",
    description: "Egypt's beloved dessert: baked bread pudding with nuts, raisins, and cream",
    category: "dessert",
    cuisineStyle: "Egyptian",
    cookingMethod: "baked",
    instructions: [
      "Tear Aish Baladi or puff pastry into pieces and place in baking dish",
      "Add mixed nuts (pistachios, almonds, walnuts) and raisins",
      "Mix hot milk with sugar and vanilla, pour over the bread",
      "Top with a drizzle of cream (qashta)",
      "Bake at 190°C for 20-25 minutes until golden and bubbly",
      "Serve warm"
    ],
    instructionsAr: [
      "قطّع العيش البلدي أو العجينة المنتفخة وضعها في صينية",
      "أضف خليط المكسرات (فستق، لوز، جوز) والزبيب",
      "اخلط الحليب الساخن مع السكر والفانيليا واسكبه فوق العيش",
      "غطّه برشة قشطة",
      "اخبزه في 190 درجة لمدة 20-25 دقيقة حتى يحمر ويغلي",
      "قدمه دافئاً"
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    difficulty: "easy",
    nutritionPerServing: { calories: 350, protein: 10, carbs: 42, fat: 16 },
    servingsCount: 4,
    occasions: ["ramadan", "dessert"],
  },
  {
    name: "Roz Bel Laban (Rice Pudding)",
    nameAr: "رز بلبن",
    description: "Creamy Egyptian rice pudding with rosewater and cinnamon",
    category: "dessert",
    cuisineStyle: "Egyptian",
    cookingMethod: "stewed",
    instructions: [
      "Rinse short-grain rice and cook with a little water until soft",
      "Add warm milk gradually, stirring constantly",
      "Add sugar and vanilla, continue stirring on low heat for 15-20 minutes",
      "Add a splash of rosewater",
      "Pour into individual bowls, let cool",
      "Sprinkle with cinnamon and pistachios before serving"
    ],
    instructionsAr: [
      "اغسل الأرز قصير الحبة واطبخه بالماء حتى ينضج",
      "أضف الحليب الدافئ تدريجياً مع التحريك المستمر",
      "أضف السكر والفانيليا وواصل التحريك على نار هادئة لمدة 15-20 دقيقة",
      "أضف رشة ماء ورد",
      "صبّه في أوعية فردية واتركه يبرد",
      "نثره بالقرفة والفستق قبل التقديم"
    ],
    prepTimeMinutes: 5,
    cookTimeMinutes: 30,
    difficulty: "easy",
    nutritionPerServing: { calories: 260, protein: 6, carbs: 44, fat: 6 },
    servingsCount: 4,
    occasions: ["ramadan", "dessert"],
  },

  // ── Ramadan Specials ────────────────────────────────────────
  {
    name: "Qamar al-Din (Apricot Juice)",
    nameAr: "قمر الدين",
    description: "Traditional thick apricot juice served during Ramadan",
    category: "beverage",
    cuisineStyle: "Egyptian",
    cookingMethod: "mixed",
    instructions: [
      "Dissolve qamar al-din sheets in warm water for 30 minutes",
      "Blend until smooth",
      "Add cold water and sugar to taste",
      "Strain if desired, chill in refrigerator",
      "Serve ice cold"
    ],
    instructionsAr: [
      "ذوّب رقائق قمر الدين في الماء الدافئ لمدة 30 دقيقة",
      "اخضرها حتى تصبح ناعمة",
      "أضف ماء بارد وسكر حسب الرغبة",
      "صفيها إذا رغبت وبرّدها في الثلاجة",
      "قدمها باردة جداً"
    ],
    prepTimeMinutes: 35,
    cookTimeMinutes: 0,
    difficulty: "easy",
    nutritionPerServing: { calories: 150, protein: 1, carbs: 37, fat: 0 },
    servingsCount: 4,
    occasions: ["ramadan"],
  },
  {
    name: "Konafa with Cream",
    nameAr: "كنافة بالقشطة",
    description: "Crispy shredded pastry with sweet cheese filling and sugar syrup",
    category: "dessert",
    cuisineStyle: "Egyptian",
    cookingMethod: "baked",
    instructions: [
      "Cut konafa dough into small pieces, mix with melted butter",
      "Press half into a greased baking pan",
      "Spread qashta (clotted cream) or sweet cheese evenly",
      "Cover with remaining konafa, press down firmly",
      "Bake at 180°C for 30-35 minutes until golden",
      "Immediately pour cold sugar syrup over hot konafa",
      "Let absorb, cut into pieces, garnish with pistachios"
    ],
    instructionsAr: [
      "قطّع عجينة الكنافة إلى قطع صغيرة واخلطها بالزبدة الذائبة",
      "اضغط نصفها في صينية مدهونة",
      "افرد القشطة أو الجبن الحلو بالتساوي",
      "غطّها بباقي الكنافة واضغط بإحكام",
      "اخبزها في 180 درجة لمدة 30-35 دقيقة حتى تحمر",
      "اسكب القطر البارد فوراً فوق الكنافة الساخنة",
      "اتركه يمتص القطر وقطّعه وزيّنه بالفستق"
    ],
    prepTimeMinutes: 20,
    cookTimeMinutes: 35,
    difficulty: "hard",
    nutritionPerServing: { calories: 420, protein: 8, carbs: 52, fat: 22 },
    servingsCount: 6,
    occasions: ["ramadan", "dessert"],
  },
  {
    name: "Basbousa (Semolina Cake)",
    nameAr: "بسبوسة",
    description: "Sweet semolina cake soaked in sugar syrup with coconut",
    category: "dessert",
    cuisineStyle: "Egyptian",
    cookingMethod: "baked",
    instructions: [
      "Mix semolina, sugar, desiccated coconut, and baking powder",
      "Add yogurt and melted butter, mix well",
      "Pour into greased baking pan, smooth the top",
      "Score into diamond shapes, place an almond on each piece",
      "Bake at 180°C for 25-30 minutes until golden",
      "Pour cold sugar syrup over hot cake immediately",
      "Let absorb for 30 minutes before serving"
    ],
    instructionsAr: [
      "اخلط السميد مع السكر وجوز الهند المجفف وباكينج باودر",
      "أضف الزبادي والزبدة الذائبة وقلب جيداً",
      "صبّه في صينية مدهونة وسوي السطح",
      "قطعه على شكل معينات وضع لوز على كل قطعة",
      "اخبزه في 180 درجة لمدة 25-30 دقيقة حتى يحمر",
      "اسكب القطر البارد فوراً فوق الكعكة الساخنة",
      "اتركه يمتص القطر لمدة 30 دقيقة قبل التقديم"
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 30,
    difficulty: "medium",
    nutritionPerServing: { calories: 320, protein: 5, carbs: 48, fat: 12 },
    servingsCount: 8,
    occasions: ["ramadan", "dessert"],
  },

  // ── Healthy Options ─────────────────────────────────────────
  {
    name: "Grilled Chicken Salad Bowl",
    nameAr: "سلطة دجاج مشوي",
    description: "High-protein salad bowl with grilled chicken, quinoa, and fresh vegetables",
    category: "salad",
    cuisineStyle: "Healthy",
    cookingMethod: "grilled",
    instructions: [
      "Cook quinoa according to package directions, let cool",
      "Season chicken breast with herbs and grill until cooked through",
      "Slice the chicken",
      "Arrange bowl: quinoa base, mixed greens, cherry tomatoes, cucumber, avocado",
      "Top with sliced chicken",
      "Drizzle with olive oil and lemon dressing"
    ],
    instructionsAr: [
      "اطبخ الكينوا حسب التعليمات واتركها تبرد",
      "تبّل صدر الدجاج بالأعشاب واشويه حتى ينضج",
      "قطّع الدجاج",
      "رتب Bowl: كينوا كقاعدة، خضراء مختلطة، طماطم كرزية، خيار، أفوكادو",
      "ضع الدجاج المقطع فوق",
      "رشّها بزيت الزيتون وصلصة الليمون"
    ],
    prepTimeMinutes: 15,
    cookTimeMinutes: 15,
    difficulty: "easy",
    nutritionPerServing: { calories: 380, protein: 35, carbs: 28, fat: 14 },
    servingsCount: 1,
    occasions: ["lunch"],
  },
  {
    name: "Protein Smoothie Bowl",
    nameAr: "سموذي بروتين",
    description: "Thick smoothie bowl with banana, berries, oats, and protein powder",
    category: "snack",
    cuisineStyle: "Healthy",
    cookingMethod: "blended",
    instructions: [
      "Blend frozen banana, mixed berries, oats, protein powder, and almond milk",
      "Pour into a bowl (should be thick)",
      "Top with sliced banana, chia seeds, granola, and coconut flakes",
      "Drizzle with honey or peanut butter",
      "Eat with a spoon immediately"
    ],
    instructionsAr: [
      "اخضر الموز المجمد والتوت والأفوكادو والبروتين وحليب اللوز",
      "صبّه في وعاء (يجب أن يكون سميكاً)",
      "زيّنه بموز مقطّع وبذور شيا وجرانولا ورقائق جوز هند",
      "رشّه بالعسل أو زبدة الفول السوداني",
      "تناوله بالملعقة فوراً"
    ],
    prepTimeMinutes: 5,
    cookTimeMinutes: 0,
    difficulty: "easy",
    nutritionPerServing: { calories: 350, protein: 25, carbs: 48, fat: 8 },
    servingsCount: 1,
    occasions: ["snack"],
  },
  {
    name: "Grilled Shrimp (Gamberi)",
    nameAr: "جمبري مشوي",
    description: "Garlic butter grilled shrimp with lemon and herbs",
    category: "main",
    cuisineStyle: "Egyptian",
    cookingMethod: "grilled",
    instructions: [
      "Clean and devein shrimp, pat dry",
      "Marinate with garlic, olive oil, lemon juice, paprika, and parsley for 20 minutes",
      "Thread onto skewers",
      "Grill on high heat for 2-3 minutes per side until pink and curled",
      "Squeeze lemon and serve immediately with rice or salad"
    ],
    instructionsAr: [
      "نظّف الجمبري وأزل الأمعاء وجففه",
      "تبله بالثوم وزيت الزيتون وعصير الليمون والبابريكا والبقدونس لمدة 20 دقيقة",
      "اهرسه على الأسياخ",
      "اشويه على نار عالية لمدة 2-3 دقائق لكل جانب حتى يتحول لونه للوردي",
      "اضغط عليه ليمون وقدمه فوراً مع الأرز أو السلطة"
    ],
    prepTimeMinutes: 25,
    cookTimeMinutes: 6,
    difficulty: "easy",
    nutritionPerServing: { calories: 220, protein: 28, carbs: 2, fat: 10 },
    servingsCount: 2,
    occasions: ["dinner"],
  },
  {
    name: "Shakshuka",
    nameAr: "شكشوكة",
    description: "Eggs poached in spicy tomato sauce with peppers and onions",
    category: "breakfast",
    cuisineStyle: "Middle Eastern",
    cookingMethod: "stewed",
    instructions: [
      "Sauté diced onion and bell pepper in olive oil until soft",
      "Add minced garlic and cook for 1 minute",
      "Add canned crushed tomatoes, cumin, paprika, and chili flakes",
      "Simmer for 10 minutes until thickened",
      "Make wells and crack eggs into them",
      "Cover and cook on low for 5-7 minutes until eggs are set",
      "Garnish with fresh parsley and serve with bread"
    ],
    instructionsAr: [
      "اقلي البصل والفلفل المقطّعين في زيت الزيتون حتى ينضجا",
      "أضف الثوم المفروم واطبخه لمدة دقيقة",
      "أضف الطماطم المطحونة والكمون والبابريكا ورقاعات الفلفل الحار",
      "اتركها تنضج لمدة 10 دقائق حتى تتكثف",
      "افتح تجاويف وأضف البيض فيها",
      "غطِّها واطبخها على نار هادئة لمدة 5-7 دقائق حتى تنضج البيض",
      "زيّنها بالبقدونس الطازج وقدمها مع الخبز"
    ],
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    difficulty: "easy",
    nutritionPerServing: { calories: 280, protein: 16, carbs: 14, fat: 18 },
    servingsCount: 2,
    occasions: ["breakfast", "lunch"],
  },
];

async function seed() {
  console.log("🔗 Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected\n");

  console.log("🗑️  Clearing existing recipes...");
  await Recipe.deleteMany({});
  console.log("✅ Cleared\n");

  console.log(`📥 Seeding ${recipes.length} recipes...`);
  const result = await Recipe.insertMany(recipes);
  console.log(`✅ Inserted ${result.length} recipes\n`);

  const categories = await Recipe.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  console.log("📊 Categories:");
  for (const c of categories) {
    console.log(`   ${c._id}: ${c.count}`);
  }

  const difficulties = await Recipe.aggregate([
    { $group: { _id: "$difficulty", count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  console.log("\n📊 Difficulties:");
  for (const d of difficulties) {
    console.log(`   ${d._id}: ${d.count}`);
  }

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected. Done!");
}

seed().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
