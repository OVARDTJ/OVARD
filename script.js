document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search input");
  const shopCards = document.querySelectorAll(".shop-card");
  const orderButtons = document.querySelectorAll(".order-button");
  const partnerButton = document.getElementById("partnerButton");

  // Ҷустуҷӯи мағозаҳо
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();

      shopCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? "" : "none";
      });
    });
  }

  // Тугмаҳои фармоиш
  orderButtons.forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".shop-card");
      const shopName = card.querySelector("h3").textContent;

      const message =
        "Здравствуйте! Хочу сделать заказ через OVARD.\nМагазин: " +
        shopName;

      const whatsappURL =
        "https://wa.me/?text=" + encodeURIComponent(message);

      window.open(whatsappURL, "_blank");
    });
  });

  // Пайваст шудан ба OVARD ҳамчун шарик
  if (partnerButton) {
    partnerButton.addEventListener("click", () => {
      const message =
        "Здравствуйте! Хочу подключить свой магазин к OVARD.";

      window.open(
        "https://wa.me/?text=" + encodeURIComponent(message),
        "_blank"
      );
    });
  }

  // Тоза кардани ҷустуҷӯ ҳангоми кушодани рӯйхати мағозаҳо
  document.querySelectorAll('a[href="#shops"]').forEach(link => {
    link.addEventListener("click", () => {
      if (searchInput) {
        searchInput.value = "";
      }

      shopCards.forEach(card => {
        card.style.display = "";
      });
    });
  });

  console.log("OVARD запущен!");
});
