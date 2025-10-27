/**
 * VaccinationSchedule Model
 *
 * Defines the standard vaccination schedule (Australian NIP)
 * This is a reference table for recommended vaccinations
 */

const { DataTypes } = require('sequelize');
const db = require('../config/database');

const VaccinationSchedule = db.define(
  'VaccinationSchedule',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vaccineName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'vaccine_name',
      comment: 'Name of the vaccination',
    },
    shortName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'short_name',
      comment: 'Abbreviated name (e.g., DTaP, MMR)',
    },
    ageInDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'age_in_days',
      comment: 'Recommended age in days',
    },
    ageLabel: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'age_label',
      comment: 'Human-readable age (e.g., "Birth", "2 months", "4 years")',
    },
    doseNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'dose_number',
      comment: 'Dose number in series (1, 2, 3, etc.)',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description of what the vaccine protects against',
    },
    route: {
      type: DataTypes.ENUM('oral', 'injection_im', 'injection_sc', 'injection_id'),
      allowNull: true,
      comment: 'Standard route of administration',
    },
    isForAtsiOnly: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_for_atsi_only',
      comment: 'Aboriginal and Torres Strait Islander children only',
    },
    isOptional: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_optional',
      comment: 'Optional/recommended vs required',
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Category (e.g., Routine, ATSI, High-risk)',
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'sort_order',
      comment: 'Order for display',
    },
  },
  {
    tableName: 'vaccination_schedules',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['age_in_days'],
      },
      {
        fields: ['category', 'sort_order'],
      },
    ],
  }
);

/**
 * Seed the standard Australian NIP schedule
 */
