/**
 * Baby Controller
 *
 * Handles baby/child management operations
 */

const { Baby, Appointment } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * Get all babies
 * GET /api/babies
 */
const getAllBabies = async (req, res) => {
  try {
    const babies = await Baby.findAll({
      where: { isActive: true },
      include: [
        {
          model: Appointment,
          as: 'appointments',
          where: {
            appointmentDate: { [Op.gte]: new Date() },
            status: 'scheduled',
          },
          required: false,
          order: [['appointmentDate', 'ASC']],
          limit: 1,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Add computed age to each baby
    const babiesWithAge = babies.map((baby) => {
      const babyData = baby.toJSON();
      babyData.age = baby.getAge();
      babyData.formattedAge = baby.getFormattedAge();
      babyData.ageInDays = baby.getAgeInDays();

      // Get next appointment
      if (babyData.appointments && babyData.appointments.length > 0) {
        babyData.nextAppointment = babyData.appointments[0];
      } else {
        babyData.nextAppointment = null;
      }

      return babyData;
    });

    res.json({
      success: true,
      data: babiesWithAge,
      count: babiesWithAge.length,
    });
  } catch (error) {
    logger.error('Error fetching babies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch babies',
    });
  }
};

/**
 * Get single baby by ID
 * GET /api/babies/:id
 */
const getBabyById = async (req, res) => {
  try {
    const { id } = req.params;

    const baby = await Baby.findByPk(id, {
      include: [
        {
          model: Appointment,
          as: 'appointments',
          order: [['appointmentDate', 'DESC']],
        },
      ],
    });

    if (!baby) {
      return res.status(404).json({
        success: false,
        message: 'Baby not found',
      });
    }

    const babyData = baby.toJSON();
    babyData.age = baby.getAge();
    babyData.formattedAge = baby.getFormattedAge();
    babyData.ageInDays = baby.getAgeInDays();

    res.json({
      success: true,
      data: babyData,
    });
  } catch (error) {
    logger.error('Error fetching baby:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch baby',
    });
  }
};

/**
 * Create new baby
 * POST /api/babies
 */
const createBaby = async (req, res) => {
  try {
    const {
      // Basic Info
      name,
      dateOfBirth,
      gender,
      photoUrl,
      bloodType,
      allergies,
      medicalNotes,
      // Birth Details
      birthType,
      examiner,
      hospital,
      timeOfBirth,
      birthWeight,
      birthLength,
      headCircumference,
      estimatedGestation,
      apgarScore1,
      apgarScore5,
      // Pregnancy Details
      pregnancyComplications,
      maternalRubellaTitre,
      // Labour & Delivery
      labourType,
      deliveryType,
      // Screening
      bloodspotScreening,
      bloodspotScreeningDate,
      // Admission
      intensiveCare,
      intensiveCareDetails,
      specialCare,
      specialCareDetails,
    } = req.body;

    // Validation
    if (!name || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Name and date of birth are required',
      });
    }

    // Validate date of birth is not in the future
    if (new Date(dateOfBirth) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth cannot be in the future',
      });
    }

    const baby = await Baby.create({
      // Basic Info
      name,
      dateOfBirth,
      gender,
      photoUrl,
      bloodType,
      allergies,
      medicalNotes,
      // Birth Details
      birthType,
      examiner,
      hospital,
      timeOfBirth,
      birthWeight,
      birthLength,
      headCircumference,
      estimatedGestation,
      apgarScore1,
      apgarScore5,
      // Pregnancy Details
      pregnancyComplications,
      maternalRubellaTitre,
      // Labour & Delivery
      labourType,
      deliveryType,
      // Screening
      bloodspotScreening,
      bloodspotScreeningDate,
      // Admission
      intensiveCare,
      intensiveCareDetails,
      specialCare,
      specialCareDetails,
    });

    const babyData = baby.toJSON();
    babyData.age = baby.getAge();
    babyData.formattedAge = baby.getFormattedAge();
    babyData.ageInDays = baby.getAgeInDays();

    logger.info(`Baby created: ${name}`);

    res.status(201).json({
      success: true,
      message: 'Baby created successfully',
      data: babyData,
    });
  } catch (error) {
    logger.error('Error creating baby:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create baby',
    });
  }
};

/**
 * Update baby
 * PUT /api/babies/:id
 */
