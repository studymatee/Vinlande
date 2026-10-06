/* بيانات المنتجات */
const PRODUCTS = [
  // حسابات
  { id: 1, name: "حساب Steam مميز", desc: "حساب Steam فيه ألعاب AAA + مكتبة ضخمة.", price: 25, category: "accounts", icon: "🎮", badge: "hot", rating: 5, bestSeller: true },
  { id: 2, name: "حساب Epic Games", desc: "ألعاب مجانية أسبوعياً + مكتبة متنوعة.", price: 15, category: "accounts", icon: "🎯", rating: 4, badge: "new" },
  { id: 3, name: "حساب Valorant", desc: "سكنات نادرة + رانك عالي.", price: 40, category: "accounts", icon: "🔫", rating: 5, bestSeller: true },
  { id: 4, name: "حساب PUBG Mobile", desc: "مستوى عالي + سكنات نادرة.", price: 20, category: "accounts", icon: "🎯", rating: 4 },

  // اشتراكات
  { id: 5, name: "اشتراك Netflix", desc: "شهر كامل — باقة Premium 4K بدون إعلانات.", price: 8, category: "subscriptions", icon: "🎬", badge: "hot", rating: 5, bestSeller: true },
  { id: 6, name: "Spotify Premium", desc: "3 أشهر — استماع بلا حدود بدون إعلانات.", price: 6, category: "subscriptions", icon: "🎵", badge: "new", rating: 5 },
  { id: 7, name: "Discord Nitro", desc: "سنة كاملة — ميزات حصرية وإيموجي مخصص.", price: 30, category: "subscriptions", icon: "💬", rating: 5 },
  { id: 8, name: "YouTube Premium", desc: "6 أشهر — بدون إعلانات + YouTube Music.", price: 12, category: "subscriptions", icon: "📺", badge: "new", rating: 4 },
  { id: 9, name: "ChatGPT Plus", desc: "شهر — GPT-4 وأدوات الذكاء الاصطناعي.", price: 15, category: "subscriptions", icon: "🤖", rating: 5 },

  // أدوات
  { id: 10, name: "Canva Pro", desc: "سنة كاملة — تصميم احترافي بدون قيود.", price: 10, category: "tools", icon: "🎨", rating: 5 },
  { id: 11, name: "VPN سنوي", desc: "حماية كاملة + سرعة عالية بدون تسجيل.", price: 18, category: "tools", icon: "🛡️", rating: 4 },
  { id: 12, name: "Adobe Creative Cloud", desc: "شهر — كل برامج Adobe.", price: 22, category: "tools", icon: "🖌️", rating: 5 },
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
