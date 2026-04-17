const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { Name, Email, Password, UserType } = req.body;

  const hash = await bcrypt.hash(Password, 10);

  db.query(
    'INSERT INTO Users (Name, Email, PasswordHash, UserType) VALUES (?, ?, ?, ?)',
    [Name, Email, hash, UserType],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("User Registered");
    }
  );
};

exports.login = (req, res) => {
  const { Email, Password } = req.body;

  db.query('SELECT * FROM Users WHERE Email = ?', [Email], async (err, users) => {
    if (users.length === 0) return res.status(400).send("User not found");

    const user = users[0];
    const valid = await bcrypt.compare(Password, user.PasswordHash);

    if (!valid) return res.status(400).send("Wrong password");

    const token = jwt.sign({ id: user.UserID }, 'secret');

    res.json({ token });
  });
};
