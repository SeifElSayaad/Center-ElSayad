# E-Commerce App - Features & Requirements

## 👥 User Types

### 1. Individual Customers (B2C - Business to Consumer)

**Description**: Regular customers buying products for personal use

**Characteristics:**

- Pay full retail price
- Smaller order quantities
- Need detailed product information
- Value convenience and user experience
- May want to save favorites/wishlist
- Need order tracking

**Access Level:** Customer account with basic permissions

---

### 3. Admins

**Description**: Store owners/managers managing the platform

**Characteristics:**

- Full system access
- Manage products, inventory, and pricing
- Approve B2B customer accounts
- View analytics and reports
- Process orders
- Manage customer support

**Access Level:** Admin dashboard with full permissions

---

## 📱 Features Breakdown by User Type

### 🛍️ INDIVIDUAL CUSTOMERS (B2C)

#### Authentication & Profile

- [ ] Register new account (email + password)
- [ ] Login / Logout
- [ ] Password reset
- [ ] View and edit profile
- [ ] Upload profile picture
- [ ] Manage saved addresses
- [ ] View order history
- [ ] Delete account

#### Product Browsing

- [ ] View home page with featured products
- [ ] Browse products by category
  - [ ] Office Supplies
  - [ ] School Supplies
  - [ ] Educational Books
  - [ ] Toys & Games
- [ ] View product details (name, description, price, images, stock)
- [ ] View product reviews and ratings
- [ ] Search products by name/keyword
- [ ] Filter products by:
  - [ ] Price range
  - [ ] Category
  - [ ] Rating
  - [ ] Availability (in stock/out of stock)
- [ ] Sort products by:
  - [ ] Price (low to high, high to low)
  - [ ] Newest arrivals
  - [ ] Best sellers
  - [ ] Highest rated

#### Shopping Cart & Checkout

- [ ] Add products to cart
- [ ] View cart with item list
- [ ] Update product quantities in cart
- [ ] Remove items from cart
- [ ] View cart total (with tax calculation)
- [ ] Proceed to checkout
- [ ] Select/add shipping address
- [ ] Choose payment method
- [ ] Place order
- [ ] View order confirmation

#### Orders & Tracking

- [ ] View all past orders
- [ ] View order details (items, total, status)
- [ ] Track order status (Pending → Processing → Shipped → Delivered)
- [ ] Download invoice/receipt

#### Reviews & Ratings

- [ ] Rate purchased products (1-5 stars)
- [ ] Write product reviews
- [ ] Edit/delete own reviews
- [ ] View other customers' reviews

#### Notifications

- [ ] Push notifications for:
  - [ ] Order status updates
  - [ ] New product arrivals

---

### 👨‍💼 ADMIN

#### Role-Based Permissions

**Four Admin Roles:**

- **Super Admin**: Full access to all features
- **Inventory Manager**: Product and category management only
- **Order Manager**: Order management and customer support
- **Customer Service**: View-only access + order status updates

#### Dashboard & Analytics

- [ ] View dashboard overview (access level varies by role)
  - [ ] Total sales (daily/weekly/monthly)
  - [ ] Active orders count
  - [ ] Low stock alerts
  - [ ] Total customers
- [ ] View sales analytics
  - [ ] Revenue charts
  - [ ] Best-selling products
  - [ ] Category performance
  - [ ] Customer segments

#### Product Management

- [ ] View all products (list with search/filter)
- [ ] Add new product
  - [ ] Name, description, category
  - [ ] Price (retail)
  - [ ] Stock quantity
  - [ ] Upload multiple images
  - [ ] Set product status (active/inactive)
- [ ] Edit product details
- [ ] Delete product
- [ ] Bulk upload products (CSV import) - Optional
- [ ] Low stock alerts
- [ ] Set featured products (for homepage)

#### Category Management

- [ ] View all categories
- [ ] Add new category
- [ ] Edit category (name, description, image)
- [ ] Delete category
- [ ] Reorder categories

#### Order Management

- [ ] View all orders (with filters: status, date, customer type)
- [ ] View order details
- [ ] Update order status
  - [ ] Pending → Processing → Shipped → Delivered
- [ ] Cancel orders
- [ ] Print packing slips
- [ ] Export orders (CSV/Excel)

#### Customer Management

- [ ] View all customers
- [ ] View customer details (profile, order history)
- [ ] Search customers
- [ ] Deactivate/ban customer accounts
- [ ] Send notifications to customers (optional)

#### Reviews & Content Moderation (Optional)

- [ ] View all product reviews
- [ ] Moderate/delete inappropriate reviews
- [ ] Respond to customer reviews

#### Settings (Super Admin Only)

- [ ] Update store information (name, logo, contact)
- [ ] Manage admin users (add/remove admins)
- [ ] Assign admin roles (Super Admin, Inventory Manager, Order Manager, Customer Service)
- [ ] Configure payment settings
- [ ] Configure shipping settings (flat rate, free shipping threshold)
- [ ] Tax configuration
- [ ] Email notification templates

---

## 🎯 Feature Priority (MVP vs Future)

