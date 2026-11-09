const $ = id => document.getElementById(id);
const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

let shops = read("ovard_shops", [
  {id:1,name:"Нонвойхона",category:"Нони гарм",emoji:"🥖",description:"Нони гарм ва маҳсулоти нонӣ"},
  {id:2,name:"Маркази хӯрокворӣ",category:"Маҳсулоти хӯрокворӣ",emoji:"🛒",description:"Маҳсулоти рӯзмарра"},
  {id:3,name:"Дорухона",category:"Дору ва саломатӣ",emoji:"💊",description:"Маҳсулоти дорухона"},
  {id:4,name:"Масолеҳи сохтмонӣ",category:"Сохтмон",emoji:"🧱",description:"Маводи сохтмонӣ"},
  {id:5,name:"Мағозаи асбобҳо",category:"Асбобҳо",emoji:"🛠️",description:"Асбоб ва таҷҳизот"}
]);
let products = read("ovard_products", []);
let cart = read("ovard_cart", []);
let orders = read("ovard_orders", []);
let profile = read("ovard_profile", {});
let currentShop = null;

function showPage(name) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const page = $(name + "Page");
  if (page) page.classList.add("active");
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === name));
  if (name === "shops") renderShops();
  if (name === "catalog") renderCatalog();
  if (name === "cart") renderCart();
  if (name === "orders") renderOrders();
  if (name === "home") renderHome();
  window.scrollTo(0,0);
}

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}

function productImage(p) {
  return p.image
    ? `<img src="${safe(p.image)}" alt="${safe(p.name)}">`
    : safe(p.emoji || "📦");
}

function productCard(p) {
  const shop = shops.find(s => String(s.id) === String(p.shopId));
  return `<article class="product-card">
    <div class="product-image">${productImage(p)}</div>
    <h3>${safe(p.name)}</h3>
    <div class="shop-name">${safe(shop?.name || "OVARD")}</div>
    <div class="price">${safe(p.price)} сомони <span class="unit">/ ${safe(p.unit || "шт.")}</span></div>
    <button class="add-btn" onclick="addToCart(${Number(p.id)})">В корзину</button>
  </article>`;
}

function renderHome() {
  $("featuredShops").innerHTML = shops.slice(0,8).map(s => `
    <button class="shop-mini" onclick="openShop(${Number(s.id)})">
      <div class="shop-emoji">${safe(s.emoji || "🏪")}</div>
      <strong>${safe(s.name)}</strong><small>${safe(s.category || "Магазин")}</small>
    </button>`).join("") || `<div class="empty">Магазины скоро появятся</div>`;

  const q = ($("searchInput").value || "").toLowerCase();
  $("homeProducts").innerHTML = products.filter(p =>
    (p.name + " " + (p.description || "")).toLowerCase().includes(q)
  ).slice(0,8).map(productCard).join("") ||
  `<div class="empty">Товары скоро появятся. Следите за обновлениями.</div>`;
}

function renderProducts() { renderHome(); }

function renderCatalog() {
  const q = ($("catalogSearch").value || "").toLowerCase();
  $("catalogProducts").innerHTML = products.filter(p =>
    (p.name + " " + (p.description || "")).toLowerCase().includes(q)
  ).map(productCard).join("") || `<div class="empty">Пока нет товаров</div>`;
}

function renderShops() {
  $("allShops").innerHTML = shops.map(s => `
    <div class="shop-row">
      <div class="shop-emoji">${safe(s.emoji || "🏪")}</div>
      <div><strong>${safe(s.name)}</strong><p>${safe(s.category || "")}</p></div>
      <button onclick="openShop(${Number(s.id)})">Открыть →</button>
    </div>`).join("") || `<div class="empty">Магазины пока не добавлены</div>`;
}

function openShop(id) {
  currentShop = shops.find(s => String(s.id) === String(id));
  if (!currentShop) return;
  $("shopDetail").innerHTML = `
    <div class="hero"><div><span class="eyebrow">МАГАЗИН OVARD</span>
    <h1>${safe(currentShop.name)}</h1><p>${safe(currentShop.description || "")}</p></div>
    <div class="hero-icon">${safe(currentShop.emoji || "🏪")}</div></div>
    <h2>Товары магазина</h2>
    <div class="product-grid">${products.filter(p => String(p.shopId) === String(id)).map(productCard).join("") || `<div class="empty">Товары скоро появятся</div>`}</div>`;
  showPage("shopDetail");
}

