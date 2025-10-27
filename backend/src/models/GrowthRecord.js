/**
 * GrowthRecord Model
 *
 * Represents growth measurements for babies over time
 */

const { DataTypes } = require('sequelize');
const db = require('../config/database');

const GrowthRecord = db.define(
  'GrowthRecord',
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
    recordDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'record_date',
    },
    ageInDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'age_in_days',
      comment: 'Age in days at time of measurement',
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Weight in kilograms',
    },
    height: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      comment: 'Height/Length in centimeters',
    },
    headCircumference: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      field: 'head_circumference',
      comment: 'Head circumference in centimeters',
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional notes or observations',
    },
  },
  {
    tableName: 'growth_records',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['baby_id', 'record_date'],
        unique: false,
      },
      {
        fields: ['baby_id', 'age_in_days'],
        unique: false,
      },
    ],
  }
);

module.exports = GrowthRecord;
