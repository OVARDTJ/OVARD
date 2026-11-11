const KEY = "ovard_v2";

const defaultData = {
  city: "Фархор",
  shops: [
    { id: 1, name: "Нонвойхона", description: "Нони гарм ва маҳсулоти нонӣ", active: true, products: [] },
    { id: 2, name: "Магазин продуктов", description: "Маҳсулоти хӯрокворӣ", active: true, products: [] },
    { id: 3, name: "Мясо и птица", description: "Гӯшт, мурғ ва тухм", active: true, products: [] },
    { id: 4, name: "Аптека", description: "Доруворӣ ва маҳсулоти тиббӣ", active: true, products: [] },
    { id: 5, name: "Стройматериалы", description: "Маводи сохтмонӣ", active: true, products: [] }
  ],
  ownProducts: [],
  cart: [],
  orders: [],
  settings: {
    language: "ru",
    theme: "light",
    whatsapp: true,
    website: true,
    phone: ""
  },
  payments: {
    cash: true,
    alif: false
  }
};

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (!saved || typeof saved !== "object") return structuredClone(defaultData);

    const data = { ...structuredClone(defaultData), ...saved };
    data.shops = Array.isArray(data.shops) ? data.shops : [];
    data.ownProducts = Array.isArray(data.ownProducts) ? data.ownProducts : [];
    data.cart = Array.isArray(data.cart) ? data.cart : [];
    data.orders = Array.isArray(data.orders) ? data.orders : [];
    data.settings = { ...defaultData.settings, ...(data.settings || {}) };
    data.payments = { ...defaultData.payments, ...(data.payments || {}) };

    data.shops.forEach(shop => {
      if (!Array.isArray(shop.products)) shop.products = [];
      if (shop.active === undefined) shop.active = true;
    });

    return data;
  } catch (error) {
    return structuredClone(defaultData);
  }
}

let data = loadData();
let currentShopId = null;
let toastTimer = null;

function saveData() {
  localStorage.setItem(KEY, JSON.stringify(data));
}

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function money(value) {
  const number = Number(value) || 0;
  return number.toLocaleString("ru-RU") + " сомони";
}

function showToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
}

function setPage(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  const page = document.getElementById(pageId);
  if (page) page.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.page === pageId);
  });

  closeDrawer();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goHome() {
  setPage("homePage");
}

function showShops() {
  renderAllShops();
  setPage("shopsPage");
}

function showCart() {
  renderCart();
  setPage("cartPage");
}

function showProfile() {
  setPage("profilePage");
  showOrders();
}

function openDrawer() {
  document.getElementById("drawer").classList.add("open");
  document.getElementById("drawerOverlay").classList.remove("hidden");
}

function closeDrawer() {
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("drawerOverlay").classList.add("hidden");
}

