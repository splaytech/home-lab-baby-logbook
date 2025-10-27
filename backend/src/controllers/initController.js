/**
 * Initialization Controller
 *
 * Handles system initialization and first-time setup
 */

const { User, SystemConfig } = require('../models');
const { generateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

/**
 * Check if system is initialized
 * GET /api/init/status
 */
const checkInitStatus = async (req, res) => {
  try {
    const initialized = await SystemConfig.isInitialized();

    res.json({
      success: true,
      initialized,
    });
  } catch (error) {
    logger.error('Error checking initialization status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check initialization status',
    });
  }
};

/**
 * Create initial admin account
 * POST /api/init/admin
 * Body: { username, displayName, email?, password }
 */
const createAdminAccount = async (req, res) => {
  try {
    // Check if already initialized
    const initialized = await SystemConfig.isInitialized();
    if (initialized) {
      return res.status(400).json({
        success: false,
        message: 'System already initialized',
      });
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ where: { role: 'admin' } });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin account already exists',
      });
    }

    const { username, displayName, email, password } = req.body;

    // Validation
    if (!username || !displayName || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, display name, and password are required',
      });
    }

    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({
        success: false,
        message: 'Username must be 3-20 characters',
      });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: 'Username can only contain letters, numbers, hyphens, and underscores',
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters',
      });
    }

    // Password complexity check
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain uppercase, lowercase, and numbers',
      });
    }

    // Create admin user
    const adminUser = await User.create({
      username,
      displayName,
      email: email || null,
      passwordHash: password, // Will be hashed by model hook
      role: 'admin',
      isActive: true,
    });

    logger.info(`Admin account created: ${username}`);

    res.status(201).json({
      success: true,
      message: 'Admin account created successfully',
      user: adminUser.toJSON(),
    });
  } catch (error) {
    logger.error('Error creating admin account:', error);

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Username or email already exists',
      });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create admin account',
    });
  }
};

/**
 * Complete system initialization
 * POST /api/init/complete
 * Body: { setupData? }
 */
const completeInitialization = async (req, res) => {
  try {
    // Check if already initialized
    const initialized = await SystemConfig.isInitialized();
    if (initialized) {
      return res.status(400).json({
        success: false,
        message: 'System already initialized',
      });
    }

    // Verify admin exists
    const adminUser = await User.findOne({ where: { role: 'admin' } });
    if (!adminUser) {
      return res.status(400).json({
        success: false,
        message: 'Admin account must be created first',
      });
    }

    // Mark system as initialized
    await SystemConfig.setInitialized(true);

    // Store initialization timestamp
    await SystemConfig.setValue(
      'initialized_at',
      new Date().toISOString(),
      'System initialization timestamp'
    );

    logger.info('System initialization completed');

    res.json({
      success: true,
      message: 'System initialization completed',
    });
  } catch (error) {
    logger.error('Error completing initialization:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete initialization',
    });
  }
};

module.exports = {
  checkInitStatus,
  createAdminAccount,
  completeInitialization,
};
