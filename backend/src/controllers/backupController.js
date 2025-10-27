/**
 * Backup Controller
 *
 * Handles database backup and restore operations
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const db = require('../models');

// Backup directory
const BACKUP_DIR = path.join(__dirname, '../../backups');

// Ensure backup directory exists
const ensureBackupDir = async () => {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  } catch (error) {
    logger.error('Error creating backup directory:', error);
    throw error;
  }
};

/**
 * Create database backup
 * GET /api/backup/create
 */
const createBackup = async (req, res) => {
  try {
    await ensureBackupDir();

    // Get database file path from environment or use default
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../../data/baby-logbook.db');

    // Check if database exists
    if (!fsSync.existsSync(dbPath)) {
      return res.status(404).json({
        success: false,
        message: 'Database file not found',
      });
    }

    // Create backup filename with timestamp (keep original extension)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const dbExtension = path.extname(dbPath); // .db or .sqlite
    const backupFilename = `backup-${timestamp}${dbExtension}`;
    const backupPath = path.join(BACKUP_DIR, backupFilename);

    // Copy database file
    await fs.copyFile(dbPath, backupPath);

    logger.info(`Database backup created: ${backupFilename} from ${dbPath}`);

    // Send file as download
    res.download(backupPath, backupFilename, (err) => {
      if (err) {
        logger.error('Error sending backup file:', err);
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Failed to download backup file',
          });
        }
      }
    });
  } catch (error) {
    logger.error('Error creating backup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create backup',
      error: error.message,
    });
  }
};

/**
 * Restore database from backup
 * POST /api/backup/restore
 * Body: multipart/form-data with 'backup' file
 */
const restoreBackup = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No backup file provided',
      });
    }

    const uploadedFile = req.file;

    // Validate file extension
    if (!uploadedFile.originalname.endsWith('.sqlite') && !uploadedFile.originalname.endsWith('.db')) {
      // Clean up uploaded file
      await fs.unlink(uploadedFile.path);
      return res.status(400).json({
        success: false,
        message: 'Invalid file format. Only .sqlite or .db files are allowed',
      });
    }

    // Get database file path from environment or use default
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../../data/baby-logbook.db');

    // Create backup of current database before restoring
    if (fsSync.existsSync(dbPath)) {
      await ensureBackupDir();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const dbExtension = path.extname(dbPath);
      const currentBackupPath = path.join(BACKUP_DIR, `pre-restore-backup-${timestamp}${dbExtension}`);
      await fs.copyFile(dbPath, currentBackupPath);
      logger.info(`Created backup before restore: pre-restore-backup-${timestamp}${dbExtension}`);
    }

    // Close existing database connections
    await db.sequelize.close();

    // Replace database file with uploaded file
    await fs.copyFile(uploadedFile.path, dbPath);

    // Clean up uploaded file
    await fs.unlink(uploadedFile.path);

    logger.info('Database restored from backup');

    res.json({
      success: true,
      message: 'Database restored successfully. Please restart the application.',
    });

    // Exit process to force restart (server should be run with process manager like PM2 or nodemon)
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  } catch (error) {
    logger.error('Error restoring backup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to restore backup',
      error: error.message,
    });
  }
};

/**
 * List available backups
 * GET /api/backup/list
 */
const listBackups = async (req, res) => {
  try {
    await ensureBackupDir();

    // Read backup directory
    const files = await fs.readdir(BACKUP_DIR);

    // Filter for .sqlite and .db files and get stats
    const backups = await Promise.all(
      files
        .filter(file => file.endsWith('.sqlite') || file.endsWith('.db'))
        .map(async (file) => {
          const filePath = path.join(BACKUP_DIR, file);
          const stats = await fs.stat(filePath);
          return {
            filename: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime,
          };
        })
    );

    // Sort by creation date (newest first)
    backups.sort((a, b) => b.created - a.created);

    res.json({
      success: true,
      data: backups,
    });
  } catch (error) {
    logger.error('Error listing backups:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list backups',
      error: error.message,
    });
  }
};

/**
 * Delete a backup file
 * DELETE /api/backup/:filename
 */
const deleteBackup = async (req, res) => {
  try {
    const { filename } = req.params;

    // Validate filename (prevent directory traversal)
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename',
      });
    }

    const backupPath = path.join(BACKUP_DIR, filename);

    // Check if file exists
    if (!fsSync.existsSync(backupPath)) {
      return res.status(404).json({
        success: false,
        message: 'Backup file not found',
      });
    }

    // Delete file
    await fs.unlink(backupPath);

    logger.info(`Backup deleted: ${filename}`);

    res.json({
      success: true,
      message: 'Backup deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting backup:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete backup',
      error: error.message,
    });
  }
};

module.exports = {
  createBackup,
  restoreBackup,
  listBackups,
  deleteBackup,
};
