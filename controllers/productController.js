/**
 * controllers/productController.js
 * Handles all business logic for Product CRUD operations
 * Author: Faaiz Muneer | SP23-BSE-005
 */

const Product = require('../models/Product');

// ─── GET all products (with search & filter) ─────────────────────────────────
exports.getAllProducts = async (req, res) => {
  try {
    const { search, category, status } = req.query;
    let filter = {};

    // Search by name or SKU
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { supplier: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Filter by stock status
    if (status === 'low') {
      filter.quantity = { $gt: 0, $lte: 10 };
    } else if (status === 'out') {
      filter.quantity = 0;
    } else if (status === 'in') {
      filter.quantity = { $gt: 10 };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    // Summary stats
    const totalProducts = await Product.countDocuments();
    const lowStock = await Product.countDocuments({ quantity: { $gt: 0, $lte: 10 } });
    const outOfStock = await Product.countDocuments({ quantity: 0 });
    const totalValue = await Product.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$quantity'] } } } },
    ]);

    res.render('products/index', {
      products,
      search: search || '',
      selectedCategory: category || 'All',
      selectedStatus: status || 'all',
      stats: {
        total: totalProducts,
        lowStock,
        outOfStock,
        totalValue: totalValue[0] ? totalValue[0].total.toFixed(2) : '0.00',
      },
      categories: ['All', 'Electronics', 'Clothing', 'Food & Beverages', 'Furniture', 'Stationery', 'Sports', 'Other'],
      title: 'Inventory Dashboard',
    });
  } catch (err) {
    res.status(500).render('error', { message: 'Failed to fetch products', error: err });
  }
};

// ─── GET single product ───────────────────────────────────────────────────────
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).render('error', { message: 'Product not found', error: {} });
    res.render('products/show', { product, title: product.name });
  } catch (err) {
    res.status(500).render('error', { message: 'Error fetching product', error: err });
  }
};

// ─── GET new product form ─────────────────────────────────────────────────────
exports.newProductForm = (req, res) => {
  res.render('products/new', {
    categories: ['Electronics', 'Clothing', 'Food & Beverages', 'Furniture', 'Stationery', 'Sports', 'Other'],
    title: 'Add New Product',
    errors: [],
    formData: {},
  });
};

// ─── POST create product ──────────────────────────────────────────────────────
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.redirect('/products?success=Product+added+successfully');
  } catch (err) {
    const errors = err.errors
      ? Object.values(err.errors).map(e => e.message)
      : [err.message];

    res.status(400).render('products/new', {
      categories: ['Electronics', 'Clothing', 'Food & Beverages', 'Furniture', 'Stationery', 'Sports', 'Other'],
      title: 'Add New Product',
      errors,
      formData: req.body,
    });
  }
};

// ─── GET edit product form ────────────────────────────────────────────────────
exports.editProductForm = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).render('error', { message: 'Product not found', error: {} });
    res.render('products/edit', {
      product,
      categories: ['Electronics', 'Clothing', 'Food & Beverages', 'Furniture', 'Stationery', 'Sports', 'Other'],
      title: 'Edit Product',
      errors: [],
    });
  } catch (err) {
    res.status(500).render('error', { message: 'Error loading edit form', error: err });
  }
};

// ─── PUT update product ───────────────────────────────────────────────────────
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).render('error', { message: 'Product not found', error: {} });
    res.redirect(`/products/${product._id}?success=Product+updated+successfully`);
  } catch (err) {
    const errors = err.errors
      ? Object.values(err.errors).map(e => e.message)
      : [err.message];

    const product = await Product.findById(req.params.id);
    res.status(400).render('products/edit', {
      product,
      categories: ['Electronics', 'Clothing', 'Food & Beverages', 'Furniture', 'Stationery', 'Sports', 'Other'],
      title: 'Edit Product',
      errors,
    });
  }
};

// ─── DELETE product ───────────────────────────────────────────────────────────
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).render('error', { message: 'Product not found', error: {} });
    res.redirect('/products?success=Product+deleted+successfully');
  } catch (err) {
    res.status(500).render('error', { message: 'Error deleting product', error: err });
  }
};
