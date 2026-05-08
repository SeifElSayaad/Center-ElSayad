# 🏗️ Center-ElSayad — Full Project Plan: Current State → Deployment

---

## 📊 Current State Assessment

### ✅ What's Done & Working

#### Backend (Node.js / Express / Prisma / PostgreSQL)
| Module | Status | Notes |
|--------|--------|-------|
| Auth — Register/Login/Logout | ✅ Done | JWT-based, bcrypt |
| Auth — `GET /auth/me` | ✅ Done | Returns safe user object |
| Auth — Social Login (Google/FB) | ✅ Done | Token verification via provider API |
| Auth — Forgot/Reset Password | ✅ Done | OTP via DB, **no real email yet** (console.log only) |
| Products CRUD | ✅ Done | Filter by category, price, search, featured |
| Categories | ✅ Done | Basic list endpoint |
| Cart (CRUD) | ✅ Done | Per-user cart with product images |
| Favorites (toggle) | ✅ Done | Toggle add/remove |
| Orders — Place/List/Details | ✅ Done | Basic flow |
| Orders — Status update | ✅ Done | Admin-only endpoint |
| Address CRUD | ✅ Done | Multiple addresses per user |
| Admin — Dashboard Stats | ✅ Done | Revenue, orders, users, low-stock |
| Admin — Bulk CSV Sync | ✅ Done | Create/Update/Delete via CSV |
| Docker Compose | ✅ Done | DB, backend, Prisma Studio, frontend, admin |

#### Frontend Mobile App (React Native / Expo / NativeWind)
| Screen | Status | Notes |
|--------|--------|-------|
| HomeScreen | ✅ Done | Featured products, search bar, categories |
| CategoriesScreen | ✅ Done | Filter products by category |
| ProductDetailsScreen | ✅ Done | Images, add to cart, favorite toggle |
| LoginScreen | ✅ Done | Email/pass + social buttons wired |
| RegisterScreen | ✅ Done | Full form, API connected |
| ForgotPasswordScreen | ✅ Done | Sends OTP |
| ResetPasswordScreen | ✅ Done | OTP + new password |
| ProfileScreen | ✅ Done | View/edit user info |
| CartScreen | ✅ Done | List, qty update, remove |
| FavoritesScreen | ✅ Done | Grid, add to cart from favorites |
| CheckoutScreen | ✅ Done | Address + payment method + place order |
| AddressScreen | ✅ Done | List saved addresses, select for order |
| AddAddressScreen | ✅ Done | Create new address form |
| OrderConfirmScreen | ✅ Done | Post-order confirmation |
| CustomerOrderScreen | ✅ Done | Order details view |
| AppNavigator | ✅ Done | All screens registered |
| BottomNav | ✅ Done | Home / Categories / Favorites / Profile tabs |
| Stores (Zustand) | ✅ Done | cart, favorites, address, product, category |
| API Services | ✅ Done | auth, cart, order, product, category, favorites, address |

#### Admin Panel (Vite / React / Tailwind)
| Page | Status | Notes |
|--------|--------|-------|
| Login | ✅ Done | JWT stored in localStorage |
| Dashboard | ✅ Done | Stats cards + recent orders |
| Products (list + delete) | ✅ Done | Search works |
| Products — Add/Edit form | ❌ **Missing** | Placeholder toast only |
| Products — Image upload | ❌ **Missing** | No UI yet |
| Bulk Sync (CSV) | ✅ Done | Upload, preview, execute |
| Orders (list + status update) | ✅ Done | |
| Categories Management | ❌ **Missing** | No page at all |
| Customers Management | ❌ **Missing** | No page at all |
| Settings | ❌ **Missing** | |

---

## 🔴 Gap Analysis — What's Missing or Broken