const updateBaby = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      // Basic Info
      name,
      dateOfBirth,
      gender,
      photoUrl,
      bloodType,
      allergies,
      medicalNotes,
      // Birth Details
      birthType,
      examiner,
      hospital,
      timeOfBirth,
      birthWeight,
      birthLength,
      headCircumference,
      estimatedGestation,
      apgarScore1,
      apgarScore5,
      // Pregnancy Details
      pregnancyComplications,
      maternalRubellaTitre,
      // Labour & Delivery
      labourType,
      deliveryType,
      // Screening
      bloodspotScreening,
      bloodspotScreeningDate,
      // Admission
      intensiveCare,
      intensiveCareDetails,
      specialCare,
      specialCareDetails,
    } = req.body;

    const baby = await Baby.findByPk(id);

    if (!baby) {
      return res.status(404).json({
        success: false,
        message: 'Baby not found',
      });
    }

    // Validate date of birth if provided
    if (dateOfBirth && new Date(dateOfBirth) > new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Date of birth cannot be in the future',
      });
    }

    await baby.update({
      // Basic Info
      name: name || baby.name,
      dateOfBirth: dateOfBirth || baby.dateOfBirth,
      gender: gender !== undefined ? gender : baby.gender,
      photoUrl: photoUrl !== undefined ? photoUrl : baby.photoUrl,
      bloodType: bloodType !== undefined ? bloodType : baby.bloodType,
      allergies: allergies !== undefined ? allergies : baby.allergies,
      medicalNotes: medicalNotes !== undefined ? medicalNotes : baby.medicalNotes,
      // Birth Details
      birthType: birthType !== undefined ? birthType : baby.birthType,
      examiner: examiner !== undefined ? examiner : baby.examiner,
      hospital: hospital !== undefined ? hospital : baby.hospital,
      timeOfBirth: timeOfBirth !== undefined ? timeOfBirth : baby.timeOfBirth,
      birthWeight: birthWeight !== undefined ? birthWeight : baby.birthWeight,
      birthLength: birthLength !== undefined ? birthLength : baby.birthLength,
      headCircumference: headCircumference !== undefined ? headCircumference : baby.headCircumference,
      estimatedGestation: estimatedGestation !== undefined ? estimatedGestation : baby.estimatedGestation,
      apgarScore1: apgarScore1 !== undefined ? apgarScore1 : baby.apgarScore1,
      apgarScore5: apgarScore5 !== undefined ? apgarScore5 : baby.apgarScore5,
      // Pregnancy Details
      pregnancyComplications: pregnancyComplications !== undefined ? pregnancyComplications : baby.pregnancyComplications,
      maternalRubellaTitre: maternalRubellaTitre !== undefined ? maternalRubellaTitre : baby.maternalRubellaTitre,
      // Labour & Delivery
      labourType: labourType !== undefined ? labourType : baby.labourType,
      deliveryType: deliveryType !== undefined ? deliveryType : baby.deliveryType,
      // Screening
      bloodspotScreening: bloodspotScreening !== undefined ? bloodspotScreening : baby.bloodspotScreening,
      bloodspotScreeningDate: bloodspotScreeningDate !== undefined ? bloodspotScreeningDate : baby.bloodspotScreeningDate,
      // Admission
      intensiveCare: intensiveCare !== undefined ? intensiveCare : baby.intensiveCare,
      intensiveCareDetails: intensiveCareDetails !== undefined ? intensiveCareDetails : baby.intensiveCareDetails,
      specialCare: specialCare !== undefined ? specialCare : baby.specialCare,
      specialCareDetails: specialCareDetails !== undefined ? specialCareDetails : baby.specialCareDetails,
    });

    const babyData = baby.toJSON();
    babyData.age = baby.getAge();
    babyData.formattedAge = baby.getFormattedAge();
    babyData.ageInDays = baby.getAgeInDays();

    logger.info(`Baby updated: ${baby.name}`);

    res.json({
      success: true,
      message: 'Baby updated successfully',
      data: babyData,
    });
  } catch (error) {
    logger.error('Error updating baby:', error);

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: error.errors.map((e) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update baby',
    });
  }
};

/**
 * Delete baby (soft delete)
 * DELETE /api/babies/:id
 */
const deleteBaby = async (req, res) => {
  try {
    const { id } = req.params;

    const baby = await Baby.findByPk(id);

    if (!baby) {
      return res.status(404).json({
        success: false,
        message: 'Baby not found',
      });
    }

    await baby.update({ isActive: false });

    logger.info(`Baby soft deleted: ${baby.name}`);

    res.json({
      success: true,
      message: 'Baby deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting baby:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete baby',
    });
  }
};

module.exports = {
  getAllBabies,
  getBabyById,
  createBaby,
  updateBaby,
  deleteBaby,
};
