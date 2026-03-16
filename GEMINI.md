# GEMINI.md - Center-ElSayad Project Context

## 🎯 Project Overview
**Center-ElSayad** is a comprehensive full-stack e-commerce mobile application designed for office & school supplies, educational books, and toys & games. It features a modern mobile-first design, role-based access control, and robust order management.

### 🏗️ Architecture
- **Monorepo Structure**: Contains both `frontend` (mobile app) and `backend` (API).
- **Backend**: Node.js/TypeScript REST API using Express and Prisma ORM with a PostgreSQL database.
- **Frontend**: React Native mobile application built with Expo and NativeWind (TailwindCSS).
- **Orchestration**: Docker and Docker Compose for consistent development and deployment environments.

## 🛠️ Tech Stack
- **Frontend**: React Native, Expo, TypeScript, Zustand (State Management), Axios (HTTP), NativeWind (Styling).
- **Backend**: Node.js, Express.js, TypeScript, Prisma (ORM), PostgreSQL.
- **Authentication**: JWT (JSON Web Tokens) with bcrypt for password hashing.
- **Infrastructure**: Docker, Docker Compose.

## 🚀 Building and Running

### Prerequisites
- Node.js v18+
- Docker & Docker Compose
- Expo Go (on mobile device) or Android Studio/Xcode (for emulators)

### Using Docker (Recommended)
From the project root:
```powershell
docker-compose up -d
```
This starts the database, backend API (port 3000), Prisma Studio (port 5555), and Expo dev server (port 8081).

### Manual Setup

#### Backend
```powershell
cd backend
npm install
# Copy .env.example to .env and configure
npx prisma migrate dev
npx prisma generate
npm run dev
```

#### Frontend
```powershell
cd frontend
npm install
npm start
```

## 📂 Project Structure Highlights
- `backend/src/controllers`: Request handlers for business logic.
- `backend/src/routes`: API endpoint definitions.
- `backend/src/services`: Core business logic and database interactions via Prisma.
- `frontend/src/pages`: Main application screens (Home, Cart, Profile, etc.).
- `frontend/src/components`: Reusable UI components.
- `frontend/src/navigation`: App navigation logic using React Navigation.
- `docs/`: Comprehensive project documentation, design systems, and implementation plans.

## 🛠️ Development Conventions
- **TypeScript**: Used across both frontend and backend for type safety.
- **Styling**: NativeWind (TailwindCSS) is used for the frontend. Avoid inline styles where possible.
- **State Management**: Zustand is preferred for global state in the frontend.
- **Database**: Prisma migrations must be used for all schema changes.
- **API Response**: Standard JSON responses with appropriate HTTP status codes.
- **Error Handling**: Centralized error handling middleware in the backend (`server.ts`).

## 📋 Key Commands
- `npm run dev` (Backend): Starts backend with nodemon and tsx.
- `npx prisma studio` (Backend): Opens a web UI to explore the database.
- `npm start` (Frontend): Starts the Expo development server.
- `docker-compose down` (Root): Stops all services.
