/* ============================================
   Vinland Store — admin.js (كامل)
   ============================================ */

const SUPABASE_URL = 'https://ncrycgbrstafdouvipzc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_6t2dkU27Rkinsoo8MhYAEQ_FSgj4G73';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;
let allProducts = [];
let allOrders = [];
let allUsers = [];

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

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('ar-EG', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/* ============================================
   تسجيل الدخول بجوجل
   ============================================ */
async function signInWithGoogle() {
  const { error } = await sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + window.location.pathname }
  });
  if (error) showToast('فشل تسجيل الدخول', 'error');
}

async function signOut() {
  await sb.auth.signOut();
  showToast('✓ تم تسجيل الخروج');
  setTimeout(() => window.location.reload(), 800);
}

/* ============================================
   التحقق من صلاحيات الأدمن
   ============================================ */
async function checkAdmin(user) {
  if (!user) return false;
  try {
    const { data, error } = await sb
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error checking admin:', error);
      return false;
    }
    return data?.role === 'admin';
  } catch (err) {
    console.error('Admin check failed:', err);
    return false;
  }
}

/* ============================================
   تحميل الإحصائيات
   ============================================ */
async function loadStats() {
  try {
    const [productsRes, ordersRes, usersRes] = await Promise.all([
      sb.from('products').select('*', { count: 'exact', head: true }),
      sb.from('orders').select('total, status'),
      sb.from('profiles').select('id', { count: 'exact', head: true })
    ]);

    const totalProducts = productsRes.count || 0;
    const orders = ordersRes.data || [];
    const totalUsers = usersRes.count || 0;

    const totalOrders = orders.length;
    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((s, o) => s + parseFloat(o.total || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;

    document.getElementById('adminStats').innerHTML = `
      <div class="admin-stat-card">
        <img src="https://api.iconify.design/mdi:package-variant.svg?color=%237cb342" alt="">
        <div class="admin-stat-value">${totalProducts}</div>
        <div class="admin-stat-label">المنتجات</div>
      </div>
      <div class="admin-stat-card">
        <img src="https://api.iconify.design/mdi:clipboard-list.svg?color=%232196f3" alt="">
        <div class="admin-stat-value">${totalOrders}</div>
        <div class="admin-stat-label">الطلبات</div>
      </div>
      <div class="admin-stat-card">
        <img src="https://api.iconify.design/mdi:account-group.svg?color=%239c27b0" alt="">
        <div class="admin-stat-value">${totalUsers}</div>
        <div class="admin-stat-label">المستخدمين</div>
      </div>
      <div class="admin-stat-card">
        <img src="https://api.iconify.design/mdi:currency-usd.svg?color=%23ffc107" alt="">
        <div class="admin-stat-value">$${totalRevenue.toFixed(2)}</div>
        <div class="admin-stat-label">إجمالي المبيعات</div>
      </div>
      <div class="admin-stat-card">
        <img src="https://api.iconify.design/mdi:clock-alert.svg?color=%23ff5252" alt="">
        <div class="admin-stat-value">${pendingOrders}</div>
        <div class="admin-stat-label">طلبات معلقة</div>
      </div>
    `;
  } catch (err) {
    console.error('Error loading stats:', err);
  }
}

/* ============================================
   المنتجات
   ============================================ */
async function loadProducts() {
  const container = document.getElementById('productsTable');
  container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--gray-600);">جاري التحميل...</p>';

  const { data, error } = await sb
    .from('products')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--red);">خطأ في التحميل</p>';
    return;
  }

  allProducts = data || [];

  if (allProducts.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--gray-600);">لا توجد منتجات</p>';
    return;
  }

  container.innerHTML = `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>الصورة</th>
            <th>الاسم</th>
            <th>الفئة</th>
            <th>السعر</th>
            <th>المخزون</th>
            <th>الحالة</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${allProducts.map(p => `
            <tr>
              <td>${p.id}</td>
              <td><img src="${p.image_url}" alt="" style="width:40px;height:40px;object-fit:contain;background:var(--grass-pale);padding:4px;border-radius:6px;"></td>
              <td><strong>${p.name}</strong></td>
              <td>${p.category === 'accounts' ? 'حسابات' : p.category === 'subscriptions' ? 'اشتراكات' : 'أدوات'}</td>
              <td style="color:var(--grass);font-weight:700;">$${p.price}</td>
              <td>${p.stock}</td>
              <td>
                <span class="admin-status ${p.active ? 'active' : 'inactive'}">
                  ${p.active ? '✓ مفعل' : '✕ معطل'}
                </span>
              </td>
              <td>
                <div style="display:flex;gap:6px;">
                  <button class="admin-action-btn edit" onclick="editProduct(${p.id})" title="تعديل">
                    <img src="https://api.iconify.design/mdi:pencil.svg?color=%232196f3" alt="">
                  </button>
                  <button class="admin-action-btn toggle" onclick="toggleProduct(${p.id}, ${p.active})" title="${p.active ? 'تعطيل' : 'تفعيل'}">
                    <img src="https://api.iconify.design/mdi:${p.active ? 'eye-off' : 'eye'}.svg?color=%23ffc107" alt="">
                  </button>
                  <button class="admin-action-btn delete" onclick="deleteProduct(${p.id})" title="حذف">
                    <img src="https://api.iconify.design/mdi:delete.svg?color=%23ff5252" alt="">
                  </button>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* فتح Modal إضافة/تعديل */
