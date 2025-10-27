/**
 * Initialization Routes
 *
 * Routes for system initialization and setup
 */

const express = require('express');
const {
  checkInitStatus,
  createAdminAccount,
  completeInitialization,
} = require('../controllers/initController');

const router = express.Router();

/**
 * @route   GET /api/init/status
 * @desc    Check if system is initialized
 * @access  Public
 */
router.get('/status', checkInitStatus);

/**
 * @route   POST /api/init/admin
 * @desc    Create initial admin account
 * @access  Public (only when not initialized)
 */
router.post('/admin', createAdminAccount);

/**
 * @route   POST /api/init/complete
 * @desc    Complete system initialization
 * @access  Public (only when not initialized)
 */
router.post('/complete', completeInitialization);

module.exports = router;
