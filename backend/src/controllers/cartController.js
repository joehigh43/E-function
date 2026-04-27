const Cart = require('../models/cartModel');

// create cart
exports.createCart = (req, res) => {
  const { userId } = req.body;

  Cart.createCart(userId, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Cart created");
  });
};

// add item
exports.addToCart = (req, res) => {
  const data = req.body;

  Cart.addItem(data, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Added to cart");
  });
};

// get cart
exports.getCart = (req, res) => {
  const userId = req.params.userId;

  Cart.getCartByUser(userId, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};