function openProductModal(product = null) {
  const modal = document.getElementById('productModal');
  const form = document.getElementById('productForm');

  form.reset();

  if (product) {
    document.getElementById('modalTitle').textContent = 'تعديل منتج';
    document.getElementById('saveBtnText').textContent = 'حفظ التعديلات';
    document.getElementById('productId').value = product.id;
    document.getElementById('pName').value = product.name;
    document.getElementById('pDesc').value = product.description || '';
    document.getElementById('pLongDesc').value = product.long_description || '';
    document.getElementById('pPrice').value = product.price;
    document.getElementById('pStock').value = product.stock;
    document.getElementById('pCategory').value = product.category;
    document.getElementById('pImage').value = product.image_url || '';
    document.getElementById('pBadge').value = product.badge || '';
    document.getElementById('pBestSeller').checked = product.best_seller;
  } else {
    document.getElementById('modalTitle').textContent = 'إضافة منتج';
    document.getElementById('saveBtnText').textContent = 'إضافة المنتج';
    document.getElementById('productId').value = '';
    document.getElementById('pImage').value = 'https://api.iconify.design/mdi:package-variant.svg?color=%237cb342';
  }

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
}

function editProduct(id) {
  const product = allProducts.find(p => p.id === id);
  if (product) openProductModal(product);
}

/* حفظ منتج */
async function saveProduct(e) {
  e.preventDefault();

  const id = document.getElementById('productId').value;
  const data = {
    name: document.getElementById('pName').value.trim(),
    description: document.getElementById('pDesc').value.trim(),
    long_description: document.getElementById('pLongDesc').value.trim(),
    price: parseFloat(document.getElementById('pPrice').value),
    stock: parseInt(document.getElementById('pStock').value),
    category: document.getElementById('pCategory').value,
    image_url: document.getElementById('pImage').value.trim(),
    badge: document.getElementById('pBadge').value || null,
    best_seller: document.getElementById('pBestSeller').checked
  };

  try {
    let error;
    if (id) {
      const res = await sb.from('products').update(data).eq('id', id);
      error = res.error;
      if (!error) showToast('✓ تم تحديث المنتج');
    } else {
      data.rating = 5;
      data.reviews_count = 0;
      data.active = true;
      data.features = [];
      const res = await sb.from('products').insert([data]);
      error = res.error;
      if (!error) showToast('✓ تمت إضافة المنتج');
    }

    if (error) throw error;

    closeProductModal();
    await loadProducts();
    await loadStats();
  } catch (err) {
    console.error('Save error:', err);
    showToast('فشل الحفظ', 'error');
  }
}

/* تعطيل/تفعيل */
async function toggleProduct(id, currentState) {
  if (!confirm(currentState ? 'تعطيل هذا المنتج؟' : 'تفعيل هذا المنتج؟')) return;
  const { error } = await sb.from('products').update({ active: !currentState }).eq('id', id);
  if (error) {
    showToast('فشل التعديل', 'error');
    return;
  }
  showToast(currentState ? '✓ تم التعطيل' : '✓ تم التفعيل');
  await loadProducts();
}

/* حذف */
async function deleteProduct(id) {
  if (!confirm('هل أنت متأكد من الحذف؟ لا يمكن التراجع!')) return;
  const { error } = await sb.from('products').delete().eq('id', id);
  if (error) {
    showToast('فشل الحذف', 'error');
    return;
  }
  showToast('✓ تم الحذف');
  await loadProducts();
  await loadStats();
}

/* ============================================
   الطلبات
   ============================================ */
