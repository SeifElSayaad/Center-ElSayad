# Center-ElSayad Project Context

## Introduction

This is the `Center-ElSayad` e-commerce application. It consists of a React Native mobile app (frontend) and a Node.js + Prisma API (backend) for office & school supplies, books, and toys.

### Tech Stack

- **Frontend**: React Native (Expo), TypeScript, React Navigation v7, NativeWind v4 (TailwindCSS), Zustand, Axios.
- **Backend**: Node.js, Express, TypeScript, PostgreSQL, Prisma.
- **Tools**: Docker, Git.

## Project Structure

- `frontend/`: Expo Mobile App.
  - `src/components/`: **CRITICAL:** Reusable UI components (`PrimaryButton`, `FormInput`, `PasswordInput`, `ScreenHeader`, `BottomNav`, `ProductCard`, `SearchBar`, etc.). **ALWAYS check here and reuse these components instead of building raw styled Views/Texts.**
  - `src/pages/`: App screens (`HomeScreen`, `LoginScreen`, `ProfileScreen`, etc.).
  - `src/navigation/`: App routing and flow.
  - `src/services/`: API calls (Axios instances and endpoints).
- `backend/`: Node.js Express API.
  - `prisma/schema.prisma`: Database schema and models (e.g., User, Address, Category, Product).
  - `src/controllers/`, `src/routes/`, `src/services/`: API implementation.

## Rules for AI Assistant (Claude Opus)

To save processing time and tokens while providing the best assistance:

1. **Be Concise with Code**: When proposing modifications, do NOT output the entire file. Use snippets and place `// ... existing code ...` around the lines you changed.
2. **Reuse Existing Components**: Look at `frontend/src/components/` first. Do not reinvent the wheel for standard form inputs, buttons, headers, or dividers.
3. **Tailwind First**: Use `className` (NativeWind / TailwindCSS style) for all frontend styling instead of React Native `StyleSheet`, unless dynamic inline styles are strictly necessary.
4. **Assume Existing Setup**: The project is already initialized with all core dependencies. Do not suggest running `npm install` for standard setups unless we are explicitly adding a new library.
5. **Database Changes**: Always update `prisma/schema.prisma` first when adding new features that require data persistence, then run `npx prisma format` and `npx prisma generate`.
6. **Git Commits**: After confirming that a feature or fix is working properly, always ask for permission to commit the changes to GitHub and write a descriptive, structured commit message.

## Design & Theme

- **Primary Color**: Red (`#DC1F2E` - mapped to Tailwind `text-primary` / `bg-primary`).
- Ensure consistent spacing using Tailwind (e.g., `p-4`, `gap-4`). Use `SafeAreaView` from `react-native-safe-area-context` for main screen layouts.
