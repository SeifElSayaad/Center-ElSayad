# Complete Project Setup Instructions

## 🎯 Overview

This guide will walk you through setting up the complete Center-ElSayad e-commerce project from scratch. Follow each step carefully!

---

## 📋 Step 1: Create GitHub Repository

### 1.1 Create Repository on GitHub
1. Go to **https://github.com**
2. Click **"New repository"** (green button or + icon)
3. Settings:
   - **Name**: `elsayad-center-ecommerce`
   - **Description**: `E-commerce mobile app for office & school supplies`
   - **Visibility**: Public or Private (your choice)
   - ✅ Check "Add a README file"
   - ✅ Add .gitignore → select "Node"
   - Click **"Create repository"**

### 1.2 Clone to Your Computer

Open PowerShell and run:

```powershell
# Navigate to where you want the project
cd C:\Users\Sayaad\

# Clone the repository (replace YOUR_USERNAME with your GitHub username)
git clone https://github.com/YOUR_USERNAME/elsayad-center-ecommerce.git

# Enter the project folder
cd elsayad-center-ecommerce
```

### 1.3 Configure Git (if first time)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 📁 Step 2: Create Project Structure

Create the folder structure:

```powershell
# Create backend and frontend folders
mkdir backend
mkdir frontend
mkdir docs

echo "# Center-ElSayad Backend" > backend\README.md
echo "# Center-ElSayad Frontend" > frontend\README.md
```

---

## 🔧 Step 3: Setup Backend

### 3.1 Initialize Node.js Project

```powershell
cd backend

# Initialize package.json
npm init -y
```

### 3.2 Install Dependencies

```powershell
# Core dependencies
npm install express cors dotenv bcrypt jsonwebtoken

# TypeScript and types
npm install -D typescript ts-node @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken nodemon tsx

# Prisma ORM
npm install prisma @prisma/client
npm install -D prisma
```

### 3.3 Initialize TypeScript

```powershell
npx tsc --init
```

Edit `tsconfig.json` and update:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 3.4 Initialize Prisma

```powershell
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Database schema
- `.env` - Environment variables

### 3.5 Create Backend Folder Structure

```powershell
# Create source folders
mkdir src
mkdir src\controllers
mkdir src\routes
mkdir src\services  
mkdir src\middleware
mkdir src\types
mkdir src\utils
```

### 3.6 Update package.json Scripts

Open `backend\package.json` and add:

```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  }
}
```

### 3.7 Create Basic Server File

Create `backend\src\server.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Center-ElSayad API is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### 3.8 Setup Environment Variables

Copy `.env.example` to `.env`:

```powershell
copy .env.example .env
```

Edit `.env` with your actual values (password, secrets, etc.)

---

## 🐳 Step 4: Setup Docker

### 4.1 Copy Docker Files

From the scratch folder, copy these files to your project root:

```powershell
# Go back to project root
cd ..

# Copy docker files (you need to create these first)
copy C:\Users\Sayaad\.gemini\antigravity\scratch\docker-compose.yml .\
copy C:\Users\Sayaad\.gemini\antigravity\scratch\backend-Dockerfile .\backend\Dockerfile
copy C:\Users\Sayaad\.gemini\antigravity\scratch\.gitignore .\
copy C:\Users\Sayaad\.gemini\antigravity\scratch\backend-.env.example .\backend\.env.example
```

### 4.2 Test Docker Setup

```powershell
# Start Docker containers
docker-compose up -d

# Check if containers are running
docker ps

# View logs
docker-compose logs backend
docker-compose logs database
```

### 4.3 Test Backend API

Open browser or use PowerShell:

```powershell
# Test if API is running
curl http://localhost:3000

# Should return: {"message":"Center-ElSayad API is running!"}
```

---

## 🗃️ Step 5: Setup Database Schema

### 5.1 Update Prisma Schema

Edit `backend\prisma\schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id                String        @id @default(uuid())
  email             String        @unique
  password          String
  name              String
  phone             String?
  role              Role          @default(CUSTOMER_B2C)
  accountStatus     AccountStatus @default(ACTIVE)
  businessDocuments String[]
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
}

enum Role {
  CUSTOMER_B2C
  CUSTOMER_B2B
  SUPER_ADMIN
  INVENTORY_MANAGER
  ORDER_MANAGER
  CUSTOMER_SERVICE
}

enum AccountStatus {
  ACTIVE
  PENDING_APPROVAL
  REJECTED
}
```

### 5.2 Run Migrations

```powershell
cd backend

# Create migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

---

## 📦 Step 6: First Git Commit

### 6.1 Copy Project Files

Copy all the setup files:
- `PROJECT-README.md` → Rename to `README.md` in project root
- Planning documents to `docs/` folder

### 6.2 Commit to GitHub

```powershell
# Make sure you're in project root
cd C:\Users\Sayaad\elsayad-center-ecommerce

# Add all files
git add .

# Commit
git commit -m "Initial project setup with backend and Docker configuration"

# Push to GitHub
git push origin main
```

---

## ✅ Step 7: Verify Everything Works

### 7.1 Check Docker

```powershell
docker-compose ps
```

All services should show "Up"

### 7.2 Check Database Connection

```powershell
cd backend
npx prisma studio
```

This opens a web interface to view your database

### 7.3 Test Backend

```powershell
# From backend folder
npm run dev
```

Visit http://localhost:3000 - should show API message

---

## 🎯 Next Steps

After completing this setup, you'll have:
- ✅ GitHub repository configured
- ✅ Backend project initialized
- ✅ Docker containers running
- ✅ Database setup with Prisma
- ✅ Initial Git commit

**Next phases:**
1. **Setup React Native frontend**
2. **Design remaining app screens**
3. **Build API endpoints**
4. **Code frontend screens**
5. **Connect frontend to backend**

---

## 🆘 Troubleshooting

### Docker Issues

```powershell
# Stop all containers
docker-compose down

# Rebuild and restart
docker-compose up --build

# Remove all containers and volumes (CAUTION: deletes data)
docker-compose down -v
```

### Port Already in Use

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Prisma Issues

```powershell
# Reset database (CAUTION: deletes all data)
npx prisma migrate reset

# Regenerate client
npx prisma generate
```

---

## 📞 Need Help?

If you encounter any issues:
1. Check error messages carefully
2. Verify all files are in correct locations
3. Ensure Docker is running
4. Check that ports 3000 and 5432 aren't in use
5. Ask me for help with specific error messages!

---

**Ready to start coding?** 🚀

Let me know when you've completed these steps and we'll move to frontend setup!
