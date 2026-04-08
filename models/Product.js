/**
 * models/Product.js
 * Mongoose Schema & Model for Products
 * Includes validations and virtual fields
 */

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      trim: true,
      uppercase: true,
      match: [/^[A-Z0-9\-]+$/, 'SKU can only contain letters, numbers, and hyphens'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Electronics', 'Clothing', 'Food & Beverages', 'Furniture', 'Stationery', 'Sports', 'Other'],
        message: '{VALUE} is not a valid category',
      },
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0,
    },
    supplier: {
      type: String,
      trim: true,
      maxlength: [100, 'Supplier name cannot exceed 100 characters'],
      default: 'Unknown',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ─── Virtual: Stock Status ────────────────────────────────────────────────────
productSchema.virtual('stockStatus').get(function () {
  if (this.quantity === 0) return 'Out of Stock';
  if (this.quantity <= 10) return 'Low Stock';
  return 'In Stock';
});

// ─── Virtual: Total Value ─────────────────────────────────────────────────────
productSchema.virtual('totalValue').get(function () {
  return (this.price * this.quantity).toFixed(2);
});

// Ensure virtuals are included when converting to JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// ─── Index for search ─────────────────────────────────────────────────────────
productSchema.index({ name: 'text', sku: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