async function loadOrders() {
  const container = document.getElementById('ordersTable');
  container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--gray-600);">جاري التحميل...</p>';

  const { data, error } = await sb
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--red);">خطأ في التحميل</p>';
    return;
  }

  allOrders = data || [];

  if (allOrders.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--gray-600);">لا توجد طلبات</p>';
    return;
  }

  const statuses = {
    'pending': 'معلق',
    'processing': 'قيد المعالجة',
    'shipped': 'قيد التسليم',
    'delivered': 'تم التسليم',
    'cancelled': 'ملغي'
  };

  container.innerHTML = `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>رقم الطلب</th>
            <th>العميل</th>
            <th>الإجمالي</th>
            <th>الحالة</th>
            <th>التاريخ</th>
            <th>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          ${allOrders.map(o => `
            <tr>
              <td><strong>${o.order_number}</strong></td>
              <td>${o.customer_name || 'زائر'}</td>
              <td style="color:var(--grass);font-weight:700;">$${o.total}</td>
              <td>
                <select class="admin-select" onchange="changeOrderStatus(${o.id}, this.value)">
                  ${Object.entries(statuses).map(([key, val]) =>
                    `<option value="${key}" ${o.status === key ? 'selected' : ''}>${val}</option>`
                  ).join('')}
                </select>
              </td>
              <td>${formatDate(o.created_at)}</td>
              <td>
                <button class="admin-action-btn delete" onclick="deleteOrder(${o.id})">
                  <img src="https://api.iconify.design/mdi:delete.svg?color=%23ff5252" alt="">
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

async function changeOrderStatus(id, status) {
  const { error } = await sb.from('orders').update({ status }).eq('id', id);
  if (error) {
    showToast('فشل التحديث', 'error');
    return;
  }
  showToast('✓ تم تحديث الحالة');
  await loadStats();
}

async function deleteOrder(id) {
  if (!confirm('حذف هذا الطلب؟')) return;
  const { error } = await sb.from('orders').delete().eq('id', id);
  if (error) {
    showToast('فشل الحذف', 'error');
    return;
  }
  showToast('✓ تم الحذف');
  await loadOrders();
  await loadStats();
}

/* ============================================
   المستخدمين
   ============================================ */
async function loadUsers() {
  const container = document.getElementById('usersTable');
  container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--gray-600);">جاري التحميل...</p>';

  const { data, error } = await sb
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--red);">خطأ في التحميل</p>';
    return;
  }

  allUsers = data || [];

  if (allUsers.length === 0) {
    container.innerHTML = '<p style="text-align:center;padding:40px;color:var(--gray-600);">لا يوجد مستخدمين</p>';
    return;
  }

  container.innerHTML = `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>الصورة</th>
            <th>الاسم</th>
            <th>الإيميل</th>
            <th>الدور</th>
            <th>التاريخ</th>
          </tr>
        </thead>
        <tbody>
          ${allUsers.map(u => `
            <tr>
              <td>
                ${u.avatar_url
                  ? `<img src="${u.avatar_url}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;">`
                  : `<div style="width:36px;height:36px;border-radius:50%;background:var(--grass-pale);display:flex;align-items:center;justify-content:center;font-weight:700;color:var(--grass-dark);">${(u.full_name || 'U').charAt(0)}</div>`
                }
              </td>
              <td><strong>${u.full_name || '—'}</strong></td>
              <td>${u.email || '—'}</td>
              <td>
                <span class="admin-status ${u.role === 'admin' ? 'active' : 'inactive'}">
                  ${u.role === 'admin' ? 'أدمن' : 'عميل'}
                </span>
              </td>
              <td>${formatDate(u.created_at)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

/* ============================================
   التبويبات
   ============================================ */
function initTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.admin-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('tab-' + target).classList.add('active');

      if (target === 'products') loadProducts();
      if (target === 'orders') loadOrders();
      if (target === 'users') loadUsers();
    });
  });
}

/* ============================================
   التشغيل الرئيسي
   ============================================ */
document.addEventListener('DOMContentLoaded', async () => {
  const loginBtn = document.getElementById('adminLoginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const addBtn = document.getElementById('addProductBtn');
  const form = document.getElementById('productForm');
  const modalClose = document.getElementById('productModalClose');
  const modalBackdrop = document.getElementById('productModalBackdrop');

  loginBtn?.addEventListener('click', signInWithGoogle);
  logoutBtn?.addEventListener('click', signOut);
  addBtn?.addEventListener('click', () => openProductModal());
  form?.addEventListener('submit', saveProduct);
  modalClose?.addEventListener('click', closeProductModal);
  modalBackdrop?.addEventListener('click', closeProductModal);

  const { data: { user } } = await sb.auth.getUser();

  if (!user) {
    document.getElementById('adminLogin').style.display = 'flex';
    return;
  }

  const isAdmin = await checkAdmin(user);

  if (!isAdmin) {
    document.getElementById('adminDenied').style.display = 'flex';
    return;
  }

  currentUser = user;
  document.getElementById('adminLogin').style.display = 'none';
  document.getElementById('adminContent').style.display = 'block';
  document.getElementById('logoutBtn').style.display = 'inline-flex';
  document.getElementById('adminName').textContent =
    user.user_metadata?.full_name || user.email;

  await loadStats();
  await loadProducts();
  initTabs();
});
