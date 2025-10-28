/**
 * Database Configuration
 *
 * SQLite database setup using Sequelize ORM
 */

const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('../utils/logger');

const DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../../data/baby-logbook.db');

// Log database path for debugging
logger.info(`Database path: ${DATABASE_PATH}`);

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DATABASE_PATH,
  logging: process.env.DEBUG === 'true' ? (msg) => logger.debug(msg) : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = sequelize;
