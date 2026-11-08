
let products = JSON.parse(localStorage.getItem("ovard_products") || "null") || [
 {id:1,name:"Гандум",price:0,unit:"кг",category:"Зерно",emoji:"🌾"},
 {id:2,name:"Комбикорм",price:0,unit:"мешок",category:"Корм",emoji:"🐓"},
 {id:3,name:"Ҷав",price:0,unit:"кг",category:"Зерно",emoji:"🌱"},
 {id:4,name:"Ҷуворимакка",price:0,unit:"кг",category:"Зерно",emoji:"🌽"}
];

let shops = JSON.parse(localStorage.getItem("ovard_shops") || "null") || [
 {id:1,name:"Нонвойхона",desc:"Свежий горячий хлеб",emoji:"🥖"},
 {id:2,name:"Аптека",desc:"Аптечные товары",emoji:"💊"},
 {id:3,name:"Строительный магазин",desc:"Материалы для дома",emoji:"🧱"}
];

let cart = JSON.parse(localStorage.getItem("ovard_cart") || "[]");
let category = "Все";

function persist() {
 localStorage.setItem("ovard_products",JSON.stringify(products));
 localStorage.setItem("ovard_shops",JSON.stringify(shops));
 localStorage.setItem("ovard_cart",JSON.stringify(cart));
}

function showPage(id) {
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 document.getElementById(id).classList.add("active");
 document.getElementById("menu").classList.add("hidden");
 if(id==="shops") renderShops();
 if(id==="cart") renderCart();
 if(id==="admin") renderAdmin();
 if(id==="profile") renderProfile();
 window.scrollTo(0,0);
}

document.getElementById("menuBtn").onclick=()=>{
 document.getElementById("menu").classList.toggle("hidden");
};

function renderProducts() {
 let q=document.getElementById("search").value.toLowerCase();
 let cats=["Все",...new Set(products.map(p=>p.category))];
 document.getElementById("categories").innerHTML=cats.map(c=>
 `<button class="${category===c?'active':''}" onclick="category='${escapeHTML(c)}';renderProducts()">${escapeHTML(c)}</button>`
 ).join("");

 let list=products.filter(p=>
 (category==="Все"||p.category===category)&&
 (p.name.toLowerCase().includes(q))
 );

 document.getElementById("products").innerHTML=list.map(p=>`
 <div class="product">
  <div class="emoji">${escapeHTML(p.emoji||"📦")}</div>
  <h3>${escapeHTML(p.name)}</h3>
  <small>${escapeHTML(p.unit||"")}</small>
  <p class="price">${p.price>0?p.price+" сомони":"Цена уточняется"}</p>
  <button onclick="addToCart(${p.id})">＋ В корзину</button>
 </div>`).join("") || "<p>Товары не найдены.</p>";
}

function addToCart(id) {
 let p=products.find(x=>x.id===id);
 if(!p||p.price<=0){alert("Цена уточняется");return}
 let i=cart.find(x=>x.id===id);
 if(i)i.qty++;
 else cart.push({...p,qty:1});
 persist();
 alert("Добавлено в корзину");
}

function renderCart() {
 let el=document.getElementById("cartItems");
 el.innerHTML=cart.map(i=>`
 <div class="admin-item">
 ${escapeHTML(i.name)} — ${i.price} сомони × ${i.qty}
 <button onclick="changeQty(${i.id},-1)">−</button>
 <button onclick="changeQty(${i.id},1)">＋</button>
 </div>`).join("") || "<p>Корзина пуста</p>";
 let total=cart.reduce((s,i)=>s+i.price*i.qty,0);
 document.getElementById("total").textContent="Итого: "+total+" сомони";
}

function changeQty(id,d) {
 let i=cart.find(x=>x.id===id);
 if(i){i.qty+=d;if(i.qty<=0)cart=cart.filter(x=>x.id!==id)}
 persist();renderCart();
}

function renderShops() {
 document.getElementById("shopList").innerHTML=shops.map(s=>`
 <div class="shop">
 <h3>${escapeHTML(s.emoji||"🏪")} ${escapeHTML(s.name)}</h3>
 <p>${escapeHTML(s.desc||"Магазин-партнёр OVARD")}</p>
 </div>`).join("") || "<p>Магазинов пока нет.</p>";
}

