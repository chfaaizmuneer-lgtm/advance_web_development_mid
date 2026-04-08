/**
 * routes/products.js
 * Express Router - Web (EJS) Routes for Products
 */

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');

// GET    /products          → List all products (with search/filter)
router.get('/', ctrl.getAllProducts);

// GET    /products/new      → Show create form
router.get('/new', ctrl.newProductForm);

// POST   /products          → Create new product
router.post('/', ctrl.createProduct);

// GET    /products/:id      → Show single product
router.get('/:id', ctrl.getProduct);

// GET    /products/:id/edit → Show edit form
router.get('/:id/edit', ctrl.editProductForm);

// PUT    /products/:id      → Update product
router.put('/:id', ctrl.updateProduct);

// DELETE /products/:id      → Delete product
router.delete('/:id', ctrl.deleteProduct);

module.exports = router;
