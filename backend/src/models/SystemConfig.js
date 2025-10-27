/**
 * SystemConfig Model
 *
 * Stores system-wide configuration and initialization status
 */

const { DataTypes } = require('sequelize');
const db = require('../config/database');

const SystemConfig = db.define(
  'SystemConfig',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    key: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'system_config',
    timestamps: true,
    underscored: true,
  }
);

// Helper methods
SystemConfig.getValue = async function (key, defaultValue = null) {
  const config = await this.findOne({ where: { key } });
  return config ? config.value : defaultValue;
};

SystemConfig.setValue = async function (key, value, description = null) {
  const [config, created] = await this.findOrCreate({
    where: { key },
    defaults: { value, description },
  });

  if (!created && config.value !== value) {
    config.value = value;
    if (description) config.description = description;
    await config.save();
  }

  return config;
};

SystemConfig.isInitialized = async function () {
  const initialized = await this.getValue('system_initialized', 'false');
  return initialized === 'true';
};

SystemConfig.setInitialized = async function (status = true) {
  await this.setValue(
    'system_initialized',
    status ? 'true' : 'false',
    'System initialization status'
  );
};

module.exports = SystemConfig;