### ✅ Phase 1 - MVP (Must Have) - 4 Months

#### For Individual Customers:

1. User registration & login
2. Browse products by category
3. Search products
4. View product details
5. Add to cart
6. Checkout (basic, COD/mock payment)
7. View order history
8. Profile management

#### For Admins:

1. Product management (CRUD)
2. Category management
3. Order management (view, update status)
4. Customer management (view, search)
5. Basic dashboard (sales, orders count)

---

### 🌟 Phase 2 - Enhanced Features (Nice to Have) - Month 5-6

- Advanced filtering & sorting
- Sales analytics & reports
- Email notifications (order confirmations)
- Advanced search (autocomplete, suggestions)
- Product recommendations ("You may also like")

---

### 🚀 Phase 3 - Advanced Features (Future) - Month 7+

- Payment gateway integration (Stripe/PayPal)
- Real-time chat support
- Social sharing
- Loyalty program
- Multi-language support
- Multi-currency support
- Advanced inventory management
- Barcode scanning for products
- AR product preview (for toys)

---

## 📊 User Stories

### Individual Customer Stories

1. **As an individual customer**, I want to browse office supplies by category so that I can find what I need for my home office.
2. **As an individual customer**, I want to search for specific products so that I can quickly find items.
3. **As an individual customer**, I want to add items to my cart so that I can purchase multiple products at once.
4. **As an individual customer**, I want to view my order history so that I can track my purchases.
5. **As an individual customer**, I want to see product reviews so that I can make informed purchasing decisions.

### Store Customer (B2B) Stories

1. **As a store owner**, I want to register for a business account so that I can access wholesale pricing.
2. **As a store owner**, I want to see 20% discounted prices automatically so that I know my wholesale cost.
3. **As a store owner**, I want to place bulk orders easily so that I can stock my retail store.
4. **As a store owner**, I want to download business invoices so that I can maintain my accounting records.
5. **As a store owner**, I want to quickly reorder products from my order history so that I can restock efficiently.

### Admin Stories

1. **As an admin**, I want to add new products with images and descriptions so that customers can browse our catalog.
2. **As an admin**, I want to update order statuses so that customers know when their orders are shipped.
3. **As an admin**, I want to view sales analytics so that I can understand business performance.
4. **As an admin**, I want to manage inventory levels so that I can prevent stockouts.

---

## 💡 Special Considerations

### B2B Discount Implementation

**Option 1: Price Calculation at Runtime** (Recommended)

- Store only retail prices in database
- Calculate B2B price: `retailPrice * 0.80` when user is logged in as B2B
- Easier to change discount percentage globally

**Option 2: Separate Price Fields**

- Store both `retailPrice` and `wholesalePrice` in database
- More flexibility for per-product pricing
- More complex to maintain

**Recommendation:** Start with Option 1, migrate to Option 2 if needed

### B2B Verification Flow

1. User registers and selects "Business Account"
2. Submits business documents (photos/PDFs)
3. Account status: "Pending Verification"
4. Admin reviews documents in admin panel
5. Admin approves/rejects
6. User receives notification
7. If approved: User sees wholesale prices immediately

### Payment Considerations

**MVP:** Cash on Delivery (COD) or mock payment
**Future:**

- Credit card, PayPal, Stripe

---

## 📱 Platform-Specific Features

### Mobile App (React Native)

- Push notifications
- Biometric login (fingerprint/face ID)
- Camera for barcode scanning (future)
- Offline cart (save cart locally)

### Potential Web Admin Panel (Optional)

- More detailed analytics
- Bulk operations easier on desktop
- Better for data entry (products, categories)

---

## ✅ Finalized Decisions

### B2B Minimum Order

- **MVP**: No minimum order requirement
- **Future**: Admin can configure minimum order value/quantity (build flexibility into the system)

### Payment Implementation

- **MVP**: Mock payment / Cash on Delivery (COD)
- **Reason**: Learning project - no payment gateway integration cost
- **Future**: Real payment gateway integration (Stripe/PayPal) after learning phase

### Shipping

- **Handled by**: Store (you handle shipping)
- **Rates**: Single shipping approach
- **MVP**: Flat rate or free shipping threshold
- **Future**: Advanced shipping (weight-based, location-based rates)

### Admin Structure

- **Multiple Role-Based Permissions**:
  - **Super Admin**: Full access to everything
  - **Inventory Manager**: Product and category management only
  - **Order Manager**: Order management and customer support
  - **Customer Service**: View-only access + order status updates

### B2B Registration Flow

- **Approval Required Before Activation**:
  1. User registers as "Business Account"
  2. Submits business documents (license, Tax ID, etc.)
  3. Account status: "Pending Approval" (cannot shop yet)
  4. Admin reviews documents
  5. Admin approves/rejects
  6. If approved: Account activated with 20% discount
  7. User receives notification and can start shopping

### Product Publishing

- **Direct Publishing**: Admins can publish products immediately (no approval workflow needed)

---

## 🎯 Ready for Next Phase

All requirements are now finalized! Next step: **UI/UX Design in Figma**
