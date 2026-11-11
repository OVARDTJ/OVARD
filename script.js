const KEY = "ovard_v2";

const defaults = {
 location:"Фархор, Таджикистан",
 shops:[
  {id:1,name:"Нонвойхона",desc:"Свежий хлеб и выпечка",photo:"🥖",image:"",active:true,products:[]},
  {id:2,name:"Магазин продуктов",desc:"Продукты питания",photo:"🛒",image:"",active:true,products:[]},
  {id:3,name:"Мясо и птица",desc:"Мясная продукция и яйца",photo:"🍗",image:"",active:true,products:[]},
  {id:4,name:"Аптека",desc:"Аптечные товары",photo:"✚",image:"",active:true,products:[]},
  {id:5,name:"Стройматериалы",desc:"Материалы для строительства",photo:"🧱",image:"",active:true,products:[]}
 ],
 cart:[],
 orders:[],
 font:"normal",
 dark:false,
 language:"ru",
 checkout:{
  whatsapp:true,
  website:true,
  phone:true,
  phoneNumber:"+992000001606"
 },
 payments:[
  {id:1,name:"Наличными при получении",details:"",active:true},
  {id:2,name:"Alif",details:"Реквизиты уточняются",active:false}
 ]
};

let data;
try {
 data=JSON.parse(localStorage.getItem(KEY)) || structuredClone(defaults);
} catch(e) {
 data=JSON.parse(JSON.stringify(defaults));
}

data.shops ||= [];
data.cart ||= [];
data.orders ||= [];
data.checkout ||= {...defaults.checkout};
data.payments ||= [...defaults.payments];

function save(){
 localStorage.setItem(KEY,JSON.stringify(data));
}

function esc(value){
 return String(value??"").replace(/[&<>"']/g,c=>({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
 })[c]);
}

function toast(msg){
 const el=document.getElementById("toast");
 el.textContent=msg;
 el.classList.remove("hidden");
 clearTimeout(window.ovardToast);
 window.ovardToast=setTimeout(()=>el.classList.add("hidden"),2500);
}

function money(n){
 return Number(n||0).toFixed(2);
}

function imageHTML(src,emoji,cls){
 if(src) return `<img class="${cls}" src="${src}" alt="">`;
 return `<div class="${cls}">${esc(emoji||"🏬")}</div>`;
}

function renderShops(){
 const strip=document.getElementById("shopStrip");
 if(!strip)return;
 strip.innerHTML="";

 const all=document.createElement("button");
 all.className="shop-tile";
 all.innerHTML=`<div class="shop-emoji">🏬</div><strong>Все магазины</strong>`;
 all.onclick=showAllShops;
 strip.appendChild(all);

 data.shops.filter(s=>s.active).forEach(s=>{
  const card=document.createElement("button");
  card.className="shop-tile";
  card.innerHTML=`
   ${imageHTML(s.image,s.photo,"shop-emoji")}
   <strong>${esc(s.name)}</strong>`;
  card.onclick=()=>openShop(s.id);
  strip.appendChild(card);
 });
}

function renderAllShops(){
 const list=document.getElementById("allShopList");
 list.innerHTML="";
 data.shops.filter(s=>s.active).forEach(s=>{
  const card=document.createElement("button");
  card.className="shop-list-card";
  card.innerHTML=`
   ${imageHTML(s.image,s.photo,"shop-emoji")}
   <div class="grow"><strong>${esc(s.name)}</strong>
   <small>${esc(s.desc||"Магазин Ovard")}</small></div>
   <span>→</span>`;
  card.onclick=()=>openShop(s.id);
  list.appendChild(card);
 });
 if(!list.children.length)list.innerHTML="<p class='muted'>Магазинов пока нет.</p>";
}

function hidePages(){
 ["allShopsPage","shopDetails","searchResults"].forEach(id=>{
  document.getElementById(id).classList.add("hidden");
 });
}

function showHome(){
 hidePages();
 document.getElementById("homePage").classList.remove("hidden");
 window.scrollTo({top:0,behavior:"smooth"});
}

