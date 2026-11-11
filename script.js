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
  const featured = $("featuredShops");
  if (featured) {
    featured.innerHTML = shops.slice(0,8).map(s => `
      <button class="shop-mini" onclick="openShop(${Number(s.id)})">
        <div class="shop-emoji">${safe(s.emoji || "🏪")}</div>
        <strong>${safe(s.name)}</strong><small>${safe(s.category || "Магазин")}</small>
      </button>`).join("") || `<div class="empty">Магазины скоро появятся</div>`;
  }

  const q = (($("searchInput") && $("searchInput").value) || "").toLowerCase();
  const homeProds = $("homeProducts");
  if (homeProds) {
    homeProds.innerHTML = products.filter(p =>
      (p.name + " " + (p.description || "")).toLowerCase().includes(q)
    ).slice(0,8).map(productCard).join("") ||
    `<div class="empty">Товары скоро появятся. Следите за обновлениями.</div>`;
  }
}

function renderProducts() { renderHome(); }

function renderCatalog() {
  const q = (($("catalogSearch") && $("catalogSearch").value) || "").toLowerCase();
  const catProds = $("catalogProducts");
  if (catProds) {
    catProds.innerHTML = products.filter(p =>
      (p.name + " " + (p.description || "")).toLowerCase().includes(q)
    ).map(productCard).join("") || `<div class="empty">Пока нет товаров</div>`;
  }
}

function renderShops() {
  const allShopsEl = $("allShops");
  if (allShopsEl) {
    allShopsEl.innerHTML = shops.map(s => `
      <div class="shop-row">
        <div class="shop-emoji">${safe(s.emoji || "🏪")}</div>
        <div><strong>${safe(s.name)}</strong><p>${safe(s.category || "")}</p></div>
        <button onclick="openShop(${Number(s.id)})">Открыть →</button>
      </div>`).join("") || `<div class="empty">Магазины пока не добавлены</div>`;
  }
}

function openShop(id) {
  currentShop = shops.find(s => String(s.id) === String(id));
  if (!currentShop) return;
  const detail = $("shopDetail");
  if (detail) {
    detail.innerHTML = `
      <div class="hero"><div><span class="eyebrow">МАГАЗИН OVARD</span>
      <h1>${safe(currentShop.name)}</h1><p>${safe(currentShop.description || "")}</p></div>
      <div class="hero-icon">${safe(currentShop.emoji || "🏪")}</div></div>
      <h2 style="margin:20px 0 10px;">Товары магазина</h2>
      <div class="product-grid">${products.filter(p => String(p.shopId) === String(id)).map(productCard).join("") || `<div class="empty">Товары скоро появятся</div>`}</div>`;
  }
  showPage("shopDetail");
}

/* Илова кардани мағоза ё мол ба таври дастӣ (Вручную) */
function addNewShopManually() {
  const nameInput = $("customShopName");
  const descInput = $("customShopDesc");
  const unitSelect = $("customUnit");

  const name = nameInput ? nameInput.value.trim() : "";
  const desc = descInput ? descInput.value.trim() : "";
  const unit = unitSelect ? unitSelect.value : "кг";

  if (!name) {
    return toast("Лутфан номи мағоза ё молро ворид кунед!");
  }

  const newId = Date.now();
  const newShop = {
    id: newId,
    name: name,
    category: desc ? `${desc} (${unit})` : `Ченак: ${unit}`,
    emoji: "🏪",
    description: desc
  };

  shops.unshift(newShop);
  save("ovard_shops", shops);

  // Агар рақам ворид шуда бошад, онро ҳамчун моли алоҳида низ сабт мекунем
  if (desc && !isNaN(parseFloat(desc))) {
    const newProduct = {
      id: newId,
      shopId: newId,
      name: name,
      price: parseFloat(desc),
      unit: unit,
      emoji: "📦"
    };
    products.unshift(newProduct);
    save("ovard_products", products);
  }

  renderShops();
  renderHome();

  if (nameInput) nameInput.value = "";
  if (descInput) descInput.value = "";

  toast("Илова шуд!");
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
  const el = $("cartCount");
  if (el) el.textContent = cart.reduce((sum,x) => sum + x.qty,0);
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
  const itemsEl = $("cartItems");
  if (itemsEl) {
    itemsEl.innerHTML = cart.map(item => {
      const p = products.find(x => Number(x.id) === Number(item.id));
      if (!p) return "";
      return `<div class="cart-line">
        <div class="product-image" style="width:55px;height:55px;font-size:25px">${productImage(p)}</div>
        <div class="grow"><strong>${safe(p.name)}</strong><p class="price">${safe(p.price)} сомони / ${safe(p.unit || "шт.")}</p></div>
        <div class="qty-controls"><button onclick="changeQty(${Number(p.id)},-1)">−</button>${item.qty}<button onclick="changeQty(${Number(p.id)},1)">+</button></div>
      </div>`;
    }).join("") || `<div class="empty">🛒<h3>Корзина пока пуста</h3>Выберите товары в каталоге</div>`;
  }

  const checkEl = $("checkoutArea");
  if (checkEl) {
    checkEl.innerHTML = cart.length ? `
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
