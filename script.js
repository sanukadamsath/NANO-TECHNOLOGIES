const WHATSAPP_NUMBER = "94777176230";
const CART_STORAGE_KEY = "nanoCartV2";

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

let cart = loadCart();

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return [];

    return saved
      .map(item => ({
        id: Number(item.id),
        qty: Math.max(1, Number(item.qty) || 1)
      }))
      .filter(item => products.some(product => product.id === item.id));
  } catch (error) {
    console.warn("Could not load cart:", error);
    return [];
  }
}

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function money(value) {
  if (!value || Number(value) === 0) return "Contact for Price";
  return "Rs. " + Number(value).toLocaleString("en-LK");
}

function getProduct(id) {
  return products.find(product => product.id === Number(id));
}

function getCartQuantity() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal() {
  return cart.reduce((sum, item) => {
    const product = getProduct(item.id);
    return sum + (product ? Number(product.price || 0) * item.qty : 0);
  }, 0);
}

function productImageHTML(product, extraClass = "") {
  if (product.image) {
    return `<img src="${product.image}" alt="${escapeHTML(product.name)}" class="product-photo ${extraClass}" loading="lazy">`;
  }

  return `
    <div class="camera-placeholder ${extraClass}" aria-label="${escapeHTML(product.name)} image placeholder">
      <div class="camera-body"><div class="lens"></div></div>
      <small>Image coming soon</small>
    </div>
  `;
}

function renderProducts(list = products) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `<p class="empty-state">No products found in this category.</p>`;
    return;
  }

  grid.innerHTML = list.map(product => `
    <article class="product">
      <div class="product-image">
        ${productImageHTML(product)}
      </div>

      <div class="product-body">
        <span class="tag">${escapeHTML(product.badge)}</span>
        <h3>${escapeHTML(product.name)}</h3>
        <p class="desc">${escapeHTML(product.desc)}</p>

        <div class="price">
          ${product.mrp ? `<span class="mrp">${money(product.mrp)}</span>` : ""}
          <span class="sale">${money(product.price)}</span>
        </div>

        <div class="product-actions">
          <button class="smallbtn" type="button" data-details="${product.id}">Details</button>
          <button class="smallbtn buy" type="button" data-add="${product.id}">
            ${product.price ? "Add to Cart" : "WhatsApp"}
          </button>
        </div>
      </div>
    </article>
  `).join("");
}

function filterProducts(category) {
  const normalized = String(category || "ALL").toUpperCase();
  const filtered = normalized === "ALL"
    ? products
    : products.filter(product => product.cat === normalized);

  renderProducts(filtered);
}

function showProductDetails(id) {
  const product = getProduct(id);
  const container = document.getElementById("productDetails");
  if (!product || !container) return;

  container.innerHTML = `
    <div class="details-layout">
      <div class="details-image">${productImageHTML(product, "details-photo")}</div>
      <div>
        <span class="tag">${escapeHTML(product.badge)}</span>
        <h2 id="productModalTitle">${escapeHTML(product.name)}</h2>
        <p class="muted">${escapeHTML(product.desc)}</p>
        <div class="details-price">
          ${product.mrp ? `<span class="mrp">${money(product.mrp)}</span>` : ""}
          <strong>${money(product.price)}</strong>
        </div>
        <button class="btn primary full" type="button" data-modal-add="${product.id}">
          ${product.price ? "Add to Cart" : "Ask Price on WhatsApp"}
        </button>
      </div>
    </div>
  `;

  openModal("productModal");
}

function addToCart(id) {
  const product = getProduct(id);
  if (!product) return;

  if (!product.price) {
    openWhatsApp(
      `Hello Nano Technologies,\n\nI'm interested in ${product.name}. Please send me the latest price and availability.`
    );
    return;
  }

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: product.id, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`${product.name} added to cart`);
}

function changeQuantity(id, change) {
  const item = cart.find(cartItem => cartItem.id === Number(id));
  if (!item) return;

  item.qty += Number(change);

  if (item.qty <= 0) {
    cart = cart.filter(cartItem => cartItem.id !== Number(id));
  }

  saveCart();
  updateCartUI();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== Number(id));
  saveCart();
  updateCartUI();
  renderCart();
}