function addToCart(id) {
  const p = products.find(x => Number(x.id) === Number(id));
  if (!p) return;
  const item = cart.find(x => Number(x.id) === Number(id));
  if (item) item.qty++;
  else cart.push({id:p.id,qty:1});
  save("ovard_cart",cart);
  updateCartCount();
  toast("Товар добавлен в корзину");
}

function updateCartCount() {
  $("cartCount").textContent = cart.reduce((sum,x) => sum + x.qty,0);
}

function cartTotal() {
  return cart.reduce((sum,item) => {
    const p = products.find(x => Number(x.id) === Number(item.id));
    return sum + (p ? Number(p.price) * item.qty : 0);
  },0);
}

function changeQty(id, delta) {
  const item = cart.find(x => Number(x.id) === Number(id));
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => Number(x.id) !== Number(id));
  save("ovard_cart",cart);
  renderCart();
  updateCartCount();
}

function renderCart() {
  const total = cartTotal();
  $("cartItems").innerHTML = cart.map(item => {
    const p = products.find(x => Number(x.id) === Number(item.id));
    if (!p) return "";
    return `<div class="cart-line">
      <div class="product-image" style="width:55px;height:55px;font-size:25px">${productImage(p)}</div>
      <div class="grow"><strong>${safe(p.name)}</strong><p class="price">${safe(p.price)} сомони / ${safe(p.unit || "шт.")}</p></div>
      <div class="qty-controls"><button onclick="changeQty(${Number(p.id)},-1)">−</button>${item.qty}<button onclick="changeQty(${Number(p.id)},1)">+</button></div>
    </div>`;
  }).join("") || `<div class="empty">🛒<h3>Корзина пока пуста</h3>Выберите товары в каталоге</div>`;

  $("checkoutArea").innerHTML = cart.length ? `
    <div class="checkout-box">
      <h3>Оформление заказа</h3>
      <div class="total-line"><span>Товары</span><strong>${total.toFixed(2)} сомони</strong></div>
      <p class="settings-note">Минимальная сумма заказа — 50 сомони без учёта доставки.</p>
      <input id="orderName" placeholder="Ваше имя" value="${safe(profile.name || "")}">
      <input id="orderPhone" placeholder="Номер телефона" value="${safe(profile.phone || "")}">
      <input id="orderAddress" placeholder="Адрес доставки" value="${safe(profile.address || "")}">
      <input id="orderWeight" type="number" min="0" step="0.1" placeholder="Примерный вес заказа (кг), если знаете">
      <select id="deliveryDistance">
        <option value="unknown">Расстояние — уточнить</option>
        <option value="near">Близко</option>
        <option value="medium">Среднее расстояние</option>
        <option value="far">Далеко</option>
      </select>
      <div class="total-line"><span>Доставка</span><strong>Уточняется</strong></div>
      <button class="primary-btn" onclick="placeOrder()">Отправить заказ</button>
      <button class="wide-link" onclick="whatsappOrder()">Заказать в WhatsApp</button>
    </div>` : "";
}

function placeOrder() {
  const total = cartTotal();
  if (total < 50) return toast("Минимальная сумма товаров — 50 сомони");
  const name = $("orderName").value.trim();
  const phone = $("orderPhone").value.trim();
  const address = $("orderAddress").value.trim();
  if (!name || !phone || !address) return toast("Заполните имя, телефон и адрес");

  const order = {
    id:Date.now(), date:new Date().toLocaleString(),
    name,phone,address,total,
    weight:$("orderWeight").value,
    distance:$("deliveryDistance").value,
    items:cart.map(item => {
      const p = products.find(x => Number(x.id) === Number(item.id));
      return {name:p?.name || "Товар",price:p?.price || 0,unit:p?.unit || "",qty:item.qty};
    }),
    status:"Получен. Доставка уточняется."
  };
  orders.unshift(order);
  save("ovard_orders",orders);
  profile = {name,phone,address};
  save("ovard_profile",profile);
  cart = [];
  save("ovard_cart",cart);
  updateCartCount();
  renderCart();
  toast("Заказ сохранён на этом устройстве");
  showPage("orders");
}

