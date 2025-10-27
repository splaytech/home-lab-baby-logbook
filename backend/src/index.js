/**
 * Baby Logbook - Backend Entry Point
 *
 * Main application server initialization
 */

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const logger = require('./utils/logger');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Will be configured in nginx
}));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined', { stream: logger.stream }));
} else {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// Import routes
const initRoutes = require('./routes/init');
const authRoutes = require('./routes/auth');
const babyRoutes = require('./routes/babies');
const userRoutes = require('./routes/users');
const appointmentRoutes = require('./routes/appointments');
const growthRoutes = require('./routes/growth');
const vaccinationRoutes = require('./routes/vaccinations');
const milestoneRoutes = require('./routes/milestones');
const backupRoutes = require('./routes/backup');

// API routes
app.use('/api/init', initRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/babies', babyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/growth', growthRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/backup', backupRoutes);

// API root endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Baby Logbook API',
    version: '1.0.0',
    status: 'healthy',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);

  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'An error occurred'
      : err.message,
    timestamp: new Date().toISOString(),
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Test database connection
    await db.authenticate();
    logger.info('Database connection established successfully');

    // Sync database (in development)
    if (process.env.NODE_ENV !== 'production') {
      await db.sync({ force: true });
      logger.info('Database synchronized');

      // Seed vaccination schedule
      const { VaccinationSchedule } = require('./models');
      await VaccinationSchedule.seedSchedule();
      logger.info('Vaccination schedule seeded');
    }

    // Start server
    app.listen(PORT, () => {
      logger.info(`Baby Logbook API running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await db.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT signal received: closing HTTP server');
  await db.close();
  process.exit(0);
});

// Start the server
startServer();

module.exports = app;
