/* ═══════════════════════════════════════════════════════════════
   script.js — FULL VERSION (JSON + ALL FEATURES)
═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   STATE
───────────────────────────────────────────────────────────── */
let DB_PRODUCTS = [];
let activeCategory = 'all';
let debounceTimer = null;

/* ─────────────────────────────────────────────────────────────
   DOM refs
───────────────────────────────────────────────────────────── */
const grid = document.getElementById('products-grid');
const countBadge = document.getElementById('products-count');
const searchInput = document.getElementById('search-input');
const filterContainer = document.getElementById('category-filters');
const notification = document.getElementById('notification');

// Modal
const backdrop = document.getElementById('modal-backdrop');
const modalBadge = document.getElementById('modal-badge');
const modalMainImg = document.getElementById('modal-main-img');
const modalCategory = document.getElementById('modal-category');
const modalTitle = document.getElementById('modal-title');
const modalRating = document.getElementById('modal-rating');
const modalPrice = document.getElementById('modal-price');
const modalOldPrice = document.getElementById('modal-original-price');
const modalDesc = document.getElementById('modal-description');
const modalSpecs = document.getElementById('modal-specs');
const modalClose = document.getElementById('modal-close');
const modalAddCart = document.getElementById('modal-add-cart');
const modalWishlist = document.getElementById('modal-wishlist');
const modalDecrease = document.getElementById('modal-decrease');
const modalIncrease = document.getElementById('modal-increase');
const modalQty = document.getElementById('modal-qty');

/* ─────────────────────────────────────────────────────────────
   LOAD JSON
───────────────────────────────────────────────────────────── */
async function loadProducts() {
    try {
        showSkeletons(6);

        const res = await fetch('./products.json');
        DB_PRODUCTS = await res.json();

        buildCategoryFilters();
        renderProducts();

    } catch (err) {
        console.error(err);
        grid.innerHTML = `<p style="text-align:center">Error loading products</p>`;
    }
}

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const fmt = (n) => '$' + parseFloat(n).toFixed(2);

function debounce(fn, ms = 280) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(fn, ms);
}

function starsHTML(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) html += '<i class="fas fa-star"></i>';
        else if (rating >= i - 0.5) html += '<i class="fas fa-star-half-alt"></i>';
        else html += '<i class="far fa-star"></i>';
    }
    return html;
}

/* ─────────────────────────────────────────────────────────────
   FILTERS
───────────────────────────────────────────────────────────── */
function buildCategoryFilters() {
    const categories = ['all', ...new Set(DB_PRODUCTS.map(p => p.category))];

    filterContainer.innerHTML = categories.map(cat => `
        <button class="filter-btn ${cat === 'all' ? 'active' : ''}" data-filter="${cat}">
            ${cat}
        </button>
    `).join('');

    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            activeCategory = this.dataset.filter;
            renderProducts();
        });
    });
}

function getFiltered() {
    const q = searchInput.value.toLowerCase();
    return DB_PRODUCTS.filter(p => {
        return (
            (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) &&
            (activeCategory === 'all' || p.category === activeCategory)
        );
    });
}

/* ─────────────────────────────────────────────────────────────
   SKELETON
───────────────────────────────────────────────────────────── */
function showSkeletons(count = 6) {
    grid.innerHTML = Array.from({ length: count }).map(() => `
        <div class="product-card skeleton-card"></div>
    `).join('');
}

/* ─────────────────────────────────────────────────────────────
   RENDER
───────────────────────────────────────────────────────────── */
function renderProducts() {
    const products = getFiltered();

    countBadge.textContent = `${products.length} products`;

    grid.innerHTML = products.map(p => `
        <article class="product-card" data-id="${p.id}">
            ${p.badge ? `<div class="card-badge">${p.badge}</div>` : ''}

            <img src="${p.image_url}" alt="${p.name}">

            <h3>${p.name}</h3>

            <div class="rating">
                ${starsHTML(p.rating)} (${p.reviewCount})
            </div>

            <div>
                <span>${fmt(p.price)}</span>
                ${p.originalPrice ? `<span>${fmt(p.originalPrice)}</span>` : ''}
            </div>

            <div class="card-actions" onclick="event.stopPropagation()">
                <button class="card-add-cart">
                    <i class="fas fa-shopping-cart"></i>
                </button>
                <button class="card-wishlist">
                    <i class="far fa-heart"></i>
                </button>
            </div>
        </article>
    `).join('');

    // EVENTS
    grid.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => openModal(Number(card.dataset.id)));
    });

    grid.querySelectorAll('.card-add-cart').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            handleAddToCart(btn);
        });
    });

    grid.querySelectorAll('.card-wishlist').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            toggleWishlist(btn);
        });
    });
}

/* ─────────────────────────────────────────────────────────────
   MODAL
───────────────────────────────────────────────────────────── */
function openModal(id) {
    const p = DB_PRODUCTS.find(x => x.id === id);
    if (!p) return;

    modalMainImg.src = p.image_url;
    modalTitle.textContent = p.name;
    modalPrice.textContent = fmt(p.price);
    modalDesc.textContent = p.description;

    modalSpecs.innerHTML = p.specs.map(s => `<li>${s}</li>`).join('');

    modalQty.value = 1;

    backdrop.classList.add('open');
}

function closeModal() {
    backdrop.classList.remove('open');
}

/* ─────────────────────────────────────────────────────────────
   CART + WISHLIST
───────────────────────────────────────────────────────────── */
function handleAddToCart(btn) {
    btn.innerHTML = '✔';
    showNotification();
}

function toggleWishlist(btn) {
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');

    if (btn.classList.contains('active')) {
        icon.classList.replace('far', 'fas');
    } else {
        icon.classList.replace('fas', 'far');
    }
}

function showNotification() {
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 2000);
}

/* ─────────────────────────────────────────────────────────────
   EVENTS
───────────────────────────────────────────────────────────── */
searchInput.addEventListener('input', () => debounce(renderProducts));

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
});

modalDecrease.addEventListener('click', () => {
    let v = parseInt(modalQty.value);
    if (v > 1) modalQty.value = v - 1;
});

modalIncrease.addEventListener('click', () => {
    let v = parseInt(modalQty.value);
    if (v < 99) modalQty.value = v + 1;
});

modalAddCart.addEventListener('click', function () {
    handleAddToCart(this);
});

modalWishlist.addEventListener('click', function () {
    toggleWishlist(this);
});

/* ─────────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────────── */
loadProducts();

//Hamburger menu
const menuBtn = document.getElementById('menuBtn');
const closeBtn = document.getElementById('closeBtn');
const sidebar = document.getElementById('sidebar');

// Open sidebar
menuBtn.addEventListener('click', () => {
  sidebar.classList.add('active');
});

// Close sidebar using the 'X'
closeBtn.addEventListener('click', () => {
  sidebar.classList.remove('active');
});