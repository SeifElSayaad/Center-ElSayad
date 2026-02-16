# El Sayad Center - Backend

Node.js + TypeScript + Express + Prisma backend for El Sayad Center e-commerce app.

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Setup Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Run with Docker
```bash
# From project root
docker-compose up -d backend database
```

### Run Locally
```bash
npm run dev
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 🗃️ Database

Using PostgreSQL with Prisma ORM.

### Run Migrations
```bash
npx prisma migrate dev --name your-migration-name
```

### View Database
```bash
npx prisma studio
```

## 📁 Folder Structure

```
backend/
├── src/
│   ├── controllers/    # Request handlers
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── middleware/     # Auth, validation
│   ├── types/          # TypeScript types
│   ├── utils/          # Helper functions
│   └── server.ts       # Entry point
├── prisma/
│   └── schema.prisma   # Database schema
├── Dockerfile
├── package.json
└── README.md
```

## 🔗 API Endpoints

Coming soon...

## 🛠️ Tech Stack

- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
