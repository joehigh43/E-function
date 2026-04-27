const router = require('express').Router();
const orderController = require('../controllers/orderController');

// Create order
router.post('/', orderController.createOrder);

// Get user orders
router.get('/:userId', orderController.getUserOrders);

module.exports = router;
