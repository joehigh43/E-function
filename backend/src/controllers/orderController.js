const Order = require('../models/orderModel');

exports.createOrder = (req, res) => {
  const data = req.body;

  Order.create(data, (err, result) => {
    if (err) return res.status(500).send(err);
    res.send("Order created");
  });
};

exports.getUserOrders = (req, res) => {
  const userId = req.params.userId;

  Order.getByUser(userId, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
};
