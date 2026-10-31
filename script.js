// Data state
let stores = [
  { id: 1, name: "Магазин OVARD", desc: "Главный склад продуктов и товаров" },
  { id: 2, name: "Ферма & Сельхоз", desc: "Замин, алаф, корма ва чорво" }
];

let products = [
  { id: 101, storeId: 1, name: "Мука 50кг", price: 280, unit: "мешок" },
  { id: 102, storeId: 1, name: "Сахар", price: 10, unit: "кг" },
  { id: 103, storeId: 2, name: "Алаф (Люцерна)", price: 25, unit: "прес" },
  { id: 104, storeId: 2, name: "Замини кишоварзӣ", price: 1500, unit: "сотих" }
];

let cart = [];
let currentLang = 'ru';

// Translations
const translations = {
  ru: {
    navHome: "Главная",
    navStores: "Магазины",
    navAdmin: "Админка",
    bannerTitle: "Доставляем всё, что нужно",
    bannerSub: "Продукты • Товары • Сельское хозяйство",
    titleStores: "Магазины и Фермы",
    titleProducts: "Товары магазина",
    btnBack: "← Назад",
    adminTitle: "Управление магазинами и товарами",
    adminAddStore: "Добавить новый магазин",
    adminAddProd: "Добавить товар",
    btnAddStore: "Добавить магазин",
    btnAddProd: "Добавить товар",
    lblUnit: "Единица измерения:",
    cartTitle: "Корзина",
    cartTotalLbl: "Итого:",
    btnCheckout: "Оформить заказ",
    addBtn: "В корзину"
  },
  tj: {
    navHome: "Асосӣ",
    navStores: "Мағозаҳо",
    navAdmin: "Админка",
    bannerTitle: "Ҳама чизро мерасонем",
    bannerSub: "Маҳсулот • Молҳо • Кишоварзӣ",
    titleStores: "Мағозаҳо ва Фермаҳо",
    titleProducts: "Молҳои мағоза",
    btnBack: "← Ба ақиб",
    adminTitle: "Идоракунии мағозаҳо ва молҳо",
    adminAddStore: "Илова кардани мағозаи нав",
    adminAddProd: "Илова кардани мол",
    btnAddStore: "Илова кардани мағоза",
    btnAddProd: "Илова кардани мол",
    lblUnit: "Воҳиди ченкунӣ:",
    cartTitle: "Сабад",
    cartTotalLbl: "Ҷамъ:",
    btnCheckout: "Расид кардан",
    addBtn: "Ба сабад"
  },
  en: {
    navHome: "Home",
    navStores: "Stores",
    navAdmin: "Admin",
    bannerTitle: "Delivering everything you need",
    bannerSub: "Groceries • Goods • Agriculture",
    titleStores: "Stores & Farms",
    titleProducts: "Store Products",
    btnBack: "← Back",
    adminTitle: "Manage Stores & Products",
    adminAddStore: "Add New Store",
    adminAddProd: "Add Product",
    btnAddStore: "Add Store",
    btnAddProd: "Add Product",
    lblUnit: "Unit of measurement:",
    cartTitle: "Cart",
    cartTotalLbl: "Total:",
    btnCheckout: "Checkout",
    addBtn: "Add to cart"
  }
};

// Language switcher
function changeLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];
  
  document.getElementById('nav-home').innerText = t.navHome;
  document.getElementById('nav-stores').innerText = t.navStores;
  document.getElementById('nav-admin').innerText = t.navAdmin;
  document.getElementById('banner-title').innerText = t.bannerTitle;
  document.getElementById('banner-sub').innerText = t.bannerSub;
  document.getElementById('title-stores').innerText = t.titleStores;
  document.getElementById('title-products').innerText = t.titleProducts;
  document.getElementById('btn-back').innerText = t.btnBack;
  document.getElementById('admin-title').innerText = t.adminTitle;
  document.getElementById('admin-add-store').innerText = t.adminAddStore;
  document.getElementById('admin-add-prod').innerText = t.adminAddProd;
  document.getElementById('btn-add-store').innerText = t.btnAddStore;
  document.getElementById('btn-add-prod').innerText = t.btnAddProd;
  document.getElementById('lbl-unit').innerText = t.lblUnit;
  document.getElementById('cart-title').innerText = t.cartTitle;
  document.getElementById('cart-total-lbl').innerText = t.cartTotalLbl;
  document.getElementById('btn-checkout').innerText = t.btnCheckout;

  renderStores();
}

