/**
 * Baby Routes
 *
 * Routes for baby management
 */

const express = require('express');
const {
  getAllBabies,
  getBabyById,
  createBaby,
  updateBaby,
  deleteBaby,
} = require('../controllers/babyController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

/**
 * @route   GET /api/babies
 * @desc    Get all babies
 * @access  Private
 */
router.get('/', getAllBabies);

/**
 * @route   GET /api/babies/:id
 * @desc    Get single baby by ID
 * @access  Private
 */
router.get('/:id', getBabyById);

/**
 * @route   POST /api/babies
 * @desc    Create new baby
 * @access  Private
 */
router.post('/', createBaby);

/**
 * @route   PUT /api/babies/:id
 * @desc    Update baby
 * @access  Private
 */
router.put('/:id', updateBaby);

/**
 * @route   DELETE /api/babies/:id
 * @desc    Delete baby (soft delete)
 * @access  Private
 */
router.delete('/:id', deleteBaby);

module.exports = router;
