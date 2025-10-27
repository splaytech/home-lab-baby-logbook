/**
 * Appointment Model
 *
 * Represents medical appointments for babies
 */

const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Appointment = db.define(
  'Appointment',
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
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [1, 200],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    appointmentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'appointment_date',
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    doctorName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'doctor_name',
    },
    appointmentType: {
      type: DataTypes.ENUM('checkup', 'vaccination', 'sick_visit', 'specialist', 'other'),
      allowNull: false,
      defaultValue: 'checkup',
      field: 'appointment_type',
    },
    status: {
      type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'missed'),
      allowNull: false,
      defaultValue: 'scheduled',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'reminder_sent',
    },
  },
  {
    tableName: 'appointments',
    timestamps: true,
    underscored: true,
  }
);

// Instance methods
Appointment.prototype.isUpcoming = function () {
  return new Date(this.appointmentDate) > new Date() && this.status === 'scheduled';
};

Appointment.prototype.isPast = function () {
  return new Date(this.appointmentDate) < new Date();
};

Appointment.prototype.getDaysUntil = function () {
  const today = new Date();
  const apptDate = new Date(this.appointmentDate);
  const diffTime = apptDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = Appointment;
