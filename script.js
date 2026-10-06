/* ============================================
   Vinland Store — script.js (النسخة الكاملة)
   ============================================ */

/* ============================================
   إعدادات Supabase
   ============================================ */
const SUPABASE_URL = 'https://ncrycgbrstafdouvipzc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6t2dkU27Rkinsoo8MhYAEQ_FSgj4G73';
const CART_KEY = 'vinland_cart';
const WHATSAPP_NUMBER = '0000000000'; // ← بدّل رقمك هنا

let sb = null;
if (window.supabase) {
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* ============================================
   المنتجات الاحتياطية (لو Supabase فشل)
   ============================================ */
const FALLBACK_PRODUCTS = [
  { id: 1, name: "حساب Steam مميز", desc: "حساب Steam فيه ألعاب AAA + مكتبة ضخمة.", longDesc: "حساب Steam مميز يحتوي على أكثر من 50 لعبة AAA.", price: 25, category: "accounts", img: "https://api.iconify.design/mdi:steam.svg?color=%237cb342", badge: "hot", rating: 5, reviews: 47, stock: 5, bestSeller: true, features: ["أكثر من 50 لعبة", "ضمان 30 يوم", "تسليم فوري"] },
  { id: 2, name: "حساب Epic Games", desc: "ألعاب مجانية أسبوعياً + مكتبة متنوعة.", longDesc: "حساب Epic Games مع مكتبة متنوعة.", price: 15, category: "accounts", img: "https://api.iconify.design/simple-icons:epicgames.svg?color=%237cb342", rating: 4, reviews: 23, stock: 8, badge: "new", features: ["ألعاب مجانية", "عروض حصرية", "ضمان 30 يوم"] },
  { id: 3, name: "حساب Valorant", desc: "سكنات نادرة + رانك عالي.", longDesc: "حساب Valorant برانك Immortal.", price: 40, category: "accounts", img: "https://api.iconify.design/simple-icons:valorant.svg?color=%23ff5252", rating: 5, reviews: 62, stock: 3, bestSeller: true, features: ["رانك Immortal", "سكنات نادرة", "ضمان كامل"] },
  { id: 4, name: "حساب PUBG Mobile", desc: "مستوى عالي + سكنات نادرة.", longDesc: "حساب PUBG Mobile بمستوى عالي.", price: 20, category: "accounts", img: "https://api.iconify.design/mdi:target.svg?color=%23ffc107", rating: 4, reviews: 31, stock: 6, features: ["مستوى عالي", "سكنات نادرة", "تسليم فوري"] },
  { id: 5, name: "اشتراك Netflix", desc: "شهر كامل — باقة Premium 4K.", longDesc: "اشتراك Netflix Premium لمدة شهر كامل.", price: 8, category: "subscriptions", img: "https://api.iconify.design/simple-icons:netflix.svg?color=%23e50914", badge: "hot", rating: 5, reviews: 156, stock: 20, bestSeller: true, features: ["جودة 4K", "4 أجهزة", "بدون إعلانات"] },
  { id: 6, name: "Spotify Premium", desc: "3 أشهر — استماع بلا حدود.", longDesc: "اشتراك Spotify Premium لمدة 3 أشهر.", price: 6, category: "subscriptions", img: "https://api.iconify.design/simple-icons:spotify.svg?color=%231db954", badge: "new", rating: 5, reviews: 89, stock: 15, features: ["3 أشهر", "بدون إعلانات", "تحميل بدون إنترنت"] },
  { id: 7, name: "Discord Nitro", desc: "سنة كاملة — ميزات حصرية.", longDesc: "اشتراك Discord Nitro لمدة سنة.", price: 30, category: "subscriptions", img: "https://api.iconify.design/simple-icons:discord.svg?color=%235865f2", rating: 5, reviews: 78, stock: 10, features: ["سنة كاملة", "إيموجي مخصص", "بث HD"] },
  { id: 8, name: "YouTube Premium", desc: "6 أشهر — بدون إعلانات.", longDesc: "اشتراك YouTube Premium لمدة 6 أشهر.", price: 12, category: "subscriptions", img: "https://api.iconify.design/simple-icons:youtube.svg?color=%23ff0000", badge: "new", rating: 4, reviews: 45, stock: 12, features: ["6 أشهر", "YouTube Music", "تحميل"] },
  { id: 9, name: "ChatGPT Plus", desc: "شهر — GPT-4 وأدوات AI.", longDesc: "اشتراك ChatGPT Plus لمدة شهر.", price: 15, category: "subscriptions", img: "https://api.iconify.design/simple-icons:openai.svg?color=%2310a37f", rating: 5, reviews: 112, stock: 25, features: ["GPT-4", "سرعة عالية", "أدوات متقدمة"] },
  { id: 10, name: "Canva Pro", desc: "سنة كاملة — تصميم احترافي.", longDesc: "اشتراك Canva Pro لمدة سنة.", price: 10, category: "tools", img: "https://api.iconify.design/simple-icons:canva.svg?color=%2300c4cc", rating: 5, reviews: 67, stock: 8, features: ["سنة كاملة", "100M+ عنصر", "إزالة الخلفية"] },
  { id: 11, name: "VPN سنوي", desc: "حماية كاملة + سرعة عالية.", longDesc: "اشتراك VPN سنوي، حماية كاملة.", price: 18, category: "tools", img: "https://api.iconify.design/mdi:shield-lock.svg?color=%237cb342", rating: 4, reviews: 34, stock: 14, features: ["سنة كاملة", "5 أجهزة", "بدون تسجيل"] },
  { id: 12, name: "Adobe Creative Cloud", desc: "شهر — كل برامج Adobe.", longDesc: "اشتراك Adobe Creative Cloud لمدة شهر.", price: 22, category: "tools", img: "https://api.iconify.design/simple-icons:adobe.svg?color=%23ff0000", rating: 5, reviews: 51, stock: 7, features: ["كل برامج Adobe", "شهر كامل", "تحديثات"] }
];

let PRODUCTS = [...FALLBACK_PRODUCTS];

/* ============================================
   آراء العملاء
   ============================================ */
const REVIEWS = [
  { name: "أحمد", initial: "أ", rating: 5, text: "خدمة ممتازة وسريعة! استلمت الحساب فوراً بعد الدفع. أنصح الجميع." },
  { name: "سارة", initial: "س", rating: 5, text: "أسعار ممتازة ودعم فني رائع. تعاملت معهم أكثر من مرة." },
  { name: "محمد", initial: "م", rating: 5, text: "أفضل متجر رقمي تعاملت معه. مصداقية وأمان 100%." },
  { name: "نور", initial: "ن", rating: 4, text: "منتجات أصلية وأسعار منافسة. التسليم كان أسرع من المتوقع." }
];

/* ============================================
   الأسئلة الشائعة
   ============================================ */
const FAQS = [
  { q: "كيف أستلم المنتج بعد الدفع؟", a: "يتم التسليم فوراً عبر الإيميل أو واتساب خلال دقائق من تأكيد الدفع." },
  { q: "هل يوجد ضمان؟", a: "نعم، جميع المنتجات مضمونة. في حال وجود أي مشكلة، نستبدلها مجاناً خلال 7 أيام." },
  { q: "ما هي طرق الدفع المتاحة؟", a: "نقبل PayPal، التحويل البنكي، USDT، وطرق دفع محلية أخرى." },
  { q: "هل يمكن الاسترجاع؟", a: "نعم، يمكنك طلب استرجاع خلال 24 ساعة من الشراء إذا لم يكن المنتج يعمل." },
  { q: "كم يستغرق التسليم؟", a: "التسليم فوري خلال دقائق. في أوقات الذروة قد يستغرق حتى 30 دقيقة." },
  { q: "هل الحسابات آمنة؟", a: "جميع الحسابات أصلية ومضمونة. ننصح بتغيير كلمة المرور بعد الاستلام." }
];

/* ============================================
   أدوات مساعدة
   ============================================ */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2500);
}

function renderStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

/* ============================================
   جلب المنتجات من Supabase
   ============================================ */
async function fetchProducts() {
  if (!sb) {
    console.warn('⚠️ Supabase not loaded, using fallback products');
    PRODUCTS = [...FALLBACK_PRODUCTS];
    return;
  }
  try {
    const { data, error } = await sb
      .from('products')
      .select('*')
      .eq('active', true)
      .order('id', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      PRODUCTS = data.map(p => ({
        id: p.id,
        name: p.name,
        desc: p.description,
        longDesc: p.long_description,
        price: parseFloat(p.price),
        category: p.category,
        img: p.image_url,
        badge: p.badge,
        rating: p.rating,
        reviews: p.reviews_count,
        stock: p.stock,
        bestSeller: p.best_seller,
        features: p.features || []
      }));
      console.log('✅ Loaded', PRODUCTS.length, 'products from Supabase');
    } else {
      console.warn('⚠️ No products in Supabase, using fallback');
      PRODUCTS = [...FALLBACK_PRODUCTS];
    }
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    PRODUCTS = [...FALLBACK_PRODUCTS];
  }
}

/* ============================================
   السلة
   ============================================ */
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(b => {
    b.textContent = getCartCount();
  });
}

function addToCart(productId) {
  const cart = getCart();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
      qty: 1
    });
  }
  saveCart(cart);
  showToast('✓ تمت إضافة ' + product.name);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  if (!itemsEl) return;
  const cart = getCart();

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="empty-cart">
        <img src="https://api.iconify.design/mdi:cart-outline.svg?color=%23bdbdbd" alt="" class="empty-icon">
        <p>سلتك فارغة</p>
      </div>`;
    if (footerEl) footerEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="item-img"><img src="${item.img}" alt="${item.name}"></div>
      <div class="item-info">
        <h4>${item.name}</h4>
        <span class="item-price">$${item.price}</span>
        <span class="item-qty"> × ${item.qty}</span>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})">
        <img src="https://api.iconify.design/mdi:close.svg?color=%23ff5252" alt="">
      </button>
    </div>
  `).join('');

  const total = getCartTotal();
  if (footerEl) footerEl.innerHTML = `
    <div class="summary-row"><span>المجموع الفرعي</span><span>$${total}</span></div>
    <div class="summary-row total"><span>الإجمالي</span><span>$${total}</span></div>
    <button class="checkout-btn" onclick="checkout()">إتمام الشراء</button>
  `;
}

