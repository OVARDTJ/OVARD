
const KEY = "ovard_v2";

const defaults = {
  city: "Фархор",
  shops: [],
  ownProducts: [],
  cart: [],
  orders: [],
  settings: { lang: "ru", theme: "light", phone: "" }
};

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved ? { ...defaults, ...saved,
      settings: { ...defaults.settings, ...(saved.settings || {}) }
    } : structuredClone(defaults);
  } catch {
    return structuredClone(defaults);
  }
}

let data = loadData();

function saveData() {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
}

function money(value) {
  return Number(value || 0).toLocaleString("ru-RU") + " сомони";
}

function toast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.style.display = "block";
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => el.style.display = "none", 2600);
}

function showPage(name) {
  document.querySelectorAll(".page").forEach(el => el.classList.add("hidden"));
  const page = document.getElementById(name + "Page");
  if (page) page.classList.remove("hidden");

  document.querySelectorAll(".bottom-nav button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === name);
  });

  document.getElementById("drawer")?.classList.add("hidden");

  if (name === "home") renderHome();
  if (name === "shops") renderShops();
  if (name === "cart") renderCart();
  if (name === "orders") renderOrders();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleMenu() {
  document.getElementById("drawer").classList.toggle("hidden");
}

function chooseLocation() {
  openModal(`
    <h2>Ваш город</h2>
    <label>Город или населённый пункт</label>
    <input id="newCity" value="${safe(data.city)}">
    <button class="primary-btn" onclick="saveCity()">Сохранить</button>
  `);
}

function saveCity() {
  const value = document.getElementById("newCity").value.trim();
  if (!value) return toast("Укажите населённый пункт");
  data.city = value;
  saveData();
  document.getElementById("cityName").textContent = value;
  closeModal();
}

function renderHome() {
  const query = (document.getElementById("searchInput")?.value || "").toLowerCase();
  document.getElementById("cityName").textContent = data.city;

  const activeShops = data.shops.filter(s => s.active !== false);
  const ticker = document.getElementById("partnerTicker");
  if (ticker) {
    const names = activeShops.length
      ? activeShops.map(s => `<span class="ticker-chip">${safe(s.name)}</span>`).join("")
      : `<span class="ticker-chip">Магазины-партнёры скоро появятся</span>`;
    ticker.innerHTML = names + names;
  }

  const products = data.ownProducts.filter(p =>
    p.active !== false &&
    (!query || (p.name + " " + (p.description || "")).toLowerCase().includes(query))
  );

  const container = document.getElementById("ownProducts");
  if (!container) return;

  container.innerHTML = products.length ? products.map(p => `
    <article class="product-card">
      <div class="product-image">${p.photo
        ? `<img src="${safe(p.photo)}" alt="${safe(p.name)}">`
        : "▧"}</div>
      <h3>${safe(p.name)}</h3>
      <p>${safe(p.description || p.unit || "")}</p>
      <div class="price">${money(p.price)}${p.unit ? " / " + safe(p.unit) : ""}</div>
      <button class="small-btn" onclick="addToCart('own',${Number(p.id)})">В корзину</button>
    </article>
  `).join("") : `<div class="empty-state">Пока нет товаров OVARD.</div>`;
}

function renderShops() {
  const box = document.getElementById("allShops");
  const shops = data.shops.filter(s => s.active !== false);
  box.innerHTML = shops.length ? shops.map(s => `
    <article class="shop-card">
      <div class="shop-thumb">${s.photo
        ? `<img src="${safe(s.photo)}" alt="${safe(s.name)}">`
        : "▦"}</div>
      <div class="shop-info">
        <h3>${safe(s.name)}</h3>
        <p>${safe(s.description || "Магазин-партнёр OVARD")}</p>
      </div>
      <button class="small-btn" onclick="openShop(${Number(s.id)})">Открыть</button>
    </article>
  `).join("") : `<div class="empty-state">Список магазинов пока пуст.</div>`;
}

function openShop(id) {
  const shop = data.shops.find(s => Number(s.id) === Number(id));
  if (!shop) return;
  const products = (shop.products || []).filter(p => p.active !== false);
  document.getElementById("shopDetails").innerHTML = `
    <div class="page-heading">
      <span class="eyebrow">МАГАЗИН-ПАРТНЁР</span>
      <h1>${safe(shop.name)}</h1>
      <p>${safe(shop.description || "")}</p>
    </div>
    <div class="product-grid">
      ${products.length ? products.map(p => `
        <article class="product-card">
          <div class="product-image">${p.photo
            ? `<img src="${safe(p.photo)}" alt="${safe(p.name)}">` : "▧"}</div>
          <h3>${safe(p.name)}</h3>
          <p>${safe(p.description || "")}</p>
          <div class="price">${money(p.price)}${p.unit ? " / " + safe(p.unit) : ""}</div>
          <button class="small-btn" onclick="addToCart('shop',${Number(shop.id)},${Number(p.id)})">В корзину</button>
        </article>
      `).join("") : `<div class="empty-state">В этом магазине пока нет товаров.</div>`}
    </div>
  `;
  showPage("shopDetails");
}

