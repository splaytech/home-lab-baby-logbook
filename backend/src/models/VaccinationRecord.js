/**
 * VaccinationRecord Model
 *
 * Tracks actual vaccinations administered to babies
 */

const { DataTypes } = require('sequelize');
const db = require('../config/database');

const VaccinationRecord = db.define(
  'VaccinationRecord',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    babyId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'baby_id',
      references: {
        model: 'babies',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    vaccineName: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'vaccine_name',
      comment: 'Name of the vaccination',
    },
    dateAdministered: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_administered',
      comment: 'Date when vaccination was given',
    },
    ageInDaysAtVaccination: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'age_in_days_at_vaccination',
      comment: 'Baby age in days when vaccinated',
    },
    doseAmount: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'dose_amount',
      comment: 'Dose amount (e.g., 0.5ml)',
    },
    batchNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'batch_number',
      comment: 'Batch/lot number of vaccine',
    },
    route: {
      type: DataTypes.ENUM('oral', 'injection_im', 'injection_sc', 'injection_id', 'other'),
      allowNull: true,
      comment: 'Route of administration: oral, intramuscular (IM), subcutaneous (SC), intradermal (ID)',
    },
    site: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Injection site (e.g., left thigh, right arm)',
    },
    placeGiven: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'place_given',
      comment: 'Location where vaccine was administered (Hospital/Doctor/Nurse)',
    },
    givenBy: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'given_by',
      comment: 'Name of person who administered the vaccine',
    },
    signature: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Signature or stamp identifier',
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional notes or reactions',
    },
    scheduledVaccineId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'scheduled_vaccine_id',
      comment: 'Link to scheduled vaccine if this fulfills a schedule item',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    tableName: 'vaccination_records',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['baby_id', 'date_administered'],
      },
      {
        fields: ['baby_id', 'vaccine_name'],
      },
    ],
  }
);

module.exports = VaccinationRecord;
