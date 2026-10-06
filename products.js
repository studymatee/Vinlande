/* ============================================
   Vinland Store — Product Page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const page = document.getElementById('productPage');
  if (!page) return;

  /* جلب المنتج من الرابط */
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));

  /* لو ما فيه ID */
  if (!productId) {
    page.innerHTML = `
      <div class="account-empty">
        <div class="icon">❓</div>
        <h2>المنتج غير موجود</h2>
        <p>لم نتمكن من العثور على المنتج المطلوب</p>
        <a href="index.html#products" class="btn">العودة للمنتجات</a>
      </div>
    `;
    return;
  }

  /* البحث عن المنتج */
  const product = PRODUCTS.find(p => p.id === productId);

  if (!product) {
    page.innerHTML = `
      <div class="account-empty">
        <div class="icon">🔍</div>
        <h2>المنتج غير موجود</h2>
        <p>ربما تم حذفه أو الرابط غير صحيح</p>
        <a href="index.html#products" class="btn">العودة للمنتجات</a>
      </div>
    `;
    return;
  }

  /* تحديث العنوان */
  document.title = product.name + ' — Vinland';

  /* منتجات مشابهة */
  const related = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  /* الميزات */
  const features = (product.features || []).map(f => 
    `<span class="feature-chip">✓ ${f}</span>`
  ).join('');

  /* علامات التبويب */
  const categoryNames = {
    'accounts': 'حسابات',
    'subscriptions': 'اشتراكات',
    'tools': 'أدوات'
  };
  const categoryName = categoryNames[product.category] || 'منتجات';

  /* بناء الصفحة */
  page.innerHTML = `
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <a href="index.html">الرئيسية</a> /
      <a href="index.html#products">المنتجات</a> /
      <a href="index.html#products">${categoryName}</a> /
      <span>${product.name}</span>
    </div>

    <!-- المنتج الرئيسي -->
    <div class="product-main">

      <!-- الصورة -->
      <div class="product-image">
        ${product.badge ? `<span class="badge ${product.badge}" style="position:absolute;top:20px;left:20px;font-size:12px;padding:6px 14px;border-radius:20px;">${product.badge === 'hot' ? '🔥 حار' : product.badge === 'new' ? '✨ جديد' : '⭐ مميز'}</span>` : ''}
        <img src="${product.img}" alt="${product.name}">
      </div>

      <!-- التفاصيل -->
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
          📦 المتوفر: <strong>باقي ${product.stock} فقط!</strong>
        </div>

        <div class="product-actions">
          <button class="btn" onclick="addToCartAndGo(${product.id})">
            🛒 أضف للسلة
          </button>
          <button class="btn-secondary" onclick="buyNow(${product.id})">
            ⚡ اشترِ الآن
          </button>
        </div>

        <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border); display: flex; gap: 20px; flex-wrap: wrap; font-size: 14px; color: var(--gray-600);">
          <span>⚡ تسليم فوري</span>
          <span>🛡️ ضمان كامل</span>
          <span>💬 دعم 24/7</span>
        </div>
      </div>

    </div>

    <!-- منتجات مشابهة -->
    ${related.length > 0 ? `
      <h2 class="related-title">🔥 منتجات مشابهة</h2>
      <div class="products-grid">
        ${related.map(p => `
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
        `).join('')}
      </div>
    ` : ''}
  `;
});

/* ===== أضف للسلة وارجع ===== */
function addToCartAndGo(productId) {
  addToCart(productId);
}

/* ===== اشترِ الآن → واتساب مباشر ===== */
function buyNow(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const msg = `🛒 طلب مباشر من Vinland:\n\n` +
              `• ${product.name}\n` +
              `💰 السعر: $${product.price}\n\n` +
              `أرغب في إتمام الشراء الآن.`;

  const url = `https://wa.me/0000000000?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}
