// OVARD — основной код

let products = JSON.parse(localStorage.getItem("ovard_products") || "[]");
let shops = JSON.parse(localStorage.getItem("ovard_shops") || "[]");
let cart = JSON.parse(localStorage.getItem("ovard_cart") || "[]");
let orders = JSON.parse(localStorage.getItem("ovard_orders") || "[]");

let customer = JSON.parse(localStorage.getItem("ovard_customer") || "{}");

function saveData() {
    localStorage.setItem("ovard_products", JSON.stringify(products));
    localStorage.setItem("ovard_shops", JSON.stringify(shops));
    localStorage.setItem("ovard_cart", JSON.stringify(cart));
    localStorage.setItem("ovard_orders", JSON.stringify(orders));
    localStorage.setItem("ovard_customer", JSON.stringify(customer));
}

function showPage(page) {
    document.querySelectorAll(".page").forEach(el => {
        el.classList.add("hidden");
    });

    const selected = document.getElementById(page);
    if (selected) selected.classList.remove("hidden");

    document.querySelectorAll(".bottom button").forEach(btn => {
        btn.classList.remove("active");
    });

    renderAll();
}

function toggleOther(value) {
    const field = document.getElementById("otherUnit");
    if (field) {
        field.classList.toggle("hidden", value !== "other");
    }
}

function addProduct() {
    const name = document.getElementById("pName")?.value.trim();
    const price = Number(document.getElementById("pPrice")?.value);
    const selectedUnit = document.getElementById("pUnit")?.value;
    const customUnit = document.getElementById("otherUnit")?.value.trim();

    const unit = selectedUnit === "other" ? customUnit : selectedUnit;

    if (!name || !Number.isFinite(price) || price <= 0 || !unit) {
        alert("Заполните название, цену и единицу измерения");
        return;
    }

    products.push({
        id: Date.now(),
        name,
        price,
        unit
    });

    saveData();
    renderAll();

    document.getElementById("pName").value = "";
    document.getElementById("pPrice").value = "";
    if (document.getElementById("otherUnit")) {
        document.getElementById("otherUnit").value = "";
    }

    alert("Товар добавлен");
}

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    saveData();
    renderAll();
}

function addShop() {
    const name = document.getElementById("shopName")?.value.trim();
    const description = document.getElementById("shopDescription")?.value.trim();

    if (!name) {
        alert("Введите название магазина");
        return;
    }

    shops.push({
        id: Date.now(),
        name,
        description,
        products: []
    });

    saveData();
    renderAll();

    document.getElementById("shopName").value = "";
    document.getElementById("shopDescription").value = "";

    alert("Магазин добавлен");
}

function deleteShop(id) {
    shops = shops.filter(shop => shop.id !== id);
    saveData();
    renderAll();
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    const item = cart.find(p => p.id === id);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            quantity: 1
        });
    }

    saveData();
    renderAll();
    alert("Добавлено в корзину");
}

function changeQuantity(id, amount) {
    const item = cart.find(p => p.id === id);
    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
    }

    saveData();
    renderAll();
}

function removeFromCart(id) {
    cart = cart.filter(p => p.id !== id);
    saveData();
    renderAll();
}

function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function makeOrder() {
    if (cart.length === 0) {
        alert("Корзина пуста");
        return;
    }

    const name = customer.name || document.getElementById("customerName")?.value.trim();
    const phone = customer.phone || document.getElementById("customerPhone")?.value.trim();
    const address = customer.address || document.getElementById("customerAddress")?.value.trim();

    if (!name || !phone || !address) {
        alert("Сначала заполните профиль");
        showPage("profile");
        return;
    }

    const order = {
        id: Date.now(),
        date: new Date().toLocaleString("ru-RU"),
        name,
        phone,
        address,
        items: [...cart],
        total: cartTotal(),
        status: "Новый заказ"
    };

    orders.unshift(order);
    cart = [];

    saveData();
    renderAll();

    alert("Заказ оформлен!");
    showPage("orders");
}

function saveProfile() {
    customer = {
        name: document.getElementById("customerName")?.value.trim() || "",
        phone: document.getElementById("customerPhone")?.value.trim() || "",
        address: document.getElementById("customerAddress")?.value.trim() || ""
    };

    saveData();
    alert("Профиль сохранён");
}

function changeTheme(value) {
    document.body.classList.toggle("dark", value === "dark");
    localStorage.setItem("ovard_theme", value);
}

function renderProducts() {
    const container = document.getElementById("products");
    if (!container) return;

    if (!products.length) {
        container.innerHTML = "<p>Пока товаров нет</p>";
        return;
    }

    container.innerHTML = products.map(p => `
        <div class="product">
            <h3>${escapeHTML(p.name)}</h3>
            <p>${p.price} сомони / ${escapeHTML(p.unit)}</p>
            <button onclick="addToCart(${p.id})">В корзину</button>
            <button onclick="deleteProduct(${p.id})">Удалить</button>
        </div>
    `).join("");
}

function renderShops() {
    const container = document.getElementById("shopsList");
    if (!container) return;

    if (!shops.length) {
        container.innerHTML = "<p>Пока магазинов нет</p>";
        return;
    }

    container.innerHTML = shops.map(shop => `
        <div class="shop">
            <h3>${escapeHTML(shop.name)}</h3>
            <p>${escapeHTML(shop.description || "")}</p>
            <button onclick="deleteShop(${shop.id})">Удалить</button>
        </div>
    `).join("");
}

function renderCart() {
    const container = document.getElementById("cartItems");
    if (!container) return;

    if (!cart.length) {
        container.innerHTML = "<p>Корзина пуста</p>";
        return;
    }

    container.innerHTML = cart.map(item => `
        <div class="product">
            <h3>${escapeHTML(item.name)}</h3>
            <p>${item.price} сомони / ${escapeHTML(item.unit)}</p>
            <button onclick="changeQuantity(${item.id}, -1)">−</button>
            ${item.quantity}
            <button onclick="changeQuantity(${item.id}, 1)">+</button>
            <button onclick="removeFromCart(${item.id})">Удалить</button>
        </div>
    `).join("") + `
        <h3>Итого: ${cartTotal()} сомони</h3>
        <button onclick="makeOrder()">Оформить заказ</button>
        <p>Доставка оплачивается отдельно. Стоимость зависит от расстояния и веса товара.</p>
    `;
}

function renderOrders() {
    const container = document.getElementById("ordersList");
    if (!container) return;

    if (!orders.length) {
        container.innerHTML = "<p>Заказов пока нет</p>";
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="product">
            <h3>Заказ №${order.id}</h3>
            <p>${escapeHTML(order.date)}</p>
            <p>Статус: ${escapeHTML(order.status)}</p>
            <p>Сумма: ${order.total} сомони</p>
            <p>Адрес: ${escapeHTML(order.address)}</p>
        </div>
    `).join("");
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

function renderAll() {
    renderProducts();
    renderShops();
    renderCart();
    renderOrders();
}

function loadSettings() {
    const theme = localStorage.getItem("ovard_theme") || "light";
    document.body.classList.toggle("dark", theme === "dark");

    if (customer.name) document.getElementById("customerName").value = customer.name;
    if (customer.phone) document.getElementById("customerPhone").value = customer.phone;
    if (customer.address) document.getElementById("customerAddress").value = customer.address;
}

document.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    renderAll();
});
