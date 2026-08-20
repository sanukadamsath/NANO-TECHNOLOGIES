const WHATSAPP_NUMBER = "94713395282";
const CART_KEY = "nanoCart";

const products = [
{
id:1,
cat:"CCTV",
name:"EZVIZ H1C 2MP WiFi Smart Camera",
mrp:12500,
price:9950,
desc:"2MP Full HD indoor smart WiFi camera with night vision, motion detection and mobile monitoring.",
badge:"EZVIZ CCTV CAMERA",
image:"h1c.webp",
features:[
"2MP Full HD Resolution",
"WiFi Smart Camera",
"Night Vision",
"Motion Detection",
"Mobile App Monitoring"
],
warranty:"1 Year 1-to-1 Replacement Warranty"
},

{
id:2,
cat:"CCTV",
name:"EZVIZ H8C Outdoor Smart Camera",
mrp:20500,
price:17950,
desc:"Outdoor smart security camera with remote monitoring and smart detection.",
badge:"EZVIZ CCTV CAMERA",
image:"h8c.webp",
features:[
"High Resolution Video",
"Outdoor Weather Protection",
"Human Detection",
"Night Vision",
"Remote View"
],
warranty:"1 Year 1-to-1 Replacement Warranty"
},

{
id:3,
cat:"CCTV",
name:"EZVIZ H9C Dual Lens Smart Camera",
mrp:28500,
price:25500,
desc:"Advanced dual lens security camera for wider monitoring coverage.",
badge:"EZVIZ CCTV CAMERA",
image:"",
features:[
"Dual Lens Technology",
"Smart Detection",
"Night Vision"
],
warranty:"1 Year 1-to-1 Replacement Warranty"
},

{
id:4,
cat:"CCTV",
name:"EZVIZ TY1 Pro 2MP Pan & Tilt Smart WiFi Camera",
mrp:12500,
price:9950,
desc:"2MP Full HD indoor Pan & Tilt smart WiFi camera with 360° view, human detection, night vision and two-way audio.",
badge:"EZVIZ CCTV CAMERA",
image:"ty1-pro.jpg",
features:[
"2MP Full HD Resolution (1080P)",
"360° Pan & Tilt View",
"Smart Motion Detection",
"Human Shape Detection",
"IR Night Vision up to 10m",
"Two-Way Talk",
"Remote View via EZVIZ App",
"Smart Alerts",
"Cloud Storage Support",
"MicroSD Card Support up to 512GB",
"H.265 Video Compression",
"USB Type-C Power Supply",
"RJ45 Ethernet Port"
],
warranty:"1 Year 1-to-1 Replacement Warranty"
},{
id:5,
cat:"GPS",
name:"GF-07 Mini GPS Tracker",
mrp:0,
price:0,
desc:"Compact GPS tracker with smart tracking features.",
badge:"GPS TRACKER",
image:"",
features:[
"Mini GPS Tracking",
"Compact Design",
"Easy Installation"
],
warranty:"Warranty Available"
}
];


let cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");


function money(value){

return value 
? "Rs. " + Number(value).toLocaleString("en-LK")
: "Contact for Price";

}



function getProduct(id){

return products.find(function(product){

return product.id === Number(id);

});

}



function saveCart(){

localStorage.setItem(
CART_KEY,
JSON.stringify(cart)
);

}



function renderProducts(list = products){

const grid = document.getElementById("productGrid");

if(!grid) return;



grid.innerHTML = list.map(function(product){


return `

<article class="product">


<div class="product-image">

${
product.image
?
`<img src="${product.image}" class="product-photo">`
:
`📷`
}

</div>



<div class="product-body">


<span class="tag">
${product.badge}
</span>


<h3>
${product.name}
</h3>


<p class="desc">
${product.desc}
</p>



<div class="price">

${
product.mrp
?
`<span class="mrp">
${money(product.mrp)}
</span>`
:
""
}


<span class="sale">
${money(product.price)}
</span>


</div>



<div class="product-actions">


<button 
class="smallbtn"
onclick="showProductDetails(${product.id})">

Details

</button>



<button 
class="smallbtn buy"
onclick="addToCart(${product.id})">

Add to Cart

</button>


</div>



</div>


</article>


`;


}).join("");

}





function filterProducts(category){


if(category === "ALL"){

renderProducts(products);

}

else{


renderProducts(

products.filter(function(product){

return product.cat === category;

})

);


}


}




function showProductDetails(id){


const product = getProduct(id);


const box = document.getElementById("productDetails");


if(!product || !box) return;



box.innerHTML = `


<h2>
${product.name}
</h2>



<p>
${product.desc}
</p>



<h3>
${money(product.price)}
</h3>



<h4>
Features
</h4>



<ul>

${
(product.features || [])
.map(function(feature){

return `<li>${feature}</li>`;

})
.join("")

}

</ul>



<p>

<b>
${product.warranty}
</b>

</p>


`;



openModal("productModal");


}function addToCart(id){

const product = getProduct(id);

if(!product) return;



if(product.price === 0){

window.open(
"https://wa.me/" + WHATSAPP_NUMBER +
"?text=" +
encodeURIComponent(
"Hello Nano Technologies, I need price details for " + product.name
)
);

return;

}



let item = cart.find(function(item){

return item.id === id;

});



if(item){

item.qty++;

}

else{

cart.push({

id:id,

qty:1

});

}



saveCart();

updateCart();


}




function updateCart(){

const count = document.getElementById("cartCount");


if(count){

count.textContent = cart.reduce(function(total,item){

return total + item.qty;

},0);

}


}





function removeFromCart(id){

cart = cart.filter(function(item){

return item.id !== id;

});


saveCart();

updateCart();


}




function changeQuantity(id,change){

const item = cart.find(function(item){

return item.id === id;

});


if(item){

item.qty += change;


if(item.qty <= 0){

removeFromCart(id);

}

else{

saveCart();

updateCart();

}

}


}





function openModal(id){

const modal = document.getElementById(id);


if(modal){

modal.classList.add("show");

}


}



function closeModal(id){

const modal = document.getElementById(id);


if(modal){

modal.classList.remove("show");

}


}





function toggleMenu(){

const nav = document.getElementById("nav");


if(nav){

nav.classList.toggle("open");

}


}





function checkout(){


let message = 
"Hello Nano Technologies,%0A%0AI would like to order:%0A%0A";



cart.forEach(function(item){


const product = getProduct(item.id);



message += 
product.name +
" x " +
item.qty +
"%0A";


});



window.open(

"https://wa.me/" +
WHATSAPP_NUMBER +
"?text=" +
message

);


}





document.addEventListener(
"DOMContentLoaded",
function(){


renderProducts();


updateCart();



document
.querySelectorAll("[data-filter]")
.forEach(function(button){


button.onclick = function(){


filterProducts(
button.dataset.filter
);


};


});



const cartButton = document.getElementById("cartButton");


if(cartButton){


cartButton.onclick = function(){


openModal("cartModal");


};


}




const menuButton = document.getElementById("menuButton");


if(menuButton){


menuButton.onclick = toggleMenu;


}document.querySelectorAll(".close-modal").forEach(function(button){

    button.onclick = function(){

        const modal = button.closest(".modal");

        if(modal){

            modal.classList.remove("show");

        }

    };

});



});