function addProduct() {
 let name=document.getElementById("pName").value.trim();
 let price=Number(document.getElementById("pPrice").value);
 if(!name||price<0||!Number.isFinite(price)){alert("Проверьте название и цену");return}
 products.push({
 id:Date.now(),name,price,
 unit:document.getElementById("pUnit").value||"шт.",
 category:document.getElementById("pCategory").value||"Другое",
 emoji:document.getElementById("pEmoji").value||"📦"
 });
 persist();renderProducts();renderAdmin();
 ["pName","pPrice","pUnit","pCategory","pEmoji"].forEach(id=>document.getElementById(id).value="");
}

function addShop() {
 let name=document.getElementById("sName").value.trim();
 if(!name){alert("Введите название");return}
 shops.push({
 id:Date.now(),name,
 desc:document.getElementById("sDesc").value,
 emoji:"🏪"
 });
 persist();renderShops();renderAdmin();
 document.getElementById("sName").value="";
 document.getElementById("sDesc").value="";
}

function renderAdmin() {
 document.getElementById("adminProducts").innerHTML=products.map(p=>`
 <div class="admin-item">${escapeHTML(p.name)} — ${p.price} сомони
 <button onclick="deleteProduct(${p.id})">Удалить</button></div>`).join("");
 document.getElementById("adminShops").innerHTML=shops.map(s=>`
 <div class="admin-item">${escapeHTML(s.name)}
 <button onclick="deleteShop(${s.id})">Удалить</button></div>`).join("");
}

function deleteProduct(id) {
 products=products.filter(p=>p.id!==id);
 cart=cart.filter(p=>p.id!==id);
 persist();renderProducts();renderAdmin();
}

function deleteShop(id) {
 shops=shops.filter(s=>s.id!==id);
 persist();renderShops();renderAdmin();
}

function checkout() {
 if(!cart.length){alert("Корзина пуста");return}
 let name=document.getElementById("customerName").value.trim();
 let phone=document.getElementById("customerPhone").value.trim();
 let address=document.getElementById("customerAddress").value.trim();
 if(!name||!phone||!address){alert("Заполните все данные");return}
 let orders=JSON.parse(localStorage.getItem("ovard_orders")||"[]");
 orders.push({name,phone,address,items:cart,total:cart.reduce((s,i)=>s+i.price*i.qty,0),date:new Date().toISOString()});
 localStorage.setItem("ovard_orders",JSON.stringify(orders));
 cart=[];persist();renderCart();
 alert("Заявка сохранена на этом устройстве");
}

function saveProfile() {
 let name=document.getElementById("profileName").value.trim();
 let phone=document.getElementById("profilePhone").value.trim();
 if(!name||!phone){alert("Заполните данные");return}
 localStorage.setItem("ovard_profile",JSON.stringify({name,phone}));
 renderProfile();alert("Профиль сохранён");
}

function renderProfile() {
 let p=JSON.parse(localStorage.getItem("ovard_profile")||"null");
 document.getElementById("profileInfo").textContent=p?p.name+" · "+p.phone:"Профиль не заполнен";
}

function courierRequest() {
 let name=document.getElementById("courierName").value.trim();
 let phone=document.getElementById("courierPhone").value.trim();
 if(!name||!phone){alert("Введите имя и телефон");return}
 let a=JSON.parse(localStorage.getItem("ovard_couriers")||"[]");
 a.push({name,phone,transport:document.getElementById("transport").value});
 localStorage.setItem("ovard_couriers",JSON.stringify(a));
 alert("Заявка сохранена на этом устройстве");
}

function toggleDark() {
 document.body.classList.toggle("dark",document.getElementById("darkMode").checked);
 localStorage.setItem("ovard_dark",document.getElementById("darkMode").checked?"1":"0");
}

function saveLanguage() {
 localStorage.setItem("ovard_language",document.getElementById("language").value);
 alert("Язык выбран. Полный перевод интерфейса ещё не подключён.");
}

function escapeHTML(s) {
 return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}

(function init(){
 if(localStorage.getItem("ovard_dark")==="1"){
 document.body.classList.add("dark");
 document.getElementById("darkMode").checked=true;
 }
 renderProducts();renderShops();renderCart();renderAdmin();renderProfile();
})();
