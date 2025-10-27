/**
 * Database Configuration
 *
 * SQLite database setup using Sequelize ORM
 */

const { Sequelize } = require('sequelize');
const path = require('path');
const logger = require('../utils/logger');

const DATABASE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../../data/baby-logbook.db');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: DATABASE_PATH,
  logging: (msg) => logger.debug(msg),
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
