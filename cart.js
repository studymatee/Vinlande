/* ===== إدارة السلة ===== */
const CART_KEY = 'vinland_cart';

function getCart() { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartBadge(); renderCart(); }

function addToCart(productId) {
  const cart = getCart();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) { existing.qty += 1; }
  else { cart.push({ id: product.id, name: product.name, price: product.price, icon: product.icon, qty: 1 }); }
  saveCart(cart);
  showToast('✓ تمت إضافة ' + product.name);
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
}

function getCartTotal() { return getCart().reduce((sum, item) => sum + item.price * item.qty, 0); }
function getCartCount() { return getCart().reduce((sum, item) => sum + item.qty, 0); }

function updateCartBadge() {
  document.querySelectorAll('.cart-badge').forEach(b => b.textContent = getCartCount());
}