function openModal(html) {
  document.getElementById("modalContent").innerHTML = html;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

function chooseLocation() {
  openModal(`
    <h2>Ваш город</h2>
    <label>Населённый пункт</label>
    <input id="cityInput" value="${safe(data.city)}" placeholder="Например, Фархор">
    <button class="wide-button" onclick="saveCity()">Сохранить</button>
  `);
}

function saveCity() {
  const city = document.getElementById("cityInput").value.trim();
  if (!city) return showToast("Введите название города");
  data.city = city;
  saveData();
  document.getElementById("locationText").textContent = city;
  closeModal();
  showToast("Город сохранён");
}

function renderProduct(product, source, shopId) {
  const image = product.image
    ? `<img src="${safe(product.image)}" alt="${safe(product.name)}" onerror="this.parentElement.textContent='OVARD'">`
    : "OVARD";

  return `
    <article class="product-card">
      <div class="product-photo">${image}</div>
      <div class="product-info">
        <h3>${safe(product.name)}</h3>
        <div class="product-description">${safe(product.description || "")}</div>
        <div class="product-price">
          ${money(product.price)}
          <span class="product-unit">/ ${safe(product.unit || "шт.")}</span>
        </div>
        <button class="add-button"
          onclick="addToCart('${safe(product.id)}','${safe(source)}',${Number(shopId) || 0})">
          В корзину
        </button>
      </div>
    </article>
  `;
}

function renderOwnProducts() {
  const container = document.getElementById("ownProducts");
  if (!container) return;

  const products = data.ownProducts.filter(product => product.active !== false);

  if (!products.length) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        В магазине OVARD пока нет товаров.<br>
        Новые товары появятся здесь.
      </div>`;
    return;
  }

  container.innerHTML = products.map(product =>
    renderProduct(product, "own", 0)
  ).join("");
}

function renderPartnerTicker() {
  const container = document.getElementById("partnerTicker");
  if (!container) return;

  const shops = data.shops.filter(shop => shop.active !== false);

  if (!shops.length) {
    container.classList.remove("moving");
    container.innerHTML = `<span class="partner-chip">Скоро здесь появятся магазины-партнёры</span>`;
    return;
  }

  const chips = shops.map(shop => `
    <button class="partner-chip" onclick="openShop(${Number(shop.id)})">
      ${safe(shop.name)}
    </button>
  `).join("");

  container.innerHTML = chips + chips;
  container.classList.toggle("moving", shops.length > 1);
}

function renderAllShops() {
  const container = document.getElementById("allShops");
  if (!container) return;

  const shops = data.shops.filter(shop => shop.active !== false);

  if (!shops.length) {
    container.innerHTML = `<div class="empty-state">Пока нет доступных магазинов.</div>`;
    return;
  }

  container.innerHTML = shops.map(shop => `
    <article class="shop-card" onclick="openShop(${Number(shop.id)})">
      <div class="shop-avatar">${safe(shop.name.trim().charAt(0).toUpperCase())}</div>
      <div>
        <h3>${safe(shop.name)}</h3>
        <p>${safe(shop.description || "Магазин-партнёр OVARD")}</p>
      </div>
      <span class="shop-arrow">›</span>
    </article>
  `).join("");
}

function openShop(id) {
  const shop = data.shops.find(item => Number(item.id) === Number(id));
  if (!shop || shop.active === false) return showToast("Магазин недоступен");

  currentShopId = Number(id);
  const products = (shop.products || []).filter(product => product.active !== false);

  document.getElementById("shopDetails").innerHTML = `
    <span class="eyebrow">МАГАЗИН-ПАРТНЁР</span>
    <h1 class="shop-title">${safe(shop.name)}</h1>
    <p class="shop-description">${safe(shop.description || "")}</p>
    <div class="product-grid">
      ${products.length
        ? products.map(product => renderProduct(product, "partner", id)).join("")
        : `<div class="empty-state" style="grid-column:1/-1">Товары пока не добавлены.</div>`}
    </div>
  `;

  setPage("shopDetailsPage");
}

function findProduct(id, source, shopId) {
  if (source === "own") {
    return data.ownProducts.find(product => String(product.id) === String(id));
  }

  const shop = data.shops.find(item => Number(item.id) === Number(shopId));
  return shop?.products?.find(product => String(product.id) === String(id));
}

function addToCart(productId, source, shopId) {
  const product = findProduct(productId, source, shopId);
  if (!product) return showToast("Товар не найден");

  const key = `${source}_${shopId}_${productId}`;
  const existing = data.cart.find(item => item.key === key);

  if (existing) {
    existing.quantity += 1;
  } else {
    data.cart.push({
      key,
      productId: String(productId),
      source,
      shopId: Number(shopId) || 0,
      name: product.name,
      price: Number(product.price) || 0,
      unit: product.unit || "шт.",
      quantity: 1
    });
  }

  saveData();
  updateCartCount();
  showToast("Добавлено в корзину");
}

function updateCartCount() {
  const count = data.cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const badge = document.getElementById("cartCount");
  badge.textContent = count;
  badge.classList.toggle("hidden", count === 0);
}

function renderCart() {
  const container = document.getElementById("cartContent");
  if (!container) return;

  if (!data.cart.length) {
    container.innerHTML = `<div class="empty-state">Ваша корзина пока пуста.</div>`;
    return;
  }

  const total = data.cart.reduce((sum, item) =>
    sum + Number(item.price) * Number(item.quantity), 0
  );

  container.innerHTML = `
    ${data.cart.map(item => `
      <div class="cart-row">
        <div class="cart-row-info">
          <h3>${safe(item.name)}</h3>
          <p>${money(item.price)} / ${safe(item.unit)}</p>
        </div>
        <div class="quantity-control">
          <button onclick="changeQuantity('${safe(item.key)}',-1)">−</button>
          <strong>${Number(item.quantity)}</strong>
          <button onclick="changeQuantity('${safe(item.key)}',1)">+</button>
        </div>
      </div>
    `).join("")}
    <div class="cart-total">
      <div class="cart-total-line">
        <span>Товары</span><strong>${money(total)}</strong>
      </div>
      <div class="cart-total-line">
        <span>Доставка</span><span>Уточняется при подтверждении</span>
      </div>
      <button class="wide-button" onclick="checkout()">Оформить заказ</button>
    </div>
  `;
}

function changeQuantity(key, amount) {
  const item = data.cart.find(product => product.key === key);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity <= 0) {
    data.cart = data.cart.filter(product => product.key !== key);
  }

  saveData();
  updateCartCount();
  renderCart();
}

function checkout() {
  if (!data.cart.length) return showToast("Корзина пуста");

  openModal(`
    <h2>Оформление заказа</h2>
    <label>Ваше имя</label>
    <input id="customerName" placeholder="Введите имя">
    <label>Номер телефона</label>
    <input id="customerPhone" type="tel" placeholder="+992 ...">
    <label>Адрес доставки</label>
    <textarea id="customerAddress" placeholder="Улица, дом, ориентир"></textarea>
    <label>Комментарий к заказу</label>
    <textarea id="customerComment" placeholder="Необязательно"></textarea>
    <button class="wide-button" onclick="submitOrder()">Подтвердить заказ</button>
    <p class="section-note">Стоимость доставки будет уточнена после проверки заказа.</p>
  `);
}

function submitOrder() {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const comment = document.getElementById("customerComment").value.trim();

  if (!name || !phone || !address) {
    return showToast("Заполните имя, телефон и адрес");
  }

  const order = {
    id: Date.now(),
    name,
    phone,
    address,
    comment,
    items: data.cart.map(item => ({ ...item })),
    total: data.cart.reduce((sum, item) =>
      sum + Number(item.price) * Number(item.quantity), 0
    ),
    status: "Новый",
    date: new Date().toLocaleString("ru-RU")
  };

  data.orders.unshift(order);
  data.cart = [];
  saveData();
  updateCartCount();
  closeModal();
  renderCart();
  showToast("Заказ сохранён");

  if (data.settings.whatsapp && data.settings.phone) {
    const lines = order.items.map(item =>
      `${item.name} — ${item.quantity} ${item.unit} × ${item.price}`
    ).join("\n");

    const message =
      `Заказ OVARD\nИмя: ${name}\nТелефон: ${phone}\nАдрес: ${address}\n${lines}\nИтого: ${order.total} сомони\nКомментарий: ${comment}`;

    const url = `https://wa.me/${data.settings.phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

    openModal(`
      <h2>Заказ принят на этом устройстве</h2>
      <p class="section-note">Можно отправить данные заказа через WhatsApp.</p>
      <button class="wide-button" onclick="window.open('${url}','_blank')">Отправить в WhatsApp</button>
      <button class="wide-button" style="margin-top:8px;background:#65746b" onclick="closeModal()">Закрыть</button>
    `);
  }
}

