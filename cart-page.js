/* ===== صفحة السلة الكاملة ===== */

function renderCartPage() {
  const container = document.getElementById('cartPageContainer');
  if (!container) return;

  const cart = getCart();

  // سلة فارغة
  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-page-empty">
        <div class="empty-icon">🛒</div>
        <h2>سلتك فارغة</h2>
        <p>ابدأ التسوق وأضف منتجاتك المفضلة</p>
        <a href="index.html#products" class="btn">تصفح المنتجات</a>
      </div>
    `;
    return;
  }

  // السلة فيها منتجات
  const subtotal = getCartTotal();
  const shipping = 0;
  const discount = 0;
  const total = subtotal + shipping - discount;

  container.innerHTML = `
    <div class="cart-page-grid">

      <!-- قائمة المنتجات -->
      <div class="cart-page-items">
        ${cart.map(item => `
          <div class="cart-page-item">
            <div class="cp-img">${item.icon}</div>
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
            <button class="cp-remove" onclick="removeFromCart(${item.id})" title="حذف">✕</button>
          </div>
        `).join('')}
      </div>

      <!-- ملخص الطلب -->
      <aside class="cart-page-summary">
        <h3>ملخص الطلب</h3>

        <div class="summary-row">
          <span>المجموع الفرعي</span>
          <span>$${subtotal}</span>
        </div>
        <div class="summary-row">
          <span>التوصيل</span>
          <span>${shipping === 0 ? 'مجاني' : '$' + shipping}</span>
        </div>
        <div class="summary-row">
          <span>الخصم</span>
          <span>-$0</span>
        </div>

        <div class="coupon-box">
          <input type="text" id="couponInput" placeholder="كود الخصم" />
          <button onclick="applyCoupon()">تطبيق</button>
        </div>

        <div class="summary-row total">
          <span>الإجمالي</span>
          <span>$${total}</span>
        </div>

        <button class="checkout-btn" onclick="checkout()">
          إتمام الشراء ←
        </button>

        <a href="index.html#products" class="continue-shopping">
          ← متابعة التسوق
        </a>
      </aside>

    </div>
  `;
}

/* تعديل الكمية */
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

/* كود خصم */
function applyCoupon() {
  const input = document.getElementById('couponInput');
  if (!input) return;
  const code = input.value.trim().toUpperCase();

  if (code === 'VINLAND10') {
    showToast('✓ تم تطبيق خصم 10%');
    // يمكن إضافة منطق الخصم هنا
  } else if (code === '') {
    showToast('أدخل كود الخصم', 'error');
  } else {
    showToast('كود غير صالح', 'error');
  }
}

/* التشغيل */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  renderCartPage();
});
