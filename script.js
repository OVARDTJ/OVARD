// Исправление отображения магазинов OVARD
function renderShops() {
    const elements = document.querySelectorAll('[id="shops"]');

    // Первый элемент — страница, второй — список магазинов
    const container = elements.length > 1 ? elements[1] : elements[0];

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
