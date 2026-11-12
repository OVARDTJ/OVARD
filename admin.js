
const read = key => JSON.parse(localStorage.getItem("ov_"+key) || "[]");
const write = (key,value) =>
  localStorage.setItem("ov_"+key,JSON.stringify(value));

const ADMIN_PASSWORD = "CHANGE_THIS_PASSWORD";

const loginSection=document.getElementById("loginSection");
const adminPanel=document.getElementById("adminPanel");

document.getElementById("loginButton").onclick=()=>{
  const pass=document.getElementById("adminPassword").value;

  if(pass===ADMIN_PASSWORD) {
    sessionStorage.setItem("ov_admin_demo","yes");
    loginSection.classList.add("hidden");
    adminPanel.classList.remove("hidden");
    renderAdmin();
  } else {
    document.getElementById("loginError").textContent="Неверный пароль";
  }
};

function renderAdmin() {
  renderAdminShops();
  renderAdminProducts();
  renderAdminOrders();
  updateShopOptions();
}

if(sessionStorage.getItem("ov_admin_demo")==="yes") {
  loginSection.classList.add("hidden");
  adminPanel.classList.remove("hidden");
  renderAdmin();
}

document.getElementById("logoutButton").onclick=()=>{
  sessionStorage.removeItem("ov_admin_demo");
  location.reload();
};

document.querySelectorAll("[data-tab]").forEach(button=>{
  button.onclick=()=>{
    document.querySelectorAll(".admin-tab").forEach(tab=>
      tab.classList.add("hidden")
    );
    document.getElementById(button.dataset.tab).classList.remove("hidden");
  };
});

document.getElementById("addShop").onclick=()=>{
  const name=document.getElementById("shopName").value.trim();
  const description=document.getElementById("shopDescription").value.trim();

  if(!name) return alert("Введите название магазина");

  const shops=read("shops");
  shops.push({
    id:"s"+Date.now(),
    name,
    description,
    active:true
  });

  write("shops",shops);
  document.getElementById("shopName").value="";
  document.getElementById("shopDescription").value="";
  renderAdmin();
};

function renderAdminShops() {
  const box=document.getElementById("adminShops");
  box.replaceChildren();

  read("shops").forEach(shop=>{
    const item=document.createElement("div");
    item.className="admin-item";

    const title=document.createElement("b");
    title.textContent=shop.name;

    const edit=document.createElement("button");
    edit.textContent="Изменить";
    edit.onclick=()=>{
      const name=prompt("Новое название",shop.name);
      if(name && name.trim()) {
        const list=read("shops");
        const s=list.find(x=>x.id===shop.id);
        s.name=name.trim();
        write("shops",list);
        renderAdmin();
      }
    };

    const toggle=document.createElement("button");
    toggle.textContent=shop.active===false?"Показать":"Скрыть";
    toggle.onclick=()=>{
      const list=read("shops");
      const s=list.find(x=>x.id===shop.id);
      s.active=s.active===false;
      write("shops",list);
      renderAdmin();
    };

    const del=document.createElement("button");
    del.textContent="Удалить";
    del.onclick=()=>{
      if(!confirm("Удалить магазин?")) return;
      write("shops",read("shops").filter(x=>x.id!==shop.id));
      renderAdmin();
    };

    item.append(title,edit,toggle,del);
    box.append(item);
  });
}

function updateShopOptions() {
  const select=document.getElementById("productOwner");
  select.replaceChildren();

  const own=document.createElement("option");
  own.value="own";
  own.textContent="Собственный товар";
  select.append(own);

  read("shops").forEach(shop=>{
    const option=document.createElement("option");
    option.value=shop.id;
    option.textContent=shop.name;
    select.append(option);
  });
}

document.getElementById("addProduct").onclick=()=>{
  const name=document.getElementById("productName").value.trim();
  const price=Number(document.getElementById("productPrice").value);
  const unit=document.getElementById("productUnit").value.trim();
  const image=document.getElementById("productImage").value.trim();
  const owner=document.getElementById("productOwner").value;

  if(!name || price<0 || !unit) return alert("Заполните данные товара");

  const products=read("products");
  products.push({
    id:"p"+Date.now(),
    name,price,unit,image,
    shopId:owner==="own"?null:owner,
    own:owner==="own"
  });

  write("products",products);
  ["productName","productPrice","productUnit","productImage"].forEach(id=>{
    document.getElementById(id).value="";
  });
  renderAdminProducts();
};

function renderAdminProducts() {
  const box=document.getElementById("adminProducts");
  box.replaceChildren();

  read("products").forEach(p=>{
    const item=document.createElement("div");
    item.className="admin-item";

    const title=document.createElement("b");
    title.textContent=p.name+" — "+p.price+" сомони";

    const edit=document.createElement("button");
    edit.textContent="Изменить цену";
    edit.onclick=()=>{
      const value=prompt("Новая цена",p.price);
      if(value===null || value.trim()==="" || !Number.isFinite(Number(value)) || Number(value)<0) return;
      const list=read("products");
      list.find(x=>x.id===p.id).price=Number(value);
      write("products",list);
      renderAdminProducts();
    };

    const del=document.createElement("button");
    del.textContent="Удалить";
    del.onclick=()=>{
      if(confirm("Удалить товар?")) {
        write("products",read("products").filter(x=>x.id!==p.id));
        renderAdminProducts();
      }
    };

    item.append(title,edit,del);
    box.append(item);
  });
}

function renderAdminOrders() {
  const box=document.getElementById("adminOrders");
  box.replaceChildren();

  read("orders").forEach(order=>{
    const item=document.createElement("div");
    item.className="admin-item";

    const title=document.createElement("b");
    title.textContent="Заказ № "+order.id;

    const info=document.createElement("p");
    info.textContent=order.name+" · "+order.phone+" · "+order.address;

    const status=document.createElement("select");
    ["Новый","Принят","Готовится","Передан курьеру","Доставлен","Отменён"].forEach(s=>{
      const o=document.createElement("option");
      o.value=s;
      o.textContent=s;
      status.append(o);
    });
    status.value=order.status;

    status.onchange=()=>{
      const orders=read("orders");
      orders.find(x=>x.id===order.id).status=status.value;
      write("orders",orders);
    };

    item.append(title,info,status);
    box.append(item);
  });
}
