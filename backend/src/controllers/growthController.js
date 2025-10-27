/**
 * Growth Record Controller
 *
 * Handles growth tracking operations
 */

const { GrowthRecord, Baby } = require('../models');
const logger = require('../utils/logger');

/**
 * Get all growth records for a baby
 * GET /api/growth?babyId=xxx
 */
const getAllGrowthRecords = async (req, res) => {
  try {
    const { babyId } = req.query;

    if (!babyId) {
      return res.status(400).json({
        success: false,
        message: 'Baby ID is required',
      });
    }

    const growthRecords = await GrowthRecord.findAll({
      where: { babyId },
      order: [['recordDate', 'ASC']],
    });

    res.json({
      success: true,
      data: growthRecords,
      count: growthRecords.length,
    });
  } catch (error) {
    logger.error('Error fetching growth records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch growth records',
    });
  }
};

/**
 * Get single growth record by ID
 * GET /api/growth/:id
 */
const getGrowthRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const growthRecord = await GrowthRecord.findByPk(id, {
      include: [
        {
          model: Baby,
          as: 'baby',
          attributes: ['id', 'name', 'dateOfBirth'],
        },
      ],
    });

    if (!growthRecord) {
      return res.status(404).json({
        success: false,
        message: 'Growth record not found',
      });
    }

    res.json({
      success: true,
      data: growthRecord,
    });
  } catch (error) {
    logger.error('Error fetching growth record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch growth record',
    });
  }
};

/**
 * Create new growth record
 * POST /api/growth
 */
const createGrowthRecord = async (req, res) => {
  try {
    const { babyId, recordDate, ageInDays, weight, height, headCircumference, comments } =
      req.body;

    // Validation
    if (!babyId || !recordDate || ageInDays === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Baby ID, record date, and age in days are required',
      });
    }

    // Verify baby exists
    const baby = await Baby.findByPk(babyId);
    if (!baby) {
      return res.status(404).json({
        success: false,
        message: 'Baby not found',
      });
    }

    // Validate that at least one measurement is provided
    if (!weight && !height && !headCircumference) {
      return res.status(400).json({
        success: false,
        message: 'At least one measurement (weight, height, or head circumference) is required',
      });
    }

    const growthRecord = await GrowthRecord.create({
      babyId,
      recordDate,
      ageInDays,
      weight,
      height,
      headCircumference,
      comments,
    });

    logger.info(`Growth record created for baby ${baby.name}`);

    res.status(201).json({
      success: true,
      message: 'Growth record created successfully',
      data: growthRecord,
    });
  } catch (error) {
    logger.error('Error creating growth record:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create growth record',
    });
  }
};

/**
 * Update growth record
 * PUT /api/growth/:id
 */
const updateGrowthRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { recordDate, ageInDays, weight, height, headCircumference, comments } = req.body;

    const growthRecord = await GrowthRecord.findByPk(id);

    if (!growthRecord) {
      return res.status(404).json({
        success: false,
        message: 'Growth record not found',
      });
    }

    await growthRecord.update({
      recordDate: recordDate || growthRecord.recordDate,
      ageInDays: ageInDays !== undefined ? ageInDays : growthRecord.ageInDays,
      weight: weight !== undefined ? weight : growthRecord.weight,
      height: height !== undefined ? height : growthRecord.height,
      headCircumference:
        headCircumference !== undefined ? headCircumference : growthRecord.headCircumference,
      comments: comments !== undefined ? comments : growthRecord.comments,
    });

    logger.info(`Growth record updated: ${id}`);

    res.json({
      success: true,
      message: 'Growth record updated successfully',
      data: growthRecord,
    });
  } catch (error) {
    logger.error('Error updating growth record:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update growth record',
    });
  }
};

/**
 * Delete growth record
 * DELETE /api/growth/:id
 */
const deleteGrowthRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const growthRecord = await GrowthRecord.findByPk(id);

    if (!growthRecord) {
      return res.status(404).json({
        success: false,
        message: 'Growth record not found',
      });
    }

    await growthRecord.destroy();

    logger.info(`Growth record deleted: ${id}`);

    res.json({
      success: true,
      message: 'Growth record deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting growth record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete growth record',
    });
  }
};

module.exports = {
  getAllGrowthRecords,
  getGrowthRecordById,
  createGrowthRecord,
  updateGrowthRecord,
  deleteGrowthRecord,
};
