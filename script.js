
const OVARD_WHATSAPP = "992000001606";
const DEFAULT_LOCATION = "Фархор, Таджикистан";
const $ = id => document.getElementById(id);

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
const save = (key, value) =>
  localStorage.setItem(key, JSON.stringify(value));

const starterShops = [
  {
    id:"bread", name:"Нонвойхона", category:"Нони гарм",
    address:"Фархор", phone:"", emoji:"🥖", active:true,
    products:[
      {id:"bread1",name:"Нони гарм",price:4,unit:"дона",emoji:"🥖",available:true,featured:true}
    ]
  },
  {
    id:"market", name:"Маҳсулоти рӯзгор", category:"Хӯрокворӣ",
    address:"Фархор", phone:"", emoji:"🛒", active:true,
    products:[
      {id:"oil",name:"Равғани растанӣ",price:18,unit:"литр",emoji:"🫗",available:true,featured:true}
    ]
  },
  {
    id:"eggs", name:"Тухм ва маҳсулоти мурғ",
    category:"Маҳсулоти мурғ", address:"Фархор",
    phone:"", emoji:"🥚", active:true,
    products:[
      {id:"egg",name:"Тухми мурғ",price:2,unit:"дона",emoji:"🥚",available:true,featured:true}
    ]
  }
];

let shops = read("ovard_shops", starterShops);
let cart = read("ovard_cart", []);

const money = n =>
  `${Number(n || 0).toLocaleString("ru-RU")} сомонӣ`;

const safe = s =>
  String(s ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",
    '"':"&quot;","'":"&#39;"
  }[c]));

function toast(msg) {
  $("toast").textContent = msg;
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 2200);
}

function activeShops() {
  return shops.filter(s => s.active !== false);
}

function allProducts() {
  return activeShops().flatMap(s =>
    (s.products || [])
      .filter(p => p.available !== false)
      .map(p => ({...p, shopId:s.id, shopName:s.name}))
  );
}

function renderShops() {
  const list = activeShops();
  $("shopCount").textContent = list.length;

  $("shopsList").innerHTML = list.length
    ? list.map(s => `
      <button class="shop-card" data-shop="${safe(s.id)}">
        <span class="shop-thumb">
          ${s.image
            ? `<img src="${safe(s.image)}" alt="">`
            : safe(s.emoji || "🏪")}
        </span>
        <span class="shop-info">
          <strong>${safe(s.name)}</strong>
          <small>${safe(s.category || "Магазин")} · ${safe(s.address || "")}</small>
        </span>
        <span>›</span>
      </button>
    `).join("")
    : `<div class="empty">Пока нет активных магазинов.</div>`;
}

function renderFeatured() {
  const q = $("searchInput").value.trim().toLowerCase();

  const products = allProducts()
    .filter(p => p.featured || p.isNew || p.sale)
    .filter(p =>
      !q || (p.name + " " + p.shopName).toLowerCase().includes(q)
    );

  $("featuredList").innerHTML = products.length
    ? products.map(p => `
      <article class="product-card">
        <div class="product-photo">
          ${p.image
            ? `<img src="${safe(p.image)}" alt="">`
            : safe(p.emoji || "🛍️")}
        </div>
        <strong>${safe(p.name)}</strong>
        <small>${safe(p.shopName)} · ${safe(p.unit || "шт.")}</small>
        <div class="price">${money(p.price)}</div>
        <button class="add-btn"
          data-add="${safe(p.id)}"
          data-shopid="${safe(p.shopId)}">
          + В корзину
        </button>
      </article>
    `).join("")
    : `<div class="empty">Пока нет товаров в подборке.</div>`;
}

function renderCart() {
  const count = cart.reduce((a,x) => a + x.qty, 0);
  const total = cart.reduce((a,x) => a + x.price * x.qty, 0);

  $("cartCount").textContent = count;
  $("cartTotal").textContent = money(total);

  $("cartItems").innerHTML = cart.length
    ? cart.map(x => `
      <div class="cart-row">
        <span>
          <strong>${safe(x.name)}</strong><br>
          <small class="muted">${x.qty} × ${money(x.price)}</small>
        </span>
        <span>
          <strong>${money(x.qty * x.price)}</strong>
          <button data-remove="${safe(x.key)}" aria-label="Удалить">×</button>
        </span>
      </div>
    `).join("")
    : `<p class="muted">Корзина пока пуста.</p>`;

  save("ovard_cart", cart);
}

function addToCart(shopId, productId) {
  const shop = shops.find(s => s.id === shopId);
  const p = shop?.products?.find(x => x.id === productId);
  if (!p) return;

  const key = shopId + "_" + productId;
  const old = cart.find(x => x.key === key);

  if (old) {
    old.qty++;
  } else {
    cart.push({
      key, shopId, shopName:shop.name,
      id:p.id, name:p.name,
      price:Number(p.price) || 0,
      unit:p.unit || "шт.", qty:1
    });
  }

  renderCart();
  toast("Добавлено в корзину");
}

function openShop(id) {
  const s = shops.find(x => x.id === id);
  if (!s) return;

  const products = (s.products || [])
    .filter(p => p.available !== false);

  $("modalContent").innerHTML = `
    <p class="eyebrow">${safe(s.category || "МАГАЗИН")}</p>
    <h2>${safe(s.name)}</h2>
    <p class="muted">${safe(s.address || "")}
      ${s.phone ? "· " + safe(s.phone) : ""}
    </p>
    <div>
      ${products.map(p => `
        <div class="modal-product">
          <div class="shop-thumb">
            ${p.image
              ? `<img src="${safe(p.image)}" alt="">`
              : safe(p.emoji || "🛍️")}
          </div>
          <div style="flex:1">
            <strong>${safe(p.name)}</strong>
            <div class="small muted">${safe(p.unit || "шт.")}</div>
            <div class="price">${money(p.price)}</div>
          </div>
          <button class="add-btn" style="width:auto"
            data-add="${safe(p.id)}"
            data-shopid="${safe(s.id)}">+</button>
        </div>
      `).join("") || '<p class="empty">Товаров пока нет.</p>'}
    </div>
  `;

  $("modalBackdrop").classList.add("show");
}

