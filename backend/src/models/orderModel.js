const db = require('../config/db');

const Order = {

  create: (data, callback) => {
    const sql = `
      INSERT INTO Orders (UserID, TotalAmount, PaymentMethod, OrderStatus)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [
      data.UserID,
      data.TotalAmount,
      data.PaymentMethod,
      data.OrderStatus || 'Pending'
    ], callback);
  },

  getByUser: (userId, callback) => {
    db.query('SELECT * FROM Orders WHERE UserID = ?', [userId], callback);
  }

};

module.exports = Order;