function showAllShops(){
 hidePages();
 document.getElementById("allShopsPage").classList.remove("hidden");
 renderAllShops();
 document.getElementById("allShopsPage").scrollIntoView({behavior:"smooth"});
}

function openShop(id){
 const shop=data.shops.find(s=>s.id===id && s.active);
 if(!shop)return;

 hidePages();
 document.getElementById("shopDetails").classList.remove("hidden");
 document.getElementById("shopTitle").textContent=shop.name;
 document.getElementById("shopDescription").textContent=shop.desc||"";
 const cover=document.getElementById("shopCover");
 cover.innerHTML=shop.image
  ? `<img src="${shop.image}" alt="${esc(shop.name)}">`
  : esc(shop.photo||"🏬");

 const grid=document.getElementById("productGrid");
 grid.innerHTML="";

 const products=(shop.products||[]).filter(p=>p.active!==false);
 if(!products.length){
  grid.innerHTML="<p class='muted'>Скоро здесь появятся товары этого магазина.</p>";
 }
 products.forEach(p=>{
  const card=document.createElement("div");
  card.className="product-card";
  card.innerHTML=`
   ${imageHTML(p.image,p.photo||"🛍️","product-placeholder")}
   <strong>${esc(p.name)}</strong>
   <p>${money(p.price)} сомонӣ / ${esc(p.unit||"шт.")}</p>
   <small class="muted">${esc(p.desc||"")}</small>
   <button>Добавить в корзину</button>`;
  card.querySelector("button").onclick=()=>addToCart(shop,p);
  grid.appendChild(card);
 });
 document.getElementById("shopDetails").scrollIntoView({behavior:"smooth"});
}

function addToCart(shop,p){
 const found=data.cart.find(x=>x.productId===p.id && x.shopId===shop.id);
 if(found)found.qty+=1;
 else data.cart.push({
  productId:p.id,
  shopId:shop.id,
  shop:shop.name,
  name:p.name,
  price:Number(p.price),
  unit:p.unit||"шт.",
  qty:1
 });
 save();
 updateCart();
 toast("Добавлено в корзину");
}

function updateCart(){
 document.getElementById("cartCount").textContent=
  data.cart.reduce((n,p)=>n+Number(p.qty||1),0);
}

function cartTotal(){
 return data.cart.reduce((n,p)=>n+Number(p.price)*Number(p.qty||1),0);
}

function showCart(){
 document.getElementById("modalTitle").textContent="Корзина и оформление";
 renderCart();
 document.getElementById("modal").classList.remove("hidden");
}

function renderCart(){
 const box=document.getElementById("modalContent");
 let rows=data.cart.map((p,i)=>`
  <div class="cart-line">
   <div>
    <strong>${esc(p.name)}</strong>
    <small class="muted">${esc(p.shop)} · ${money(p.price)} сомонӣ / ${esc(p.unit)}</small>
    <div><b>${money(p.price*Number(p.qty))} сомонӣ</b></div>
   </div>
   <div class="qty-control">
    <button onclick="changeQty(${i},-1)">−</button>
    <b>${p.qty}</b>
    <button onclick="changeQty(${i},1)">+</button>
    <button onclick="removeCart(${i})">×</button>
   </div>
  </div>`).join("");

 let methods="";
 if(data.checkout.whatsapp)methods+=`<label class="payment-option"><input type="radio" name="orderMethod" value="whatsapp" checked> WhatsApp</label>`;
 if(data.checkout.website)methods+=`<label class="payment-option"><input type="radio" name="orderMethod" value="website" ${data.checkout.whatsapp?"":"checked"}> Через Ovard</label>`;
 if(data.checkout.phone)methods+=`<label class="payment-option"><input type="radio" name="orderMethod" value="phone" ${!data.checkout.whatsapp&&!data.checkout.website?"checked":""}> Позвонить</label>`;

 const payments=data.payments.filter(p=>p.active);
 let paymentHTML=payments.map((p,i)=>`
  <label class="payment-option">
   <input type="radio" name="paymentMethod" value="${esc(p.name)}" ${i===0?"checked":""}>
   ${esc(p.name)}
  </label>`).join("");

 box.innerHTML=`
  ${rows||"<p class='muted'>Корзина пока пуста.</p>"}
  <div class="cart-total">Сумма товаров: ${money(cartTotal())} сомонӣ</div>
  <p class="muted">Доставка оплачивается отдельно. Стоимость зависит от веса заказа и расстояния по дороге. Окончательная сумма будет подтверждена перед доставкой.</p>
  ${data.cart.length?`
  <form id="orderForm">
   <h3>Данные покупателя</h3>
   <label>Ваше имя</label><input name="name" required placeholder="Имя">
   <label>Телефон</label><input name="phone" required placeholder="+992...">
   <label>Адрес доставки</label><input name="address" required placeholder="Улица, дом, ориентир">
   <label>Комментарий</label><textarea name="note" placeholder="Дополнительная информация"></textarea>
   <h3>Способ оформления заказа</h3>
   ${methods||"<p class='muted'>Способы заказа временно недоступны.</p>"}
   <h3>Способ оплаты</h3>
   ${paymentHTML||"<p class='muted'>Способы оплаты уточняются.</p>"}
   <button class="wide-btn" type="submit">Оформить заказ</button>
  </form>`:""}`;

 const form=document.getElementById("orderForm");
 if(form)form.onsubmit=sendOrder;
}