function showOrders() {
  const container = document.getElementById("ordersContent");
  if (!container) return;

  if (!data.orders.length) {
    container.innerHTML = `<div class="empty-state">У вас пока нет заказов.</div>`;
    return;
  }

  container.innerHTML = data.orders.map(order => `
    <div class="order-card">
      <h3>Заказ №${order.id}</h3>
      <p>Дата: ${safe(order.date)}</p>
      <p>Сумма товаров: <strong>${money(order.total)}</strong></p>
      <p>Статус: ${safe(order.status)}</p>
      <p>${order.items.map(item =>
        `${safe(item.name)} × ${Number(item.quantity)}`
      ).join("<br>")}</p>
    </div>
  `).join("");
}

function searchAll(value) {
  const term = value.trim().toLowerCase();
  const section = document.getElementById("searchResults");
  const content = document.getElementById("searchContent");

  if (!term) {
    section.classList.add("hidden");
    document.getElementById("ownStoreSection").classList.remove("hidden");
    document.querySelector(".partner-section").classList.remove("hidden");
    document.querySelector(".delivery-banner").classList.remove("hidden");
    return;
  }

  section.classList.remove("hidden");
  document.getElementById("ownStoreSection").classList.add("hidden");
  document.querySelector(".partner-section").classList.add("hidden");
  document.querySelector(".delivery-banner").classList.add("hidden");

  const results = [];

  data.ownProducts.filter(product =>
    product.active !== false &&
    `${product.name} ${product.description || ""}`.toLowerCase().includes(term)
  ).forEach(product => {
    results.push({ product, source: "own", shopId: 0, shopName: "Магазин OVARD" });
  });

  data.shops.filter(shop => shop.active !== false).forEach(shop => {
    if (shop.name.toLowerCase().includes(term)) {
      results.push({ shop });
    }

    (shop.products || []).filter(product =>
      product.active !== false &&
      `${product.name} ${product.description || ""}`.toLowerCase().includes(term)
    ).forEach(product => {
      results.push({ product, source: "partner", shopId: shop.id, shopName: shop.name });
    });
  });

  if (!results.length) {
    content.innerHTML = `<div class="empty-state">Ничего не найдено.</div>`;
    return;
  }

  content.innerHTML = results.map(result => {
    if (result.shop) {
      return `
        <article class="shop-card" onclick="openShop(${Number(result.shop.id)})">
          <div class="shop-avatar">${safe(result.shop.name.charAt(0))}</div>
          <div><h3>${safe(result.shop.name)}</h3><p>Магазин-партнёр</p></div>
          <span class="shop-arrow">›</span>
        </article>`;
    }

    return `
      <p class="section-note">${safe(result.shopName)}</p>
      ${renderProduct(result.product, result.source, result.shopId)}
    `;
  }).join("");
}

function clearSearch() {
  const input = document.getElementById("searchInput");
  input.value = "";
  searchAll("");
}

function changeTheme(value) {
  data.settings.theme = value;
  saveData();
  applyTheme();
  showToast("Настройки сохранены");
}

function applyTheme() {
  document.body.classList.toggle("dark", data.settings.theme === "dark");
  document.getElementById("themeSelect").value = data.settings.theme;
}

function changeLanguage(value) {
  data.settings.language = value;
  saveData();
  showToast("Язык сохранён. Перевод интерфейса будет добавлен отдельно.");
}

function init() {
  document.getElementById("locationText").textContent = data.city || "Фархор";
  document.getElementById("languageSelect").value = data.settings.language || "ru";
  applyTheme();
  renderOwnProducts();
  renderPartnerTicker();
  updateCartCount();
}

document.addEventListener("DOMContentLoaded", init);
