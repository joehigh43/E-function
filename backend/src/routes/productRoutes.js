const router = require('express').Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getProducts);

// Add product
router.post('/', productController.addProduct);

module.exports = router;
