/* ===== تتبع الطلب ===== */

function trackOrder() {
  const input = document.getElementById('trackInput');
  const timeline = document.getElementById('timeline');
  const trackInfo = document.getElementById('trackInfo');
  const trackEmpty = document.getElementById('trackEmpty');
  const orderNumber = document.getElementById('orderNumber');

  if (!input || !timeline) return;

  const value = input.value.trim();

  if (value.length < 3) {
    showToast('أدخل رقم طلب صحيح', 'error');
    return;
  }

  // محاكاة البحث — يمكن ربطها بـ API حقيقي لاحقاً
  orderNumber.textContent = value;

  // إظهار النتيجة
  timeline.classList.add('active');
  trackInfo.style.display = 'block';
  trackEmpty.style.display = 'none';

  showToast('✓ تم العثور على الطلب');

  // سكرول للنتيجة
  trackInfo.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* التشغيل */
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();

  // تتبع بالـ Enter
  const input = document.getElementById('trackInput');
  if (input) {
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') trackOrder();
    });
  }
});
