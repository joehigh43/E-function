const db = require('../config/db');

const Product = {

  create: (data, callback) => {
    const sql = `
      INSERT INTO Products (Name, Description, Price, WholesalePrice, StockQuantity, TraderID)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      data.Name,
      data.Description,
      data.Price,
      data.WholesalePrice,
      data.StockQuantity,
      data.TraderID
    ], callback);
  },

  getAll: (callback) => {
    db.query('SELECT * FROM Products', callback);
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM Products WHERE ProductID = ?', [id], callback);
  }

};

module.exports = Product;
