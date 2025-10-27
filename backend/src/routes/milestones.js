/**
 * Milestone Routes
 *
 * All routes require authentication
 */

const express = require('express');
const {
  getAllMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getMilestoneTemplates,
  getMilestoneStats,
} = require('../controllers/milestoneController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/milestones/templates
 * @desc    Get milestone templates
 * @access  Private
 */
router.get('/templates', getMilestoneTemplates);

/**
 * @route   GET /api/milestones/stats/:babyId
 * @desc    Get milestone statistics for a baby
 * @access  Private
 */
router.get('/stats/:babyId', getMilestoneStats);

/**
 * @route   GET /api/milestones
 * @desc    Get all milestones for a baby (query param: babyId, category, isImportant)
 * @access  Private
 */
router.get('/', getAllMilestones);

/**
 * @route   GET /api/milestones/:id
 * @desc    Get single milestone by ID
 * @access  Private
 */
router.get('/:id', getMilestoneById);

/**
 * @route   POST /api/milestones
 * @desc    Create new milestone
 * @access  Private
 */
router.post('/', createMilestone);

/**
 * @route   PUT /api/milestones/:id
 * @desc    Update milestone
 * @access  Private
 */
router.put('/:id', updateMilestone);

/**
 * @route   DELETE /api/milestones/:id
 * @desc    Delete milestone
 * @access  Private
 */
router.delete('/:id', deleteMilestone);

module.exports = router;
