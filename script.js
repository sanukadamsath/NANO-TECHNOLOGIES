const products=[
 {id:1,cat:"CCTV",name:"EZVIZ H1C",mrp:12500,price:9950,desc:"Compact smart indoor security camera with user-friendly setup.",badge:"CCTV CAMERA"},
 {id:2,cat:"CCTV",name:"EZVIZ H8C",mrp:20500,price:17950,desc:"Outdoor smart security camera with remote mobile monitoring.",badge:"CCTV CAMERA"},
 {id:3,cat:"CCTV",name:"EZVIZ H9C",mrp:28500,price:25500,desc:"Advanced dual-lens security solution for wider coverage.",badge:"CCTV CAMERA"},
 {id:4,cat:"CCTV",name:"EZVIZ TY1 Pro",mrp:0,price:0,desc:"Smart indoor camera. Contact us for the latest price and availability.",badge:"CCTV CAMERA"},
 {id:5,cat:"GPS",name:"GF-07 Mini GPS Tracker",mrp:0,price:0,desc:"Compact tracking device. Contact us for current price and availability.",badge:"GPS TRACKER"}
];
let cart=JSON.parse(localStorage.getItem("nanoCart")||"[]");

function money(n){return n?`Rs. ${n.toLocaleString("en-LK")}`:"Contact for Price"}
function renderProducts(list=products){
 const grid=document.getElementById("productGrid");
 grid.innerHTML=list.map(p=>`
 <article class="product">
   <div class="product-image"><div class="camera"><div class="lens"></div></div></div>
   <div class="product-body">
     <span class="tag">${p.badge}</span>
     <h3>${p.name}</h3>
     <p class="desc">${p.desc}</p>
     <div class="price">${p.mrp?`<span class="mrp">${money(p.mrp)}</span>`:""}<span class="sale">${money(p.price)}</span></div>
     <div class="product-actions">
       <button class="smallbtn" onclick="details(${p.id})">Details</button>
       <button class="smallbtn buy" onclick="addToCart(${p.id})">${p.price?"Add to Cart":"WhatsApp"}</button>
     </div>
   </div>
 </article>`).join("");
}
function filterProducts(cat,el){document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));el.classList.add("active");renderProducts(cat==="all"?products:products.filter(p=>p.cat===cat))}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p.price){window.open("https://wa.me/94777176230?text="+encodeURIComponent(`Hello Nano Technologies, I need the current price for ${p.name}.`),"_blank");return}let item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});saveCart();openCart()}
function saveCart(){localStorage.setItem("nanoCart",JSON.stringify(cart));document.getElementById("cartCount").textContent=cart.reduce((a,b)=>a+b.qty,0)}
function openCart(){document.getElementById("cartModal").classList.add("show");renderCart()}
function closeCart(){document.getElementById("cartModal").classList.remove("show")}
function renderCart(){const box=document.getElementById("cartItems");if(!cart.length){box.innerHTML='<div class="empty">Your cart is empty.</div>';document.getElementById("cartTotal").textContent="Rs. 0";return}let total=0;box.innerHTML=cart.map(i=>{let p=products.find(x=>x.id===i.id);let sub=p.price*i.qty;total+=sub;return `<div class="cart-row"><div><b>${p.name}</b><small>Qty: ${i.qty}</small></div><div>${money(sub)}<br><button class="smallbtn" onclick="removeItem(${p.id})">Remove</button></div></div>`}).join("");document.getElementById("cartTotal").textContent=money(total)}
function removeItem(id){cart=cart.filter(x=>x.id!==id);saveCart();renderCart()}
function checkout(){if(!cart.length)return;closeCart();document.getElementById("orderModal").classList.add("show")}
function closeOrder(){document.getElementById("orderModal").classList.remove("show")}
function submitOrder(e){e.preventDefault();let lines=cart.map(i=>{let p=products.find(x=>x.id===i.id);return `${p.name} x ${i.qty} = ${money(p.price*i.qty)}`}).join("\n");let total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);let msg=`NEW ORDER - NANO TECHNOLOGIES\n\nCustomer: ${document.getElementById("customerName").value}\nPhone: ${document.getElementById("customerPhone").value}\nAddress: ${document.getElementById("customerAddress").value}\nDistrict: ${document.getElementById("customerDistrict").value}\nPayment: ${document.getElementById("payment").value}\n\n${lines}\n\nTOTAL: ${money(total)}\nNotes: ${document.getElementById("notes").value||"None"}`;window.open("https://wa.me/94777176230?text="+encodeURIComponent(msg),"_blank");alert("Order details prepared. WhatsApp will open to send the order.");cart=[];saveCart();closeOrder();document.getElementById("orderForm").reset()}
function details(id){let p=products.find(x=>x.id===id);let msg=`Hello Nano Technologies, I need more details about ${p.name}.`;window.open("https://wa.me/94777176230?text="+encodeURIComponent(msg),"_blank")}
function toggleMenu(){document.getElementById("nav").classList.toggle("open")}
document.getElementById("year").textContent=new Date().getFullYear();renderProducts();saveCart();
