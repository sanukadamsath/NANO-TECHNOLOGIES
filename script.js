const products = [
  {
    id: 1,
    cat: "CCTV",
    name: "EZVIZ H1C",
    mrp: 12500,
    price: 9950,
    desc: "Compact smart indoor security camera with user-friendly setup.",
    badge: "CCTV CAMERA",
    image: "h1c.webp"
  },

  {
    id: 2,
    cat: "CCTV",
    name: "EZVIZ H8C",
    mrp: 20500,
    price: 17950,
    desc: "Outdoor smart security camera with remote mobile monitoring.",
    badge: "CCTV CAMERA",
    image: "h8c.webp"
  },

  {
    id: 3,
    cat: "CCTV",
    name: "EZVIZ H9C",
    mrp: 28500,
    price: 25500,
    desc: "Advanced dual-lens security solution for wider coverage.",
    badge: "CCTV CAMERA",
    image: ""
  },

  {
    id: 4,
    cat: "CCTV",
    name: "EZVIZ TY1 Pro",
    mrp: 0,
    price: 0,
    desc: "2K+ Pan & Tilt smart indoor camera with Type-C connectivity.",
    badge: "CCTV CAMERA",
    image: "ty1-pro.jpg"
  },

  {
    id: 5,
    cat: "GPS",
    name: "GF-07 Mini GPS Tracker",
    mrp: 0,
    price: 0,
    desc: "Compact GPS tracker with smart tracking features.",
    badge: "GPS TRACKER",
    image: ""
  }
];

let cart = JSON.parse(localStorage.getItem("nanoCart") || "[]");

function money(value) {
  if (!value || value === 0) {
    return "Contact for Price";
  }

  return "Rs. " + Number(value).toLocaleString("en-LK");
}

function renderProducts(list) {
  const grid = document.getElementById("productGrid");

  if (!grid) {
    console.error("productGrid not found");
    return;
  }

  grid.innerHTML = list.map(function (p) {

    const imageHTML = p.image
      ? `<img src="${p.image}" alt="${p.name}" class="product-photo">`
      : `<div class="camera">
           <div class="lens"></div>
         </div>`;

    return `
      <article class="product">

        <div class="product-image">
          ${imageHTML}
        </div>

        <div class="product-body">

          <span class="tag">${p.badge}</span>

          <h3>${p.name}</h3>

          <p class="desc">${p.desc}</p>

          <div class="price">
            ${
              p.mrp
                ? `<span class="mrp">${money(p.mrp)}</span>`
                : ""
            }
            <span class="sale">${money(p.price)}</span>
          </div>

          <div class="product-actions">

            <button
              class="smallbtn"
              onclick="showProductDetails(${p.id})">
              Details
            </button>

            <button
              class="smallbtn buy"
              onclick="addToCart(${p.id})">
              ${p.price ? "Add to Cart" : "WhatsApp"}
            </button>

          </div>

        </div>

      </article>
    `;
  }).join("");
}

function showProductDetails(id) {
  const product = products.find(function (p) {
    return p.id === id;
  });

  if (!product) return;

  alert(
    product.name +
    "\n\n" +
    product.desc +
    "\n\nPrice: " +
    money(product.price)
  );
}

function addToCart(id) {
  const product = products.find(function (p) {
    return p.id === id;
  });

  if (!product) return;

  if (!product.price) {
    const message =
      "Hello Nano Technologies,%0A%0A" +
      "I'm interested in " +
      product.name +
      ". Please send me the latest price.";

    window.open(
      "https://wa.me/?text=" + message,
      "_blank"
    );

    return;
  }

  cart.push(product);

  localStorage.setItem(
    "nanoCart",
    JSON.stringify(cart)
  );

  updateCart();

  alert(product.name + " added to cart!");
}

function updateCart() {
  const cartCount = document.getElementById("cartCount");

  if (cartCount) {
    cartCount.textContent = cart.length;
  }

  const cartTotal = document.getElementById("cartTotal");

  if (cartTotal) {
    const total = cart.reduce(function (sum, item) {
      return sum + Number(item.price || 0);
    }, 0);

    cartTotal.textContent = "Rs. " + total.toLocaleString("en-LK");
  }
}

function filterProducts(category) {
  if (category === "ALL") {
    renderProducts(products);
    return;
  }

  const filtered = products.filter(function (p) {
    return p.cat === category;
  });

  renderProducts(filtered);
}

document.addEventListener("DOMContentLoaded", function () {

  // Show all products when website loads
  renderProducts(products);

  // Update cart
  updateCart();

  // Category buttons
  const filterButtons = document.querySelectorAll(
    "[data-filter]"
  );

  filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

      const category = button.getAttribute("data-filter");

      filterProducts(category);

      filterButtons.forEach(function (btn) {
        btn.classList.remove("active");
      });

      button.classList.add("active");
    });

  });

});