function changeQty(i,step){
 if(!data.cart[i])return;
 data.cart[i].qty=Math.max(0,Number(data.cart[i].qty)+step);
 if(data.cart[i].qty===0)data.cart.splice(i,1);
 save();updateCart();renderCart();
}

function removeCart(i){
 data.cart.splice(i,1);
 save();updateCart();renderCart();
}

function sendOrder(e){
 e.preventDefault();
 if(!data.cart.length)return toast("Корзина пуста");

 const f=new FormData(e.target);
 const method=e.target.querySelector('input[name="orderMethod"]:checked')?.value;
 const payment=e.target.querySelector('input[name="paymentMethod"]:checked')?.value||"Не выбран";

 if(!method)return toast("Выберите способ оформления заказа");

 const total=cartTotal();
 const items=data.cart.map(p=>
  `• ${p.name} — ${p.qty} ${p.unit} × ${money(p.price)} = ${money(p.qty*p.price)} сомонӣ (${p.shop})`
 ).join("\n");

 const order={
  id:Date.now(),
  date:new Date().toLocaleString(),
  name:f.get("name"),
  phone:f.get("phone"),
  address:f.get("address"),
  note:f.get("note")||"",
  method,
  payment,
  items:data.cart.map(p=>({...p})),
  total,
  status:"Новый"
 };

 const msg=`Здравствуйте! Новый заказ Ovard:\n\n${items}\n\nСумма товаров: ${money(total)} сомонӣ\nДоставка: рассчитать отдельно по весу и расстоянию.\nОплата: ${payment}\n\nИмя: ${order.name}\nТелефон: ${order.phone}\nАдрес: ${order.address}\nКомментарий: ${order.note||"Нет"}`;

 if(method==="whatsapp"){
  if(!data.checkout.whatsapp)return toast("WhatsApp временно отключён");
  saveOrder(order);
  window.open("https://wa.me/"+data.checkout.phoneNumber.replace(/\D/g,"")+"?text="+encodeURIComponent(msg),"_blank");
 }else if(method==="website"){
  saveOrder(order);
  toast("Заказ сохранён на этом устройстве");
  document.getElementById("modal").classList.add("hidden");
 }else if(method==="phone"){
  saveOrder(order);
  window.location.href="tel:"+data.checkout.phoneNumber;
 }
}

function saveOrder(order){
 data.orders.unshift(order);
 data.cart=[];
 save();updateCart();
}

