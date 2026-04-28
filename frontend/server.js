/* ═══════════════════════════════════════════════════════════════
   server.js — Backend API for TechStore Cart
   
   Run: node server.js
   Requires: npm install express cors
═══════════════════════════════════════════════════════════════ */

const express = require('express');
const cors    = require('cors');
const app     = express();

app.use(cors());
app.use(express.json());

/* ─────────────────────────────────────────────────────────────
   IN-MEMORY DATABASE (استبدلها بـ MySQL أو MongoDB لو عندك)
───────────────────────────────────────────────────────────── */

// بيانات المنتجات (نفس الـ products.json)
const PRODUCTS = {
    1: { Name: "Aura Pro Noise-Cancelling Headphones", Price: 299.99 },
    2: { Name: "Aura Lite Headphones",                Price: 149.00 },
    3: { Name: "Aura Pods Pro",                        Price: 199.00 },
    4: { Name: "Premium Aluminum Stand",               Price:  45.00 },
};

// كارت في الميموري: { [userId]: { [productId]: quantity } }
let carts = {};

/* ─────────────────────────────────────────────────────────────
   GET /api/cart/:userId — جيب الكارت
───────────────────────────────────────────────────────────── */
app.get('/api/cart/:userId', (req, res) => {
    const userId = req.params.userId;
    const cart   = carts[userId] || {};

    const items = Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([productId, quantity]) => {
            const product = PRODUCTS[productId];
            if (!product) return null;
            return {
                ProductID: Number(productId),
                Name:      product.Name,
                Price:     product.Price,
                Quantity:  quantity
            };
        })
        .filter(Boolean);

    res.json(items);
});

/* ─────────────────────────────────────────────────────────────
   POST /api/cart/add — أضف أو عدّل كمية منتج
   Body: { CartID, ProductID, Quantity }
───────────────────────────────────────────────────────────── */
app.post('/api/cart/add', (req, res) => {
    const { CartID, ProductID, Quantity } = req.body;

    if (!CartID || !ProductID || Quantity === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!carts[CartID]) carts[CartID] = {};

    const current = carts[CartID][ProductID] || 0;
    const newQty  = current + Quantity;

    if (newQty <= 0) {
        delete carts[CartID][ProductID]; // اشيل المنتج لو الكمية وصلت 0 أو أقل
    } else {
        carts[CartID][ProductID] = newQty;
    }

    res.json({ success: true, quantity: Math.max(0, newQty) });
});

/* ─────────────────────────────────────────────────────────────
   POST /api/cart/delete — احذف منتج من الكارت
   Body: { CartID, ProductID }
───────────────────────────────────────────────────────────── */
app.post('/api/cart/delete', (req, res) => {
    const { CartID, ProductID } = req.body;

    if (!CartID || !ProductID) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (carts[CartID]) {
        delete carts[CartID][ProductID];
    }

    res.json({ success: true });
});

/* ─────────────────────────────────────────────────────────────
   POST /api/cart/clear — فضّي الكارت كله
   Body: { CartID }
───────────────────────────────────────────────────────────── */
app.post('/api/cart/clear', (req, res) => {
    const { CartID } = req.body;
    if (carts[CartID]) carts[CartID] = {};
    res.json({ success: true });
});

/* ─────────────────────────────────────────────────────────────
   START SERVER
───────────────────────────────────────────────────────────── */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
    console.log(`   Cart API: http://localhost:${PORT}/api/cart`);
});
