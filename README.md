# 📦 InvenTrack — Product/Inventory Management System

> **Course:** CSC337 Advanced Web Technologies — Mid Lab Exam (Spring 2026)  
> **Student:** Faaiz Muneer | SP23-BSE-005  
> **Instructor:** Yasmeen Jana  
> **Institution:** COMSATS University Islamabad, Vehari Campus  

---

## 🚀 Overview

InvenTrack is a full-stack web application for managing product inventory. It is built with **Node.js**, **Express.js**, **MongoDB**, **EJS**, and **Bootstrap 5**. The application provides a complete RESTful API along with a dynamic, responsive UI.

---

## 🛠️ Tech Stack

| Layer       | Technology                     |
|-------------|-------------------------------|
| Backend     | Node.js + Express.js          |
| Database    | MongoDB + Mongoose ODM         |
| View Engine | EJS (Embedded JavaScript)     |
| Frontend    | Bootstrap 5 + Bootstrap Icons |
| Middleware  | method-override, morgan, dotenv|

---

## 📁 Folder Structure

```
inventory-app/
├── app.js                  # Main application entry point
├── .env                    # Environment variables
├── package.json
├── controllers/
│   ├── productController.js  # Web (EJS) CRUD logic
│   └── apiController.js      # JSON REST API logic
├── models/
│   └── Product.js            # Mongoose schema & model
├── routes/
│   ├── products.js           # Web routes
│   └── api.js                # API routes
├── middleware/
│   └── errorHandler.js       # 404 & global error handler
├── views/
│   ├── error.ejs
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   └── products/
│       ├── index.ejs         # Dashboard / product list
│       ├── new.ejs           # Create product form
│       ├── edit.ejs          # Edit product form
│       └── show.ejs          # Product detail page
└── public/                   # Static assets (CSS, JS, images)
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/inventory-app.git
cd inventory-app

# 2. Install dependencies
npm install

# 3. Configure environment variables
# Edit .env file:
PORT=3000
MONGO_URI=mongodb://localhost:27017/inventory_db
NODE_ENV=development

# 4. Start the server
npm start

# For development with auto-reload:
npm run dev
```

Open your browser at: **http://localhost:3000**

---

## 🔗 REST API Endpoints

| Method | Endpoint                   | Description                         | Status Code |
|--------|----------------------------|-------------------------------------|-------------|
| GET    | `/api/products`            | Get all products (supports ?search= and ?category=) | 200 |
| GET    | `/api/products/stats`      | Get inventory statistics            | 200         |
| GET    | `/api/products/:id`        | Get a single product by ID          | 200 / 404   |
| POST   | `/api/products`            | Create a new product                | 201 / 400   |
| PUT    | `/api/products/:id`        | Update a product by ID              | 200 / 400   |
| DELETE | `/api/products/:id`        | Delete a product by ID              | 200 / 404   |

### Sample Request (Create Product)

```http
POST /api/products
Content-Type: application/json

{
  "name": "Wireless Headphones",
  "sku": "WH-001",
  "category": "Electronics",
  "price": 49.99,
  "quantity": 100,
  "supplier": "Tech Corp",
  "description": "Over-ear Bluetooth headphones"
}
```

### Sample Response

```json
{
  "success": true,
  "message": "Product created",
  "data": {
    "_id": "...",
    "name": "Wireless Headphones",
    "sku": "WH-001",
    "category": "Electronics",
    "price": 49.99,
    "quantity": 100,
    "supplier": "Tech Corp",
    "stockStatus": "In Stock",
    "totalValue": "4999.00",
    "createdAt": "2026-03-30T...",
    "updatedAt": "2026-03-30T..."
  }
}
```

---

## ✨ Features

- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ RESTful API with JSON responses & correct HTTP status codes
- ✅ MongoDB integration with Mongoose schema validations
- ✅ Dynamic EJS views with server-side rendering
- ✅ Bootstrap 5 responsive UI (navbar, cards, tables, forms, badges)
- ✅ Search by name, SKU, or supplier
- ✅ Filter by category and stock status
- ✅ Inventory statistics dashboard (total, low stock, out of stock, value)
- ✅ Virtual fields: `stockStatus` and `totalValue`
- ✅ Global error handling middleware
- ✅ HTTP method override for PUT/DELETE in HTML forms
- ✅ Request logging with Morgan

---

## 📄 License

MIT — For educational purposes only.
