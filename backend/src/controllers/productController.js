const Product = require('../models/productModel');

// Get all products
exports.getProducts = (req, res) => {
  Product.getAll((err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Add product
exports.addProduct = (req, res) => {
  const data = req.body;

  Product.create(data, (err) => {
    if (err) return res.status(500).send(err);
    res.send("Product added successfully");
  });
};
