# Specification: Center-ElSayad E-Commerce

## 🎯 Overview
Center-ElSayad is a comprehensive full-stack e-commerce mobile application designed for office & school supplies, educational books, and toys & games. It features a modern mobile-first design, role-based access control, and robust order management.

## 👥 User Types
- **Individual Customers (B2C)**: Regular customers for personal use.
- **Admins**: Store owners/managers (Super Admin, Inventory Manager, Order Manager, Customer Service).

## 📋 Functional Requirements

### 🛍️ Customer Features
- **Authentication**: Register, Login/Logout, Password reset, Profile management (edit, delete, picture).
- **Product Browsing**: Home page, Category browsing, Product details, Reviews, Search, Filters (Price, Category, Rating, Availability), Sorting (Price, Newest, Best sellers, Rated).
- **Shopping Cart**: Add/Update/Remove items, View total with tax.
- **Checkout**: Shipping address selection, Payment method (COD/Mock), Place order, Confirmation.
- **Orders**: View past orders, Order details, Track status (Pending, Processing, Shipped, Delivered), Download invoice.
- **Reviews**: Rate products (1-5), Write/Edit/Delete own reviews.

### 👨‍💼 Admin Features
- **Dashboard**: Sales analytics, Order counts, Low stock alerts.
- **Product Management**: CRUD products, stock management, featured products.
- **Category Management**: CRUD categories, reorder.
- **Order Management**: View/Filter orders, Update status, Print packing slips.
- **Customer Management**: View details, search, deactivate/ban.

## 📊 User Stories
- **As a customer**, I want to browse office supplies by category so that I can find what I need for my home office.
- **As a customer**, I want to search for specific products so that I can quickly find items.
- **As a customer**, I want to add items to my cart so that I can purchase multiple products at once.
- **As an admin**, I want to add new products with images so that customers can browse our catalog.
- **As an admin**, I want to update order statuses so that customers know when their orders are shipped.

## 🛡️ Non-Functional Requirements
- **Performance**: Mobile app must be responsive; API should handle concurrent requests efficiently.
- **Security**: JWT-based authentication; secure password hashing (bcrypt).
- **Maintainability**: TypeScript for type safety; structured backend (controllers, services, routes).
- **Styling**: Consistent design using NativeWind (TailwindCSS) and brand colors.
