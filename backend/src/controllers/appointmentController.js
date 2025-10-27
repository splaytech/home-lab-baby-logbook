/**
 * Appointment Controller
 *
 * Handles appointment management operations
 */

const { Appointment, Baby } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * Get all appointments
 * GET /api/appointments
 */
const getAllAppointments = async (req, res) => {
  try {
    const { babyId, upcoming } = req.query;

    const where = {};

    if (babyId) {
      where.babyId = babyId;
    }

    if (upcoming === 'true') {
      where.appointmentDate = { [Op.gte]: new Date() };
      where.status = 'scheduled';
    }

    const appointments = await Appointment.findAll({
      where,
      include: [
        {
          model: Baby,
          as: 'baby',
          attributes: ['id', 'name', 'dateOfBirth'],
        },
      ],
      order: [['appointmentDate', 'ASC']],
    });

    res.json({
      success: true,
      data: appointments,
      count: appointments.length,
    });
  } catch (error) {
    logger.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
    });
  }
};

/**
 * Get single appointment by ID
 * GET /api/appointments/:id
 */
const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Baby,
          as: 'baby',
          attributes: ['id', 'name', 'dateOfBirth'],
        },
      ],
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    logger.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment',
    });
  }
};

/**
 * Create new appointment
 * POST /api/appointments
 */
const createAppointment = async (req, res) => {
  try {
    const {
      babyId,
      title,
      description,
      appointmentDate,
      location,
      doctorName,
      appointmentType,
      notes,
    } = req.body;

    // Validation
    if (!babyId || !title || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: 'Baby ID, title, and appointment date are required',
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

    const appointment = await Appointment.create({
      babyId,
      title,
      description,
      appointmentDate,
      location,
      doctorName,
      appointmentType: appointmentType || 'checkup',
      notes,
      status: 'scheduled',
    });

    logger.info(`Appointment created for baby ${baby.name}: ${title}`);

    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: appointment,
    });
  } catch (error) {
    logger.error('Error creating appointment:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
    });
  }
};

/**
 * Update appointment
 * PUT /api/appointments/:id
 */
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      appointmentDate,
      location,
      doctorName,
      appointmentType,
      status,
      notes,
    } = req.body;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    await appointment.update({
      title: title || appointment.title,
      description: description !== undefined ? description : appointment.description,
      appointmentDate: appointmentDate || appointment.appointmentDate,
      location: location !== undefined ? location : appointment.location,
      doctorName: doctorName !== undefined ? doctorName : appointment.doctorName,
      appointmentType: appointmentType || appointment.appointmentType,
      status: status || appointment.status,
      notes: notes !== undefined ? notes : appointment.notes,
    });

    logger.info(`Appointment updated: ${appointment.title}`);

    res.json({
      success: true,
      message: 'Appointment updated successfully',
      data: appointment,
    });
  } catch (error) {
    logger.error('Error updating appointment:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update appointment',
    });
  }
};

/**
 * Delete appointment
 * DELETE /api/appointments/:id
 */
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    await appointment.destroy();

    logger.info(`Appointment deleted: ${appointment.title}`);

    res.json({
      success: true,
      message: 'Appointment deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete appointment',
    });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};
