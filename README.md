# Center-ElSayad E-Commerce App

> Mobile e-commerce application for office & school supplies, educational books, and toys & games.

## 🎯 Project Overview

**Center-ElSayad** is a full-stack mobile e-commerce application built with React Native for the frontend and Node.js/TypeScript for the backend.

### Key Features

- 🛒 Product browsing and search
- 📱 Mobile-first design (iOS & Android)
- 👥 Multiple user types (Customers, Admins)
- ⭐ Product reviews and ratings
- 🔔 Push notifications
- 👨‍💼 Admin dashboard with role-based permissions
- 📦 Order management and tracking

## 🏗️ Project Structure

```
elsayad-center-ecommerce/
├── frontend/                 # React Native mobile app
│   ├── src/
│   │   ├── pages/         # App screens
│   │   ├── components/      # Reusable components
│   │   ├── navigation/      # Navigation configuration
│   │   ├── services/        # API calls
│   │   ├── store/          # State management
│   │   └── constants/      # Colors, fonts, etc.
│   ├── package.json
│   └── README.md
│
├── backend/                  # Node.js + TypeScript API
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Auth, validation
│   │   └── types/          # TypeScript types
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
│
├── docker-compose.yml        # Docker orchestration
├── .gitignore
└── README.md                # This file
```

## 🛠️ Tech Stack

### Frontend

- **React Native** - Cross-platform mobile framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **React Native Paper** - UI components

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Prisma** - ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Git** - Version control
- **GitHub** - Repository hosting

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ installed
- **Docker** and **Docker Compose** installed
- **Git** installed
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, Mac only)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/elsayad-center-ecommerce.git
   cd elsayad-center-ecommerce
   ```

2. **Setup Backend:**

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Setup Frontend:**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Run with Docker (Recommended):**

   ```bash
   # From project root
   docker-compose up -d
   ```

5. **Run Backend Locally (Alternative):**

   ```bash
   cd backend
   npm run dev
   ```

6. **Run Mobile App:**

   ```bash
   cd frontend
   # For Android
   npm run android

   # For iOS (Mac only)
   npm run ios
   ```

## 📱 User Types

### 1. Customers

- Browse and purchase products
- Product reviews and ratings
- Order tracking
- Wishlist management

### 3. Admins

- **Super Admin** - Full system access
- **Inventory Manager** - Product and category management
- **Order Manager** - Order processing
- **Customer Service** - View-only + order updates

## 🎨 Brand Colors

- **Primary Red**: `#DC1F2E`
- **Black**: `#000000`
- **Background**: `#F5F5F5`
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

## 📋 Development Roadmap

- [x] Project planning and requirements
- [x] UI/UX design (Home screen)
- [x] Project setup and Docker configuration
- [x] Remaining UI/UX screens
- [x] Frontend development (React Native)
- [x] Backend API development
- [x] Database setup and migrations
- [x] Authentication system
- [x] Product management
- [x] Order processing
- [x] Admin dashboard
- [x] Testing
- [x] Deployment

## 🔒 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://elsayad:elsayad2024@localhost:5432/ecommerce
JWT_SECRET=your-super-secret-jwt-key
PORT=3000
NODE_ENV=development
```

## 📚 Documentation

- [Features & Requirements](./docs/features_and_requirements.md)
- [Implementation Plan](./docs/implementation_plan.md)
- [Brand Colors & Design System](./docs/brand_colors_design_system.md)
- [GitHub Setup Guide](./docs/github_setup_guide.md)

## 🤝 Contributing

This is a learning project. Contributions, issues, and feature requests are welcome!

## 📝 License

This project is for educational purposes.

## 👨‍💻 Developer

Created by Seif ElSayaad as a learning project to master full-stack mobile development.
