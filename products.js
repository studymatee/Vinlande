/* ============================================
   Vinland Store — Products Data
   ============================================ */

const PRODUCTS = [
  // ===== حسابات =====
  { 
    id: 1, 
    name: "حساب Steam مميز", 
    desc: "حساب Steam فيه ألعاب AAA + مكتبة ضخمة.", 
    longDesc: "حساب Steam مميز يحتوي على أكثر من 50 لعبة AAA، منها Cyberpunk 2077, GTA V, Red Dead Redemption 2. الحساب نظيف وبدون أي مشاكل، ويأتي مع ضمان كامل لمدة 30 يوم.",
    price: 25, 
    category: "accounts", 
    img: "https://img.icons8.com/color/96/steam.png",
    badge: "hot", 
    rating: 5, 
    reviews: 47,
    stock: 5,
    bestSeller: true,
    features: ["أكثر من 50 لعبة", "ضمان 30 يوم", "تسليم فوري"]
  },
  { 
    id: 2, 
    name: "حساب Epic Games", 
    desc: "ألعاب مجانية أسبوعياً + مكتبة متنوعة.", 
    longDesc: "حساب Epic Games مع مكتبة متنوعة من الألعاب المجانية، ووصول لأحدث العروض الحصرية.",
    price: 15, 
    category: "accounts", 
    img: "https://img.icons8.com/color/96/epic-games.png",
    rating: 4, 
    reviews: 23,
    stock: 8,
    badge: "new",
    features: ["ألعاب مجانية أسبوعياً", "عروض حصرية", "ضمان 30 يوم"]
  },
  { 
    id: 3, 
    name: "حساب Valorant", 
    desc: "سكنات نادرة + رانك عالي.", 
    longDesc: "حساب Valorant برانك Immortal، مع سكنات نادرة من Elderflame وGlitchpop.",
    price: 40, 
    category: "accounts", 
    img: "https://img.icons8.com/color/96/valorant.png",
    rating: 5, 
    reviews: 62,
    stock: 3,
    bestSeller: true,
    features: ["رانك Immortal", "سكنات نادرة", "ضمان كامل"]
  },
  { 
    id: 4, 
    name: "حساب PUBG Mobile", 
    desc: "مستوى عالي + سكنات نادرة.", 
    longDesc: "حساب PUBG Mobile بمستوى عالي، مع سكنات نادرة ومكافآت حصرية.",
    price: 20, 
    category: "accounts", 
    img: "https://img.icons8.com/color/96/pubg.png",
    rating: 4, 
    reviews: 31,
    stock: 6,
    features: ["مستوى عالي", "سكنات نادرة", "تسليم فوري"]
  },

  // ===== اشتراكات =====
  { 
    id: 5, 
    name: "اشتراك Netflix", 
    desc: "شهر كامل — باقة Premium 4K بدون إعلانات.", 
    longDesc: "اشتراك Netflix Premium لمدة شهر كامل، جودة 4K Ultra HD، بدون إعلانات، يمكن استخدامه على 4 أجهزة في نفس الوقت.",
    price: 8, 
    category: "subscriptions", 
    img: "https://img.icons8.com/color/96/netflix.png",
    badge: "hot", 
    rating: 5, 
    reviews: 156,
    stock: 20,
    bestSeller: true,
    features: ["جودة 4K", "4 أجهزة", "بدون إعلانات"]
  },
  { 
    id: 6, 
    name: "Spotify Premium", 
    desc: "3 أشهر — استماع بلا حدود بدون إعلانات.", 
    longDesc: "اشتراك Spotify Premium لمدة 3 أشهر، استماع بلا حدود، تحميل الأغاني بدون إنترنت، بدون إعلانات.",
    price: 6, 
    category: "subscriptions", 
    img: "https://img.icons8.com/color/96/spotify.png",
    badge: "new", 
    rating: 5, 
    reviews: 89,
    stock: 15,
    features: ["3 أشهر", "بدون إعلانات", "تحميل بدون إنترنت"]
  },
  { 
    id: 7, 
    name: "Discord Nitro", 
    desc: "سنة كاملة — ميزات حصرية وإيموجي مخصص.", 
    longDesc: "اشتراك Discord Nitro لمدة سنة كاملة، مع إيموجي مخصص، تحميل بحجم أكبر، وبث بجودة عالية.",
    price: 30, 
    category: "subscriptions", 
    img: "https://img.icons8.com/color/96/discord-logo.png",
    rating: 5, 
    reviews: 78,
    stock: 10,
    features: ["سنة كاملة", "إيموجي مخصص", "بث HD"]
  },
  { 
    id: 8, 
    name: "YouTube Premium", 
    desc: "6 أشهر — بدون إعلانات + YouTube Music.", 
    longDesc: "اشتراك YouTube Premium لمدة 6 أشهر، بدون إعلانات، مع YouTube Music، وتحميل الفيديوهات.",
    price: 12, 
    category: "subscriptions", 
    img: "https://img.icons8.com/color/96/youtube-play.png",
    badge: "new", 
    rating: 4, 
    reviews: 45,
    stock: 12,
    features: ["6 أشهر", "YouTube Music", "تحميل الفيديوهات"]
  },
  { 
    id: 9, 
    name: "ChatGPT Plus", 
    desc: "شهر — GPT-4 وأدوات الذكاء الاصطناعي.", 
    longDesc: "اشتراك ChatGPT Plus لمدة شهر، وصول لـ GPT-4، سرعة أعلى، ووصول للأدوات المتقدمة.",
    price: 15, 
    category: "subscriptions", 
    img: "https://img.icons8.com/color/96/chatgpt.png",
    rating: 5, 
    reviews: 112,
    stock: 25,
    features: ["GPT-4", "سرعة عالية", "أدوات متقدمة"]
  },

  // ===== أدوات =====
  { 
    id: 10, 
    name: "Canva Pro", 
    desc: "سنة كاملة — تصميم احترافي بدون قيود.", 
    longDesc: "اشتراك Canva Pro لمدة سنة، وصول لأكثر من 100 مليون عنصر تصميم، قوالب حصرية، وإزالة الخلفية.",
    price: 10, 
    category: "tools", 
    img: "https://img.icons8.com/color/96/canva.png",
    rating: 5, 
    reviews: 67,
    stock: 8,
    features: ["سنة كاملة", "100M+ عنصر", "إزالة الخلفية"]
  },
  { 
    id: 11, 
    name: "VPN سنوي", 
    desc: "حماية كاملة + سرعة عالية بدون تسجيل.", 
    longDesc: "اشتراك VPN سنوي، حماية كاملة، سرعة عالية، بدون تسجيل، يعمل على 5 أجهزة.",
    price: 18, 
    category: "tools", 
    img: "https://img.icons8.com/color/96/vpn.png",
    rating: 4, 
    reviews: 34,
    stock: 14,
    features: ["سنة كاملة", "5 أجهزة", "بدون تسجيل"]
  },
  { 
    id: 12, 
    name: "Adobe Creative Cloud", 
    desc: "شهر — كل برامج Adobe.", 
    longDesc: "اشتراك Adobe Creative Cloud لمدة شهر، يشمل Photoshop, Illustrator, Premiere Pro, After Effects وغيرها.",
    price: 22, 
    category: "tools", 
    img: "https://img.icons8.com/color/96/adobe-creative-cloud.png",
    rating: 5, 
    reviews: 51,
    stock: 7,
    features: ["كل برامج Adobe", "شهر كامل", "تحديثات مجانية"]
  },
];

