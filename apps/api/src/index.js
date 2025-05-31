import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { userRoutes } from './routes/userRoutes';
import { vendorRoutes } from './routes/vendorRoutes';
import { bagRoutes } from './routes/bagRoutes';
import { orderRoutes } from './routes/orderRoutes';
import { paymentRoutes } from './routes/paymentRoutes';
import { subscriptionRoutes } from './routes/subscriptionRoutes';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/bags', bagRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to ChopNow API' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
