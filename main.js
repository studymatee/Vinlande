/* ===== إشعار ===== */
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ===== نجوم ===== */
function renderStars(rating) { return '★'.repeat(rating) + '☆'.repeat(5 - rating); }

/* ===== عرض المنتجات ===== */
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  const list = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  grid.innerHTML = list.map(p => `
    <div class="card">
      ${p.badge ? `<span class="badge ${p.badge}">${p.badge === 'hot' ? '🔥 حار' : p.badge === 'new' ? '✨ جديد' : '⭐ مميز'}</span>` : ''}
      <div class="img">${p.icon}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="stars">${renderStars(p.rating)}</div>
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
      <div class="img">${p.icon}</div>
      <h3>${p.name}</h3>
      <div class="stars">${renderStars(p.rating)}</div>
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

/* ===== FAQ ===== */
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

/* ===== عرض السلة ===== */
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
      <div class="item-img">${item.icon}</div>
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
  if (cart.length === 0) { showToast('السلة فارغة', 'error'); return; }
  const total = getCartTotal();
  let msg = '🛒 طلب جديد من Vinland:\n\n';
  cart.forEach(item => { msg += `• ${item.name} × ${item.qty} = $${item.price * item.qty}\n`; });
  msg += `\n💰 الإجمالي: $${total}`;
  const url = `https://wa.me/0000000000?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

/* ===== تتبع الطلب ===== */
function trackOrder() {
  const input = document.getElementById('trackInput');
  const timeline = document.getElementById('timeline');
  if (!input || !timeline) return;
  if (input.value.trim().length < 3) { showToast('أدخل رقم طلب صحيح', 'error'); return; }
  timeline.classList.add('active');
  showToast('✓ جاري عرض حالة الطلب');
}

/* ===== السلة الجانبية ===== */
function initCartDrawer() {
  const toggle = document.getElementById('cartToggle');
  const drawer = document.getElementById('cartDrawer');
  const closeBtn = document.getElementById('closeCart');
  const backdrop = document.getElementById('cartBackdrop');
  if (!toggle || !drawer) return;

  function open() { drawer.classList.add('open'); backdrop.classList.add('show'); }
  function close() { drawer.classList.remove('open'); backdrop.classList.remove('show'); }

  toggle.addEventListener('click', e => { e.preventDefault(); open(); });
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
}

/* ===== فلترة ===== */
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

/* ===== التشغيل ===== */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  renderBestSellers();
  renderReviews();
  renderFAQs();
  initFilters();
  initCartDrawer();
  updateCartBadge();
  renderCart();
});
