/**
 * app.js - Main Application Entry Point
 * Product/Inventory Management System
 * Author: Faaiz Muneer | SP23-BSE-005
 * Course: CSC337 Advanced Web Technologies
 */

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');

const productRoutes = require('./routes/products');
const apiRoutes = require('./routes/api');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// ─── Database Connection ─────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/inventory_db';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ─── View Engine Setup ───────────────────────────────────────────────────────
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(morgan('dev'));                          // HTTP request logger
app.use(express.json());                        // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));// Parse URL-encoded bodies
app.use(methodOverride('_method'));             // Support PUT/DELETE in forms
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// ─── Routes ─────────────────────────────────────────────────────────────────
app.get('/', (req, res) => res.redirect('/products'));
app.use('/products', productRoutes);
app.use('/api/products', apiRoutes);

// ─── Error Handling Middleware ───────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📦 Inventory Management System is live!`);
});

module.exports = app;
