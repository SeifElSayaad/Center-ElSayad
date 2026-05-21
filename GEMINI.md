# GEMINI.md - Center-ElSayad Project Context

## 🎯 Project Overview
**Center-ElSayad** is a comprehensive full-stack e-commerce mobile application designed for office & school supplies, educational books, and toys & games. It features a modern mobile-first design, role-based access control, and robust order management.

### 🏗️ Architecture
- **Monorepo Structure**: Contains both `frontend` (mobile app) and `backend` (API).
- **Backend**: Node.js/TypeScript REST API using Express and Prisma ORM with a PostgreSQL database.
- **Frontend**: React Native mobile application built with Expo. Styling is done via **`StyleSheet.create({})`** — NOT NativeWind/TailwindCSS classes.
- **Orchestration**: Docker and Docker Compose for consistent development and deployment environments.

---

## 🛠️ Tech Stack
- **Frontend**: React Native, Expo, TypeScript, Zustand (State Management), Axios (HTTP), `StyleSheet.create({})` (Styling).
- **Backend**: Node.js, Express.js, TypeScript, Prisma (ORM), PostgreSQL.
- **Authentication**: JWT (JSON Web Tokens) with bcrypt for password hashing.
- **Infrastructure**: Docker, Docker Compose.

---

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

---

## 📂 Project Structure

### Backend
- `backend/src/routes/`: API endpoint definitions — no logic here, only route registration.
- `backend/src/controllers/`: Request/response handlers — extract data from `req`, call a service, send a response. **No business logic.**
- `backend/src/services/`: All business logic and database interactions via Prisma. **This is where logic lives.**
- `backend/src/middleware/`: Auth guard (`requireAuth`), Zod validation wrapper (`validate`), and error handler.
- `backend/src/types/schemas.ts`: All Zod validation schemas for request bodies.
- `backend/prisma/schema.prisma`: Database schema — all changes must go through `prisma migrate dev`.

### Frontend
- `frontend/src/pages/`: Full-screen components (one file per screen).
- `frontend/src/components/`: Reusable UI components (e.g., `BottomNav`, `ScreenHeader`, `ProductCard`).
- `frontend/src/navigation/AppNavigator.tsx`: The single navigator using `NativeStackNavigator`. All screens must be registered here with their params typed in `RootStackParamList`.
- `frontend/src/store/`: Zustand stores for **non-auth** global state (cart, favorites, products, categories, addresses).
- `frontend/src/services/`: Raw Axios API call wrappers. One file per domain (e.g., `authApi.ts`, `cartApi.ts`).
- `frontend/src/auth/AuthContext.tsx`: **The single source of truth for the logged-in user.** Use `useAuth()` hook from this file to get `user`, `signIn`, and `signOut`. Do NOT create a Zustand store for auth.

---

## 🎨 UI Design System & Theme

All screens must follow this consistent theme (based on `HomeScreen.tsx` and `GuestProfileScreen.tsx`):

| Token | Value | Usage |
|---|---|---|
| Background | `#f8f6f6` | Root `View` background of every screen |
| Surface / Card | `#ffffff` | Cards, list rows, headers |
| Card Border | `#e2e8f0` | Border on all white cards |
| Primary | `#db1f2f` | Buttons, toggles, active icons, badges |
| Text Primary | `#0f172a` | Main headings and row labels |
| Text Secondary | `#64748b` | Subtitles, value labels, section titles |
| Text Disabled | `#94a3b8` | Chevron icons, placeholder text |
| Danger | `#dc2626` | Destructive actions (delete, danger zone) |
| Border Divider | `#f1f5f9` | Row dividers inside a card |
| Icon Bg (Red) | `rgba(219,31,47,0.1)` | Icon box background for primary-colored icons |
| Icon Bg (Neutral) | `#f1f5f9` | Icon box background for grey icons |

**Icons**: Use `MaterialIcons` from `@expo/vector-icons` exclusively.
**Styling**: All styles go in `StyleSheet.create({})` at the bottom of each file. No inline styles.
**Status Bar**: `barStyle="dark-content"` and `backgroundColor="#ffffff"` (or `"#f8f6f6"`) on every screen.

---

## 🔐 Authentication Architecture (Frontend)

- **Provider**: `AuthContext.tsx` wraps the app and manages the JWT token + user object.
- **Hook**: `const { user, signIn, signOut } = useAuth();` — import from `../auth/AuthContext`.
- **Guard pattern**: Screens check `if (!user)` and render `<GuestProfileScreen />` or redirect to `Login`. All `useState` hooks **must be declared before** the `if (!user)` guard (Rules of Hooks).
- **Zustand stores** (`cartStore`, `addressStore`, etc.) are for non-auth data only. Never create a Zustand store for the logged-in user.

---

## 🛠️ Development Conventions

- **TypeScript**: Used across both frontend and backend for type safety. `strict: true` is enforced.
- **Styling**: `StyleSheet.create({})` for all React Native styles. No inline styles, no NativeWind classes.
- **State Management**: Zustand for non-auth global state. `AuthContext` for the logged-in user.
- **Database**: Prisma migrations must be used for all schema changes — never edit the DB directly.
- **Validation**: All backend endpoints validate `req.body` using Zod schemas in `schemas.ts` before touching the database.
- **API Responses**: Standard JSON with appropriate HTTP status codes. Never expose raw Prisma errors to the client.
- **Error Handling**: Centralized error handling middleware in `server.ts`. All async controllers use `try/catch`.
- **Commit Convention**: Follow Conventional Commits — `feat(scope): description`, `fix(scope): description`, `docs(scope): description`, etc. See `clean-code-guard.md` for full rules.

---

## 📋 Key Commands

| Command | Location | Description |
|---|---|---|
| `npm run dev` | `backend/` | Start backend with hot-reload (nodemon + tsx) |
| `npx prisma studio` | `backend/` | Open DB browser UI at port 5555 |
| `npx prisma migrate dev` | `backend/` | Apply a new schema migration |
| `npm start` | `frontend/` | Start Expo dev server |
| `docker-compose up -d` | root | Start all services (DB, backend, frontend, admin) |
| `docker-compose down` | root | Stop all services |

---

## 📌 Important Files to Know

| File | Purpose |
|---|---|
| `frontend/src/navigation/AppNavigator.tsx` | Navigator + `RootStackParamList` type — register all new screens here |
| `frontend/src/auth/AuthContext.tsx` | Auth state — use `useAuth()` everywhere, never roll your own auth store |
| `backend/src/types/schemas.ts` | All Zod schemas — add new request schemas here |
| `backend/prisma/schema.prisma` | DB schema — all changes via `prisma migrate dev` |
| `deployment_plan.md` | Full project roadmap with phases and task tracker |
| `clean-code-guard.md` | Code quality rules — enforced on all code written in this project |
