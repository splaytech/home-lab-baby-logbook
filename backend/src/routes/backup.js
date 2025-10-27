/**
 * Backup Routes
 *
 * Routes for database backup and restore
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  createBackup,
  restoreBackup,
  listBackups,
  deleteBackup,
} = require('../controllers/backupController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'restore-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.originalname.endsWith('.sqlite') || file.originalname.endsWith('.db')) {
      cb(null, true);
    } else {
      cb(new Error('Only .sqlite or .db files are allowed'));
    }
  },
});

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRole('admin'));

/**
 * @route   GET /api/backup/create
 * @desc    Create and download database backup
 * @access  Private (Admin only)
 */
router.get('/create', createBackup);

/**
 * @route   POST /api/backup/restore
 * @desc    Restore database from backup file
 * @access  Private (Admin only)
 */
router.post('/restore', upload.single('backup'), restoreBackup);

/**
 * @route   GET /api/backup/list
 * @desc    List all available backups
 * @access  Private (Admin only)
 */
router.get('/list', listBackups);

/**
 * @route   DELETE /api/backup/:filename
 * @desc    Delete a backup file
 * @access  Private (Admin only)
 */
router.delete('/:filename', deleteBackup);

module.exports = router;
