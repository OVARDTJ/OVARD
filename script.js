
const DB = {
  shops: JSON.parse(localStorage.getItem("ov_shops") || "[]"),
  products: JSON.parse(localStorage.getItem("ov_products") || "[]"),
  cart: JSON.parse(localStorage.getItem("ov_cart") || "[]"),
  orders: JSON.parse(localStorage.getItem("ov_orders") || "[]"),
  messages: JSON.parse(localStorage.getItem("ov_messages") || "[]")
};

let currentShop = null;

const ownProducts = [
  {id:"p1",name:"Орд",price:0,unit:"мешок",image:"https://images.unsplash.com/photo-1627485937980-221c88ac04f9?w=500",own:true},
  {id:"p2",name:"Комбикорм",price:0,unit:"кг",image:"https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500",own:true},
  {id:"p3",name:"Тухм",price:0,unit:"дона",image:"https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500",own:true},
  {id:"p4",name:"Нон",price:0,unit:"дона",image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500",own:true}
];

function save() {
  Object.keys(DB).forEach(k=>{
    localStorage.setItem("ov_"+k,JSON.stringify(DB[k]));
  });
}

const translations = {
  ru:{
    welcome:"Добро пожаловать",
    welcomeText:"Выбирайте товары и оформляйте заказ",
    ownProducts:"Наши товары",
    partnerShops:"Магазины-партнёры",
    allShops:"Все магазины →",
    shops:"Магазины",cart:"Корзина",
    orders:"Мои заказы",messages:"Сообщения",
    profile:"Профиль",settings:"Настройки",
    language:"Язык",fontSize:"Размер текста",
    theme:"Тема",account:"Аккаунт",
    help:"Помощь и информация",
    home:"Главная",checkout:"Оформить заказ"
  },
  tg:{
    welcome:"Хуш омадед",
    welcomeText:"Маҳсулотро интихоб кунед ва фармоиш диҳед",
    ownProducts:"Маҳсулоти мо",
    partnerShops:"Мағозаҳои шарик",
    allShops:"Ҳамаи мағозаҳо →",
    shops:"Мағозаҳо",cart:"Сабад",
    orders:"Фармоишҳои ман",messages:"Паёмҳо",
    profile:"Профил",settings:"Танзимот",
    language:"Забон",fontSize:"Андозаи матн",
    theme:"Намуди зоҳирӣ",account:"Ҳисоб",
    help:"Кӯмак ва маълумот",
    home:"Асосӣ",checkout:"Фармоиш додан"
  },
  uz:{
    welcome:"Xush kelibsiz",
    welcomeText:"Mahsulotlarni tanlang va buyurtma bering",
    ownProducts:"Bizning mahsulotlar",
    partnerShops:"Hamkor do‘konlar",
    allShops:"Barcha do‘konlar →",
    shops:"Do‘konlar",cart:"Savat",
    orders:"Buyurtmalarim",messages:"Xabarlar",
    profile:"Profil",settings:"Sozlamalar",
    language:"Til",fontSize:"Matn o‘lchami",
    theme:"Mavzu",account:"Hisob",
    help:"Yordam va ma’lumot",
    home:"Bosh sahifa",checkout:"Buyurtma berish"
  },
  en:{
    welcome:"Welcome",
    welcomeText:"Choose products and place your order",
    ownProducts:"Our products",
    partnerShops:"Partner shops",
    allShops:"All shops →",
    shops:"Shops",cart:"Cart",
    orders:"My orders",messages:"Messages",
    profile:"Profile",settings:"Settings",
    language:"Language",fontSize:"Text size",
    theme:"Theme",account:"Account",
    help:"Help and information",
    home:"Home",checkout:"Checkout"
  }
};

function renderLanguage(lang) {
  const dict = translations[lang] || translations.ru;
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key=el.dataset.i18n;
    if(dict[key]) el.textContent=dict[key];
  });
}