VaccinationSchedule.seedSchedule = async () => {
  const scheduleData = [
    // Birth
    { vaccineName: 'Hepatitis B', shortName: 'Hep B', ageInDays: 0, ageLabel: 'Birth', doseNumber: 1, description: 'Protects against Hepatitis B infection', route: 'injection_im', category: 'Routine', sortOrder: 1 },

    // 2 months (60 days)
    { vaccineName: 'Diphtheria-Tetanus-Pertussis', shortName: 'DTaP', ageInDays: 60, ageLabel: '2 months', doseNumber: 1, description: 'Protects against diphtheria, tetanus, and whooping cough', route: 'injection_im', category: 'Routine', sortOrder: 2 },
    { vaccineName: 'Hepatitis B', shortName: 'Hep B', ageInDays: 60, ageLabel: '2 months', doseNumber: 2, description: 'Protects against Hepatitis B infection', route: 'injection_im', category: 'Routine', sortOrder: 3 },
    { vaccineName: 'Polio', shortName: 'IPV', ageInDays: 60, ageLabel: '2 months', doseNumber: 1, description: 'Protects against poliomyelitis', route: 'injection_im', category: 'Routine', sortOrder: 4 },
    { vaccineName: 'Haemophilus Influenzae type b', shortName: 'Hib', ageInDays: 60, ageLabel: '2 months', doseNumber: 1, description: 'Protects against Hib infections', route: 'injection_im', category: 'Routine', sortOrder: 5 },
    { vaccineName: 'Pneumococcal', shortName: 'PCV', ageInDays: 60, ageLabel: '2 months', doseNumber: 1, description: 'Protects against pneumococcal disease', route: 'injection_im', category: 'Routine', sortOrder: 6 },
    { vaccineName: 'Rotavirus', shortName: 'RV', ageInDays: 60, ageLabel: '2 months', doseNumber: 1, description: 'Protects against rotavirus gastroenteritis', route: 'oral', category: 'Routine', sortOrder: 7 },
    { vaccineName: 'Meningococcal B', shortName: 'MenB', ageInDays: 60, ageLabel: '2 months', doseNumber: 1, description: 'Protects against meningococcal B disease', route: 'injection_im', category: 'Routine', sortOrder: 8 },

    // 4 months (120 days)
    { vaccineName: 'Diphtheria-Tetanus-Pertussis', shortName: 'DTaP', ageInDays: 120, ageLabel: '4 months', doseNumber: 2, description: 'Protects against diphtheria, tetanus, and whooping cough', route: 'injection_im', category: 'Routine', sortOrder: 9 },
    { vaccineName: 'Hepatitis B', shortName: 'Hep B', ageInDays: 120, ageLabel: '4 months', doseNumber: 3, description: 'Protects against Hepatitis B infection', route: 'injection_im', category: 'Routine', sortOrder: 10 },
    { vaccineName: 'Polio', shortName: 'IPV', ageInDays: 120, ageLabel: '4 months', doseNumber: 2, description: 'Protects against poliomyelitis', route: 'injection_im', category: 'Routine', sortOrder: 11 },
    { vaccineName: 'Haemophilus Influenzae type b', shortName: 'Hib', ageInDays: 120, ageLabel: '4 months', doseNumber: 2, description: 'Protects against Hib infections', route: 'injection_im', category: 'Routine', sortOrder: 12 },
    { vaccineName: 'Pneumococcal', shortName: 'PCV', ageInDays: 120, ageLabel: '4 months', doseNumber: 2, description: 'Protects against pneumococcal disease', route: 'injection_im', category: 'Routine', sortOrder: 13 },
    { vaccineName: 'Rotavirus', shortName: 'RV', ageInDays: 120, ageLabel: '4 months', doseNumber: 2, description: 'Protects against rotavirus gastroenteritis', route: 'oral', category: 'Routine', sortOrder: 14 },
    { vaccineName: 'Meningococcal B', shortName: 'MenB', ageInDays: 120, ageLabel: '4 months', doseNumber: 2, description: 'Protects against meningococcal B disease', route: 'injection_im', category: 'Routine', sortOrder: 15 },

    // 6 months (180 days)
    { vaccineName: 'Diphtheria-Tetanus-Pertussis', shortName: 'DTaP', ageInDays: 180, ageLabel: '6 months', doseNumber: 3, description: 'Protects against diphtheria, tetanus, and whooping cough', route: 'injection_im', category: 'Routine', sortOrder: 16 },
    { vaccineName: 'Hepatitis B', shortName: 'Hep B', ageInDays: 180, ageLabel: '6 months', doseNumber: 4, description: 'Protects against Hepatitis B infection', route: 'injection_im', category: 'Routine', sortOrder: 17 },
    { vaccineName: 'Polio', shortName: 'IPV', ageInDays: 180, ageLabel: '6 months', doseNumber: 3, description: 'Protects against poliomyelitis', route: 'injection_im', category: 'Routine', sortOrder: 18 },
    { vaccineName: 'Haemophilus Influenzae type b', shortName: 'Hib', ageInDays: 180, ageLabel: '6 months', doseNumber: 3, description: 'Protects against Hib infections', route: 'injection_im', category: 'Routine', sortOrder: 19 },
    { vaccineName: 'Pneumococcal', shortName: 'PCV', ageInDays: 180, ageLabel: '6 months', doseNumber: 3, description: 'Protects against pneumococcal disease', route: 'injection_im', category: 'Routine', isForAtsiOnly: true, sortOrder: 20 },

    // 12 months (365 days)
    { vaccineName: 'Measles-Mumps-Rubella', shortName: 'MMR', ageInDays: 365, ageLabel: '12 months', doseNumber: 1, description: 'Protects against measles, mumps, and rubella', route: 'injection_im', category: 'Routine', sortOrder: 21 },
    { vaccineName: 'Meningococcal ACWY', shortName: 'MenACWY', ageInDays: 365, ageLabel: '12 months', doseNumber: 1, description: 'Protects against meningococcal A, C, W, and Y disease', route: 'injection_im', category: 'Routine', sortOrder: 22 },
    { vaccineName: 'Pneumococcal', shortName: 'PCV', ageInDays: 365, ageLabel: '12 months', doseNumber: 4, description: 'Protects against pneumococcal disease', route: 'injection_im', category: 'Routine', sortOrder: 23 },
    { vaccineName: 'Meningococcal B', shortName: 'MenB', ageInDays: 365, ageLabel: '12 months', doseNumber: 3, description: 'Protects against meningococcal B disease', route: 'injection_im', category: 'Routine', sortOrder: 24 },
    { vaccineName: 'Hepatitis A', shortName: 'Hep A', ageInDays: 365, ageLabel: '12 months', doseNumber: 1, description: 'Protects against Hepatitis A infection', route: 'injection_im', category: 'ATSI', isForAtsiOnly: true, sortOrder: 25 },

    // 18 months (547 days)
    { vaccineName: 'Measles-Mumps-Rubella-Varicella', shortName: 'MMRV', ageInDays: 547, ageLabel: '18 months', doseNumber: 2, description: 'Protects against measles, mumps, rubella, and chickenpox', route: 'injection_im', category: 'Routine', sortOrder: 26 },
    { vaccineName: 'Diphtheria-Tetanus-Pertussis', shortName: 'DTaP', ageInDays: 547, ageLabel: '18 months', doseNumber: 4, description: 'Protects against diphtheria, tetanus, and whooping cough', route: 'injection_im', category: 'Routine', sortOrder: 27 },
    { vaccineName: 'Haemophilus Influenzae type b', shortName: 'Hib', ageInDays: 547, ageLabel: '18 months', doseNumber: 4, description: 'Protects against Hib infections', route: 'injection_im', category: 'Routine', sortOrder: 28 },
    { vaccineName: 'Hepatitis A', shortName: 'Hep A', ageInDays: 547, ageLabel: '18 months', doseNumber: 2, description: 'Protects against Hepatitis A infection', route: 'injection_im', category: 'ATSI', isForAtsiOnly: true, sortOrder: 29 },

    // 4 years (1460 days)
    { vaccineName: 'Diphtheria-Tetanus-Pertussis-Polio', shortName: 'DTaP-IPV', ageInDays: 1460, ageLabel: '4 years', doseNumber: 5, description: 'Protects against diphtheria, tetanus, whooping cough, and polio', route: 'injection_im', category: 'Routine', sortOrder: 30 },
  ];

  try {
    // Check if schedule already exists
    const count = await VaccinationSchedule.count();
    if (count === 0) {
      await VaccinationSchedule.bulkCreate(scheduleData);
      console.log('Vaccination schedule seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding vaccination schedule:', error);
  }
};

module.exports = VaccinationSchedule;