function orderText() {
  const name = $("customerName").value.trim();
  const phone = $("customerPhone").value.trim();
  const address = $("customerAddress").value.trim();
  const note = $("customerNote").value.trim();

  if (!cart.length) {
    toast("Сначала добавьте товар в корзину");
    return null;
  }

  if (!name || !phone || !address) {
    toast("Заполните имя, телефон и адрес");
    return null;
  }

  const total = cart.reduce(
    (a,x) => a + x.price * x.qty, 0
  );

  return `Здравствуйте! Заказ с сайта OVARD
Имя: ${name}
Телефон: ${phone}
Адрес: ${address}

${cart.map((x,i) =>
  `${i+1}. ${x.name} — ${x.qty} ${x.unit} × ${x.price} = ${x.qty*x.price} сомонӣ (${x.shopName})`
).join("\n")}

Товары итого: ${total} сомонӣ
Доставка: уточнить отдельно
Комментарий: ${note || "нет"}`;
}

function sendWhatsApp() {
  const msg = orderText();
  if (msg) {
    window.open(
      `https://wa.me/${OVARD_WHATSAPP}?text=${encodeURIComponent(msg)}`,
      "_blank",
      "noopener"
    );
  }
}

function submitSiteOrder() {
  const msg = orderText();
  if (!msg) return;

  const orders = read("ovard_orders", []);
  orders.push({
    id:Date.now(),
    createdAt:new Date().toISOString(),
    message:msg,
    status:"Новый"
  });

  save("ovard_orders", orders);
  toast("Заказ сохранён на этом устройстве. Свяжитесь с OVARD для подтверждения.");
}

$("shopsList").addEventListener("click", e => {
  const b = e.target.closest("[data-shop]");
  if (b) openShop(b.dataset.shop);
});

document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]");
  if (add) addToCart(add.dataset.shopid, add.dataset.add);

  const rem = e.target.closest("[data-remove]");
  if (rem) {
    cart = cart.filter(x => x.key !== rem.dataset.remove);
    renderCart();
  }
});

$("whatsappBtn").addEventListener("click", sendWhatsApp);
$("siteOrderBtn").addEventListener("click", submitSiteOrder);
$("searchBtn").addEventListener("click", renderFeatured);
$("searchInput").addEventListener("input", renderFeatured);

$("menuBtn").addEventListener("click", () => {
  $("settingsDrawer").classList.add("open");
  $("drawerBackdrop").classList.add("show");
});

function closeDrawer() {
  $("settingsDrawer").classList.remove("open");
  $("drawerBackdrop").classList.remove("show");
}

$("closeDrawer").addEventListener("click", closeDrawer);
$("drawerBackdrop").addEventListener("click", closeDrawer);

$("modalClose").addEventListener("click", () =>
  $("modalBackdrop").classList.remove("show")
);

$("modalBackdrop").addEventListener("click", e => {
  if (e.target === $("modalBackdrop")) {
    $("modalBackdrop").classList.remove("show");
  }
});

$("profileBtn").addEventListener("click", () => {
  const p = read("ovard_profile", {});

  $("modalContent").innerHTML = `
    <h2>Профиль</h2>
    <p class="muted">Сохраните данные, чтобы быстрее оформлять заказы.</p>
    <div class="form-grid">
      <input id="profileName" placeholder="Имя" value="${safe(p.name || "")}">
      <input id="profilePhone" placeholder="Телефон" value="${safe(p.phone || "")}">
      <input id="profileAddress" class="full" placeholder="Адрес" value="${safe(p.address || "")}">
      <button class="primary-btn full" id="saveProfile">Сохранить</button>
    </div>
  `;

  $("modalBackdrop").classList.add("show");

  $("saveProfile").addEventListener("click", () => {
    const v = {
      name:$("profileName").value,
      phone:$("profilePhone").value,
      address:$("profileAddress").value
    };

    save("ovard_profile", v);
    $("customerName").value = v.name;
    $("customerPhone").value = v.phone;
    $("customerAddress").value = v.address;
    $("modalBackdrop").classList.remove("show");
    toast("Профиль сохранён");
  });
});

$("themeSelect").value =
  localStorage.getItem("ovard_theme") || "light";

$("themeSelect").addEventListener("change", e => {
  document.body.classList.toggle("dark", e.target.value === "dark");
  localStorage.setItem("ovard_theme", e.target.value);
});

$("fontSelect").value =
  localStorage.getItem("ovard_font") || "normal";

$("fontSelect").addEventListener("change", e => {
  document.body.classList.remove("large", "xlarge");
  if (e.target.value !== "normal") {
    document.body.classList.add(e.target.value);
  }
  localStorage.setItem("ovard_font", e.target.value);
});

document.body.classList.toggle(
  "dark", localStorage.getItem("ovard_theme") === "dark"
);

document.body.classList.add(
  localStorage.getItem("ovard_font") || "normal"
);

$("activeLocation").textContent =
  localStorage.getItem("ovard_location") || DEFAULT_LOCATION;

const profile = read("ovard_profile", {});
$("customerName").value = profile.name || "";
$("customerPhone").value = profile.phone || "";
$("customerAddress").value = profile.address || "";

renderShops();
renderFeatured();
renderCart();
