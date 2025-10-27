/**
 * Models Index
 *
 * Central export point for all database models
 */

const User = require('./User');
const SystemConfig = require('./SystemConfig');
const Baby = require('./Baby');
const Appointment = require('./Appointment');
const GrowthRecord = require('./GrowthRecord');
const VaccinationRecord = require('./VaccinationRecord');
const VaccinationSchedule = require('./VaccinationSchedule');
const Milestone = require('./Milestone');

// Define associations
// A baby can have multiple appointments
Baby.hasMany(Appointment, {
  foreignKey: 'babyId',
  as: 'appointments',
  onDelete: 'CASCADE',
});

Appointment.belongsTo(Baby, {
  foreignKey: 'babyId',
  as: 'baby',
});

// A baby can have multiple growth records
Baby.hasMany(GrowthRecord, {
  foreignKey: 'babyId',
  as: 'growthRecords',
  onDelete: 'CASCADE',
});

GrowthRecord.belongsTo(Baby, {
  foreignKey: 'babyId',
  as: 'baby',
});

// A baby can have multiple vaccination records
Baby.hasMany(VaccinationRecord, {
  foreignKey: 'babyId',
  as: 'vaccinationRecords',
  onDelete: 'CASCADE',
});

VaccinationRecord.belongsTo(Baby, {
  foreignKey: 'babyId',
  as: 'baby',
});

// A baby can have multiple milestones
Baby.hasMany(Milestone, {
  foreignKey: 'babyId',
  as: 'milestones',
  onDelete: 'CASCADE',
});

Milestone.belongsTo(Baby, {
  foreignKey: 'babyId',
  as: 'baby',
});

// Users can be associated with babies (many-to-many through a join table)
// This allows multiple parents/caregivers per baby
// We'll add this later if needed

module.exports = {
  User,
  SystemConfig,
  Baby,
  Appointment,
  GrowthRecord,
  VaccinationRecord,
  VaccinationSchedule,
  Milestone,
};