### Priority 1 — Must Fix Before Any Testing (Blockers)

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 1 | **Password reset sends OTP to console only** — no real email | `auth.service.ts:180` | Users can't reset passwords in production |
| 2 | **Social auth keys not configured** | `SocialButtons.tsx` | Google/FB login broken on real devices |
| 3 | **Cart is fully client-only when not logged in** — cart store doesn't check auth state before syncing | `cartStore.ts` | Guest users get 401 errors silently on every cart action |
| 4 | **Admin `Add Product` button is a placeholder** | `Products.tsx:54` | Admins cannot add products via UI |
| 5 | **No input validation on backend** | All controllers | Raw `req.body` passed to service — no Zod/Joi validation |
| 6 | **JWT secret is hardcoded in docker-compose** | `docker-compose.yml:34` | Security risk — must be env secret |
| 7 | **CORS is wide open** (`app.use(cors())`) | `server.ts:21` | Must be restricted to known origins in production |

### Priority 2 — Core Features Incomplete

| # | Feature | Missing Piece |
|---|---------|--------------|
| 8 | **Product Reviews** | Backend model exists (`Review`), no API endpoints built |
| 9 | **Profile editing** | `ProfileScreen` has form but no save API call wired |
| 10 | **Admin — Add/Edit Product form** | Full CRUD form with image upload |
| 11 | **Admin — Categories CRUD** | No page at all |
| 12 | **Admin — Customer Management** | No page at all |
| 13 | **Order status doesn't sync to mobile** | CustomerOrderScreen fetches once; no polling/refresh |
| 14 | **No pagination** on products, orders (frontend loads all) | Performance issue with large catalogs |
| 15 | **Seeder** | No seed script — DB is empty after fresh migration |

### Priority 3 — Polish & Production Readiness

| # | Item |
|---|------|
| 16 | Rate limiting on auth endpoints |
| 17 | Request logging (Morgan or similar) |
| 18 | Health check endpoint improvements |
| 19 | `.env.example` files for both backend and frontend |
| 20 | Frontend error boundary component |
| 21 | Empty states & loading skeletons on all screens |
| 22 | App icon and splash screen for Expo |
| 23 | CI/CD pipeline |

---

## 🗺️ Execution Plan — Phase by Phase

---

### 🔧 Phase 1 — Stabilization (1–2 days)
> Fix all blockers so the app can be fully tested end-to-end

**Tasks:**

1. **Add Zod validation** to all backend controllers
   - Auth routes: `register`, `login`, `forgotPassword`, `resetPassword`
   - Product routes: `create`, `update`
   - Order routes: `place order`

2. **Restrict CORS** in `server.ts` to allow only the mobile app URL and admin panel URL

3. **Secure secrets** — move `JWT_SECRET` and DB credentials out of `docker-compose.yml` into `.env` files; add `.env.example`

4. **Fix auth-aware cart** — check `isLoggedIn` before calling sync APIs, or use a guest cart that migrates on login

5. **Create DB Seeder** (`backend/prisma/seed.ts`) — add 4 categories + ~20 sample products with real image URLs so the app has data to work with

**Deliverable:** App runs end-to-end locally with sample data, no auth errors, no console leaks

---

### ✉️ Phase 2 — Email Integration (1 day)
> Replace OTP console.log with a real transactional email

**Options (pick one):**
- **Resend** (recommended — free tier, simple API)
- **SendGrid**
- **Nodemailer + Gmail SMTP** (simplest for dev)

**Tasks:**
1. Install email provider SDK
2. Create `backend/src/utils/email.ts` — `sendOtpEmail(to, code)` helper
3. Replace `console.log` in `forgotPassword` with `sendOtpEmail()`
4. Add `EMAIL_API_KEY` to `.env`

---

### 📱 Phase 3 — Frontend Polish (2–3 days)
> Close all gaps in the mobile app

**Tasks:**
1. **Wire `ProfileScreen` save** — call `PATCH /auth/me` or a new `PUT /users/me` endpoint
2. **Add Product Reviews screens:**
   - Build `POST /reviews` and `GET /products/:id/reviews` backend endpoints
   - Add a reviews section to `ProductDetailsScreen`
3. **Skeleton loaders** for all list screens (HomeScreen, CategoriesScreen, FavoritesScreen)
4. **Pull-to-refresh** on CartScreen, FavoritesScreen, CustomerOrderScreen
5. **App icon + splash screen** — set in `app.json`
6. **Configure Social Auth keys** (Google Cloud Console + Facebook Developers)

---

### 🖥️ Phase 4 — Admin Panel Completion (2–3 days)
> Make the admin panel fully functional

