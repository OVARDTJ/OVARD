
const KEY = "ovard_v2";
const defaults = {
  location: "Фархор, Таджикистан",
  shops: [
    {id:1,name:"Нонвойхона",desc:"Свежий хлеб и выпечка",photo:"🥖",active:true,products:[]},
    {id:2,name:"Магазин продуктов",desc:"Продукты питания",photo:"🛒",active:true,products:[]},
    {id:3,name:"Мясо и птица",desc:"Мясная продукция и яйца",photo:"🍗",active:true,products:[]},
    {id:4,name:"Аптека",desc:"Аптечные товары",photo:"✚",active:true,products:[]},
    {id:5,name:"Стройматериалы",desc:"Материалы для строительства",photo:"🧱",active:true,products:[]}
  ],
  cart: [],
  font: "normal",
  dark: false,
  language: "ru"
};
let data = JSON.parse(localStorage.getItem(KEY) || "null") || defaults;
function save(){localStorage.setItem(KEY,JSON.stringify(data));}
function toast(msg){
  const el=document.getElementById("toast");
  el.textContent=msg;el.classList.remove("hidden");
  setTimeout(()=>el.classList.add("hidden"),2400);
}
function renderShops(filter=""){
  const grid=document.getElementById("shopGrid");
  grid.innerHTML="";
  data.shops.filter(s=>s.active && s.name.toLowerCase().includes(filter.toLowerCase())).forEach(s=>{
    const card=document.createElement("button");
    card.className="shop-card";
    card.innerHTML=`<div class="shop-photo">${s.photo||"🏬"}</div><div class="shop-info"><strong>${s.name}</strong><small>${s.desc||"Магазин OVARD"}</small></div>`;
    card.onclick=()=>openShop(s.id);
    grid.appendChild(card);
  });
  if(!grid.children.length)grid.innerHTML="<p class='muted'>Магазины не найдены.</p>";
}
function openShop(id){
  const shop=data.shops.find(s=>s.id===id);if(!shop)return;
  document.getElementById("shopDetails").classList.remove("hidden");
  document.getElementById("shopTitle").textContent=shop.name;
  const grid=document.getElementById("productGrid");grid.innerHTML="";
  if(!shop.products.length)grid.innerHTML="<p class='muted'>Скоро здесь появятся товары этого магазина.</p>";
  shop.products.forEach((p,i)=>{
    const el=document.createElement("div");el.className="product-card";
    el.innerHTML=`<strong>${p.name}</strong><p>${p.price} сомонӣ / ${p.unit||"шт."}</p><button>Добавить в корзину</button>`;
    el.querySelector("button").onclick=()=>{data.cart.push({shop:shop.name,name:p.name,price:Number(p.price),unit:p.unit||"шт."});save();updateCart();toast("Добавлено в корзину");};
    grid.appendChild(el);
  });
  document.getElementById("shopDetails").scrollIntoView({behavior:"smooth"});
}
function updateCart(){
  document.getElementById("cartCount").textContent=data.cart.length;
}
function showCart(){
  document.getElementById("modalTitle").textContent="Корзина и оформление";
  const total=data.cart.reduce((a,b)=>a+b.price,0);
  let rows=data.cart.map((p,i)=>`<div class="cart-line"><span>${p.name}<small class="muted"> — ${p.shop}</small></span><b>${p.price} с.</b></div>`).join("");
  document.getElementById("modalContent").innerHTML=`
    ${rows||"<p class='muted'>Корзина пока пуста.</p>"}
    <p><b>Сумма товаров: ${total.toFixed(2)} сомонӣ</b></p>
    <p class="muted">Доставка оплачивается отдельно. Её стоимость зависит от веса заказа и расстояния по дороге. Окончательную сумму подтвердим перед доставкой.</p>
    <form id="orderForm">
      <label>Ваше имя</label><input name="name" required placeholder="Имя">
      <label>Телефон для связи</label><input name="phone" required placeholder="+992...">
      <label>Адрес доставки</label><input name="address" required placeholder="Улица, дом, ориентир">
      <label>Комментарий</label><input name="note" placeholder="Дополнительная информация">
      <button class="wide-btn" type="submit">Продолжить через WhatsApp</button>
    </form>`;
  document.getElementById("orderForm").onsubmit=sendOrder;
  document.getElementById("modal").classList.remove("hidden");
}
function sendOrder(e){
  e.preventDefault();
  if(!data.cart.length){toast("Сначала добавьте товары");return;}
  const f=new FormData(e.target);
  const total=data.cart.reduce((a,b)=>a+b.price,0);
  const items=data.cart.map(p=>`• ${p.name} — ${p.price} сомонӣ (${p.shop})`).join("\n");
  const msg=`Здравствуйте! Новый заказ OVARD:\n\n${items}\n\nСумма товаров: ${total} сомонӣ\nДоставка: рассчитать отдельно по весу и расстоянию.\n\nИмя: ${f.get("name")}\nТелефон: ${f.get("phone")}\nАдрес: ${f.get("address")}\nКомментарий: ${f.get("note")||"Нет"}`;
  window.open("https://wa.me/992000001606?text="+encodeURIComponent(msg),"_blank");
}
function openDrawer(){document.getElementById("drawer").classList.remove("hidden");}
document.getElementById("menuBtn").onclick=openDrawer;
document.getElementById("closeDrawer").onclick=()=>document.getElementById("drawer").classList.add("hidden");
document.getElementById("themeBtn").onclick=()=>{data.dark=!data.dark;document.body.classList.toggle("dark",data.dark);save();};
document.querySelectorAll("[data-font]").forEach(b=>b.onclick=()=>{
  data.font=b.dataset.font;document.body.classList.remove("font-large","font-xlarge");
  if(data.font==="large")document.body.classList.add("font-large");
  if(data.font==="xlarge")document.body.classList.add("font-xlarge");
  save();toast("Размер текста изменён");
});
document.getElementById("languageSelect").onchange=e=>{data.language=e.target.value;save();toast("Язык сохранён. Перевод интерфейса будет добавлен в следующей версии.");};
document.getElementById("searchBtn").onclick=()=>renderShops(document.getElementById("searchInput").value);
document.getElementById("searchInput").oninput=e=>renderShops(e.target.value);
document.getElementById("allShopsBtn").onclick=()=>document.getElementById("shops").scrollIntoView({behavior:"smooth"});
document.getElementById("backShops").onclick=()=>document.getElementById("shopDetails").classList.add("hidden");
document.getElementById("closeModal").onclick=()=>document.getElementById("modal").classList.add("hidden");
document.getElementById("locationBtn").onclick=()=>toast("Минтақаи фаъол: "+data.location);
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));b.classList.add("active");
  if(b.dataset.go==="shops")document.getElementById("shops").scrollIntoView({behavior:"smooth"});
  if(b.dataset.go==="cart")showCart();
  if(b.dataset.go==="profile")showProfile();
  if(b.dataset.go==="home")window.scrollTo({top:0,behavior:"smooth"});
});
function showProfile(){
  document.getElementById("modalTitle").textContent="Профиль OVARD";
  document.getElementById("modalContent").innerHTML=`<h3>Добро пожаловать в OVARD</h3><p>Ваши заказы оформляются через WhatsApp.</p><p class="muted">История заказов появится здесь после подключения общей базы заказов.</p>`;
  document.getElementById("modal").classList.remove("hidden");
}
function applySaved(){
  document.getElementById("locationText").textContent=data.location;
  document.body.classList.toggle("dark",data.dark);
  document.body.classList.toggle("font-large",data.font==="large");
  document.body.classList.toggle("font-xlarge",data.font==="xlarge");
  document.getElementById("languageSelect").value=data.language||"ru";
  renderShops();updateCart();
}
applySaved();
