/**
 * Vaccination Controller
 *
 * Handles vaccination record and schedule operations
 */

const { VaccinationRecord, VaccinationSchedule, Baby } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');
const { differenceInDays } = require('date-fns');

/**
 * Get all vaccination records for a baby
 * GET /api/vaccinations/records?babyId=xxx
 */
const getAllVaccinationRecords = async (req, res) => {
  try {
    const { babyId } = req.query;

    if (!babyId) {
      return res.status(400).json({
        success: false,
        message: 'Baby ID is required',
      });
    }

    const records = await VaccinationRecord.findAll({
      where: {
        babyId,
        isActive: true,
      },
      order: [['dateAdministered', 'DESC']],
    });

    res.json({
      success: true,
      data: records,
      count: records.length,
    });
  } catch (error) {
    logger.error('Error fetching vaccination records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vaccination records',
    });
  }
};

/**
 * Get single vaccination record by ID
 * GET /api/vaccinations/records/:id
 */
const getVaccinationRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await VaccinationRecord.findByPk(id, {
      include: [
        {
          model: Baby,
          as: 'baby',
          attributes: ['id', 'name', 'dateOfBirth'],
        },
      ],
    });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination record not found',
      });
    }

    res.json({
      success: true,
      data: record,
    });
  } catch (error) {
    logger.error('Error fetching vaccination record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vaccination record',
    });
  }
};

/**
 * Create new vaccination record
 * POST /api/vaccinations/records
 */
const createVaccinationRecord = async (req, res) => {
  try {
    const {
      babyId,
      vaccineName,
      dateAdministered,
      ageInDaysAtVaccination,
      doseAmount,
      batchNumber,
      route,
      site,
      placeGiven,
      givenBy,
      signature,
      comments,
      scheduledVaccineId,
    } = req.body;

    // Validation
    if (!babyId || !vaccineName || !dateAdministered || ageInDaysAtVaccination === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Baby ID, vaccine name, date administered, and age are required',
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
    if (new Date(dateAdministered) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Vaccination date cannot be in the future',
      });
    }

    const record = await VaccinationRecord.create({
      babyId,
      vaccineName,
      dateAdministered,
      ageInDaysAtVaccination,
      doseAmount,
      batchNumber,
      route,
      site,
      placeGiven,
      givenBy,
      signature,
      comments,
      scheduledVaccineId,
    });

    logger.info(`Vaccination record created for baby ${baby.name}: ${vaccineName}`);

    res.status(201).json({
      success: true,
      message: 'Vaccination record created successfully',
      data: record,
    });
  } catch (error) {
    logger.error('Error creating vaccination record:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create vaccination record',
    });
  }
};

/**
 * Update vaccination record
 * PUT /api/vaccinations/records/:id
 */
const updateVaccinationRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vaccineName,
      dateAdministered,
      ageInDaysAtVaccination,
      doseAmount,
      batchNumber,
      route,
      site,
      placeGiven,
      givenBy,
      signature,
      comments,
      scheduledVaccineId,
    } = req.body;

    const record = await VaccinationRecord.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination record not found',
      });
    }

    // Validate date not in future if provided
    if (dateAdministered && new Date(dateAdministered) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Vaccination date cannot be in the future',
      });
    }

    await record.update({
      vaccineName: vaccineName !== undefined ? vaccineName : record.vaccineName,
      dateAdministered: dateAdministered !== undefined ? dateAdministered : record.dateAdministered,
      ageInDaysAtVaccination: ageInDaysAtVaccination !== undefined ? ageInDaysAtVaccination : record.ageInDaysAtVaccination,
      doseAmount: doseAmount !== undefined ? doseAmount : record.doseAmount,
      batchNumber: batchNumber !== undefined ? batchNumber : record.batchNumber,
      route: route !== undefined ? route : record.route,
      site: site !== undefined ? site : record.site,
      placeGiven: placeGiven !== undefined ? placeGiven : record.placeGiven,
      givenBy: givenBy !== undefined ? givenBy : record.givenBy,
      signature: signature !== undefined ? signature : record.signature,
      comments: comments !== undefined ? comments : record.comments,
      scheduledVaccineId: scheduledVaccineId !== undefined ? scheduledVaccineId : record.scheduledVaccineId,
    });

    logger.info(`Vaccination record updated: ${record.vaccineName}`);

    res.json({
      success: true,
      message: 'Vaccination record updated successfully',
      data: record,
    });
  } catch (error) {
    logger.error('Error updating vaccination record:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update vaccination record',
    });
  }
};

/**
 * Delete vaccination record (soft delete)
 * DELETE /api/vaccinations/records/:id
 */
const deleteVaccinationRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await VaccinationRecord.findByPk(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Vaccination record not found',
      });
    }

    await record.update({ isActive: false });

    logger.info(`Vaccination record soft deleted: ${record.vaccineName}`);

    res.json({
      success: true,
      message: 'Vaccination record deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting vaccination record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete vaccination record',
    });
  }
};

/**
 * Get vaccination schedule
 * GET /api/vaccinations/schedule?category=routine&isForAtsiOnly=false
 */
const getVaccinationSchedule = async (req, res) => {
  try {
    const { category, isForAtsiOnly } = req.query;

    const where = {};
    if (category) {
      where.category = category;
    }
    if (isForAtsiOnly !== undefined) {
      where.isForAtsiOnly = isForAtsiOnly === 'true';
    }

    const schedule = await VaccinationSchedule.findAll({
      where,
      order: [['sortOrder', 'ASC']],
    });

    res.json({
      success: true,
      data: schedule,
      count: schedule.length,
    });
  } catch (error) {
    logger.error('Error fetching vaccination schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vaccination schedule',
    });
  }
};

/**
 * Get personalized vaccination timeline for a baby
 * GET /api/vaccinations/timeline/:babyId?includeAtsi=false
 */
const getVaccinationTimeline = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { includeAtsi } = req.query;

    // Get baby details
    const baby = await Baby.findByPk(babyId);
    if (!baby) {
      return res.status(404).json({
        success: false,
        message: 'Baby not found',
      });
    }

    // Get vaccination schedule
    const where = {};
    if (includeAtsi === 'false') {
      where.isForAtsiOnly = false;
    }

    const schedule = await VaccinationSchedule.findAll({
      where,
      order: [['sortOrder', 'ASC']],
    });

    // Get baby's vaccination records
    const records = await VaccinationRecord.findAll({
      where: {
        babyId,
        isActive: true,
      },
    });

    // Calculate due dates and statuses
    const today = new Date();
    const babyAgeInDays = differenceInDays(today, new Date(baby.dateOfBirth));

    const timeline = schedule.map((item) => {
      const scheduledItem = item.toJSON();

      // Calculate due date
      const dueDate = new Date(baby.dateOfBirth);
      dueDate.setDate(dueDate.getDate() + scheduledItem.ageInDays);
      scheduledItem.dueDate = dueDate.toISOString().split('T')[0];

      // Calculate status
      const daysDiff = differenceInDays(today, dueDate);

      if (daysDiff < -30) {
        scheduledItem.status = 'upcoming'; // More than 30 days away
      } else if (daysDiff < 0) {
        scheduledItem.status = 'due_soon'; // Due within 30 days
      } else if (daysDiff <= 30) {
        scheduledItem.status = 'due_now'; // Due now or up to 30 days overdue
      } else {
        scheduledItem.status = 'overdue'; // More than 30 days overdue
      }

      // Check if given
      const givenRecord = records.find((r) =>
        r.vaccineName.toLowerCase().includes(scheduledItem.shortName?.toLowerCase() || scheduledItem.vaccineName.toLowerCase()) &&
        Math.abs(r.ageInDaysAtVaccination - scheduledItem.ageInDays) < 90 // Within 90 days of scheduled age
      );

      if (givenRecord) {
        scheduledItem.status = 'completed';
        scheduledItem.givenDate = givenRecord.dateAdministered;
        scheduledItem.recordId = givenRecord.id;
      }

      scheduledItem.babyAgeInDays = babyAgeInDays;
      scheduledItem.isAvailable = babyAgeInDays >= scheduledItem.ageInDays - 30; // Available 30 days before due

      return scheduledItem;
    });

    res.json({
      success: true,
      data: {
        baby: {
          id: baby.id,
          name: baby.name,
          dateOfBirth: baby.dateOfBirth,
          ageInDays: babyAgeInDays,
        },
        timeline,
        stats: {
          total: timeline.length,
          completed: timeline.filter((t) => t.status === 'completed').length,
          due_now: timeline.filter((t) => t.status === 'due_now').length,
          overdue: timeline.filter((t) => t.status === 'overdue').length,
          upcoming: timeline.filter((t) => t.status === 'upcoming' || t.status === 'due_soon').length,
        },
      },
    });
  } catch (error) {
    logger.error('Error fetching vaccination timeline:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch vaccination timeline',
    });
  }
};

module.exports = {
  getAllVaccinationRecords,
  getVaccinationRecordById,
  createVaccinationRecord,
  updateVaccinationRecord,
  deleteVaccinationRecord,
  getVaccinationSchedule,
  getVaccinationTimeline,
};
