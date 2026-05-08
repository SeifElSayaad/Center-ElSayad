import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRouter from './routes/auth.routes';
import productRouter from './routes/product.routes';
import categoryRouter from './routes/category.routes';
import orderRouter from './routes/order.routes';
import addressRouter from './routes/address.routes';
import adminRouter from './routes/admin.routes';
import cartRouter from './routes/cart.routes';
import favoriteRouter from './routes/favorite.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isDev = process.env.NODE_ENV !== 'production';

// ─── Security Middleware ──────────────────────────────────────────────────────

// HTTP security headers
app.use(helmet());

// CORS — restrict to known origins in production
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:8081', 'http://localhost:19000', 'http://localhost:5173'];

app.use(
  cors({
    origin: isDev
      ? true // Allow all in dev
      : (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error(`CORS: origin ${origin} not allowed`));
          }
        },
    credentials: true,
  })
);

// Request logging
app.use(morgan(isDev ? 'dev' : 'combined'));

// Auth rate limiter — 10 requests per 15 min per IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// ─── Core Middleware ──────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({ message: 'Center-ElSayad API is running!', version: '1.0.0' });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
  });
});

app.use('/auth', authLimiter, authRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/orders', orderRouter);
app.use('/addresses', addressRouter);
app.use('/admin', adminRouter);
app.use('/cart', cartRouter);
app.use('/favorites', favoriteRouter);

// ─── Global Error Handler ─────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error & { status?: number }, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status ?? 500;
  const message = err.message ?? 'Internal server error';
  res.status(status).json({ error: message });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

