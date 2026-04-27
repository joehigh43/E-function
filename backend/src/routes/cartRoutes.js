const router = require('express').Router();
const cartController = require('../controllers/cartController');

// Create cart
router.post('/create', cartController.createCart);

// Add item
router.post('/add', cartController.addToCart);

// Get cart by user
router.get('/:userId', cartController.getCart);

// delete item
router.post('/delete', cartController.deleteItem);

module.exports = router;
