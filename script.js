
const $ = id => document.getElementById(id);

const read = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

const save = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

let products = read("ovard_products", [
  {
    id: 1, name: "Мука Ovard", weight: "50 кг",
    price: 280, unit: "мешок",
    image: "https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=500",
    shopId: "ovard", active: true
  },
  {
    id: 2, name: "Комбикорм", weight: "40 кг",
    price: 220, unit: "мешок",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500",
    shopId: "ovard", active: true
  },
  {
    id: 3, name: "Пшеница", weight: "1 кг",
    price: 8, unit: "кг",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500",
    shopId: "ovard", active: true
  }
]);

let shops = read("ovard_shops", [
  {id:"pharmacy", name:"Аптека", description:"Лекарства и здоровье", icon:"✚", active:true},
  {id:"zoro", name:"Зоро", description:"Одежда и аксессуары", icon:"🛍️", active:true},
  {id:"bread", name:"Дукон (Нон)", description:"Свежий хлеб", icon:"🥖", active:true},
  {id:"construction", name:"СтройМатериал", description:"Стройматериалы", icon:"🏠", active:true},
  {id:"food", name:"Озуқаворӣ", description:"Продукты питания", icon:"🌾", active:true}
]);

let cart = read("ovard_cart", []);
let orders = read("ovard_orders", []);
let customer = read("ovard_customer", null);
let selectedShop = null;
let currentLanguage = read("ovard_language", "ru");

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;",
    '"':"&quot;", "'":"&#39;"
  })[char]);
}

function formatPrice(price) {
  return Number(price).toLocaleString("ru-RU") + " с.";
}

function showPage(page) {
  document.querySelectorAll(".page").forEach(el =>
    el.classList.remove("active")
  );

  const target = $(page);
  if (!target) return;

  target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(el =>
    el.classList.remove("active")
  );

  const nav = {
    home:0, shops:1, cart:2,
    orders:2, profile:3, register:3, settings:3
  };

  const items = document.querySelectorAll(".nav-item");
  if (nav[page] !== undefined && items[nav[page]]) {
    items[nav[page]].classList.add("active");
  }

  $("menu")?.classList.add("hidden");

  if (page === "home") renderOwnProducts();
  if (page === "shops") renderShops();
  if (page === "cart") renderCart();
  if (page === "orders") renderOrders();
  if (page === "profile") renderProfile();

  window.scrollTo({top:0, behavior:"smooth"});
}

function toggleMenu() {
  $("menu")?.classList.toggle("hidden");
}

function productCard(product) {
  return `
    <article class="product-card">
      <img src="${escapeHTML(product.image)}"
           alt="${escapeHTML(product.name)}"
           loading="lazy"
           onerror="this.style.display='none'">
      <h3>${escapeHTML(product.name)}</h3>
      <p>${escapeHTML(product.weight || product.unit || "")}</p>
      <div class="product-bottom">
        <span class="product-price">${formatPrice(product.price)}</span>
        <button class="add-button"
          onclick="addToCart(${Number(product.id)})">+</button>
      </div>
    </article>`;
}

function renderOwnProducts() {
  const list = products.filter(p =>
    p.active !== false && p.shopId === "ovard"
  );

  $("own-products").innerHTML = list.length
    ? list.map(productCard).join("")
    : "<p>Пока нет товаров Ovard.</p>";
}

function renderShops() {
  const query = ($("shop-search")?.value || "").toLowerCase();

  const list = shops.filter(shop =>
    shop.active !== false &&
    shop.name.toLowerCase().includes(query)
  );

  $("shops-list").innerHTML = list.length
    ? list.map(shop => `
      <div class="shop-card"
        onclick="openShop('${escapeHTML(shop.id)}')">
        <div class="shop-icon">${escapeHTML(shop.icon || "🏬")}</div>
        <div>
          <h3>${escapeHTML(shop.name)}</h3>
          <p>${escapeHTML(shop.description || "Магазин Ovard")}</p>
        </div>
        <span class="shop-arrow">›</span>
      </div>
    `).join("")
    : "<p>Магазины не найдены.</p>";
}

function openShop(id) {
  const shop = shops.find(s => String(s.id) === String(id));
  if (!shop) return;

  selectedShop = shop.id;
  $("selected-shop-name").textContent = shop.name;

  const list = products.filter(p =>
    String(p.shopId) === String(shop.id) &&
    p.active !== false
  );

  $("selected-shop-products").innerHTML = list.length
    ? list.map(productCard).join("")
    : "<p>В этом магазине пока нет добавленных товаров.</p>";

  showPage("shop-products");
}

