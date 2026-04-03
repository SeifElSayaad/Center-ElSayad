# Implementation Plan: Center-ElSayad

## 🏗️ Architecture & Stack
- **Backend**: Node.js/TypeScript REST API using Express and Prisma ORM with a PostgreSQL database.
- **Frontend**: React Native mobile application (Expo) using TypeScript and NativeWind (TailwindCSS).
- **Authentication**: JWT with bcrypt password hashing.
- **State Management**: Zustand for global frontend state.
- **API Client**: Axios for HTTP requests.
- **Orchestration**: Docker and Docker Compose for development and deployment.

## 🗄️ Data Model Reference
- **User**: Authentication and profiles.
- **Address**: Saved shipping addresses.
- **Category**: Product classifications.
- **Product**: Goods with pricing and stock levels.
- **Order / OrderItem**: Sales tracking.
- **Review**: Ratings and comments.
- **CartItem**: Persistent shopping carts.

## 🚀 Phases
1. **Infrastructure**: Database, Docker, Prisma initialization.
2. **Backend - Core API**: Authentication, Categories, Products.
3. **Backend - Business Logic**: Addresses, Cart, Orders.
4. **Frontend - Core UI**: Design System, Navigation, Auth screens.
5. **Frontend - Browsing**: Home, Category, Product screens.
6. **Frontend - Commerce**: Cart, Checkout, Orders.
7. **Admin Panel**: Dashboard, Product/Order management.

## 🛠️ Technical Constraints
- **TypeScript**: Strict type safety across all codebase layers.
- **Prisma**: All database schema changes must occur via Prisma migrations.
- **NativeWind**: Styling must use Tailwind classes wherever possible.
- **Components**: Reuse core components in `frontend/src/components/`.
- **Environment**: All services must run via `docker-compose.yml`.
