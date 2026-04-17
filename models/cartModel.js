const db = require('../config/db');

exports.addToCart = (req, res) => {
  const { CartID, ProductID, Quantity } = req.body;

  db.query(
    'INSERT INTO CartItems (CartID, ProductID, Quantity) VALUES (?, ?, ?)',
    [CartID, ProductID, Quantity],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("Added to cart");
    }
  );
};

exports.getCart = (req, res) => {
  const userId = req.params.userId;

  db.query(
    `SELECT * FROM CartItems 
     JOIN Carts ON CartItems.CartID = Carts.CartID 
     WHERE Carts.UserID = ?`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
};
