/**
 * Growth Record Routes
 *
 * All routes require authentication
 */

const express = require('express');
const {
  getAllGrowthRecords,
  getGrowthRecordById,
  createGrowthRecord,
  updateGrowthRecord,
  deleteGrowthRecord,
} = require('../controllers/growthController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/growth?babyId=xxx
 * @desc    Get all growth records for a baby
 * @access  Private
 */
router.get('/', getAllGrowthRecords);

/**
 * @route   GET /api/growth/:id
 * @desc    Get single growth record by ID
 * @access  Private
 */
router.get('/:id', getGrowthRecordById);

/**
 * @route   POST /api/growth
 * @desc    Create new growth record
 * @access  Private
 */
router.post('/', createGrowthRecord);

/**
 * @route   PUT /api/growth/:id
 * @desc    Update growth record
 * @access  Private
 */
router.put('/:id', updateGrowthRecord);

/**
 * @route   DELETE /api/growth/:id
 * @desc    Delete growth record
 * @access  Private
 */
router.delete('/:id', deleteGrowthRecord);

module.exports = router;
