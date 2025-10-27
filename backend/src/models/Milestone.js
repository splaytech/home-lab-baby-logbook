/**
 * Milestone Model
 *
 * Tracks developmental milestones and special "firsts" for babies
 */

const { DataTypes } = require('sequelize');
const db = require('../config/database');

const Milestone = db.define(
  'Milestone',
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
      comment: 'Title of the milestone (e.g., "First Smile", "First Steps")',
    },
    category: {
      type: DataTypes.ENUM(
        'physical', // rolling over, sitting, crawling, standing, walking, running
        'communication', // first smile, first word, first sentence, babbling
        'social', // first laugh, playing with others, waving bye-bye
        'cognitive', // recognizing faces, object permanence, problem solving
        'self_care', // first bath, sleeping through night, potty training, self-feeding
        'health', // first tooth, teething, vaccinations
        'other' // custom milestones
      ),
      allowNull: false,
      comment: 'Category of milestone',
    },
    dateAchieved: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'date_achieved',
      comment: 'Date when milestone was achieved',
    },
    ageInDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'age_in_days',
      comment: 'Baby age in days when milestone was achieved',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Detailed description or story about the milestone',
    },
    photos: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of photo URLs',
    },
    videos: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Array of video URLs',
    },
    location: {
      type: DataTypes.STRING(200),
      allowNull: true,
      comment: 'Where the milestone happened',
    },
    witnesses: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Who witnessed or was present (comma-separated names)',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional notes or memories',
    },
    isImportant: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_important',
      comment: 'Mark as important/favorite milestone',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    tableName: 'milestones',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['baby_id', 'date_achieved'],
      },
      {
        fields: ['baby_id', 'category'],
      },
      {
        fields: ['is_important'],
      },
    ],
  }
);

/**
 * Common milestone templates
 */
Milestone.COMMON_MILESTONES = {
  physical: [
    'First Smile',
    'Holding Head Up',
    'Rolling Over (Front to Back)',
    'Rolling Over (Back to Front)',
    'Sitting Without Support',
    'Crawling',
    'Pulling Up to Stand',
    'Standing Alone',
    'First Steps',
    'Walking Independently',
    'Running',
    'Climbing Stairs',
    'Jumping',
    'Riding Tricycle',
  ],
  communication: [
    'First Coo',
    'First Babble',
    'Responding to Name',
    'First Word',
    'Two Word Phrases',
    'First Sentence',
    'Singing Songs',
    'Telling Stories',
  ],
  social: [
    'First Laugh',
    'Recognizing Parents',
    'Stranger Anxiety',
    'Waving Hello/Goodbye',
    'Playing Peek-a-Boo',
    'Sharing Toys',
    'Playing with Other Children',
    'Showing Empathy',
  ],
  cognitive: [
    'Following Objects with Eyes',
    'Recognizing Familiar Faces',
    'Finding Hidden Objects',
    'Understanding Object Permanence',
    'Sorting Shapes',
    'Identifying Colors',
    'Counting to 10',
    'Recognizing Letters',
  ],
  self_care: [
    'First Bath',
    'First Solid Food',
    'Drinking from Cup',
    'Self-Feeding with Fingers',
    'Using Spoon',
    'Using Fork',
    'Sleeping Through Night',
    'Using Potty',
    'Potty Trained (Day)',
    'Potty Trained (Night)',
    'Brushing Teeth',
    'Dressing Self',
  ],
  health: [
    'First Tooth',
    'All Baby Teeth',
    'First Haircut',
    'First Visit to Dentist',
  ],
  other: [
    'First Day at Daycare',
    'First Birthday',
    'First Holiday',
    'First Beach Visit',
    'First Zoo Visit',
    'Meeting Sibling',
  ],
};

module.exports = Milestone;
