import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRouter from './routes/auth.routes';
import productRouter from './routes/product.routes';
import categoryRouter from './routes/category.routes';
import orderRouter from './routes/order.routes';
import addressRouter from './routes/address.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Core Middleware ──────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get('/', (_req, res) => {
  res.json({ message: 'Center-ElSayad API is running!', version: '1.0.0' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/orders', orderRouter);
app.use('/addresses', addressRouter);

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

