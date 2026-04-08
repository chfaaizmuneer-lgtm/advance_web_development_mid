/**
 * controllers/apiController.js
 * RESTful API endpoints returning JSON responses
 * Author: Faaiz Muneer | SP23-BSE-005
 */

const Product = require('../models/Product');

// ─── GET /api/products ────────────────────────────────────────────────────────
exports.getAll = async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
exports.getOne = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// ─── POST /api/products ───────────────────────────────────────────────────────
exports.create = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, message: 'Product created', data: product });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: 'Validation Error', errors });
    }
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'SKU already exists' });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// ─── PUT /api/products/:id ────────────────────────────────────────────────────
exports.update = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product updated', data: product });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: 'Validation Error', errors });
    }
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
exports.remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};

// ─── GET /api/products/stats ──────────────────────────────────────────────────
exports.getStats = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ quantity: { $gt: 0, $lte: 10 } });
    const outOfStock = await Product.countDocuments({ quantity: 0 });
    const byCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalValue: { $sum: { $multiply: ['$price', '$quantity'] } } } },
    ]);
    const totalValue = await Product.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$quantity'] } } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProducts: total,
        lowStock,
        outOfStock,
        totalInventoryValue: totalValue[0] ? totalValue[0].total.toFixed(2) : '0.00',
        byCategory,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
  }
};
