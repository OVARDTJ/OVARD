document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search input");
  const shopCards = document.querySelectorAll(".shop-card");
  const partnerButton = document.getElementById("partnerButton");

  // Ҷустуҷӯи мағозаҳо
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();

      shopCards.forEach(card => {
        card.style.display =
          card.textContent.toLowerCase().includes(query) ? "" : "none";
      });
    });
  }

  // Фармоиш дар дохили OVARD
  document.querySelectorAll(".order-button").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".shop-card");
      const shopName = card.querySelector("h3").textContent;

      document.querySelector(".order-modal")?.remove();

      const modal = document.createElement("div");
      modal.className = "order-modal";

      modal.innerHTML = `
        <div class="order-box">
          <button class="close-order" aria-label="Закрыть">×</button>
          <h2>Заказ в OVARD</h2>
          <p class="order-shop">${shopName}</p>

          <label for="customerName">Ваше имя</label>
          <input id="customerName" placeholder="Введите имя" required>

          <label for="customerPhone">Номер телефона</label>
          <input id="customerPhone" type="tel"
            placeholder="+992..." required>

          <label for="customerAddress">Адрес доставки</label>
          <input id="customerAddress"
            placeholder="Село, улица, ориентир" required>

          <label for="orderDetails">Что хотите заказать?</label>
          <textarea id="orderDetails"
            placeholder="Название товара и количество" required></textarea>

          <button class="submit-order">Оформить заказ</button>
          <p class="order-note">
            После оформления заказ сохранится на этом устройстве.
          </p>
        </div>
      `;

      document.body.appendChild(modal);
      document.body.style.overflow = "hidden";

      modal.querySelector(".close-order").onclick = () => {
        modal.remove();
        document.body.style.overflow = "";
      };

      modal.onclick = event => {
        if (event.target === modal) {
          modal.remove();
          document.body.style.overflow = "";
        }
      };

      modal.querySelector(".submit-order").onclick = () => {
        const name = modal.querySelector("#customerName").value.trim();
        const phone = modal.querySelector("#customerPhone").value.trim();
        const address = modal.querySelector("#customerAddress").value.trim();
        const details = modal.querySelector("#orderDetails").value.trim();

        if (!name || !phone || !address || !details) {
          alert("Пожалуйста, заполните все поля.");
          return;
        }

        const orders = JSON.parse(
          localStorage.getItem("ovard_orders") || "[]"
        );

        orders.push({
          id: Date.now(),
          shop: shopName,
          name,
          phone,
          address,
          details,
          date: new Date().toLocaleString("ru-RU"),
          status: "Новый заказ"
        });

        localStorage.setItem("ovard_orders", JSON.stringify(orders));

        modal.innerHTML = `
          <div class="order-box success-box">
            <h2>✓ Заказ сохранён!</h2>
            <p>Ваш заказ записан на этом устройстве.</p>
            <p><strong>Магазин:</strong> ${shopName}</p>
            <button class="submit-order finish-order">Закрыть</button>
          </div>
        `;

        modal.querySelector(".finish-order").onclick = () => {
          modal.remove();
          document.body.style.overflow = "";
        };
      };
    });
  });

  // Подключение магазина
  if (partnerButton) {
    partnerButton.onclick = () => {
      alert("Форма подключения магазинов появится в следующем обновлении.");
    };
  }

  // Сброс поиска
  document.querySelectorAll('a[href="#shops"]').forEach(link => {
    link.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      shopCards.forEach(card => card.style.display = "");
    });
  });
});