/* آراء العملاء */
const REVIEWS = [
  { name: "أحمد", initial: "أ", rating: 5, text: "خدمة ممتازة وسريعة! استلمت الحساب فوراً بعد الدفع. أنصح الجميع." },
  { name: "سارة", initial: "س", rating: 5, text: "أسعار ممتازة ودعم فني رائع. تعاملت معهم أكثر من مرة." },
  { name: "محمد", initial: "م", rating: 5, text: "أفضل متجر رقمي تعاملت معه. مصداقية وأمان 100%." },
  { name: "نور", initial: "ن", rating: 4, text: "منتجات أصلية وأسعار منافسة. التسليم كان أسرع من المتوقع." },
];

/* الأسئلة الشائعة */
const FAQS = [
  { q: "كيف أستلم المنتج بعد الدفع؟", a: "يتم التسليم فوراً عبر الإيميل أو واتساب خلال دقائق من تأكيد الدفع." },
  { q: "هل يوجد ضمان؟", a: "نعم، جميع المنتجات مضمونة. في حال وجود أي مشكلة، نستبدلها مجاناً خلال 7 أيام." },
  { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل PayPal، التحويل البنكي، USDT، وطرق دفع محلية أخرى." },
  { q: "هل يمكن الاسترجاع؟", a: "نعم، يمكنك طلب استرجاع خلال 24 ساعة من الشراء إذا لم يكن المنتج يعمل." },
  { q: "كم يستغرق التسليم؟", a: "التسليم فوري خلال دقائق. في أوقات الذروة قد يستغرق حتى 30 دقيقة." },
  { q: "هل الحسابات آمنة؟", a: "جميع الحسابات أصلية ومضمونة. ننصح بتغيير كلمة المرور بعد الاستلام." },
];