function checkout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast('السلة فارغة', 'error');
    return;
  }
  const total = getCartTotal();
  let msg = '🛒 طلب جديد من Vinland:\n\n';
  cart.forEach(item => {
    msg += `• ${item.name} × ${item.qty} = $${item.price * item.qty}\n`;
  });
  msg += `\n💰 الإجمالي: $${total}`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ============================================
   عرض المنتجات
   ============================================ */
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  grid.innerHTML = list.map(p => `
    <div class="card">
      ${p.badge ? `<span class="badge ${p.badge}">${p.badge === 'hot' ? 'حار' : p.badge === 'new' ? 'جديد' : 'مميز'}</span>` : ''}
      <a href="product.html?id=${p.id}" class="card-link">
        <div class="img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
      </a>
      <div class="stars">${renderStars(p.rating)} <span class="reviews-count">(${p.reviews})</span></div>
      <div class="price-row">
        <span class="price">$${p.price}</span>
        <button class="add-btn" onclick="addToCart(${p.id})">أضف للسلة</button>
      </div>
    </div>
  `).join('');
}

function renderBestSellers() {
  const el = document.getElementById('bestSellers');
  if (!el) return;
  const best = PRODUCTS.filter(p => p.bestSeller);
  el.innerHTML = best.map(p => `
    <div class="best-card">
      <span class="top-badge">الأكثر مبيعاً</span>
      <a href="product.html?id=${p.id}" class="card-link">
        <div class="img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
        <h3>${p.name}</h3>
      </a>
      <div class="stars">${renderStars(p.rating)} <span class="reviews-count">(${p.reviews})</span></div>
      <p>${p.desc}</p>
      <div class="price-row">
        <span class="price">$${p.price}</span>
        <button class="add-btn" onclick="addToCart(${p.id})">أضف للسلة</button>
      </div>
    </div>
  `).join('');
}

