document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.querySelector(".search input");
  const shopCards = document.querySelectorAll(".shop-card");

  // Поиск магазинов
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();

    shopCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? "" : "none";
    });
  });

  // Кнопка "Все магазины"
  document.querySelectorAll('a[href="#shops"]').forEach(link => {
    link.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      shopCards.forEach(card => card.style.display = "");
    });
  });

  console.log("OVARD запущен!");
});