function addToCart(id) {
  const product = products.find(p => Number(p.id) === Number(id));
  if (!product) return;

  const existing = cart.find(item =>
    Number(item.id) === Number(id)
  );

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({...product, quantity:1});
  }

  save("ovard_cart", cart);
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) =>
    sum + item.quantity, 0
  );

  if ($("cart-count")) {
    $("cart-count").textContent = count;
  }
}

function renderCart() {
  const container = $("cart-items");

  if (!cart.length) {
    container.innerHTML = "<p>Ваша корзина пока пуста.</p>";
    $("cart-summary").innerHTML = "";
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-row">
        <div>
          <strong>${escapeHTML(item.name)}</strong>
          <p>${formatPrice(item.price)} / ${escapeHTML(item.unit || "шт.")}</p>
        </div>
        <div class="cart-controls">
          <button onclick="changeQuantity(${Number(item.id)},-1)">−</button>
          <strong>${item.quantity}</strong>
          <button onclick="changeQuantity(${Number(item.id)},1)">+</button>
          <button onclick="removeFromCart(${Number(item.id)})">×</button>
        </div>
      </div>
      <p><strong>${formatPrice(item.price * item.quantity)}</strong></p>
    </div>
  `).join("");

  const total = cart.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  );

  $("cart-summary").innerHTML = `
    <div class="cart-total">
      Итого за товары: ${formatPrice(total)}
      <p>Стоимость доставки уточняется отдельно.</p>
    </div>
  `;
}

function changeQuantity(id, amount) {
  const item = cart.find(p => Number(p.id) === Number(id));
  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(p => Number(p.id) !== Number(id));
  }

  save("ovard_cart", cart);
  updateCartCount();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(p => Number(p.id) !== Number(id));
  save("ovard_cart", cart);
  updateCartCount();
  renderCart();
}

function checkout() {
  if (!cart.length) {
    alert("Корзина пуста.");
    return;
  }

  if (!customer) {
    alert("Сначала зарегистрируйтесь.");
    showPage("register");
    return;
  }

  const order = {
    id: Date.now(),
    date: new Date().toLocaleString("ru-RU"),
    customer: customer,
    items: cart,
    total: cart.reduce((sum, item) =>
      sum + item.price * item.quantity, 0
    ),
    status: "Принят"
  };

  orders.unshift(order);
  save("ovard_orders", orders);

  cart = [];
  save("ovard_cart", cart);

  updateCartCount();
  alert("Заказ сохранён!");

  showPage("orders");
}

function registerCustomer() {
  const name = $("customer-name").value.trim();
  const phone = $("customer-phone").value.trim();
  const address = $("customer-address").value.trim();

  if (!name || !phone || !address) {
    alert("Заполните все поля.");
    return;
  }

  customer = {name, phone, address};
  save("ovard_customer", customer);

  alert("Регистрация сохранена!");
  showPage("profile");
}

function renderProfile() {
  $("profile-info").innerHTML = customer
    ? `<div class="cart-item">
        <h3>${escapeHTML(customer.name)}</h3>
        <p>${escapeHTML(customer.phone)}</p>
        <p>${escapeHTML(customer.address)}</p>
       </div>`
    : "<p>Вы ещё не зарегистрированы.</p>";
}

function renderOrders() {
  $("orders-list").innerHTML = orders.length
    ? orders.map(order => `
      <div class="cart-item">
        <h3>Заказ №${order.id}</h3>
        <p>${escapeHTML(order.date)}</p>
        <p>Товаров: ${order.items.reduce((s,i)=>s+i.quantity,0)}</p>
        <p>Сумма: ${formatPrice(order.total)}</p>
        <p>Статус: ${escapeHTML(order.status)}</p>
      </div>
    `).join("")
    : "<p>У вас пока нет заказов.</p>";
}

function toggleTheme(enabled) {
  document.body.classList.toggle("dark", enabled);
  save("ovard_dark", enabled);
}

function changeLanguage(language) {
  currentLanguage = language;
  save("ovard_language", language);
  alert("Язык выбран. Полный перевод подключим следующим этапом.");
}

function initialize() {
  if (!Array.isArray(products)) products = [];
  if (!Array.isArray(shops)) shops = [];
  if (!Array.isArray(cart)) cart = [];
  if (!Array.isArray(orders)) orders = [];

  document.body.classList.toggle(
    "dark", read("ovard_dark", false)
  );

  if ($("dark-mode")) {
    $("dark-mode").checked = read("ovard_dark", false);
  }

  if ($("language")) {
    $("language").value = currentLanguage;
  }

  save("ovard_products", products);
  save("ovard_shops", shops);

  renderOwnProducts();
  renderShops();
  updateCartCount();
}

initialize();