function renderCart() {
  const itemsContainer = document.getElementById("cartItems");
  const checkoutButton = document.getElementById("checkoutButton");
  if (!itemsContainer) return;

  if (!cart.length) {
    itemsContainer.innerHTML = `
      <div class="empty-cart">
        <div>🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add a product to continue.</p>
      </div>
    `;
    if (checkoutButton) checkoutButton.disabled = true;
    updateCartUI();
    return;
  }

  if (checkoutButton) checkoutButton.disabled = false;

  itemsContainer.innerHTML = cart.map(item => {
    const product = getProduct(item.id);
    if (!product) return "";

    return `
      <div class="cart-item">
        <div class="cart-thumb">${productImageHTML(product)}</div>

        <div class="cart-item-info">
          <strong>${escapeHTML(product.name)}</strong>
          <span>${money(product.price)}</span>

          <div class="qty-controls">
            <button type="button" data-qty="${product.id}" data-change="-1" aria-label="Decrease quantity">−</button>
            <span>${item.qty}</span>
            <button type="button" data-qty="${product.id}" data-change="1" aria-label="Increase quantity">+</button>
          </div>
        </div>

        <div class="cart-line-total">
          <strong>${money(product.price * item.qty)}</strong>
          <button class="remove-btn" type="button" data-remove="${product.id}">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  updateCartUI();
}

function updateCartUI() {
  const count = document.getElementById("cartCount");
  const total = document.getElementById("cartTotal");

  if (count) count.textContent = getCartQuantity();
  if (total) total.textContent = money(getCartTotal());
}

function checkout() {
  if (!cart.length) {
    showToast("Your cart is empty");
    return;
  }

  closeModal("cartModal");
  openModal("orderModal");
}

function submitOrder(event) {
  event.preventDefault();

  if (!cart.length) {
    closeModal("orderModal");
    showToast("Your cart is empty");
    return;
  }

  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();
  const address = document.getElementById("customerAddress").value.trim();
  const district = document.getElementById("customerDistrict").value.trim();
  const payment = document.getElementById("payment").value;
  const notes = document.getElementById("notes").value.trim();

  const orderLines = cart.map(item => {
    const product = getProduct(item.id);
    return product
      ? `• ${product.name} × ${item.qty} — ${money(product.price * item.qty)}`
      : "";
  }).filter(Boolean);

  const message = [
    "Hello Nano Technologies,",
    "",
    "I would like to place an order:",
    "",
    ...orderLines,
    "",
    `Total: ${money(getCartTotal())}`,
    "",
    "Customer Details",
    `Name: ${name}`,
    `Mobile: ${phone}`,
    `Address: ${address}`,
    `District: ${district}`,
    `Payment: ${payment}`,
    notes ? `Notes: ${notes}` : "",
    "",
    "Please confirm availability, delivery charge and final order details. Thank you."
  ].filter(line => line !== "").join("\n");

  openWhatsApp(message);
}

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");

  if (!document.querySelector(".modal.show")) {
    document.body.classList.remove("modal-open");
  }
}

function toggleMenu() {
  const nav = document.getElementById("nav");
  const menuButton = document.getElementById("menuButton");
  if (!nav || !menuButton) return;

  const isOpen = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.textContent = isOpen ? "✕" : "☰";
}

function closeMenu() {
  const nav = document.getElementById("nav");
  const menuButton = document.getElementById("menuButton");
  if (!nav || !menuButton) return;

  nav.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.textContent = "☰";
}

function showToast(message) {
  let toast = document.getElementById("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  document.getElementById("menuButton")?.addEventListener("click", toggleMenu);

  document.querySelectorAll("#nav a").forEach(link => {
    link.addEventListener("click", closeMenu);
  });

  document.getElementById("cartButton")?.addEventListener("click", () => {
    renderCart();
    openModal("cartModal");
  });

  document.getElementById("checkoutButton")?.addEventListener("click", checkout);
  document.getElementById("orderForm")?.addEventListener("submit", submitOrder);

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-filter]").forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");
      filterProducts(button.dataset.filter);
    });
  });

  document.addEventListener("click", event => {
    const detailsButton = event.target.closest("[data-details]");
    if (detailsButton) {
      showProductDetails(detailsButton.dataset.details);
      return;
    }

    const addButton = event.target.closest("[data-add]");
    if (addButton) {
      addToCart(addButton.dataset.add);
      return;
    }

    const modalAddButton = event.target.closest("[data-modal-add]");
    if (modalAddButton) {
      addToCart(modalAddButton.dataset.modalAdd);
      if (getProduct(modalAddButton.dataset.modalAdd)?.price) {
        closeModal("productModal");
      }
      return;
    }

    const qtyButton = event.target.closest("[data-qty]");
    if (qtyButton) {
      changeQuantity(qtyButton.dataset.qty, qtyButton.dataset.change);
      return;
    }

    const removeButton = event.target.closest("[data-remove]");
    if (removeButton) {
      removeFromCart(removeButton.dataset.remove);
      return;
    }

    const closeButton = event.target.closest("[data-close-modal]");
    if (closeButton) {
      closeModal(closeButton.dataset.closeModal);
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      document.querySelectorAll(".modal.show").forEach(modal => closeModal(modal.id));
      closeMenu();
    }
  });
});
