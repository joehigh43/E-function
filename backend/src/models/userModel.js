const db = require('../config/db');

const User = {

  create: (data, callback) => {
    const sql = `
      INSERT INTO Users (Name, Email, PasswordHash, Phone, Address, UserType)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
      data.Name,
      data.Email,
      data.PasswordHash,
      data.Phone,
      data.Address,
      data.UserType
    ], callback);
  },

  findByEmail: (email, callback) => {
    db.query('SELECT * FROM Users WHERE Email = ?', [email], callback);
  },

  findById: (id, callback) => {
    db.query('SELECT * FROM Users WHERE UserID = ?', [id], callback);
  }

};

module.exports = User;