function renderReviews() {
  const el = document.getElementById('reviewsGrid');
  if (!el) return;
  el.innerHTML = REVIEWS.map(r => `
    <div class="review-card">
      <div class="review-header">
        <div class="avatar">${r.initial}</div>
        <div>
          <h4>${r.name}</h4>
          <span class="verified">✓ مشتري موثّق</span>
        </div>
      </div>
      <div class="stars">${renderStars(r.rating)}</div>
      <p>"${r.text}"</p>
    </div>
  `).join('');
}

function renderFAQs() {
  const el = document.getElementById('faqList');
  if (!el) return;
  el.innerHTML = FAQS.map((f, i) => `
    <div class="faq-item" data-index="${i}">
      <button class="faq-question">
        <span>${f.q}</span>
        <span class="arrow">▼</span>
      </button>
      <div class="faq-answer">${f.a}</div>
    </div>
  `).join('');
  el.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question').addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}

function initFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });
}

/* ============================================
   السلة الجانبية
   ============================================ */
function initCartDrawer() {
  const toggle = document.getElementById('cartToggle');
  const drawer = document.getElementById('cartDrawer');
  const closeBtn = document.getElementById('closeCart');
  const backdrop = document.getElementById('cartBackdrop');
  if (!drawer) return;

  function open() {
    drawer.classList.add('open');
    backdrop.classList.add('show');
  }
  function close() {
    drawer.classList.remove('open');
    backdrop.classList.remove('show');
  }

  toggle?.addEventListener('click', e => { e.preventDefault(); open(); });
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
}

/* ============================================
   Supabase Auth
   ============================================ */
async function signInWithFacebook() {
  try {
    const { data, error } = await sb.auth.signInWithOAuth({
      provider: 'facebook',
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
    if (error) throw error;
    return { data };
  } catch (err) {
    console.error('Facebook login error:', err);
    return { error: err };
  }
}

async function signInWithGoogle() {
  try {
    const { data, error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + window.location.pathname }
    });
    if (error) throw error;
    return { data };
  } catch (err) {
    console.error('Google login error:', err);
    return { error: err };
  }
}

async function signOut() {
  try {
    const { error } = await sb.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Sign out error:', err);
    return { error: err };
  }
}

function onAuthChange(callback) {
  sb.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
}

/* ============================================
   تهيئة Auth
   ============================================ */
