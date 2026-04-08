/**
 * routes/api.js
 * Express Router - RESTful API Routes (JSON responses)
 */

const express = require('express');
const router = express.Router();
const api = require('../controllers/apiController');

// GET    /api/products/stats  → Inventory statistics
router.get('/stats', api.getStats);

// GET    /api/products        → Get all products
router.get('/', api.getAll);

// GET    /api/products/:id    → Get single product
router.get('/:id', api.getOne);

// POST   /api/products        → Create product
router.post('/', api.create);

// PUT    /api/products/:id    → Update product
router.put('/:id', api.update);

// DELETE /api/products/:id    → Delete product
router.delete('/:id', api.remove);

module.exports = router;