function showProfile(){
 document.getElementById("modalTitle").textContent="Профиль Ovard";
 document.getElementById("modalContent").innerHTML=`
  <h3>Добро пожаловать в Ovard</h3>
  <p>Ваши заказы оформляются удобным для вас способом.</p>
  <p class="muted">Для связи используйте выбранный способ оформления заказа.</p>`;
 document.getElementById("modal").classList.remove("hidden");
}

function searchAll(){
 const q=document.getElementById("searchInput").value.trim().toLowerCase();
 if(!q)return toast("Введите название магазина или товара");

 hidePages();
 document.getElementById("searchResults").classList.remove("hidden");
 const grid=document.getElementById("searchGrid");
 grid.innerHTML="";

 data.shops.filter(s=>s.active).forEach(s=>{
  (s.products||[]).filter(p=>p.active!==false &&
   (p.name||"").toLowerCase().includes(q)).forEach(p=>{
   const card=document.createElement("div");
   card.className="product-card";
   card.innerHTML=`
    ${imageHTML(p.image,p.photo||"🛍️","product-placeholder")}
    <strong>${esc(p.name)}</strong>
    <p>${money(p.price)} сомонӣ / ${esc(p.unit||"шт.")}</p>
    <small class="muted">${esc(s.name)}</small>
    <button>Добавить в корзину</button>`;
   card.querySelector("button").onclick=()=>addToCart(s,p);
   grid.appendChild(card);
  });
  if(s.name.toLowerCase().includes(q)){
   const card=document.createElement("div");
   card.className="product-card";
   card.innerHTML=`<strong>${esc(s.name)}</strong><p>${esc(s.desc||"Магазин")}</p><button>Открыть магазин</button>`;
   card.querySelector("button").onclick=()=>openShop(s.id);
   grid.appendChild(card);
  }
 });
 if(!grid.children.length)grid.innerHTML="<p class='muted'>Ничего не найдено.</p>";
}

function clearSearch(){
 document.getElementById("searchInput").value="";
 showHome();
}

function goHome(){showHome();}

document.getElementById("menuBtn").onclick=()=>{
 document.getElementById("drawer").classList.remove("hidden");
};
document.getElementById("closeDrawer").onclick=()=>{
 document.getElementById("drawer").classList.add("hidden");
};
document.getElementById("closeModal").onclick=()=>{
 document.getElementById("modal").classList.add("hidden");
};
document.getElementById("themeBtn").onclick=()=>{
 data.dark=!data.dark;
 document.body.classList.toggle("dark",data.dark);
 save();
};
document.querySelectorAll("[data-font]").forEach(b=>{
 b.onclick=()=>{
  data.font=b.dataset.font;
  document.body.classList.remove("font-large","font-xlarge");
  if(data.font==="large")document.body.classList.add("font-large");
  if(data.font==="xlarge")document.body.classList.add("font-xlarge");
  save();toast("Размер текста изменён");
 };
});
document.getElementById("languageSelect").onchange=e=>{
 data.language=e.target.value;save();
 toast("Язык сохранён. Перевод интерфейса будет добавлен отдельно.");
};
document.getElementById("searchBtn").onclick=searchAll;
document.getElementById("searchInput").onkeydown=e=>{
 if(e.key==="Enter")searchAll();
};
document.getElementById("allShopsBtn").onclick=showAllShops;
document.getElementById("backShops").onclick=showAllShops;
document.getElementById("locationBtn").onclick=()=>{
 toast("Регион: "+data.location);
};

document.querySelectorAll(".nav-item").forEach(b=>{
 b.onclick=()=>{
  document.querySelectorAll(".nav-item").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  if(b.dataset.go==="shops")showAllShops();
  if(b.dataset.go==="cart")showCart();
  if(b.dataset.go==="profile")showProfile();
  if(b.dataset.go==="home")showHome();
 };
});

function applySaved(){
 document.getElementById("locationText").textContent=data.location;
 document.body.classList.toggle("dark",data.dark);
 document.body.classList.toggle("font-large",data.font==="large");
 document.body.classList.toggle("font-xlarge",data.font==="xlarge");
 document.getElementById("languageSelect").value=data.language||"ru";
 renderShops();
 updateCart();
}

applySaved();
