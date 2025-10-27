/**
 * Milestone Controller
 *
 * Handles milestone tracking operations
 */

const { Milestone, Baby } = require('../models');
const logger = require('../utils/logger');
const { differenceInDays } = require('date-fns');

/**
 * Get all milestones for a baby
 * GET /api/milestones?babyId=xxx&category=physical
 */
const getAllMilestones = async (req, res) => {
  try {
    const { babyId, category, isImportant } = req.query;

    if (!babyId) {
      return res.status(400).json({
        success: false,
        message: 'Baby ID is required',
      });
    }

    const where = {
      babyId,
      isActive: true,
    };

    if (category) {
      where.category = category;
    }

    if (isImportant === 'true') {
      where.isImportant = true;
    }

    const milestones = await Milestone.findAll({
      where,
      order: [['dateAchieved', 'DESC']],
    });

    res.json({
      success: true,
      data: milestones,
      count: milestones.length,
    });
  } catch (error) {
    logger.error('Error fetching milestones:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestones',
    });
  }
};

/**
 * Get single milestone by ID
 * GET /api/milestones/:id
 */
const getMilestoneById = async (req, res) => {
  try {
    const { id } = req.params;

    const milestone = await Milestone.findByPk(id, {
      include: [
        {
          model: Baby,
          as: 'baby',
          attributes: ['id', 'name', 'dateOfBirth'],
        },
      ],
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found',
      });
    }

    res.json({
      success: true,
      data: milestone,
    });
  } catch (error) {
    logger.error('Error fetching milestone:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestone',
    });
  }
};

/**
 * Create new milestone
 * POST /api/milestones
 */
const createMilestone = async (req, res) => {
  try {
    const {
      babyId,
      title,
      category,
      dateAchieved,
      ageInDays,
      description,
      photos,
      videos,
      location,
      witnesses,
      notes,
      isImportant,
    } = req.body;

    // Validation
    if (!babyId || !title || !category || !dateAchieved || ageInDays === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Baby ID, title, category, date achieved, and age are required',
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

    // Validate date not in future
    if (new Date(dateAchieved) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Milestone date cannot be in the future',
      });
    }

    const milestone = await Milestone.create({
      babyId,
      title,
      category,
      dateAchieved,
      ageInDays,
      description,
      photos,
      videos,
      location,
      witnesses,
      notes,
      isImportant,
    });

    logger.info(`Milestone created for baby ${baby.name}: ${title}`);

    res.status(201).json({
      success: true,
      message: 'Milestone created successfully',
      data: milestone,
    });
  } catch (error) {
    logger.error('Error creating milestone:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create milestone',
    });
  }
};

/**
 * Update milestone
 * PUT /api/milestones/:id
 */
const updateMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      category,
      dateAchieved,
      ageInDays,
      description,
      photos,
      videos,
      location,
      witnesses,
      notes,
      isImportant,
    } = req.body;

    const milestone = await Milestone.findByPk(id);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found',
      });
    }

    // Validate date not in future if provided
    if (dateAchieved && new Date(dateAchieved) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Milestone date cannot be in the future',
      });
    }

    await milestone.update({
      title: title !== undefined ? title : milestone.title,
      category: category !== undefined ? category : milestone.category,
      dateAchieved: dateAchieved !== undefined ? dateAchieved : milestone.dateAchieved,
      ageInDays: ageInDays !== undefined ? ageInDays : milestone.ageInDays,
      description: description !== undefined ? description : milestone.description,
      photos: photos !== undefined ? photos : milestone.photos,
      videos: videos !== undefined ? videos : milestone.videos,
      location: location !== undefined ? location : milestone.location,
      witnesses: witnesses !== undefined ? witnesses : milestone.witnesses,
      notes: notes !== undefined ? notes : milestone.notes,
      isImportant: isImportant !== undefined ? isImportant : milestone.isImportant,
    });

    logger.info(`Milestone updated: ${milestone.title}`);

    res.json({
      success: true,
      message: 'Milestone updated successfully',
      data: milestone,
    });
  } catch (error) {
    logger.error('Error updating milestone:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update milestone',
    });
  }
};

/**
 * Delete milestone (soft delete)
 * DELETE /api/milestones/:id
 */
const deleteMilestone = async (req, res) => {
  try {
    const { id } = req.params;

    const milestone = await Milestone.findByPk(id);

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found',
      });
    }

    await milestone.update({ isActive: false });

    logger.info(`Milestone soft deleted: ${milestone.title}`);

    res.json({
      success: true,
      message: 'Milestone deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting milestone:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete milestone',
    });
  }
};

/**
 * Get milestone templates
 * GET /api/milestones/templates
 */
const getMilestoneTemplates = async (req, res) => {
  try {
    res.json({
      success: true,
      data: Milestone.COMMON_MILESTONES,
    });
  } catch (error) {
    logger.error('Error fetching milestone templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestone templates',
    });
  }
};

/**
 * Get milestone statistics for a baby
 * GET /api/milestones/stats/:babyId
 */
const getMilestoneStats = async (req, res) => {
  try {
    const { babyId } = req.params;

    const baby = await Baby.findByPk(babyId);
    if (!baby) {
      return res.status(404).json({
        success: false,
        message: 'Baby not found',
      });
    }

    const milestones = await Milestone.findAll({
      where: {
        babyId,
        isActive: true,
      },
    });

    // Group by category
    const byCategory = milestones.reduce((acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + 1;
      return acc;
    }, {});

    // Get recent milestones (last 5)
    const recent = milestones
      .sort((a, b) => new Date(b.dateAchieved) - new Date(a.dateAchieved))
      .slice(0, 5);

    // Get important milestones
    const important = milestones.filter((m) => m.isImportant);

    res.json({
      success: true,
      data: {
        total: milestones.length,
        byCategory,
        recent,
        important: important.length,
        importantMilestones: important,
      },
    });
  } catch (error) {
    logger.error('Error fetching milestone stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch milestone statistics',
    });
  }
};

module.exports = {
  getAllMilestones,
  getMilestoneById,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  getMilestoneTemplates,
  getMilestoneStats,
};