**Tasks:**

1. **Add Product Form** (`/products/new`) — Modal or dedicated page with:
   - Name, slug, description, price, stock, category
   - Image URL input (or file upload to S3/Cloudinary)
   - Active/Featured toggles

2. **Edit Product Form** (`/products/:id/edit`) — Pre-filled form

3. **Categories Page** (`/categories`) — CRUD table:
   - List all categories
   - Add category (name, description, image URL)
   - Delete category

4. **Customers Page** (`/customers`) — Read-only view:
   - List all B2C users
   - Search by name/email
   - Deactivate/reactivate account toggle

5. **Admin route guard** — ensure only `ADMIN` users (from JWT payload or adminProfile check) can access the panel

---

### 🚀 Phase 5 — Deployment Preparation (1–2 days)

#### Backend Deployment (Railway / Render / Fly.io recommended)

1. Create a `Dockerfile.prod` for backend with multi-stage build
2. Remove development volume mounts from docker-compose for production
3. Set all environment variables as platform secrets:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `EMAIL_API_KEY`
   - `NODE_ENV=production`
4. Run `prisma migrate deploy` (not `migrate dev`) in production startup
5. Set up a managed PostgreSQL (Railway / Supabase / Neon)

#### Admin Panel Deployment (Vercel / Netlify)

1. Build: `npm run build`
2. Set `VITE_API_URL` to production backend URL
3. Deploy `dist/` to Vercel/Netlify

#### Mobile App Deployment (Expo / EAS)

1. Install EAS CLI: `npm install -g eas-cli`
2. Create `eas.json` with build profiles
3. Configure `app.json`:
   - `bundleIdentifier` (iOS)
   - `package` (Android)
   - App name, icon, splash
4. Update `apiClient.ts` base URL to production backend
5. Build: `eas build --platform all`
6. Submit to stores:
   - **Google Play**: Create app in Play Console, upload `.aab`
   - **Apple App Store**: Create app in App Store Connect, upload `.ipa`
   - Or distribute internally via **Expo Go / TestFlight / internal test track**

---

### 🔐 Phase 6 — Production Hardening (Ongoing)

| Item | Priority |
|------|----------|
| Rate limiting on `/auth/*` (express-rate-limit) | High |
| Request logging (Morgan) | Medium |
| Helmet.js for HTTP security headers | High |
| Database connection pooling (PgBouncer or Prisma pool config) | Medium |
| Automated backups for PostgreSQL | High |
| Error monitoring (Sentry) | Medium |
| APM / uptime monitoring (Better Uptime, UptimeRobot) | Medium |

---

## 📅 Recommended Execution Order

```
Week 1:  Phase 1 (Stabilization) + Phase 2 (Email)
Week 2:  Phase 3 (Frontend Polish)
Week 3:  Phase 4 (Admin Panel)
Week 4:  Phase 5 (Deployment) + Phase 6 starts
```

---

## 🎯 MVP Deployment Checklist

Before going live, verify each item:

- [ ] All 3 services build without errors (backend, frontend, admin)
- [ ] DB migration runs cleanly (`prisma migrate deploy`)
- [ ] Seeder creates initial categories
- [ ] Auth flow works end-to-end (register → login → order)
- [ ] Password reset sends a real email
- [ ] Admin can add/edit/delete products
- [ ] Admin can update order status
- [ ] CORS restricted to production domains
- [ ] JWT_SECRET is a strong random string (not the default)
- [ ] No sensitive keys in source code
- [ ] `.env.example` checked into git
- [ ] App icon and splash screen set
- [ ] EAS build succeeds for both platforms
- [ ] Backend deployed and responding at production URL
- [ ] Admin panel deployed and connected to production API
- [ ] Mobile app points to production API URL

---

## 📌 Quick Wins (Do Today)

These can be done immediately with minimal risk:

1. Create `backend/prisma/seed.ts` — gives you data to test against
2. Create `.env` and `.env.example` for backend — remove secrets from docker-compose
3. Add `helmet` and `express-rate-limit` to backend — 10 min security boost
4. Fix Admin "Add Product" button — build a basic modal form
