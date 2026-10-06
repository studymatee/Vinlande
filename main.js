/* ===== عرض المنتجات ===== */
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
