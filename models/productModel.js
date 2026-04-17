const db = require('../config/db');

exports.getProducts = (req, res) => {
  db.query('SELECT * FROM Products', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

exports.addProduct = (req, res) => {
  const { Name, Price, TraderID } = req.body;

  db.query(
    'INSERT INTO Products (Name, Price, TraderID) VALUES (?, ?, ?)',
    [Name, Price, TraderID],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Product added");
    }
  );
};