function initAuth() {
  const loginBtn = document.getElementById('loginBtn');
  const userMenu = document.getElementById('userMenu');
  const userName = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');
  const authModal = document.getElementById('authModal');
  const authBackdrop = document.getElementById('authBackdrop');
  const authClose = document.getElementById('authClose');
  const fbLoginBtn = document.getElementById('fbLoginBtn');
  const ggLoginBtn = document.getElementById('ggLoginBtn');

  function openModal() {
    authModal?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    authModal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  loginBtn?.addEventListener('click', openModal);
  authClose?.addEventListener('click', closeModal);
  authBackdrop?.addEventListener('click', closeModal);

  fbLoginBtn?.addEventListener('click', async () => {
    fbLoginBtn.disabled = true;
    const { error } = await signInWithFacebook();
    if (error) {
      showToast('فشل تسجيل الدخول بفيسبوك', 'error');
      fbLoginBtn.disabled = false;
    }
  });

  ggLoginBtn?.addEventListener('click', async () => {
    ggLoginBtn.disabled = true;
    const { error } = await signInWithGoogle();
    if (error) {
      showToast('فشل تسجيل الدخول بجوجل', 'error');
      ggLoginBtn.disabled = false;
    }
  });

  logoutBtn?.addEventListener('click', async () => {
    await signOut();
    showToast('✓ تم تسجيل الخروج');
  });

  if (sb) {
    onAuthChange((user) => {
      if (user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        const name = user.user_metadata?.full_name
                  || user.user_metadata?.name
                  || user.email?.split('@')[0]
                  || 'مستخدم';
        const avatar = user.user_metadata?.avatar_url;
        if (userName) {
          userName.innerHTML = avatar
            ? `<img src="${avatar}" alt="" class="user-avatar"> ${name}`
            : name;
        }
        closeModal();
      } else {
        if (loginBtn) loginBtn.style.display = 'inline-flex';
        if (userMenu) userMenu.style.display = 'none';
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ============================================
   تتبع الطلب
   ============================================ */
function trackOrder() {
  const input = document.getElementById('trackInput');
  const timeline = document.getElementById('timeline');
  if (!input || !timeline) return;
  if (input.value.trim().length < 3) {
    showToast('أدخل رقم طلب صحيح', 'error');
    return;
  }
  timeline.classList.add('active');
  showToast('✓ جاري عرض حالة الطلب');
}

/* ============================================
   صفحة المنتج
   ============================================ */
function initProductPage() {
  const page = document.getElementById('productPage');
  if (!page) return;

  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));

  if (!productId) {
    page.innerHTML = `
      <div class="account-empty">
        <img src="https://api.iconify.design/mdi:alert-circle-outline.svg?color=%23bdbdbd" alt="" class="empty-icon">
        <h2>المنتج غير موجود</h2>
        <a href="index.html#products" class="btn">العودة للمنتجات</a>
      </div>`;
    return;
  }

  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) {
    page.innerHTML = `
      <div class="account-empty">
        <img src="https://api.iconify.design/mdi:magnify.svg?color=%23bdbdbd" alt="" class="empty-icon">
        <h2>المنتج غير موجود</h2>
        <a href="index.html#products" class="btn">العودة للمنتجات</a>
      </div>`;
    return;
  }

  document.title = product.name + ' — Vinland';

  const related = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const features = (product.features || []).map(f =>
    `<span class="feature-chip">✓ ${f}</span>`
  ).join('');

  const categoryNames = {
    'accounts': 'حسابات',
    'subscriptions': 'اشتراكات',
    'tools': 'أدوات'
  };

  page.innerHTML = `
    <div class="breadcrumb">
      <a href="index.html">الرئيسية</a> /
      <a href="index.html#products">المنتجات</a> /
      <a href="index.html#products">${categoryNames[product.category] || 'منتجات'}</a> /
      <span>${product.name}</span>
    </div>

    <div class="product-main">
      <div class="product-image">
        ${product.badge ? `<span class="badge ${product.badge}" style="position:absolute;top:20px;left:20px;">${product.badge === 'hot' ? 'حار' : product.badge === 'new' ? 'جديد' : 'مميز'}</span>` : ''}
        <img src="${product.img}" alt="${product.name}">
      </div>

      <div class="product-info">
        <h1>${product.name}</h1>
        <div class="rating-row">
          <span>${renderStars(product.rating)}</span>
          <span class="reviews-count">(${product.reviews} تقييم)</span>
        </div>
        <div class="price-tag">$${product.price}</div>
        <p class="desc">${product.longDesc || product.desc}</p>
        ${features ? `<div class="features-list">${features}</div>` : ''}
        <div class="stock-info">
          المتوفر: <strong>باقي ${product.stock} فقط!</strong>
        </div>
        <div class="product-actions">
          <button class="btn" onclick="addToCart(${product.id})">أضف للسلة</button>
          <button class="btn-secondary" onclick="buyNow(${product.id})">اشترِ الآن</button>
        </div>
        <div style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);display:flex;gap:20px;flex-wrap:wrap;font-size:14px;color:var(--gray-600);">
          <span>⚡ تسليم فوري</span>
          <span>🛡️ ضمان كامل</span>
          <span>💬 دعم 24/7</span>
        </div>
      </div>
    </div>

    ${related.length > 0 ? `
      <h2 class="related-title">منتجات مشابهة</h2>
      <div class="products-grid">
        ${related.map(p => `
          <div class="card">
            ${p.badge ? `<span class="badge ${p.badge}">${p.badge === 'hot' ? 'حار' : p.badge === 'new' ? 'جديد' : 'مميز'}</span>` : ''}
            <a href="product.html?id=${p.id}" class="card-link">
              <div class="img"><img src="${p.img}" alt="${p.name}" loading="lazy"></div>
              <h3>${p.name}</h3>
              <p>${p.desc}</p>
            </a>
            <div class="stars">${renderStars(p.rating)} <span class="reviews-count">(${p.reviews})</span></div>
            <div class="price-row">
              <span class="price">$${p.price}</span>
              <button class="add-btn" onclick="addToCart(${p.id})">أضف للسلة</button>
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}
  `;
}

function buyNow(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const msg = `🛒 طلب مباشر من Vinland:\n\n• ${product.name}\n💰 السعر: $${product.price}\n\nأرغب في إتمام الشراء الآن.`;
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ============================================
   صفحة الحساب
   ============================================ */
function initAccountPage() {
  const page = document.getElementById('accountPage');
  if (!page) return;

  setTimeout(async () => {
    if (!sb) {
      showLoginRequired();
      return;
    }
    const { data: { user } } = await sb.auth.getUser();
    if (!user) {
      showLoginRequired();
      return;
    }
    renderAccount(user);
  }, 500);

  function showLoginRequired() {
    page.innerHTML = `
      <div class="account-empty">
        <img src="https://api.iconify.design/mdi:lock-outline.svg?color=%23bdbdbd" alt="" class="empty-icon">
        <h2>يجب تسجيل الدخول</h2>
        <p>سجل دخولك لعرض حسابك وطلباتك</p>
        <button class="btn" onclick="document.getElementById('authModal').classList.add('open');document.body.style.overflow='hidden';">تسجيل الدخول</button>
      </div>
    `;
  }

  function renderAccount(user) {
    const name = user.user_metadata?.full_name
              || user.user_metadata?.name
              || user.email?.split('@')[0]
              || 'مستخدم';
    const email = user.email || '';
    const avatar = user.user_metadata?.avatar_url;
    const initial = name.charAt(0).toUpperCase();

    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

    const demoOrders = [
      { id: 'VL-2025-001', name: 'اشتراك Netflix', price: 8, img: 'https://api.iconify.design/simple-icons:netflix.svg?color=%23e50914', status: 'done', date: '2025-01-15' },
      { id: 'VL-2025-002', name: 'Spotify Premium', price: 6, img: 'https://api.iconify.design/simple-icons:spotify.svg?color=%231db954', status: 'done', date: '2025-01-20' },
      { id: 'VL-2025-003', name: 'Canva Pro', price: 10, img: 'https://api.iconify.design/simple-icons:canva.svg?color=%2300c4cc', status: 'pending', date: '2025-01-25' }
    ];

    page.innerHTML = `
      <div class="account-header">
        <div class="account-avatar">
          ${avatar ? `<img src="${avatar}" alt="${name}">` : initial}
        </div>
        <div class="account-info">
          <h1>${name}</h1>
          <p>${email}</p>
        </div>
        <button class="btn-secondary" id="editProfileBtn" style="padding:10px 22px;font-size:14px;">تعديل</button>
      </div>

      <div class="account-stats">
        <div class="stat-card">
          <div class="stat-value">${demoOrders.length}</div>
          <div class="stat-label">طلباتي</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${cart.length}</div>
          <div class="stat-label">في السلة</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$${demoOrders.reduce((s, o) => s + o.price, 0)}</div>
          <div class="stat-label">إجمالي الصرف</div>
        </div>
      </div>

      <h2 style="font-family:'Amiri',serif;font-size:28px;margin-bottom:20px;">طلباتي</h2>

      <div class="orders-list">
        ${demoOrders.map(o => `
          <div class="order-card">
            <div class="order-img"><img src="${o.img}" alt="${o.name}"></div>
            <div class="order-info">
              <h4>${o.name}</h4>
              <p>#${o.id} — ${o.date}</p>
            </div>
            <div style="font-weight:900;color:var(--grass);font-size:18px;">$${o.price}</div>
            <span class="order-status ${o.status === 'done' ? 'done' : 'pending'}">
              ${o.status === 'done' ? '✓ تم التسليم' : 'قيد المعالجة'}
            </span>
          </div>
        `).join('')}
      </div>
    `;

    document.getElementById('editProfileBtn')?.addEventListener('click', () => {
      showToast('قريباً: تعديل الملف الشخصي');
    });
  }
}

/* ============================================
   صفحة السلة الكاملة
   ============================================ */
function initCartPage() {
  const container = document.getElementById('cartPageContainer');
  if (!container) return;
  renderCartPage();
}

function renderCartPage() {
  const container = document.getElementById('cartPageContainer');
  if (!container) return;
  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-page-empty">
        <img src="https://api.iconify.design/mdi:cart-outline.svg?color=%23bdbdbd" alt="" class="empty-icon">
        <h2>سلتك فارغة</h2>
        <p>ابدأ التسوق وأضف منتجاتك المفضلة</p>
        <a href="index.html#products" class="btn">تصفح المنتجات</a>
      </div>
    `;
    return;
  }

  const subtotal = getCartTotal();
  const total = subtotal;

  container.innerHTML = `
    <div class="cart-page-grid">
      <div class="cart-page-items">
        ${cart.map(item => `
          <div class="cart-page-item">
            <div class="cp-img"><img src="${item.img}" alt="${item.name}"></div>
            <div class="cp-info">
              <h3>${item.name}</h3>
              <p class="cp-price">$${item.price}</p>
            </div>
            <div class="cp-qty">
              <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
              <span>${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
            </div>
            <div class="cp-total">$${item.price * item.qty}</div>
            <button class="cp-remove" onclick="removeFromCart(${item.id});renderCartPage();">✕</button>
          </div>
        `).join('')}
      </div>

      <aside class="cart-page-summary">
        <h3>ملخص الطلب</h3>
        <div class="summary-row"><span>المجموع الفرعي</span><span>$${subtotal}</span></div>
        <div class="summary-row"><span>التوصيل</span><span>مجاني</span></div>
        <div class="summary-row total"><span>الإجمالي</span><span>$${total}</span></div>
        <button class="checkout-btn" onclick="checkout()">إتمام الشراء</button>
        <a href="index.html#products" class="continue-shopping">← متابعة التسوق</a>
      </aside>
    </div>
  `;
}

function changeQty(productId, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    saveCart(cart);
  }
  renderCartPage();
}

/* ============================================
   التشغيل الرئيسي
   ============================================ */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Vinland Store — بدء التحميل...');

  // أول شي: جلب المنتجات من Supabase
  await fetchProducts();

  // بعدها: تهيئة كل شي
  updateCartBadge();
  initAuth();
  initCartDrawer();
  renderCart();

  // الرئيسية
  renderProducts('all');
  renderBestSellers();
  renderReviews();
  renderFAQs();
  initFilters();

  // صفحة المنتج
  initProductPage();

  // صفحة الحساب
  initAccountPage();

  // صفحة السلة
  initCartPage();

  console.log('✅ Vinland Store — جاهز!');
});
