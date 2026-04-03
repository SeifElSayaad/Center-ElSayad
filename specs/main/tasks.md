# Tasks: Center-ElSayad

## 🏗️ Phase 1: Infrastructure & Database (Current Focus)
- [x] **T1.1**: Run Database Migration inside Docker. [Ref: NEXT-STEPS.md Step 1]
- [x] **T1.2**: Verify Schema via Prisma Studio. [Ref: NEXT-STEPS.md Step 2]
- [x] **T1.3**: Seed Database with sample data (categories/products). [Ref: NEXT-STEPS.md Step 3]
- [x] **T1.4**: Configure Store Settings (shipping, tax) in Database.

## 🔐 Phase 2: Backend - Authentication & Profile
- [x] **T2.1**: Implement `POST /auth/register` (B2C account). [Ref: NEXT-STEPS.md Step 4]
- [x] **T2.2**: Implement `POST /auth/login` (JWT token). [Ref: NEXT-STEPS.md Step 4]
- [x] **T2.3**: Implement `POST /auth/logout` (token invalidation). [Ref: NEXT-STEPS.md Step 4]
- [x] **T2.4**: Implement `GET /auth/me` (current profile). [Ref: NEXT-STEPS.md Step 4]
- [x] **T2.5**: Implement Address Management API (CRUD). [Ref: `address.controller.ts`]

## 🛍️ Phase 3: Backend - Product & Order API
- [x] **T3.1**: Implement Product API (List, Search, Filters). [Ref: NEXT-STEPS.md Step 5]
- [x] **T3.2**: Implement Category API (List, Product-by-category). [Ref: NEXT-STEPS.md Step 5]
- [x] **T3.3**: Implement Cart API (Add/Update/Delete). [Ref: `cartStore.ts`]
- [x] **T3.4**: Implement Order API (Place order, History, Status). [Ref: NEXT-STEPS.md Step 6]

## 🎨 Phase 4: Frontend - Foundation & Design System
- [x] **T4.1**: Configure Theme and Brand Colors in Tailwind. [Ref: `tailwind.config.js`]
- [x] **T4.2**: Set up Navigation Structure (AppNavigator). [Ref: `AppNavigator.tsx`]
- [x] **T4.3**: Integrate AuthContext with AsyncStorage. [Ref: `AuthContext.tsx`]
- [P] **T4.4**: Configure Social Auth Credentials (Google/FB). [Ref: NEXT-STEPS.md Step 7]

## 📱 Phase 5: Frontend - Core User Experience
- [x] **T5.1**: Develop Login & Registration Screens. [Ref: `LoginScreen.tsx`, `RegisterScreen.tsx`]
- [x] **T5.2**: Develop Home Screen with Featured Products. [Ref: `HomeScreen.tsx`]
- [x] **T5.3**: Develop Product Details Screen. [Ref: `ProductDetailsScreen.tsx`]
- [x] **T5.4**: Develop Cart & Checkout Flow. [Ref: `CartScreen.tsx`, `CheckoutScreen.tsx`]
- [x] **T5.5**: Develop Profile & Order History Screens. [Ref: `ProfileScreen.tsx`, `CustomerOrderScreen.tsx`]

## 👨‍💼 Phase 6: Admin Panel (Optional/Web)
- [x] **T6.1**: Implement Admin Middleware for role-based access. [Ref: `admin.middleware.ts`]
- [x] **T6.2**: Build Dashboard View (Sales/Orders). [Ref: `admin-panel/src/pages/Dashboard.tsx`]
- [x] **T6.3**: Build Product/Category Management UI. [Ref: `admin-panel/src/pages/Products.tsx`]
- [x] **T6.4**: Build Order Management UI. [Ref: `admin-panel/src/pages/Orders.tsx`]
