/**
 * Baby Model
 *
 * Represents a baby/child in the system
 */

const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Baby = db.define(
  'Baby',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [1, 100],
      },
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_of_birth',
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other', 'prefer_not_to_say'),
      allowNull: true,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'photo_url',
    },
    bloodType: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: 'blood_type',
    },
    allergies: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    medicalNotes: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'medical_notes',
    },

    // Birth Details
    birthType: {
      type: DataTypes.ENUM('home_birth', 'hospital', 'bba'),
      allowNull: true,
      field: 'birth_type',
    },
    examiner: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    hospital: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    timeOfBirth: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'time_of_birth',
    },
    birthWeight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'birth_weight',
    },
    birthLength: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'birth_length',
    },
    headCircumference: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'head_circumference',
    },
    estimatedGestation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'estimated_gestation',
    },
    apgarScore1: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'apgar_score_1',
      validate: {
        min: 0,
        max: 10,
      },
    },
    apgarScore5: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'apgar_score_5',
      validate: {
        min: 0,
        max: 10,
      },
    },

    // Pregnancy Details
    pregnancyComplications: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'pregnancy_complications',
    },
    maternalRubellaTitre: {
      type: DataTypes.STRING(50),
      allowNull: true,
      field: 'maternal_rubella_titre',
    },

    // Labour Details
    labourType: {
      type: DataTypes.ENUM('spontaneous', 'induced'),
      allowNull: true,
      field: 'labour_type',
    },

    // Delivery Details
    deliveryType: {
      type: DataTypes.ENUM('normal', 'breech', 'caesarean', 'vacuum_extraction', 'forceps'),
      allowNull: true,
      field: 'delivery_type',
    },

    // Newborn Screening
    bloodspotScreening: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'bloodspot_screening',
    },
    bloodspotScreeningDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'bloodspot_screening_date',
    },

    // Admission Details
    intensiveCare: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'intensive_care',
    },
    intensiveCareDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'intensive_care_details',
    },
    specialCare: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'special_care',
    },
    specialCareDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'special_care_details',
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    tableName: 'babies',
    timestamps: true,
    underscored: true,
  }
);

// Instance methods
Baby.prototype.getAgeInDays = function () {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  const diffTime = Math.abs(today - birthDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

Baby.prototype.getAge = function () {
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
};

Baby.prototype.getFormattedAge = function () {
  const age = this.getAge();
  const parts = [];

  if (age.years > 0) {
    parts.push(`${age.years} year${age.years !== 1 ? 's' : ''}`);
  }
  if (age.months > 0) {
    parts.push(`${age.months} month${age.months !== 1 ? 's' : ''}`);
  }
  if (age.days > 0 && age.years === 0) {
    parts.push(`${age.days} day${age.days !== 1 ? 's' : ''}`);
  }

  return parts.join(', ') || '0 days';
};

module.exports = Baby;
