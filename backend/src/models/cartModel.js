const db = require('../config/db');

const Cart = {

  createCart: (userId, callback) => {
    db.query('INSERT INTO Carts (UserID) VALUES (?)', [userId], callback);
  },

  addItem: (data, callback) => {
    const sql = `
      INSERT INTO CartItems (CartID, ProductID, Quantity)
      VALUES (?, ?, ?)
    `;

    db.query(sql, [
      data.CartID,
      data.ProductID,
      data.Quantity
    ], callback);
  },

  getCartByUser: (userId, callback) => {
    const sql = `
      SELECT * FROM CartItems
      JOIN Carts ON CartItems.CartID = Carts.CartID
      WHERE Carts.UserID = ?
    `;

    db.query(sql, [userId], callback);
  }

};

module.exports = Cart;

