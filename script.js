
const $ = id => document.getElementById(id);

// Саҳифаҳо
function openPage(name) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.add("hidden");
  });

  const page = $(name + "Page");
  if (page) page.classList.remove("hidden");

  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === name);
  });
}

document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", () => openPage(btn.dataset.page));
});

// Мағозаҳо ва маҳсулот
let shops = JSON.parse(localStorage.getItem("ovardShops") || "[]");
let products = JSON.parse(localStorage.getItem("ovardProducts") || "[]");

function saveData() {
  localStorage.setItem("ovardShops", JSON.stringify(shops));
  localStorage.setItem("ovardProducts", JSON.stringify(products));
}

function renderShops() {
  const html = shops.map((shop, index) => `
    <div class="shop-card">
      <div class="shop-icon">🏪</div>
      <div>
        <h3>${escapeHTML(shop.name)}</h3>
        <p>${escapeHTML(shop.description || "Магазин OVARD")}</p>
      </div>
      <button onclick="deleteShop(${index})">✕</button>
    </div>
  `).join("");

  $("allShops").innerHTML = html || "<p>Пока магазинов нет.</p>";
  $("shopPreview").innerHTML = html || "<p>Магазины скоро появятся.</p>";
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function addShop() {
  const name = prompt("Введите название магазина:");
  if (!name || !name.trim()) return;

  const description = prompt("Описание магазина:") || "";

  shops.push({
    name: name.trim(),
    description: description.trim(),
    products: []
  });

  saveData();
  renderShops();
}

function deleteShop(index) {
  if (!confirm("Удалить этот магазин?")) return;
  shops.splice(index, 1);
  saveData();
  renderShops();
}

// Товары OVARD
function renderProducts() {
  $("ovardProducts").innerHTML = products.map((product, index) => `
    <div class="product-card">
      <h3>${escapeHTML(product.name)}</h3>
      <p>${escapeHTML(product.price)} сомони / ${escapeHTML(product.unit)}</p>
      <button onclick="deleteProduct(${index})">Удалить</button>
    </div>
  `).join("") || "<p>Товары OVARD скоро появятся.</p>";
}

function addProduct() {
  const name = prompt("Название товара:");
  if (!name || !name.trim()) return;

  const price = prompt("Цена в сомони:");
  if (price === null || !price.trim()) return;

  const unit = prompt("Единица измерения (кг, мешок, штука и т.д.):");
  if (!unit || !unit.trim()) return;

  products.push({
    name: name.trim(),
    price: price.trim(),
    unit: unit.trim()
  });

  saveData();
  renderProducts();
}

function deleteProduct(index) {
  if (!confirm("Удалить товар?")) return;
  products.splice(index, 1);
  saveData();
  renderProducts();
}

// Настройки
$("menuBtn").addEventListener("click", () => {
  openPage("settings");
});

$("theme").addEventListener("change", event => {
  document.body.classList.toggle("dark", event.target.value === "dark");
  localStorage.setItem("ovardTheme", event.target.value);
});

const savedTheme = localStorage.getItem("ovardTheme") || "light";
$("theme").value = savedTheme;
document.body.classList.toggle("dark", savedTheme === "dark");

// Поиск
function searchProducts() {
  const query = $("searchInput").value.trim().toLowerCase();

  if (!query) {
    renderProducts();
    return;
  }

  const found = products.filter(product =>
    product.name.toLowerCase().includes(query)
  );

  $("ovardProducts").innerHTML = found.map(product => `
    <div class="product-card">
      <h3>${escapeHTML(product.name)}</h3>
      <p>${escapeHTML(product.price)} сомони / ${escapeHTML(product.unit)}</p>
    </div>
  `).join("") || "<p>Ничего не найдено.</p>";

  openPage("home");
}

$("searchSubmit").addEventListener("click", searchProducts);
$("searchBtn").addEventListener("click", () => $("searchInput").focus());
$("searchInput").addEventListener("keydown", event => {
  if (event.key === "Enter") searchProducts();
});

// Регистрация — пока начальная версия
$("registerBtn").addEventListener("click", () => {
  const name = prompt("Введите ваше имя:");
  if (!name || !name.trim()) return;

  localStorage.setItem("ovardUser", name.trim());
  renderProfile();
});

function renderProfile() {
  const name = localStorage.getItem("ovardUser");
  $("userProfile").innerHTML = name
    ? `<p>Здравствуйте, ${escapeHTML(name)}!</p>`
    : "<p>Вы пока не зарегистрированы.</p>";
}

// Инициализация
const addShopButton = document.createElement("button");
addShopButton.textContent = "+ Добавить магазин";
addShopButton.className = "admin-add-button";
addShopButton.onclick = addShop;
$("shopsPage").appendChild(addShopButton);

const addProductButton = document.createElement("button");
addProductButton.textContent = "+ Добавить товар OVARD";
addProductButton.className = "admin-add-button";
addProductButton.onclick = addProduct;
$("homePage").insertBefore(addProductButton, $("ovardProducts"));

renderShops();
renderProducts();
renderProfile();