function addToCart(type, id, productId) {
  let product, sourceName = "OVARD";

  if (type === "own") {
    product = data.ownProducts.find(p => Number(p.id) === Number(id));
  } else {
    const shop = data.shops.find(s => Number(s.id) === Number(id));
    product = shop?.products?.find(p => Number(p.id) === Number(productId));
    sourceName = shop?.name || "Магазин";
  }

  if (!product) return toast("Товар не найден");

  const key = type + "-" + id + (productId ? "-" + productId : "");
  const existing = data.cart.find(item => item.key === key);

  if (existing) existing.qty++;
  else data.cart.push({
    key, type, shopId: type === "shop" ? Number(id) : null,
    productId: type === "shop" ? Number(productId) : Number(id),
    name: product.name, price: Number(product.price || 0),
    unit: product.unit || "", sourceName, qty: 1
  });

  saveData();
  updateCartCount();
  toast("Добавлено в корзину");
}

function updateCartCount() {
  const count = data.cart.reduce((sum, item) => sum + item.qty, 0);
  const el = document.getElementById("cartCount");
  if (el) el.textContent = count;
}

function renderCart() {
  const box = document.getElementById("cartContent");
  if (!data.cart.length) {
    box.innerHTML = `<div class="empty-state">Корзина пока пуста.<br><br><button class="primary-btn" onclick="showPage('shops')">Выбрать товары</button></div>`;
    return;
  }

  const total = data.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  box.innerHTML = `
    ${data.cart.map(item => `
      <div class="cart-row">
        <div><strong>${safe(item.name)}</strong><div class="muted">${safe(item.sourceName)} · ${money(item.price)}</div></div>
        <div class="qty-controls">
          <button onclick="changeQty('${safe(item.key)}',-1)">−</button>
          <strong>${item.qty}</strong>
          <button onclick="changeQty('${safe(item.key)}',1)">+</button>
        </div>
      </div>
    `).join("")}
    <div class="total-line"><span>Итого за товары</span><span>${money(total)}</span></div>
    <p class="muted">Стоимость доставки рассчитывается отдельно с учётом расстояния, веса и сложности заказа. Оператор подтвердит её до отправки.</p>
    <button class="primary-btn" style="width:100%" onclick="checkout()">Оформить заказ</button>
  `;
}

function changeQty(key, amount) {
  const item = data.cart.find(i => i.key === key);
  if (!item) return;
  item.qty += amount;
  if (item.qty <= 0) data.cart = data.cart.filter(i => i.key !== key);
  saveData();
  updateCartCount();
  renderCart();
}

function checkout() {
  if (!data.cart.length) return;
  openModal(`
    <h2>Оформление заказа</h2>
    <label>Ваше имя</label><input id="orderName" placeholder="Имя">
    <label>Телефон</label><input id="orderPhone" type="tel" placeholder="+992 ...">
    <label>Адрес доставки</label><input id="orderAddress" placeholder="Улица, ориентир">
    <label>Комментарий</label><textarea id="orderComment" rows="3" placeholder="Дополнительная информация"></textarea>
    <button class="primary-btn" style="width:100%" onclick="submitOrder()">Отправить заказ</button>
    <p class="muted">Доставка платная. Её стоимость согласуется отдельно до отправки.</p>
  `);
}

function submitOrder() {
  const name = document.getElementById("orderName").value.trim();
  const phone = document.getElementById("orderPhone").value.trim();
  const address = document.getElementById("orderAddress").value.trim();

  if (!name || !phone || !address) return toast("Заполните имя, телефон и адрес");

  const order = {
    id: Date.now(),
    date: new Date().toLocaleString("ru-RU"),
    name, phone, address,
    comment: document.getElementById("orderComment").value.trim(),
    items: data.cart,
    total: data.cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    status: "Новый"
  };

  data.orders.unshift(order);
  data.cart = [];
  saveData();
  updateCartCount();
  closeModal();
  toast("Заказ сохранён. Ожидайте подтверждения.");
  showPage("orders");
}

function renderOrders() {
  const box = document.getElementById("ordersContent");
  box.innerHTML = data.orders.length ? data.orders.map(o => `
    <article class="order-card" style="margin-bottom:12px">
      <strong>Заказ №${o.id}</strong>
      <p class="muted">${safe(o.date)}</p>
      <p>${(o.items || []).map(i => safe(i.name) + " × " + i.qty).join("<br>")}</p>
      <div class="price">${money(o.total)}</div>
      <span class="ticker-chip">${safe(o.status || "Новый")}</span>
    </article>
  `).join("") : `<div class="empty-state">У вас пока нет заказов.</div>`;
}

function openModal(html) {
  document.getElementById("modalContent").innerHTML = html;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function changeTheme(value) {
  data.settings.theme = value;
  document.body.classList.toggle("dark", value === "dark");
  saveData();
}

function changeLanguage(value) {
  data.settings.lang = value;
  saveData();
  toast("Выбран язык. Полный перевод интерфейса будет добавлен отдельно.");
}

function init() {
  document.getElementById("cityName").textContent = data.city;
  document.getElementById("language").value = data.settings.lang || "ru";
  document.getElementById("themeSelect").value = data.settings.theme || "light";
  document.body.classList.toggle("dark", data.settings.theme === "dark");
  renderHome();
  updateCartCount();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    });
  }
}

init();