function settingsInit() {
  const lang=localStorage.getItem("ov_lang") || "ru";
  const font=localStorage.getItem("ov_font") || "medium";
  const theme=localStorage.getItem("ov_theme") || "light";

  languageSelect.value=lang;
  fontSelect.value=font;
  themeSelect.value=theme;

  renderLanguage(lang);
  document.body.classList.toggle("font-large",font==="large");
  applyTheme(theme);
}

function applyTheme(theme) {
  const dark=theme==="dark" ||
    (theme==="auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.body.classList.toggle("dark",dark);
}

languageSelect.addEventListener("change",e=>{
  localStorage.setItem("ov_lang",e.target.value);
  renderLanguage(e.target.value);
});

fontSelect.addEventListener("change",e=>{
  localStorage.setItem("ov_font",e.target.value);
  document.body.classList.toggle("font-large",e.target.value==="large");
});

themeSelect.addEventListener("change",e=>{
  localStorage.setItem("ov_theme",e.target.value);
  applyTheme(e.target.value);
});

function showPage(id) {
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const page=document.getElementById(id);
  if(page) page.classList.add("active");

  document.querySelectorAll(".bottom-nav button").forEach(b=>{
    b.classList.toggle("selected",b.dataset.open===id);
  });

  if(id==="shopsPage") renderShops();
  if(id==="cartPage") renderCart();
  if(id==="ordersPage") renderOrders();
  if(id==="messagesPage") renderMessages();
  if(id==="profilePage") renderProfile();
}

document.addEventListener("click",e=>{
  const btn=e.target.closest("[data-open]");
  if(btn) showPage(btn.dataset.open);
});

document.getElementById("searchOpen").onclick=()=>{
  document.getElementById("searchBox").classList.toggle("hidden");
  document.getElementById("searchInput").focus();
};

function productCard(p) {
  const div=document.createElement("article");
  div.className="product-card";

  const img=document.createElement("img");
  img.src=p.image || "";
  img.alt=p.name;
  img.loading="lazy";

  const name=document.createElement("h4");
  name.textContent=p.name;

  const price=document.createElement("div");
  price.className="product-price";
  price.textContent=p.price>0 ? p.price+" сомони / "+p.unit : "Уточнить цену";

  const add=document.createElement("button");
  add.textContent="В корзину";
  add.onclick=()=>addCart(p);

  div.append(img,name,price,add);
  return div;
}

function renderOwnProducts(filter="") {
  const box=document.getElementById("ownProducts");
  box.replaceChildren();

  ownProducts
    .filter(p=>p.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(p=>box.append(productCard(p)));
}

function renderTicker() {
  const box=document.getElementById("shopTicker");
  box.replaceChildren();

  const active=DB.shops.filter(s=>s.active!==false);
  if(!active.length) {
    box.textContent="Пока нет магазинов";
    return;
  }

  const names=[...active,...active];
  names.forEach(shop=>{
    const span=document.createElement("span");
    span.textContent=shop.name+"  •";
    span.onclick=()=>openShop(shop.id);
    box.append(span);
  });
}

function renderShops() {
  const box=document.getElementById("shopsList");
  box.replaceChildren();

  DB.shops.filter(s=>s.active!==false).forEach(shop=>{
    const card=document.createElement("div");
    card.className="shop-card";

    const info=document.createElement("div");
    const title=document.createElement("h3");
    title.textContent=shop.name;
    const desc=document.createElement("p");
    desc.textContent=shop.description || "Магазин-партнёр";
    info.append(title,desc);

    const arrow=document.createElement("span");
    arrow.textContent="›";
    card.append(info,arrow);
    card.onclick=()=>openShop(shop.id);
    box.append(card);
  });
}

function openShop(id) {
  currentShop=id;
  const shop=DB.shops.find(s=>s.id===id);
  if(!shop) return;

  document.getElementById("shopDetail").textContent=shop.name;
  const box=document.getElementById("shopProducts");
  box.replaceChildren();

  DB.products.filter(p=>p.shopId===id).forEach(p=>{
    box.append(productCard(p));
  });

  showPage("shopDetailPage");
}

function addCart(product) {
  const found=DB.cart.find(x=>x.id===product.id);
  if(found) found.qty++;
  else DB.cart.push({...product,qty:1});

  save();
  alert("Товар добавлен в корзину");
}

function renderCart() {
  const box=document.getElementById("cartItems");
  box.replaceChildren();
  let total=0;

  DB.cart.forEach(p=>{
    total+=Number(p.price)*p.qty;
    const row=document.createElement("div");
    row.className="cart-row";

    const info=document.createElement("span");
    info.textContent=p.name+" × "+p.qty;

    const price=document.createElement("b");
    price.textContent=(Number(p.price)*p.qty)+" сомони";

    const remove=document.createElement("button");
    remove.textContent="−";
    remove.onclick=()=>{
      p.qty--;
      if(p.qty<=0) DB.cart=DB.cart.filter(x=>x.id!==p.id);
      save();
      renderCart();
    };

    row.append(info,price,remove);
    box.append(row);
  });

  document.getElementById("cartTotal").textContent="Итого: "+total+" сомони";
}

document.getElementById("checkoutButton").onclick=()=>{
  if(!DB.cart.length) return alert("Корзина пуста");

  const name=prompt("Ваше имя:");
  if(!name) return;

  const phone=prompt("Ваш номер телефона:");
  if(!phone) return;

  const address=prompt("Адрес доставки:");
  if(!address) return;

  const order={
    id:Date.now(),
    name,phone,address,
    items:[...DB.cart],
    date:new Date().toLocaleString(),
    status:"Новый"
  };

  DB.orders.unshift(order);
  DB.cart=[];
  save();
  renderOrders();

  const lines=order.items.map(p=>
    p.name+" x "+p.qty+" — "+p.price+" сомони"
  ).join("\n");

  const text="Новый заказ\n"+
    "Имя: "+name+"\n"+
    "Телефон: "+phone+"\n"+
    "Адрес: "+address+"\n"+
    lines;

  window.open(
    "https://wa.me/992000001606?text="+encodeURIComponent(text),
    "_blank"
  );

  alert("Заказ сохранён на этом устройстве. Отправьте сообщение в WhatsApp.");
};

function renderOrders() {
  const box=document.getElementById("ordersList");
  box.replaceChildren();

  DB.orders.forEach(order=>{
    const card=document.createElement("div");
    card.className="order-card";
    const title=document.createElement("b");
    title.textContent="Заказ № "+order.id;
    const status=document.createElement("p");
    status.textContent="Статус: "+order.status;
    const date=document.createElement("p");
    date.textContent=order.date;
    card.append(title,status,date);
    box.append(card);
  });
}

function renderMessages() {
  const box=document.getElementById("messagesList");
  box.replaceChildren();

  DB.messages.forEach(m=>{
    const row=document.createElement("div");
    row.className="message-item";
    row.textContent=m.text+" · "+m.date;
    box.append(row);
  });
}

document.getElementById("sendMessage").onclick=()=>{
  const input=document.getElementById("messageInput");
  const text=input.value.trim();
  if(!text) return;

  DB.messages.push({
    text,
    date:new Date().toLocaleString()
  });
  save();
  input.value="";
  renderMessages();
};

function renderProfile() {
  const box=document.getElementById("profileContent");
  box.replaceChildren();

  const input=document.createElement("input");
  input.className="profile-input";
  input.placeholder="Ваше имя";
  input.value=localStorage.getItem("ov_name") || "";

  const phone=document.createElement("input");
  phone.className="profile-input";
  phone.placeholder="Номер телефона";
  phone.value=localStorage.getItem("ov_phone") || "";

  const saveBtn=document.createElement("button");
  saveBtn.className="primary-button";
  saveBtn.textContent="Сохранить";

  saveBtn.onclick=()=>{
    localStorage.setItem("ov_name",input.value);
    localStorage.setItem("ov_phone",phone.value);
    alert("Сохранено на этом устройстве");
  };

  box.append(input,phone,saveBtn);
}

document.getElementById("searchInput").addEventListener("input",e=>{
  renderOwnProducts(e.target.value);
});

settingsInit();
renderOwnProducts();
renderTicker();
renderShops();
renderCart();
