import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './db/database.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import menuRoutes from './routes/menu.routes.js';
import orderRoutes from './routes/orders.routes.js';
import cartRoutes from './routes/cart.routes.js';
import storeRoutes from './routes/stores.routes.js';
import dealRoutes from './routes/deals.routes.js';
import rewardsRoutes from './routes/rewards.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '*')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    app: 'Burger King API',
    status: 'running',
    message: 'Backend is running successfully',
    docs: {
      health: '/health',
      auth: '/api/auth',
      menu: '/api/menu',
      orders: '/api/orders',
      cart: '/api/cart',
      stores: '/api/stores',
      deals: '/api/deals',
      rewards: '/api/rewards'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/rewards', rewardsRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`🔥 BK Backend running on http://localhost:${PORT}`));