function whatsappOrder() {
  const total = cartTotal();
  if (total < 50) return toast("Минимальная сумма товаров — 50 сомони");
  const name = $("orderName")?.value.trim() || profile.name || "";
  const phone = $("orderPhone")?.value.trim() || profile.phone || "";
  const address = $("orderAddress")?.value.trim() || profile.address || "";
  if (!name || !phone || !address) return toast("Сначала заполните данные заказа");
  const lines = cart.map(item => {
    const p = products.find(x => Number(x.id) === Number(item.id));
    return p ? `${p.name} — ${item.qty} × ${p.price} сомони / ${p.unit || "шт."}` : "";
  }).filter(Boolean).join("\n");
  const message = `Здравствуйте, OVARD!\nХочу оформить заказ:\n${lines}\nИтого товары: ${total} сомони\nИмя: ${name}\nТелефон: ${phone}\nАдрес: ${address}\nДоставку прошу рассчитать отдельно.`;
  window.open("https://wa.me/992000001606?text=" + encodeURIComponent(message),"_blank");
}

function renderOrders() {
  $("ordersList").innerHTML = orders.map(o => `
    <div class="order-card"><strong>Заказ №${o.id}</strong>
    <p>${safe(o.date)}</p><p>${safe(o.name)} · ${safe(o.phone)}</p>
    <p>${safe(o.address)}</p><strong>${Number(o.total).toFixed(2)} сомони</strong>
    <p>${safe(o.status)}</p>
    <ul>${o.items.map(i => `<li>${safe(i.name)} — ${i.qty} × ${safe(i.price)} сомони ${safe(i.unit)}</li>`).join("")}</ul></div>
  `).join("") || `<div class="empty">У вас пока нет заказов</div>`;
}

function saveProfile() {
  profile = {
    name:$("customerName").value.trim(),
    phone:$("customerPhone").value.trim(),
    address:$("customerAddress").value.trim()
  };
  save("ovard_profile",profile);
  toast("Данные сохранены");
}

function openSettings() {
  $("settingsOverlay").classList.add("open");
  $("languageSelect").value = localStorage.getItem("ovard_lang") || "ru";
  $("themeSelect").value = localStorage.getItem("ovard_theme") || "light";
}

function closeSettings(event) {
  if (event && event.target !== $("settingsOverlay")) return;
  $("settingsOverlay").classList.remove("open");
}

function changeTheme(value) {
  localStorage.setItem("ovard_theme",value);
  document.body.classList.toggle("dark",value === "dark");
}

function changeLanguage(value) {
  localStorage.setItem("ovard_lang",value);
  toast(value === "tg" ? "Забон интихоб шуд: Тоҷикӣ" : value === "en" ? "Language selected: English" : "Выбран русский язык");
  toast("Полный перевод интерфейса подключим следующим этапом");
}

function changeCity(value) {
  $("locationText").textContent = value;
  localStorage.setItem("ovard_city",value);
}

function contactOvard() {
  window.open("https://wa.me/992000001606","_blank");
}

function toast(message) {
  const t = $("toast");
  t.textContent = message;
  t.style.display = "block";
  clearTimeout(window.ovardToastTimer);
  window.ovardToastTimer = setTimeout(() => t.style.display = "none",2600);
}

function init() {
  changeTheme(localStorage.getItem("ovard_theme") || "light");
  $("locationText").textContent = localStorage.getItem("ovard_city") || "Пархар";
  $("languageSelect").value = localStorage.getItem("ovard_lang") || "ru";
  $("themeSelect").value = localStorage.getItem("ovard_theme") || "light";
  if (profile.name) $("customerName").value = profile.name;
  if (profile.phone) $("customerPhone").value = profile.phone;
  if (profile.address) $("customerAddress").value = profile.address;
  renderHome();
  renderShops();
  updateCartCount();
}
init();