// Navigation
function showSection(sectionId) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));

  if(sectionId === 'home' || sectionId === 'stores') {
    document.getElementById('sec-home').classList.add('active');
    document.getElementById('nav-' + (sectionId === 'home' ? 'home' : 'stores')).classList.add('active');
  } else if(sectionId === 'admin') {
    document.getElementById('sec-admin').classList.add('active');
    document.getElementById('nav-admin').classList.add('active');
    populateStoreSelect();
  }
}

// Render Stores
function renderStores() {
  const container = document.getElementById('stores-container');
  container.innerHTML = '';
  const t = translations[currentLang];

  stores.forEach(store => {
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openStore(store.id);
    card.innerHTML = `
      <div>
        <div class="card-title">${store.name}</div>
        <div class="card-desc">${store.desc}</div>
      </div>
      <div>➔</div>
    `;
    container.appendChild(card);
  });
}

// Open Store Products
function openStore(storeId) {
  const store = stores.find(s => s.id === storeId);
  document.getElementById('store-header').innerHTML = `
    <h2>${store.name}</h2>
    <p style="color:#6b7280; font-size:14px;">${store.desc}</p>
  `;

  const container = document.getElementById('products-container');
  container.innerHTML = '';
  const t = translations[currentLang];

  const storeProds = products.filter(p => p.storeId === storeId);
  storeProds.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div>
        <div class="card-title">${p.name}</div>
        <div class="price-tag">${p.price} сомони / ${p.unit}</div>
      </div>
      <button class="add-btn" onclick="addToCart(${p.id})">${t.addBtn}</button>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById('sec-store-detail').classList.add('active');
}

// Cart logic
function addToCart(prodId) {
  const prod = products.find(p => p.id === prodId);
  cart.push(prod);
  document.getElementById('cart-count').innerText = cart.length;
}

function toggleCart() {
  const modal = document.getElementById('cart-modal');
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
  renderCart();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  container.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement('div');
    div.style.cssText = "display:flex; justify-shadow:space-between; margin-bottom:8px;";
    div.innerHTML = `
      <span>${item.name} (${item.unit})</span>
      <strong>${item.price} сомони</strong>
    `;
    container.appendChild(div);
  });

  document.getElementById('cart-total-price').innerText = total + " сомони";
}

function checkout() {
  if(cart.length === 0) return alert("Корзина пуста!");
  alert("Заказ оформлен!");
  cart = [];
  document.getElementById('cart-count').innerText = 0;
  toggleCart();
}

// Admin Logic
function populateStoreSelect() {
  const select = document.getElementById('prod-store-select');
  select.innerHTML = '';
  stores.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id;
    opt.innerText = s.name;
    select.appendChild(opt);
  });
}

function addNewStore() {
  const name = document.getElementById('new-store-name').value;
  const desc = document.getElementById('new-store-desc').value;
  if(!name) return alert("Введите название");

  stores.push({ id: Date.now(), name, desc });
  document.getElementById('new-store-name').value = '';
  document.getElementById('new-store-desc').value = '';
  renderStores();
  alert("Магазин добавлен!");
}

function addNewProduct() {
  const storeId = Number(document.getElementById('prod-store-select').value);
  const name = document.getElementById('new-prod-name').value;
  const price = Number(document.getElementById('new-prod-price').value);
  const unit = document.getElementById('prod-unit').value;

  if(!name || !price) return alert("Заполните данные");

  products.push({ id: Date.now(), storeId, name, price, unit });
  document.getElementById('new-prod-name').value = '';
  document.getElementById('new-prod-price').value = '';
  alert("Товар добавлен!");
}

// Init
renderStores();
