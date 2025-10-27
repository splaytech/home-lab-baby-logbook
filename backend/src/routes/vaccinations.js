/**
 * Vaccination Routes
 *
 * All routes require authentication
 */

const express = require('express');
const {
  getAllVaccinationRecords,
  getVaccinationRecordById,
  createVaccinationRecord,
  updateVaccinationRecord,
  deleteVaccinationRecord,
  getVaccinationSchedule,
  getVaccinationTimeline,
} = require('../controllers/vaccinationController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply authentication to all routes
router.use(authenticateToken);

/**
 * @route   GET /api/vaccinations/schedule
 * @desc    Get vaccination schedule
 * @access  Private
 */
router.get('/schedule', getVaccinationSchedule);

/**
 * @route   GET /api/vaccinations/timeline/:babyId
 * @desc    Get personalized vaccination timeline for a baby
 * @access  Private
 */
router.get('/timeline/:babyId', getVaccinationTimeline);

/**
 * @route   GET /api/vaccinations/records
 * @desc    Get all vaccination records for a baby (query param: babyId)
 * @access  Private
 */
router.get('/records', getAllVaccinationRecords);

/**
 * @route   GET /api/vaccinations/records/:id
 * @desc    Get single vaccination record by ID
 * @access  Private
 */
router.get('/records/:id', getVaccinationRecordById);

/**
 * @route   POST /api/vaccinations/records
 * @desc    Create new vaccination record
 * @access  Private
 */
router.post('/records', createVaccinationRecord);

/**
 * @route   PUT /api/vaccinations/records/:id
 * @desc    Update vaccination record
 * @access  Private
 */
router.put('/records/:id', updateVaccinationRecord);

/**
 * @route   DELETE /api/vaccinations/records/:id
 * @desc    Delete vaccination record
 * @access  Private
 */
router.delete('/records/:id', deleteVaccinationRecord);

module.exports = router;
