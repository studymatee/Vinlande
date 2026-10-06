/* ============================================
   Vinland Store — main.js
   ============================================ */

/* ===== إشعار ===== */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ===== نجوم التقييم ===== */
function renderStars(rating) {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
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
      ${p.badge ? `<span class="badge ${p.badge}">${p.badge === 'hot' ? '🔥 حار' : p.badge === 'new' ? '✨ جديد' : '⭐ مميز'}</span>` : ''}
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

/* ===== الأكثر مبيعاً ===== */
function renderBestSellers() {
  const el = document.getElementById('bestSellers');
  if (!el) return;
  const best = PRODUCTS.filter(p => p.bestSeller);
  el.innerHTML = best.map(p => `
    <div class="best-card">
      <span class="top-badge">🔥 الأكثر مبيعاً</span>
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

/* ===== آراء العملاء ===== */
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

/* ===== الأسئلة الشائعة ===== */
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

/* ============================================
   السلة
   ============================================ */
const CART_KEY = 'vinland_cart';

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  renderCart();
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

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = getCartCount());
}

function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  if (!itemsEl) return;
  const cart = getCart();

  if (cart.length === 0) {
    itemsEl.innerHTML = `<div class="empty-cart"><div class="icon">🛒</div><p>سلتك فارغة</p></div>`;
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
      <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
    </div>
  `).join('');

  const total = getCartTotal();
  if (footerEl) footerEl.innerHTML = `
    <div class="summary-row"><span>المجموع الفرعي</span><span>$${total}</span></div>
    <div class="summary-row total"><span>الإجمالي</span><span>$${total}</span></div>
    <button class="checkout-btn" onclick="checkout()">إتمام الشراء ←</button>
  `;
}

/* ===== إتمام الشراء (واتساب) ===== */
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
  const url = `https://wa.me/0000000000?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ===== تتبع الطلب ===== */
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

/* ===== السلة الجانبية ===== */
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

  toggle?.addEventListener('click', e => {
    e.preventDefault();
    open();
  });
  closeBtn?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
}

/* ===== الفلترة ===== */
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
   Supabase Auth
   ============================================ */
const SUPABASE_URL = 'https://ncrycgbrstafdouvipzc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6t2dkU27Rkinsoo8MhYAEQ_FSgj4G73';

let sb = null;
if (window.supabase) {
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* تسجيل الدخول بفيسبوك */
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

/* تسجيل الدخول بجوجل */
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

/* تسجيل الخروج */
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

/* مراقبة حالة الدخول */
function onAuthChange(callback) {
  sb.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
}

/* ============================================
   التشغيل عند تحميل الصفحة
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* عناصر تسجيل الدخول */
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
    fbLoginBtn.innerHTML = '<span>⏳</span> جاري...';
    const { error } = await signInWithFacebook();
    if (error) {
      showToast('فشل تسجيل الدخول بفيسبوك', 'error');
      fbLoginBtn.disabled = false;
      fbLoginBtn.innerHTML = '<span>📘</span> تسجيل الدخول بفيسبوك';
    }
  });

  ggLoginBtn?.addEventListener('click', async () => {
    ggLoginBtn.disabled = true;
    ggLoginBtn.innerHTML = '<span>⏳</span> جاري...';
    const { error } = await signInWithGoogle();
    if (error) {
      showToast('فشل تسجيل الدخول بجوجل', 'error');
      ggLoginBtn.disabled = false;
      ggLoginBtn.innerHTML = '<span>🔍</span> تسجيل الدخول بجوجل';
    }
  });

  logoutBtn?.addEventListener('click', async () => {
    await signOut();
    showToast('✓ تم تسجيل الخروج');
  });

  /* مراقبة حالة الدخول */
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
            : `👤 ${name}`;
        }
        closeModal();
      } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (userMenu) userMenu.style.display = 'none';
      }
    });
  }

  /* ESC لإغلاق Modal */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  /* تشغيل كل شي */
  renderProducts('all');
  renderBestSellers();
  renderReviews();
  renderFAQs();
  initFilters();
  initCartDrawer();
  updateCartBadge();
  renderCart();
});
