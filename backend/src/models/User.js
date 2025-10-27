/**
 * User Model
 *
 * Represents a user in the system (admin, parent, caregiver)
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const db = require('../config/database');

const User = db.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 20],
        is: /^[a-zA-Z0-9_-]+$/,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
    displayName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'display_name',
      validate: {
        len: [2, 50],
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'parent', 'caregiver'),
      allowNull: false,
      defaultValue: 'parent',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login_at',
    },
    failedLoginAttempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'failed_login_attempts',
    },
    lockedUntil: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'locked_until',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.passwordHash) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('passwordHash')) {
          user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
        }
      },
    },
  }
);

// Instance methods
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

User.prototype.incrementFailedLogins = async function () {
  const maxAttempts = parseInt(process.env.LOGIN_ATTEMPTS_MAX || '5', 10);
  this.failedLoginAttempts += 1;

  if (this.failedLoginAttempts >= maxAttempts) {
    // Lock account for 30 minutes
    this.lockedUntil = new Date(Date.now() + 30 * 60 * 1000);
  }

  await this.save();
};

User.prototype.resetFailedLogins = async function () {
  this.failedLoginAttempts = 0;
  this.lockedUntil = null;
  await this.save();
};

User.prototype.isLocked = function () {
  return this.lockedUntil && this.lockedUntil > new Date();
};

User.prototype.toJSON = function () {
  const values = { ...this.get() };
  delete values.passwordHash;
  delete values.failedLoginAttempts;
  delete values.lockedUntil;
  return values;
};

module.exports = User;
