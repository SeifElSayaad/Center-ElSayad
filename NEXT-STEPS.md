# Next Steps - Database Schema

## ✅ What's Done

- Backend running in Docker on `http://localhost:3000`
- PostgreSQL database healthy on port `5432`
- Prisma 7 configured with `prisma.config.ts`

---

## 🗄️ Database Schema Overview

The schema is defined in `backend/prisma/schema.prisma` and covers:

| Model          | Purpose                                           |
| -------------- | ------------------------------------------------- |
| `User`         | All users — B2C and Admin                         |
| `AdminProfile` | Admin role (Super Admin, Inventory Manager, etc.) |
| `Address`      | Saved shipping addresses per user                 |
| `Category`     | Product categories (Office, School, Books, Toys)  |
| `Product`      | Products with retail price + stock                |
| `ProductImage` | Multiple images per product                       |
| `CartItem`     | Shopping cart (one row per user+product)          |
| `Order`        | Orders with pricing snapshot                      |
| `OrderItem`    | Line items within an order                        |
| `Review`       | Product ratings (1–5 stars)                       |
| `WishlistItem` | Saved products per user                           |
| `StoreSetting` | Global config (shipping, tax)                     |

## 🚀 Next Steps (Follow in Order)

### Step 1: Run the Database Migration

Make sure Docker is running, then:

```powershell
cd "C:\Users\Sayaad\.gemini\antigravity\scratch\Center-ElSayad"
docker-compose up -d
```

Then run the migration inside the backend container:

```powershell
docker exec -it elsayad-backend npx prisma migrate dev --name init
```

This will:

- Create all tables in PostgreSQL
- Generate the Prisma Client

### Step 2: Verify the Schema in Prisma Studio

```powershell
docker exec -it elsayad-backend npx prisma studio
```

Open `http://localhost:5555` to browse your database visually.

> **Note:** You may need to expose port `5555` in `docker-compose.yml` for this to work.

### Step 3: Seed the Database (Optional but Recommended)

Create `backend/prisma/seed.ts` with sample categories and products so you have data to work with during development.

### Step 4: Build Authentication API

Now that the schema is ready, build these endpoints:

```
POST /auth/register     → Create B2C account
POST /auth/login        → Login, returns JWT token
POST /auth/logout       → Invalidate token
GET  /auth/me           → Get current user profile
```

### Step 5: Build Product API

```
GET    /products              → List products (with filters)
GET    /products/:id          → Single product details
POST   /products              → Create product (Admin only)
PUT    /products/:id          → Update product (Admin only)
DELETE /products/:id          → Delete product (Admin only)
GET    /categories            → List categories
```

### Step 6: Build Order API

```
POST /orders              → Place order
GET  /orders              → My order history
GET  /orders/:id          → Order details
PUT  /orders/:id/status   → Update status (Admin only)
```

---

## 🆘 Common Issues

### Migration fails — cannot connect to database

Make sure the database container is running and healthy:

```powershell
docker ps
docker-compose up -d database
```

### Prisma Client out of sync

If you change `schema.prisma`, regenerate the client:

```powershell
docker exec -it elsayad-backend npx prisma generate
```

---

## 🎯 After Database is Set Up

Next we'll build:

1. ✅ Database schema ← **You are here**
2. 🔐 Authentication (JWT)
3. 🛍️ Product & Category API
4. 📦 Order management API
5. 📱 React Native frontend
