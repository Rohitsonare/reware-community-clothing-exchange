import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import itemsRoutes from './routes/items.js';
import swapsRoutes from './routes/swaps.js';
import logger from './utils/logger.js';
import errorHandler from './middleware/error.js';

// Load environment variables
dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// CORS setup
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Enhanced health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'unknown',
    },
    uptime: Math.floor(process.uptime()) + ' seconds',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/swaps', swapsRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// MongoDB connection with retry logic
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/reware';
    await mongoose.connect(mongoURI);
    logger.info('✅ MongoDB Connected Successfully!');
  } catch (err) {
    logger.error('❌ MongoDB connection error:', err);
    logger.error('MongoDB connection error:', err);
    logger.info('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
      logger.info(`API available at http://localhost:${port}/api`);
      logger.info(`Health check at http://localhost:${port}/health`);
    });
  })
  .catch((err) => {
    logger.error('Failed to start server:', err);
    process.exit(1);
  });
