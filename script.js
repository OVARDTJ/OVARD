(() => {
  "use strict";

  const KEY = "ovard_v2";
  const WHATSAPP = "992000001606";

  const translations = {
    ru: {
      welcomeSmall:"ПОКУПКИ БЕЗ ЛИШНИХ ПОЕЗДОК",
      welcomeTitle:"Нужное — рядом.<br>Доставим к вам.",
      welcomeText:"Заказывайте товары из магазинов, а мы привезём их по вашему адресу.",
      startShopping:"Начать покупки",searchPlaceholder:"Найти товар или магазин",
      forYou:"ДЛЯ ВАС",ourProducts:"Товары овaрд",freshOffers:"Наши предложения",
      promoOneTag:"УДОБНО И ПРОСТО",promoOneTitle:"Покупки из магазинов",
      promoOneText:"Выбирайте нужное — доставку организуем мы.",
      viewShops:"Посмотреть магазины →",promoTwoTag:"ДОСТАВКА ПО АДРЕСУ",
      promoTwoTitle:"Не нужно выходить",
      promoTwoText:"Оформите заказ — привезём к вашей двери.",
      howDelivery:"Как работает доставка →",partners:"ПАРТНЁРЫ",
      shopsTitle:"Магазины",allShops:"Все магазины →",
      shopsHint:"Нажмите «Все магазины», чтобы посмотреть магазины и их товары.",
      openShops:"Открыть магазины",catalog:"КАТАЛОГ",
      popularProducts:"Популярные товары",back:"← Назад",
      deliveryTitle:"Доставка до вашего адреса",
      deliveryText:"Стоимость доставки рассчитывается отдельно — с учётом расстояния по дороге и веса заказа.",
      courierLabel:"СЕРВИС ОВАРД",courierTitle:"Доставка для каждого заказа",
      courierText:"Мы заберём покупки у продавца и доставим по указанному адресу.",
      navHome:"Главная",navShops:"Магазины",navCart:"Корзина",navProfile:"Профиль",
      settingsLabel:"ОВАРД",settingsTitle:"Настройки",languageLabel:"Язык",
      themeLabel:"Оформление",lightTheme:"Светлая",darkTheme:"Тёмная",
      fontLabel:"Размер текста",aboutText:"овард — покупки и доставка из магазинов.",
      adminLink:"Панель управления",yourOrder:"ВАШ ЗАКАЗ",cartTitle:"Корзина",
      productsTotal:"Товары:",deliverySeparate:"Доставка оплачивается отдельно. Стоимость уточняется по адресу и весу.",
      customerName:"Ваше имя",phoneLabel:"Номер телефона",addressLabel:"Адрес доставки",
      commentLabel:"Комментарий",sendOrder:"Отправить заказ в WhatsApp →",
      yourAccount:"ОВАРД",profileTitle:"Покупатель",
      profileText:"Укажите свои данные при оформлении заказа. Отдельная регистрация пока не требуется.",
      goToOrder:"Перейти к заказу",add:"Добавить",empty:"Пока нет товаров.",
      emptyCart:"Корзина пока пуста.",added:"Добавлено в корзину.",
      noShops:"Магазины пока не добавлены.",ownShop:"Магазин овард",
      deliveryInfo:"Стоимость доставки согласуется отдельно после уточнения адреса, расстояния по дороге и веса заказа.",
      orderHeader:"НОВЫЙ ЗАКАЗ — ОВАРД",
      orderName:"Имя",orderPhone:"Телефон",orderAddress:"Адрес",
      orderComment:"Комментарий",orderItems:"Товары",orderSum:"Сумма товаров",
      orderDelivery:"Доставка: оплачивается отдельно, уточнить по расстоянию и весу.",
      orderThanks:"Спасибо за заказ!"
    },
    tg: {
      welcomeSmall:"ХАРИД БЕЗ САФАРҲОИ ЗИЁДАТӢ",
      welcomeTitle:"Чизи лозим — наздик.<br>Ба назди шумо мерасонем.",
      welcomeText:"Аз мағозаҳо мол фармоиш диҳед, мо онро ба суроғаи шумо меорем.",
      startShopping:"Харидро оғоз кардан",searchPlaceholder:"Мол ё мағозаро ҷустуҷӯ кунед",
      forYou:"БАРОИ ШУМО",ourProducts:"Маҳсулоти овард",freshOffers:"Пешниҳодҳои мо",
      promoOneTag:"ОСОН ВА ҚУЛАЙ",promoOneTitle:"Харид аз мағозаҳо",
      promoOneText:"Моли лозимаро интихоб кунед — расониданро мо ташкил мекунем.",
      viewShops:"Дидани мағозаҳо →",promoTwoTag:"РАСОНИДАН БА СУРОҒА",
      promoTwoTitle:"Ба берун баромадан лозим нест",
      promoTwoText:"Фармоиш диҳед — то назди дари хона меорем.",
      howDelivery:"Тарзи расонидан →",partners:"ШАРИКОН",
      shopsTitle:"Мағозаҳо",allShops:"Ҳамаи мағозаҳо →",
      shopsHint:"Барои дидани мағозаҳо ва молҳои онҳо тугмаи «Ҳамаи мағозаҳо»-ро пахш кунед.",
      openShops:"Кушодани мағозаҳо",catalog:"ФЕҲРИСТ",
      popularProducts:"Молҳои маъмул",back:"← Бозгашт",
      deliveryTitle:"Расонидан ба суроғаи шумо",
      deliveryText:"Нархи расонидан алоҳида, бо назардошти масофаи роҳ ва вазни фармоиш ҳисоб карда мешавад.",
      courierLabel:"ХИЗМАТРАСОНИИ ОВАРД",courierTitle:"Расонидани ҳар фармоиш",
      courierText:"Молро аз фурӯшанда гирифта, ба суроғаи нишондодаи шумо мерасонем.",
      navHome:"Асосӣ",navShops:"Мағозаҳо",navCart:"Сабад",navProfile:"Профил",
      settingsLabel:"ОВАРД",settingsTitle:"Танзимот",languageLabel:"Забон",
      themeLabel:"Намуди зоҳирӣ",lightTheme:"Равшан",darkTheme:"Торик",
      fontLabel:"Андозаи матн",aboutText:"овард — харид ва расонидан аз мағозаҳо.",
      adminLink:"Панели идоракунӣ",yourOrder:"ФАРМОИШИ ШУМО",cartTitle:"Сабад",
      productsTotal:"Молҳо:",deliverySeparate:"Пули расонидан алоҳида аст. Он аз рӯйи суроға ва вазн муайян мешавад.",
      customerName:"Номи шумо",phoneLabel:"Рақами телефон",addressLabel:"Суроғаи расонидан",
      commentLabel:"Шарҳ",sendOrder:"Фиристодани фармоиш ба WhatsApp →",
      yourAccount:"ОВАРД",profileTitle:"Харидор",
      profileText:"Ҳангоми фармоиш маълумоти худро нависед. Ҳоло бақайдгирии алоҳида лозим нест.",
      goToOrder:"Ба фармоиш гузаштан",add:"Илова кардан",empty:"Ҳоло мол нест.",
      emptyCart:"Сабад ҳоло холӣ аст.",added:"Ба сабад илова шуд.",
      noShops:"Ҳоло мағоза илова нашудааст.",ownShop:"Мағозаи овард",
      deliveryInfo:"Нархи расонидан баъди муайян кардани суроға, масофаи роҳ ва вазни фармоиш алоҳида мувофиқа мешавад.",
      orderHeader:"ФАРМОИШИ НАВ — ОВАРД",
      orderName:"Ном",orderPhone:"Телефон",orderAddress:"Суроға",
      orderComment:"Шарҳ",orderItems:"Молҳо",orderSum:"Ҷамъи молҳо",
      orderDelivery:"Расонидан: алоҳида, мувофиқи масофа ва вазн муайян карда мешавад.",
      orderThanks:"Барои фармоиш ташаккур!"
    },
    uz: {
      welcomeSmall:"ORTIQCHA YO‘L YURMASDAN XARID",
      welcomeTitle:"Kerakli narsa — yaqin.<br>Sizga yetkazamiz.",
      welcomeText:"Do‘konlardan mahsulot tanlang, biz manzilingizga yetkazamiz.",
      startShopping:"Xaridni boshlash",searchPlaceholder:"Mahsulot yoki do‘konni qidiring",
      forYou:"SIZ UCHUN",ourProducts:"овард mahsulotlari",freshOffers:"Takliflarimiz",
      promoOneTag:"QULAY VA OSON",promoOneTitle:"Do‘konlardan xarid",
      promoOneText:"Kerakli mahsulotni tanlang — yetkazishni biz tashkil qilamiz.",
      viewShops:"Do‘konlarni ko‘rish →",promoTwoTag:"MANZILGA YETKAZISH",
      promoTwoTitle:"Tashqariga chiqish shart emas",
      promoTwoText:"Buyurtma bering — eshigingizgacha olib boramiz.",
      howDelivery:"Yetkazish qanday ishlaydi →",partners:"HAMKORLAR",
      shopsTitle:"Do‘konlar",allShops:"Barcha do‘konlar →",
      shopsHint:"Do‘konlar va mahsulotlarini ko‘rish uchun «Barcha do‘konlar» tugmasini bosing.",
      openShops:"Do‘konlarni ochish",catalog:"KATALOG",
      popularProducts:"Mashhur mahsulotlar",back:"← Orqaga",
      deliveryTitle:"Manzilingizga yetkazish",
      deliveryText:"Yetkazish narxi yo‘l masofasi va buyurtma og‘irligiga qarab alohida hisoblanadi.",
      courierLabel:"ОВАРД XIZMATI",courierTitle:"Har bir buyurtma uchun yetkazish",
      courierText:"Xaridni sotuvchidan olib, ko‘rsatilgan manzilga yetkazamiz.",
      navHome:"Bosh sahifa",navShops:"Do‘konlar",navCart:"Savat",navProfile:"Profil",
      settingsLabel:"ОВАРД",settingsTitle:"Sozlamalar",languageLabel:"Til",
      themeLabel:"Ko‘rinish",lightTheme:"Yorug‘",darkTheme:"Qorong‘i",
      fontLabel:"Matn o‘lchami",aboutText:"овард — do‘konlardan xarid va yetkazish.",
      adminLink:"Boshqaruv paneli",yourOrder:"BUYURTMANGIZ",cartTitle:"Savat",
      productsTotal:"Mahsulotlar:",deliverySeparate:"Yetkazish alohida to‘lanadi. Narx manzil va og‘irlikka qarab aniqlanadi.",
      customerName:"Ismingiz",phoneLabel:"Telefon raqami",addressLabel:"Yetkazish manzili",
      commentLabel:"Izoh",sendOrder:"WhatsApp orqali buyurtma yuborish →",
      yourAccount:"ОВАРД",profileTitle:"Xaridor",
      profileText:"Buyurtma berishda ma’lumotlaringizni kiriting. Hozircha alohida ro‘yxatdan o‘tish shart emas.",
      goToOrder:"Buyurtmaga o‘tish",add:"Qo‘shish",empty:"Hozircha mahsulot yo‘q.",
      emptyCart:"Savat hozircha bo‘sh.",added:"Savatga qo‘shildi.",
      noShops:"Hozircha do‘kon qo‘shilmagan.",ownShop:"овард do‘koni",
      deliveryInfo:"Yetkazish narxi manzil, yo‘l masofasi va buyurtma og‘irligi aniqlangach kelishiladi.",
      orderHeader:"YANGI BUYURTMA — ОВАРД",
      orderName:"Ism",orderPhone:"Telefon",orderAddress:"Manzil",
      orderComment:"Izoh",orderItems:"Mahsulotlar",orderSum:"Mahsulotlar jami",
      orderDelivery:"Yetkazish: masofa va og‘irlik bo‘yicha alohida aniqlanadi.",
      orderThanks:"Buyurtmangiz uchun rahmat!"
    },
    en: {
      welcomeSmall:"SHOP WITHOUT EXTRA TRIPS",
      welcomeTitle:"What you need is near.<br>We bring it to you.",
      welcomeText:"Choose products from local shops and we will deliver them to your address.",
      startShopping:"Start shopping",searchPlaceholder:"Search products or shops",
      forYou:"FOR YOU",ourProducts:"овард products",freshOffers:"Our offers",
      promoOneTag:"SIMPLE AND EASY",promoOneTitle:"Shop from local stores",
      promoOneText:"Choose what you need — we arrange the delivery.",
      viewShops:"View shops →",promoTwoTag:"DELIVERY TO YOUR ADDRESS",
      promoTwoTitle:"No need to go out",
      promoTwoText:"Place an order and we will bring it to your door.",
      howDelivery:"How delivery works →",partners:"PARTNERS",
      shopsTitle:"Shops",allShops:"All shops →",
      shopsHint:"Tap “All shops” to view shops and their products.",
      openShops:"Open shops",catalog:"CATALOG",
      popularProducts:"Popular products",back:"← Back",
      deliveryTitle:"Delivery to your address",
      deliveryText:"Delivery is priced separately according to road distance and order weight.",
      courierLabel:"ОВАРД SERVICE",courierTitle:"Delivery for every order",
      courierText:"We collect your purchases from the seller and deliver them to your address.",
      navHome:"Home",navShops:"Shops",navCart:"Cart",navProfile:"Profile",
      settingsLabel:"ОВАРД",settingsTitle:"Settings",languageLabel:"Language",
      themeLabel:"Appearance",lightTheme:"Light",darkTheme:"Dark",
      fontLabel:"Text size",aboutText:"овард — shopping and delivery from local stores.",
      adminLink:"Admin panel",yourOrder:"YOUR ORDER",cartTitle:"Cart",
      productsTotal:"Products:",deliverySeparate:"Delivery is charged separately. The cost is confirmed according to address and weight.",
      customerName:"Your name",phoneLabel:"Phone number",addressLabel:"Delivery address",
      commentLabel:"Comment",sendOrder:"Send order to WhatsApp →",
      yourAccount:"ОВАРД",profileTitle:"Customer",
      profileText:"Enter your details when placing an order. Separate registration is not required yet.",
      goToOrder:"Continue to order",add:"Add",empty:"No products yet.",
      emptyCart:"Your cart is empty.",added:"Added to cart.",
      noShops:"No shops have been added yet.",ownShop:"овард shop",
      deliveryInfo:"Delivery cost is agreed separately after confirming the address, road distance and order weight.",
      orderHeader:"NEW ORDER — ОВАРД",
      orderName:"Name",orderPhone:"Phone",orderAddress:"Address",
      orderComment:"Comment",orderItems:"Products",orderSum:"Products total",
      orderDelivery:"Delivery: charged separately according to distance and weight.",
      orderThanks:"Thank you for your order!"
    }
  };

  function defaultData() {
    return {
      location:"Фархор, Таджикистан",
      language:"ru",
      dark:false,
      font:"normal",
      shops:[{
        id:"ovard-own",
        name:"Магазин овард",
        description:"Товары собственного магазина",
        icon:"O",
        active:true,
        own:true,
        products:[]
      }],
      cart:[]
    };
  }

  function loadData() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(KEY) || "null"); } catch(e) {}
    const base = defaultData();
    if (!saved || typeof saved !== "object") return base;

    const data = {...base,...saved};
    if (!Array.isArray(data.shops)) data.shops = [];
    if (!Array.isArray(data.cart)) data.cart = [];

    let own = data.shops.find(s => s.own || s.id === "ovard-own");
    if (!own) {
      own = base.shops[0];
      data.shops.unshift(own);
    } else {
      own.own = true;
      own.id = own.id || "ovard-own";
      own.name = "Магазин овард";
      own.products = Array.isArray(own.products) ? own.products : [];
    }
    data.shops = [own,...data.shops.filter(s => s !== own)];
    return data;
  }

  let data = loadData();
  let currentShopId = null;
  let shopsVisible = false;
  let searchTerm = "";

  const $ = id => document.getElementById(id);
  const t = key => (translations[data.language] || translations.ru)[key] || translations.ru[key] || key;

  function save() {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    })[char]);
  }

  function money(value) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toLocaleString("ru-RU") + " смн." : String(value || "");
  }

  function applySettings() {
    document.body.classList.toggle("dark", !!data.dark);
    document.body.classList.toggle("font-large", data.font === "large");
    document.body.classList.toggle("font-xlarge", data.font === "xlarge");
    document.documentElement.lang = data.language || "ru";

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      if (translations[data.language]?.[key]) el.innerHTML = translations[data.language][key];
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (translations[data.language]?.[key]) el.placeholder = translations[data.language][key];
    });

    $("languageSelect").value = data.language;
    document.querySelectorAll("[data-theme-choice]").forEach(btn => {
      btn.classList.toggle("selected", btn.dataset.themeChoice === (data.dark ? "dark" : "light"));
    });
    document.querySelectorAll("[data-font]").forEach(btn => {
      btn.classList.toggle("selected", btn.dataset.font === data.font);
    });
    $("locationText").textContent = data.location || "Фархор, Таджикистан";
    $("productsTitle").textContent = currentShopId
      ? (data.shops.find(s => s.id === currentShopId)?.name || t("popularProducts"))
      : t("popularProducts");
  }

  function renderShops() {
    const list = $("shopList");
    const shops = data.shops.filter(s => s.active !== false);
    if (!shops.length) {
      list.innerHTML = `<div class="empty-products">${escapeHTML(t("noShops"))}</div>`;
      return;
    }

    list.innerHTML = shops.map(shop => `
      <article class="shop-card">
        <div class="shop-thumb">${escapeHTML(shop.icon || (shop.own ? "O" : "▤"))}</div>
        <div class="shop-details">
          <h3>${escapeHTML(shop.name)}</h3>
          <p>${escapeHTML(shop.description || "")}</p>
        </div>
        <button class="shop-open" data-open-shop="${escapeHTML(shop.id)}">${escapeHTML(t("viewShops").replace(" →",""))}</button>
      </article>
    `).join("");
  }

  function renderProducts() {
    const grid = $("productGrid");
    const own = data.shops.find(s => s.own) || data.shops[0];
    const shop = currentShopId
      ? data.shops.find(s => s.id === currentShopId)
      : own;

    $("productsTitle").textContent = currentShopId
      ? (shop?.name || t("popularProducts"))
      : t("popularProducts");

    $("backToShops").classList.toggle("hidden", !currentShopId);

    let products = (shop?.products || []).filter(p => p.available !== false);
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      products = products.filter(p =>
        `${p.name} ${p.description || ""} ${p.unit || ""}`.toLowerCase().includes(term)
      );
    }

    if (!products.length) {
      grid.innerHTML = `<div class="empty-products">${escapeHTML(searchTerm ? t("empty") : t("empty"))}</div>`;
      return;
    }

    grid.innerHTML = products.map((p, index) => {
      const productId = p.id || `${shop.id}-${index}`;
      const symbol = p.image
        ? `<img src="${escapeHTML(p.image)}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:12px">`
        : `<span>${escapeHTML(p.icon || "▧")}</span>`;
      return `
        <article class="product-card">
          <div class="product-symbol">${symbol}</div>
          <h3>${escapeHTML(p.name)}</h3>
          <div class="product-unit">${escapeHTML(p.unit || "")}</div>
          ${p.weight ? `<div class="product-unit">${escapeHTML(p.weight)}</div>` : ""}
          <div class="product-price">${escapeHTML(money(p.price))}</div>
          <button class="add-button" data-add-product="${escapeHTML(productId)}" data-shop-id="${escapeHTML(shop.id)}">${escapeHTML(t("add"))} +</button>
        </article>
      `;
    }).join("");
  }

  function renderAll() {
    applySettings();
    renderShops();
    renderProducts();
    renderCartCount();
    $("shopsHint").classList.toggle("hidden", shopsVisible);
    $("shopList").classList.toggle("hidden", !shopsVisible);
  }

  function renderCartCount() {
    const count = data.cart.reduce((sum,item) => sum + Number(item.qty || 1),0);
    $("cartCount").textContent = count;
  }

  function addToCart(shopId, productId) {
    const shop = data.shops.find(s => s.id === shopId);
    const product = shop?.products?.find((p,index) => (p.id || `${shop.id}-${index}`) === productId);
    if (!shop || !product) return;

    const key = `${shopId}_${productId}`;
    const existing = data.cart.find(item => item.key === key);
    if (existing) existing.qty += 1;
    else data.cart.push({
      key,shopId,productId,
      name:product.name,
      price:Number(product.price) || 0,
      unit:product.unit || "",
      qty:1
    });

    save();
    renderCartCount();
    showToast(t("added"));
  }

  function renderCart() {
    const container = $("cartItems");
    if (!data.cart.length) {
      container.innerHTML = `<div class="empty-products">${escapeHTML(t("emptyCart"))}</div>`;
      $("cartTotal").textContent = money(0);
      return;
    }

    container.innerHTML = data.cart.map(item => `
      <div class="cart-row">
        <div>
          <strong>${escapeHTML(item.name)}</strong>
          <small>${escapeHTML(money(item.price))} · ${escapeHTML(item.unit || "")}</small>
        </div>
        <div class="quantity-control">
          <button data-cart-minus="${escapeHTML(item.key)}">−</button>
          <b>${Number(item.qty || 1)}</b>
          <button data-cart-plus="${escapeHTML(item.key)}">+</button>
        </div>
      </div>
    `).join("");

    const total = data.cart.reduce((sum,item) => sum + Number(item.price || 0) * Number(item.qty || 1),0);
    $("cartTotal").textContent = money(total);
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"),2300);
  }

  function openLayer(element) {
    $("overlay").classList.remove("hidden");
    element.classList.remove("hidden");
  }

  function closeLayers() {
    $("overlay").classList.add("hidden");
    ["settingsDrawer","cartModal","profileModal","infoModal"].forEach(id => $(id).classList.add("hidden"));
  }

  function openCart() {
    renderCart();
    openLayer($("cartModal"));
  }

  function showInfo(title,text) {
    $("infoTitle").textContent = title;
    $("infoText").textContent = text;
    openLayer($("infoModal"));
  }

  function showAllShops() {
    shopsVisible = true;
    currentShopId = null;
    renderAll();
    $("shopsSection").scrollIntoView({behavior:"smooth",block:"start"});
  }

  function goHome() {
    currentShopId = null;
    shopsVisible = false;
    searchTerm = "";
    $("searchInput").value = "";
    renderAll();
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function sendOrder(event) {
    event.preventDefault();
    if (!data.cart.length) {
      showToast(t("emptyCart"));
      return;
    }

    const form = new FormData(event.target);
    const name = String(form.get("customer") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const address = String(form.get("address") || "").trim();
    const comment = String(form.get("comment") || "").trim();

    if (!name || !phone || !address) return;

    const total = data.cart.reduce((sum,item) => sum + Number(item.price || 0) * Number(item.qty || 1),0);
    const lines = [
      t("orderHeader"),
      "",
      `${t("orderName")}: ${name}`,
      `${t("orderPhone")}: ${phone}`,
      `${t("orderAddress")}: ${address}`,
      `${t("orderComment")}: ${comment || "—"}`,
      "",
      `${t("orderItems")}:`,
      ...data.cart.map(item => `• ${item.name} — ${item.qty} × ${item.price} = ${item.qty * item.price} смн.`),
      "",
      `${t("orderSum")}: ${money(total)}`,
      t("orderDelivery"),
      "",
      t("orderThanks")
    ];

    const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines.join("\n"))}`;
    window.open(url,"_blank");

    data.cart = [];
    save();
    renderCartCount();
    closeLayers();
    event.target.reset();
  }

  $("menuButton").addEventListener("click",() => openLayer($("settingsDrawer")));
  $("closeDrawer").addEventListener("click",closeLayers);
  $("closeCart").addEventListener("click",closeLayers);
  $("closeProfile").addEventListener("click",closeLayers);
  $("closeInfo").addEventListener("click",closeLayers);
  $("overlay").addEventListener("click",closeLayers);

  $("languageSelect").addEventListener("change",event => {
    data.language = event.target.value;
    save();
    renderAll();
  });

  document.querySelectorAll("[data-theme-choice]").forEach(button => {
    button.addEventListener("click",() => {
      data.dark = button.dataset.themeChoice === "dark";
      save();
      renderAll();
    });
  });

  document.querySelectorAll("[data-font]").forEach(button => {
    button.addEventListener("click",() => {
      data.font = button.dataset.font;
      save();
      renderAll();
    });
  });

  $("allShopsButton").addEventListener("click",showAllShops);
  $("showShopsButton").addEventListener("click",showAllShops);
  $("promoShops").addEventListener("click",showAllShops);
  $("startShopping").addEventListener("click",() => {
    $("productsHeading").scrollIntoView({behavior:"smooth"});
  });

  $("promoDelivery").addEventListener("click",() => {
    showInfo(t("deliveryTitle"),t("deliveryInfo"));
  });

  $("locationButton").addEventListener("click",() => {
    showInfo("Фархор, Таджикистан","Сейчас зона запуска — Фархор. Регион обслуживания можно изменить через панель управления.");
  });

  $("backToShops").addEventListener("click",() => {
    currentShopId = null;
    renderProducts();
    $("shopsSection").scrollIntoView({behavior:"smooth"});
  });

  $("shopList").addEventListener("click",event => {
    const button = event.target.closest("[data-open-shop]");
    if (!button) return;
    currentShopId = button.dataset.openShop;
    renderProducts();
    $("productsHeading").scrollIntoView({behavior:"smooth"});
  });

  $("productGrid").addEventListener("click",event => {
    const button = event.target.closest("[data-add-product]");
    if (!button) return;
    addToCart(button.dataset.shopId,button.dataset.addProduct);
  });

  $("searchInput").addEventListener("input",event => {
    searchTerm = event.target.value.trim();
    renderProducts();
  });

  $("clearSearch").addEventListener("click",() => {
    $("searchInput").value = "";
    searchTerm = "";
    renderProducts();
  });

  $("cartCount").parentElement.addEventListener("click",openCart);
  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click",() => {
      document.querySelectorAll(".nav-item").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      const page = button.dataset.page;
      if (page === "home") goHome();
      if (page === "shops") showAllShops();
      if (page === "cart") openCart();
      if (page === "profile") openLayer($("profileModal"));
    });
  });

  $("profileOrderButton").addEventListener("click",() => {
    closeLayers();
    openCart();
  });

  $("cartItems").addEventListener("click",event => {
    const plus = event.target.closest("[data-cart-plus]");
    const minus = event.target.closest("[data-cart-minus]");
    if (!plus && !minus) return;
    const key = (plus || minus).dataset.cartPlus || (plus || minus).dataset.cartMinus;
    const item = data.cart.find(row => row.key === key);
    if (!item) return;
    if (plus) item.qty += 1;
    if (minus) {
      item.qty -= 1;
      if (item.qty <= 0) data.cart = data.cart.filter(row => row.key !== key);
    }
    save();
    renderCart();
    renderCartCount();
  });

  $("checkoutForm").addEventListener("submit",sendOrder);

  // Агар дар версияи пешина маълумот бошад, онро нигоҳ медорем.
  save();
  renderAll();
})();
