/* ============================================
   Vinland Store — Account Page
   ============================================ */

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.getElementById('accountPage');
  if (!page) return;

  /* انتظار تحميل Supabase */
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

  /* لو المستخدم غير مسجل */
  function showLoginRequired() {
    page.innerHTML = `
      <div class="account-empty">
        <div class="icon">🔒</div>
        <h2>يجب تسجيل الدخول</h2>
        <p>سجل دخولك لعرض حسابك وطلباتك</p>
        <button class="btn" onclick="document.getElementById('authModal').classList.add('open');document.body.style.overflow='hidden';">👤 تسجيل الدخول</button>
      </div>
    `;
  }

  /* عرض الحساب */
  function renderAccount(user) {
    const name = user.user_metadata?.full_name
              || user.user_metadata?.name
              || user.email?.split('@')[0]
              || 'مستخدم';
    const email = user.email || '';
    const avatar = user.user_metadata?.avatar_url;
    const initial = name.charAt(0).toUpperCase();

    /* إحصائيات (تجريبية - من localStorage) */
    const cart = JSON.parse(localStorage.getItem('vinland_cart') || '[]');
    const orderCount = parseInt(localStorage.getItem('vinland_orders_count') || '0');
    const totalSpent = parseFloat(localStorage.getItem('vinland_total_spent') || '0');

    /* طلبات تجريبية */
    const demoOrders = [
      { id: 'VL-2025-001', name: 'اشتراك Netflix', price: 8, img: 'https://img.icons8.com/color/96/netflix.png', status: 'done', date: '2025-01-15' },
      { id: 'VL-2025-002', name: 'Spotify Premium', price: 6, img: 'https://img.icons8.com/color/96/spotify.png', status: 'done', date: '2025-01-20' },
      { id: 'VL-2025-003', name: 'Canva Pro', price: 10, img: 'https://img.icons8.com/color/96/canva.png', status: 'pending', date: '2025-01-25' }
    ];

    page.innerHTML = `
      <!-- هيدر الحساب -->
      <div class="account-header">
        <div class="account-avatar">
          ${avatar ? `<img src="${avatar}" alt="${name}">` : initial}
        </div>
        <div class="account-info">
          <h1>${name}</h1>
          <p>${email}</p>
        </div>
        <button class="btn-secondary" id="editProfileBtn" style="padding: 10px 22px; font-size: 14px;">
          ✏️ تعديل
        </button>
      </div>

      <!-- إحصائيات -->
      <div class="account-stats">
        <div class="stat-card">
          <div class="stat-value">${demoOrders.length}</div>
          <div class="stat-label">📦 طلباتي</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${cart.length}</div>
          <div class="stat-label">🛒 في السلة</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$${demoOrders.reduce((s, o) => s + o.price, 0)}</div>
          <div class="stat-label">💰 إجمالي الصرف</div>
        </div>
      </div>

      <!-- طلباتي -->
      <h2 style="font-family: 'Amiri', serif; font-size: 28px; margin-bottom: 20px;">📦 طلباتي</h2>

      ${demoOrders.length === 0 ? `
        <div class="account-empty" style="padding: 40px 20px;">
          <div class="icon">📭</div>
          <p>لا توجد طلبات بعد</p>
          <a href="index.html#products" class="btn" style="margin-top: 16px;">ابدأ التسوق</a>
        </div>
      ` : `
        <div class="orders-list">
          ${demoOrders.map(o => `
            <div class="order-card">
              <div class="order-img">
                <img src="${o.img}" alt="${o.name}">
              </div>
              <div class="order-info">
                <h4>${o.name}</h4>
                <p>#${o.id} — ${o.date}</p>
              </div>
              <div style="font-weight: 900; color: var(--grass); font-size: 18px;">$${o.price}</div>
              <span class="order-status ${o.status === 'done' ? 'done' : 'pending'}">
                ${o.status === 'done' ? '✓ تم التسليم' : '⏳ قيد المعالجة'}
              </span>
            </div>
          `).join('')}
        </div>
      `}
    `;

    /* زر تعديل الملف */
    document.getElementById('editProfileBtn')?.addEventListener('click', () => {
      showToast('✏️ قريباً: تعديل الملف الشخصي');
    });
  }
});
