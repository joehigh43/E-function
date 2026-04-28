/* ═══════════════════════════════════════════════════════════════
   cart.js — FULL VERSION (API + ERROR HANDLING + UX)
═══════════════════════════════════════════════════════════════ */

const API    = "http://localhost:3000/api/cart";
const userId = 1; // غيّره لما تربطه بالـ login

const cartDiv = document.getElementById("cartItems");
const totalDiv = document.getElementById("total");

/* ─────────────────────────────────────────────────────────────
   LOAD CART
───────────────────────────────────────────────────────────── */
async function loadCart() {
    try {
        cartDiv.innerHTML = `<p class="loading-msg"><span class="spinner"></span> Loading cart...</p>`;

        const res = await fetch(`${API}/${userId}`);
        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();

        cartDiv.innerHTML = "";
        let total = 0;

        if (data.length === 0) {
            cartDiv.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Go add some products!</p>
                    <a href="products.html" class="btn-shop">Browse Products</a>
                </div>
            `;
            totalDiv.innerText = "";
            return;
        }

        data.forEach(item => {
            total += item.Price * item.Quantity;

            const div = document.createElement("div");
            div.className = "cart-item";
            div.id = `item-${item.ProductID}`;
            div.innerHTML = `
                <div class="item-info">
                    <h4>${item.Name}</h4>
                    <p class="item-price">${fmt(item.Price)} × ${item.Quantity} = <strong>${fmt(item.Price * item.Quantity)}</strong></p>
                </div>
                <div class="item-controls">
                    <button class="btn-qty add"   onclick="updateQty(${item.ProductID},  1)">+</button>
                    <span class="qty-display">${item.Quantity}</span>
                    <button class="btn-qty remove" onclick="updateQty(${item.ProductID}, -1)">−</button>
                    <button class="btn-qty delete" onclick="deleteItem(${item.ProductID})">🗑</button>
                </div>
            `;
            cartDiv.appendChild(div);
        });

        totalDiv.innerHTML = `Total: <strong>${fmt(total)}</strong>`;

    } catch (err) {
        console.error("Load cart error:", err);
        cartDiv.innerHTML = `
            <div class="error-msg">
                ⚠️ Could not load cart. Make sure the server is running.<br>
                <button onclick="loadCart()" class="btn-retry">Retry</button>
            </div>
        `;
    }
}

/* ─────────────────────────────────────────────────────────────
   UPDATE QUANTITY
───────────────────────────────────────────────────────────── */
async function updateQty(productId, change) {
    try {
        const res = await fetch(`${API}/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                CartID: userId,
                ProductID: productId,
                Quantity: change
            })
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        await loadCart();
    } catch (err) {
        console.error("Update qty error:", err);
        alert("Could not update quantity. Please try again.");
    }
}

/* ─────────────────────────────────────────────────────────────
   DELETE ITEM
───────────────────────────────────────────────────────────── */
async function deleteItem(productId) {
    // Optimistic UI — اشيل العنصر فوراً
    const el = document.getElementById(`item-${productId}`);
    if (el) {
        el.style.opacity = "0.4";
        el.style.pointerEvents = "none";
    }

    try {
        const res = await fetch(`${API}/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                CartID: userId,
                ProductID: productId
            })
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        await loadCart();
    } catch (err) {
        console.error("Delete item error:", err);
        if (el) {
            el.style.opacity = "1";
            el.style.pointerEvents = "auto";
        }
        alert("Could not remove item. Please try again.");
    }
}

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
const fmt = (n) => '$' + parseFloat(n).toFixed(2);

/* ─────────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────────── */
loadCart();

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